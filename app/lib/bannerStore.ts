import { promises as fs } from "fs";
import path from "path";
import {
  BannerPage,
  BannerPosition,
  defaultBanners,
  isBannerActiveNow,
  StoreBanner,
} from "@/app/data/banners";

type SupabaseBanner = {
  id: string;
  name: string;
  page: BannerPage;
  position: BannerPosition;
  desktop_image_url: string;
  mobile_image_url?: string | null;
  title?: string | null;
  description?: string | null;
  link_url?: string | null;
  is_active: boolean;
  sort_order: number;
  starts_at?: string | null;
  ends_at?: string | null;
  created_at?: string;
  updated_at?: string;
};

const localBannersFile = path.join(process.cwd(), ".data", "banners.json");
const publicDirectory = path.join(process.cwd(), "public");

const hasSupabaseConfig = () => {
  return Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);
};

const getSupabaseHeaders = () => {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

  return {
    apikey: serviceRoleKey,
    Authorization: `Bearer ${serviceRoleKey}`,
    "Content-Type": "application/json",
  };
};

const normalizeBannerPayload = (
  banner: Omit<StoreBanner, "id"> | StoreBanner
) => {
  return {
    ...banner,
    name: banner.name.trim(),
    desktopImageUrl: banner.desktopImageUrl.trim(),
    mobileImageUrl: banner.mobileImageUrl?.trim() || undefined,
    title: banner.title?.trim() || undefined,
    description: banner.description?.trim() || undefined,
    linkUrl: banner.linkUrl?.trim() || undefined,
    sortOrder: Number(banner.sortOrder || 0),
    startsAt: banner.startsAt || undefined,
    endsAt: banner.endsAt || undefined,
  };
};

const toBanner = (banner: SupabaseBanner): StoreBanner => {
  return {
    id: banner.id,
    name: banner.name,
    page: banner.page,
    position: banner.position,
    desktopImageUrl: banner.desktop_image_url,
    mobileImageUrl: banner.mobile_image_url || undefined,
    title: banner.title || undefined,
    description: banner.description || undefined,
    linkUrl: banner.link_url || undefined,
    isActive: banner.is_active,
    sortOrder: Number(banner.sort_order),
    startsAt: banner.starts_at || undefined,
    endsAt: banner.ends_at || undefined,
  };
};

const toSupabaseBanner = (banner: StoreBanner): SupabaseBanner => {
  return {
    id: banner.id,
    name: banner.name,
    page: banner.page,
    position: banner.position,
    desktop_image_url: banner.desktopImageUrl,
    mobile_image_url: banner.mobileImageUrl ?? null,
    title: banner.title ?? null,
    description: banner.description ?? null,
    link_url: banner.linkUrl ?? null,
    is_active: banner.isActive,
    sort_order: banner.sortOrder,
    starts_at: banner.startsAt ?? null,
    ends_at: banner.endsAt ?? null,
  };
};

const sortBanners = (banners: StoreBanner[]) => {
  return [...banners].sort((a, b) => {
    return a.sortOrder - b.sortOrder || a.name.localeCompare(b.name);
  });
};

const isRemoteImageUrl = (imageUrl: string) => {
  return imageUrl.startsWith("http://") || imageUrl.startsWith("https://");
};

const isPublicImageUrl = (imageUrl: string) => {
  return imageUrl.startsWith("/") && !imageUrl.startsWith("//");
};

const getPublicImagePath = (imageUrl: string) => {
  const normalizedImageUrl = imageUrl.split("?")[0].replace(/^\/+/, "");

  return path.resolve(publicDirectory, normalizedImageUrl);
};

const isSafePublicImagePath = (imagePath: string) => {
  const relativePath = path.relative(publicDirectory, imagePath);

  return Boolean(relativePath) && !relativePath.startsWith("..") && !path.isAbsolute(relativePath);
};

const publicImageExists = async (imageUrl?: string) => {
  if (!imageUrl || isRemoteImageUrl(imageUrl)) return true;
  if (!isPublicImageUrl(imageUrl)) return false;

  const imagePath = getPublicImagePath(imageUrl);

  if (!isSafePublicImagePath(imagePath)) return false;

  try {
    const stats = await fs.stat(imagePath);
    return stats.isFile();
  } catch {
    return false;
  }
};

const validateBannerImages = async (banner: Omit<StoreBanner, "id"> | StoreBanner) => {
  if (!(await publicImageExists(banner.desktopImageUrl))) {
    throw new Error("Imagem desktop não encontrada em public");
  }

  if (banner.mobileImageUrl && !(await publicImageExists(banner.mobileImageUrl))) {
    throw new Error("Imagem mobile não encontrada em public");
  }
};

const bannerImagesExist = async (banner: StoreBanner) => {
  return (
    (await publicImageExists(banner.desktopImageUrl)) &&
    (await publicImageExists(banner.mobileImageUrl))
  );
};

