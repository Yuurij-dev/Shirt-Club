"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type { BannerPage, StoreBanner } from "@/app/data/banners";

type CategoryBannerCarouselProps = {
  page: BannerPage;
  fallbackBanner: StoreBanner;
  heading: string;
};

type BannersResponse = {
  banners?: StoreBanner[];
};

const CategoryBannerCarousel = ({
  page,
  fallbackBanner,
  heading,
}: CategoryBannerCarouselProps) => {
  const [banners, setBanners] = useState<StoreBanner[] | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    let isMounted = true;

    const loadBanners = async () => {
      try {
        const response = await fetch(`/api/banners?page=${page}&position=hero`, {
          cache: "no-store",
        });
        const data = (await response.json()) as BannersResponse;

        if (!isMounted || !response.ok) return;

        setBanners(data.banners || []);
        setActiveIndex(0);
      } catch (error) {
        console.error("Não foi possível carregar banners da categoria", error);

        if (isMounted) {
          setBanners([fallbackBanner]);
        }
      }
    };

    void loadBanners();

    return () => {
      isMounted = false;
    };
  }, [fallbackBanner, page]);

  const visibleBanners = useMemo(() => {
    return banners === null ? [fallbackBanner] : banners;
  }, [banners, fallbackBanner]);

  const hasMultipleBanners = visibleBanners.length > 1;
  const normalizedActiveIndex =
    visibleBanners.length > 0 ? activeIndex % visibleBanners.length : 0;
  const activeBanner = visibleBanners[normalizedActiveIndex];

  useEffect(() => {
    if (!hasMultipleBanners) return;

    const timer = window.setInterval(() => {
      setActiveIndex((currentIndex) => {
        return (currentIndex + 1) % visibleBanners.length;
      });
    }, 5500);

    return () => window.clearInterval(timer);
  }, [hasMultipleBanners, visibleBanners.length]);

  const goToPrevious = () => {
    setActiveIndex((currentIndex) => {
      return currentIndex === 0 ? visibleBanners.length - 1 : currentIndex - 1;
    });
  };

  const goToNext = () => {
    setActiveIndex((currentIndex) => {
      return (currentIndex + 1) % visibleBanners.length;
    });
  };

  if (!activeBanner) return null;

  const shouldShowTextOverlay =
    activeBanner.id === fallbackBanner.id ||
    Boolean(activeBanner.title || activeBanner.description);

  return (
    <section className="!py-8">
      <div className="relative !mx-auto aspect-[16/9] w-full max-w-[1180px] overflow-hidden rounded-lg bg-white sm:aspect-[32/9]">
        {visibleBanners.map((banner, index) => {
          const imageUrl = banner.mobileImageUrl || banner.desktopImageUrl;
          const isActive = index === normalizedActiveIndex;

          return (
            <div
              key={banner.id}
              className={`absolute inset-0 transition-opacity duration-700 ${
                isActive ? "opacity-100" : "opacity-0"
              }`}
              aria-hidden={!isActive}
            >
              <Image
                src={imageUrl}
                alt={banner.name}
                fill
                priority={index === 0}
                sizes="(min-width: 1600px) 1600px, 100vw"
                className="object-contain object-center"
              />
            </div>
          );
        })}

        {shouldShowTextOverlay && (
          <div className="pointer-events-none absolute inset-0 flex items-center !pl-5 sm:!pl-10 lg:!pl-20">
            <div className="flex max-w-[420px] flex-col gap-4 text-white sm:gap-5">
              <h2 className="font-[family-name:var(--font-bebas)] text-4xl leading-none tracking-wide drop-shadow-[0_2px_10px_rgba(0,0,0,0.6)] sm:text-5xl">
                {activeBanner.title || heading}
              </h2>

              {activeBanner.description ? (
                <p className="max-w-[360px] text-sm text-zinc-200 drop-shadow-[0_2px_10px_rgba(0,0,0,0.6)]">
                  {activeBanner.description}
                </p>
              ) : (
                <div className="!mt-2 flex flex-col gap-4 sm:!mt-4 sm:flex-row sm:gap-10">
                  <div>
                    <p className="text-xs font-bold uppercase sm:text-sm">
                      FRETE GRÁTIS
                    </p>
                    <span className="text-xs text-zinc-300">Para todo Brasil</span>
                  </div>

                  <div>
                    <p className="text-xs font-bold uppercase sm:text-sm">
                      10% OFF NO PIX
                    </p>
                    <span className="text-xs text-zinc-300">
                      Desconto exclusivo
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {activeBanner.linkUrl && (
          <Link
            href={activeBanner.linkUrl}
            aria-label={`Abrir ${activeBanner.name}`}
            className="absolute inset-0 z-[1]"
          />
        )}

        {hasMultipleBanners && (
          <>
            <button
              type="button"
              onClick={goToPrevious}
              aria-label="Banner anterior"
              className="absolute left-3 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-white/90 text-black shadow-sm transition-all duration-200 hover:bg-white"
            >
              <ChevronLeft size={22} />
            </button>

            <button
              type="button"
              onClick={goToNext}
              aria-label="Próximo banner"
              className="absolute right-3 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-white/90 text-black shadow-sm transition-all duration-200 hover:bg-white"
            >
              <ChevronRight size={22} />
            </button>

            <div className="absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 items-center !gap-2">
              {visibleBanners.map((banner, index) => (
                <button
                  key={banner.id}
                  type="button"
                  aria-label={`Ir para o banner ${index + 1}`}
                  onClick={() => setActiveIndex(index)}
                  className={`h-2.5 cursor-pointer rounded-full transition-all duration-200 ${
                    index === normalizedActiveIndex
                      ? "w-8 bg-white"
                      : "w-2.5 bg-white/55 hover:bg-white"
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default CategoryBannerCarousel;
