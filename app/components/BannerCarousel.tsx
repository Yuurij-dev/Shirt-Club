"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type { StoreBanner } from "@/app/data/banners";

type BannerCarouselProps = {
  banners: StoreBanner[];
};

const BannerCarousel = ({ banners }: BannerCarouselProps) => {
  const visibleBanners = useMemo(() => {
    return banners.length > 0 ? banners : [];
  }, [banners]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [bannerRatios, setBannerRatios] = useState<Record<string, number>>({});
  const [isMobile, setIsMobile] = useState(false);

  const hasMultipleBanners = visibleBanners.length > 1;
  const normalizedActiveIndex =
    visibleBanners.length > 0 ? activeIndex % visibleBanners.length : 0;
  const activeBanner = visibleBanners[normalizedActiveIndex];
  const activeRatioKey =
    activeBanner && isMobile && activeBanner.mobileImageUrl
      ? `${activeBanner.id}:mobile`
      : `${activeBanner?.id}:desktop`;
  const activeRatio = activeBanner ? bannerRatios[activeRatioKey] || 1.875 : 1.875;

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 639px)");
    const handleViewportChange = () => setIsMobile(mediaQuery.matches);

    handleViewportChange();
    mediaQuery.addEventListener("change", handleViewportChange);

    return () => mediaQuery.removeEventListener("change", handleViewportChange);
  }, []);

  useEffect(() => {
    if (!hasMultipleBanners) return;

    const timer = window.setInterval(() => {
      setActiveIndex((currentIndex) => {
        return (currentIndex + 1) % visibleBanners.length;
      });
    }, 5500);

    return () => window.clearInterval(timer);
  }, [hasMultipleBanners, visibleBanners.length]);

  if (!activeBanner) return null;

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

  const content = (
    <div
      className="relative w-full max-w-[1600px] overflow-hidden rounded-lg bg-zinc-100 transition-[aspect-ratio] duration-300"
      style={{ aspectRatio: activeRatio }}
    >
      {visibleBanners.map((banner, index) => {
        const isActive = index === normalizedActiveIndex;

        return (
          <div
            key={banner.id}
            className={`absolute inset-0 transition-opacity duration-700 ${
              isActive ? "opacity-100" : "opacity-0"
            }`}
            aria-hidden={!isActive}
          >
            {banner.mobileImageUrl && (
              <Image
                src={banner.mobileImageUrl}
                alt={banner.name}
                priority={index === 0}
                fill
                sizes="100vw"
                className="object-contain object-center sm:hidden"
                onLoad={(event) => {
                  const image = event.currentTarget;
                  if (!image.naturalWidth || !image.naturalHeight) return;

                  setBannerRatios((currentRatios) => {
                    const ratioKey = `${banner.id}:mobile`;
                    if (currentRatios[ratioKey]) return currentRatios;

                    return {
                      ...currentRatios,
                      [ratioKey]: image.naturalWidth / image.naturalHeight,
                    };
                  });
                }}
              />
            )}

            <Image
              src={banner.desktopImageUrl}
              alt={banner.name}
              priority={index === 0 && !banner.mobileImageUrl}
              fill
              sizes="(min-width: 1600px) 1600px, 100vw"
              className={`object-contain object-center ${
                banner.mobileImageUrl ? "hidden sm:block" : "block"
              }`}
              onLoad={(event) => {
                const image = event.currentTarget;
                if (!image.naturalWidth || !image.naturalHeight) return;

                setBannerRatios((currentRatios) => {
                  const ratioKey = `${banner.id}:desktop`;
                  if (currentRatios[ratioKey]) return currentRatios;

                  return {
                    ...currentRatios,
                    [ratioKey]: image.naturalWidth / image.naturalHeight,
                  };
                });
              }}
            />
          </div>
        );
      })}

      {(activeBanner.title || activeBanner.description) && (
        <div className="pointer-events-none absolute bottom-6 left-4 text-left sm:bottom-8 sm:left-6 md:bottom-10 md:left-10 lg:bottom-16 lg:left-16">
          {activeBanner.title && (
            <h1 className="whitespace-pre-line font-[family-name:var(--font-bebas)] text-4xl leading-[0.9] text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.6)] sm:text-5xl md:text-6xl lg:text-8xl">
              {activeBanner.title}
            </h1>
          )}

          {activeBanner.description && (
            <p className="!mt-3 max-w-[260px] text-sm text-zinc-200 drop-shadow-[0_2px_10px_rgba(0,0,0,0.6)] sm:text-base lg:!mt-6 lg:max-w-[420px] lg:text-[1.1em]">
              {activeBanner.description}
            </p>
          )}
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
  );

  return (
    <section className="flex w-full justify-center">
      {content}
    </section>
  );
};

export default BannerCarousel;