const readLocalBanners = async (): Promise<StoreBanner[]> => {
  try {
    const file = await fs.readFile(localBannersFile, "utf-8");
    const banners = JSON.parse(file) as StoreBanner[];

    return banners.length > 0 ? banners : defaultBanners;
  } catch {
    return defaultBanners;
  }
};

const writeLocalBanners = async (banners: StoreBanner[]) => {
  await fs.mkdir(path.dirname(localBannersFile), { recursive: true });
  await fs.writeFile(localBannersFile, JSON.stringify(sortBanners(banners), null, 2));
};

const listSupabaseBanners = async () => {
  const response = await fetch(
    `${process.env.SUPABASE_URL}/rest/v1/banners?select=*&order=sort_order.asc`,
    {
      headers: getSupabaseHeaders(),
      cache: "no-store",
    }
  );

  if (!response.ok) {
    throw new Error("Não foi possível buscar banners no Supabase");
  }

  const banners = (await response.json()) as SupabaseBanner[];

  return banners.map(toBanner);
};

const writeSupabaseBanner = async (banner: StoreBanner) => {
  const response = await fetch(`${process.env.SUPABASE_URL}/rest/v1/banners`, {
    method: "POST",
    headers: getSupabaseHeaders(),
    cache: "no-store",
    body: JSON.stringify(toSupabaseBanner(banner)),
  });

  if (!response.ok) {
    throw new Error("Não foi possível salvar o banner no Supabase");
  }
};

const patchSupabaseBanner = async (banner: StoreBanner) => {
  const response = await fetch(
    `${process.env.SUPABASE_URL}/rest/v1/banners?id=eq.${encodeURIComponent(banner.id)}`,
    {
      method: "PATCH",
      headers: getSupabaseHeaders(),
      cache: "no-store",
      body: JSON.stringify({
        ...toSupabaseBanner(banner),
        updated_at: new Date().toISOString(),
      }),
    }
  );

  if (!response.ok) {
    throw new Error("Não foi possível atualizar o banner no Supabase");
  }
};

const removeSupabaseBanner = async (id: string) => {
  const response = await fetch(
    `${process.env.SUPABASE_URL}/rest/v1/banners?id=eq.${encodeURIComponent(id)}`,
    {
      method: "DELETE",
      headers: getSupabaseHeaders(),
      cache: "no-store",
    }
  );

  if (!response.ok) {
    throw new Error("Não foi possível remover o banner no Supabase");
  }
};

export const listBanners = async () => {
  if (hasSupabaseConfig()) {
    return sortBanners(await listSupabaseBanners());
  }

  return sortBanners(await readLocalBanners());
};

export const listActiveBanners = async ({
  page,
  position,
}: {
  page: BannerPage;
  position: BannerPosition;
}) => {
  const banners = await listBanners();

  const activeBanners = banners.filter((banner) => {
      return (
        banner.page === page &&
        banner.position === position &&
        isBannerActiveNow(banner)
      );
    });
  const validatedBanners = await Promise.all(
    activeBanners.map(async (banner) => {
      return (await bannerImagesExist(banner)) ? banner : null;
    })
  );

  return sortBanners(
    validatedBanners.filter((banner): banner is StoreBanner => Boolean(banner))
  );
};

export const createBanner = async (banner: Omit<StoreBanner, "id">) => {
  const banners = await listBanners();
  const payload = normalizeBannerPayload(banner);

  if (!payload.name) {
    throw new Error("Informe o nome do banner");
  }

  if (!payload.desktopImageUrl) {
    throw new Error("Informe a imagem desktop do banner");
  }

  await validateBannerImages(payload);

  const newBanner: StoreBanner = {
    ...payload,
    id: `banner-${Date.now()}`,
  };

  if (hasSupabaseConfig()) {
    await writeSupabaseBanner(newBanner);
    return newBanner;
  }

  await writeLocalBanners([newBanner, ...banners]);
  return newBanner;
};

export const updateBanner = async ({
  id,
  banner,
}: {
  id: string;
  banner: Omit<StoreBanner, "id">;
}) => {
  const banners = await listBanners();
  const currentBanner = banners.find((item) => item.id === id);

  if (!currentBanner) {
    throw new Error("Banner não encontrado");
  }

  const updatedBanner: StoreBanner = {
    ...currentBanner,
    ...normalizeBannerPayload(banner),
    id,
  };

  await validateBannerImages(updatedBanner);

  if (hasSupabaseConfig()) {
    await patchSupabaseBanner(updatedBanner);
    return updatedBanner;
  }

  await writeLocalBanners(
    banners.map((item) => (item.id === id ? updatedBanner : item))
  );

  return updatedBanner;
};

export const deleteBanner = async (id: string) => {
  const banners = await listBanners();
  const bannerExists = banners.some((banner) => banner.id === id);

  if (!bannerExists) {
    throw new Error("Banner não encontrado");
  }

  if (hasSupabaseConfig()) {
    await removeSupabaseBanner(id);
    return;
  }

  await writeLocalBanners(banners.filter((banner) => banner.id !== id));
};
