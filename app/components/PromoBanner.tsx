"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { StoreBanner } from "../data/banners";
import BannerImageLayer from "./BannerImageLayer";
import { SkeletonBlock } from "./Skeleton";

type PromoBannerProps = {
  banners?: StoreBanner[];
};

const fallbackPromoBanner: StoreBanner = {
  id: "home-promo-default",
  name: "Banner promocional padrão",
  page: "home",
  position: "promo",
  desktopImageUrl: "/assets/banner/promo-banner.png",
  title: "NOVA COLEÇÃO 25/26",
  linkUrl: "/masculino",
  isActive: true,
  sortOrder: 1,
};

const PromoBanner = ({ banners = [] }: PromoBannerProps) => {
  const [isMobile, setIsMobile] = useState<boolean | null>(null);
  const banner = banners[0] || fallbackPromoBanner;
  const isFallbackBanner = banner.id === fallbackPromoBanner.id;
  const title = banner.title || (isFallbackBanner ? fallbackPromoBanner.title : "");
  const description = banner.description;
  const shouldShowText = Boolean(title || description);
  const imageUrl =
    isMobile && banner.mobileImageUrl
      ? banner.mobileImageUrl
      : banner.desktopImageUrl;

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 639px)");
    const handleViewportChange = () => setIsMobile(mediaQuery.matches);

    handleViewportChange();
    mediaQuery.addEventListener("change", handleViewportChange);

    return () => mediaQuery.removeEventListener("change", handleViewportChange);
  }, []);

  return (
    <section className="container !mx-auto !px-4 !py-8 sm:!px-6 lg:!px-0">
      <div className="relative aspect-[4/5] w-full overflow-hidden rounded-lg bg-white sm:h-[260px] sm:aspect-auto sm:bg-zinc-100 lg:h-[290px]">
        {isMobile === null ? (
          <SkeletonBlock className="absolute inset-0 h-full w-full rounded-none bg-zinc-100" />
        ) : (
          <BannerImageLayer
            src={imageUrl}
            alt={banner.name}
            priority={false}
            sizes={isMobile ? "100vw" : "(min-width: 1600px) 1400px, 100vw"}
            imageClassName={
              isMobile
                ? "object-contain object-center"
                : "object-cover object-[70%_center] md:object-center"
            }
            fallbackLabel="Banner indisponível"
          />
        )}

        {shouldShowText && (
          <div className="pointer-events-none absolute inset-0 flex items-center !pl-5 sm:!pl-10 lg:!pl-20">
            <div className="flex max-w-[420px] flex-col gap-4 text-white sm:gap-5">
              {title && (
                <h2 className="font-[family-name:var(--font-bebas)] text-4xl leading-none tracking-wide drop-shadow-[0_2px_10px_rgba(0,0,0,0.6)] sm:text-5xl">
                  {title}
                </h2>
              )}

              {description && (
                <p className="max-w-[360px] text-sm text-zinc-200 drop-shadow-[0_2px_10px_rgba(0,0,0,0.6)]">
                  {description}
                </p>
              )}
            </div>
          </div>
        )}

        {banner.linkUrl && (
          <Link
            href={banner.linkUrl}
            aria-label={`Abrir ${banner.name}`}
            className="absolute inset-0 z-[1]"
          />
        )}
      </div>
    </section>
  );
};

export default PromoBanner;
