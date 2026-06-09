import { NextResponse } from "next/server";
import { BannerPage, BannerPosition } from "@/app/data/banners";
import { listActiveBanners } from "@/app/lib/bannerStore";

const bannerPages: BannerPage[] = [
  "home",
  "masculino",
  "feminino",
  "retro",
  "times",
  "selecoes",
];

const bannerPositions: BannerPosition[] = ["hero", "promo"];

export const GET = async (request: Request) => {
  const url = new URL(request.url);
  const page = url.searchParams.get("page") as BannerPage | null;
  const position = url.searchParams.get("position") as BannerPosition | null;

  if (!page || !bannerPages.includes(page)) {
    return NextResponse.json({ error: "Página inválida" }, { status: 400 });
  }

  if (!position || !bannerPositions.includes(position)) {
    return NextResponse.json({ error: "Posição inválida" }, { status: 400 });
  }

  try {
    const banners = await listActiveBanners({ page, position });

    return NextResponse.json({ banners });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Não foi possível buscar banners";

    return NextResponse.json({ error: message }, { status: 500 });
  }
};
