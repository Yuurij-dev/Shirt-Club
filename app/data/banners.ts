export type BannerPage =
  | "home"
  | "masculino"
  | "feminino"
  | "retro"
  | "times"
  | "selecoes";

export type BannerPosition = "hero" | "promo";

export type StoreBanner = {
  id: string;
  name: string;
  page: BannerPage;
  position: BannerPosition;
  desktopImageUrl: string;
  mobileImageUrl?: string;
  title?: string;
  description?: string;
  linkUrl?: string;
  isActive: boolean;
  sortOrder: number;
  startsAt?: string;
  endsAt?: string;
};

export const bannerPageLabels: Record<BannerPage, string> = {
  home: "Início",
  masculino: "Masculino",
  feminino: "Feminino",
  retro: "Retrô",
  times: "Times",
  selecoes: "Seleções",
};

export const bannerPositionLabels: Record<BannerPosition, string> = {
  hero: "Hero principal",
  promo: "Banner promocional",
};

export const defaultBanners: StoreBanner[] = [
  {
    id: "home-hero-principal",
    name: "Hero principal da home",
    page: "home",
    position: "hero",
    desktopImageUrl: "/assets/banner/BannerHome.png",
    title: "MAIS QUE\nUMA CAMISA,\nUMA HISTÓRIA.",
    description: "Camisas dos maiores times do mundo com qualidade premium.",
    linkUrl: "/masculino",
    isActive: true,
    sortOrder: 1,
  },
  {
    id: "home-hero-masculino",
    name: "Hero masculino",
    page: "home",
    position: "hero",
    desktopImageUrl: "/assets/banner/promo-banner.png",
    title: "MASCULINO",
    description: "Modelos premium para torcer com estilo.",
    linkUrl: "/masculino",
    isActive: true,
    sortOrder: 2,
  },
  {
    id: "home-hero-retro",
    name: "Hero retrô",
    page: "home",
    position: "hero",
    desktopImageUrl: "/assets/banner/bannerRetro.png",
    title: "RETRÔ",
    description: "Camisas que carregam história dentro e fora de campo.",
    linkUrl: "/retro",
    isActive: true,
    sortOrder: 3,
  },
];

export const isBannerActiveNow = (banner: StoreBanner, date = new Date()) => {
  if (!banner.isActive) return false;

  if (banner.startsAt) {
    const startsAt = new Date(`${banner.startsAt}T00:00:00`);
    if (date < startsAt) return false;
  }

  if (banner.endsAt) {
    const endsAt = new Date(`${banner.endsAt}T23:59:59`);
    if (date > endsAt) return false;
  }

  return true;
};
