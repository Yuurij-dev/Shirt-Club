import { NextResponse } from "next/server";
import { BannerPage, BannerPosition, StoreBanner } from "@/app/data/banners";
import { isAdminAuthenticated } from "@/app/lib/adminAuth";
import {
  createBanner,
  deleteBanner,
  listBanners,
  updateBanner,
} from "@/app/lib/bannerStore";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const bannerPages: BannerPage[] = [
  "home",
  "masculino",
  "feminino",
  "retro",
  "times",
  "selecoes",
  "mascotes",
];

const bannerPositions: BannerPosition[] = ["hero", "promo"];

type BannerRequest = Partial<Omit<StoreBanner, "id">> & {
  id?: string;
};

const getBannerPayload = (body: BannerRequest): Omit<StoreBanner, "id"> => {
  if (!body.name?.trim()) {
    throw new Error("Informe o nome do banner");
  }

  if (!body.desktopImageUrl?.trim()) {
    throw new Error("Informe a imagem desktop do banner");
  }

  if (!body.page || !bannerPages.includes(body.page)) {
    throw new Error("Página do banner inválida");
  }

  if (!body.position || !bannerPositions.includes(body.position)) {
    throw new Error("Posição do banner inválida");
  }

  return {
    name: body.name,
    page: body.page,
    position: body.position,
    desktopImageUrl: body.desktopImageUrl,
    mobileImageUrl: body.mobileImageUrl || undefined,
    title: body.title || undefined,
    description: body.description || undefined,
    linkUrl: body.linkUrl || undefined,
    isActive: Boolean(body.isActive),
    sortOrder: Number(body.sortOrder || 0),
    startsAt: body.startsAt || undefined,
    endsAt: body.endsAt || undefined,
  };
};

export const GET = async () => {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  try {
    const banners = await listBanners();

    return NextResponse.json({ banners });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Não foi possível buscar banners";

    return NextResponse.json({ error: message }, { status: 500 });
  }
};

export const POST = async (request: Request) => {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  try {
    const body = (await request.json()) as BannerRequest;
    const banner = await createBanner(getBannerPayload(body));

    return NextResponse.json({ banner }, { status: 201 });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Não foi possível criar o banner";

    return NextResponse.json({ error: message }, { status: 400 });
  }
};

export const PUT = async (request: Request) => {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  try {
    const body = (await request.json()) as BannerRequest;

    if (!body.id) {
      return NextResponse.json(
        { error: "Informe o banner que será editado" },
        { status: 400 }
      );
    }

    const banner = await updateBanner({
      id: body.id,
      banner: getBannerPayload(body),
    });

    return NextResponse.json({ banner });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Não foi possível atualizar o banner";

    return NextResponse.json({ error: message }, { status: 400 });
  }
};

export const DELETE = async (request: Request) => {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  try {
    const body = (await request.json()) as { id?: string };

    if (!body.id) {
      return NextResponse.json(
        { error: "Informe o banner que será removido" },
        { status: 400 }
      );
    }

    await deleteBanner(body.id);

    return NextResponse.json({ ok: true });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Não foi possível remover o banner";

    return NextResponse.json({ error: message }, { status: 400 });
  }
};
