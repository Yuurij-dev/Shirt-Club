"use client";

import Image from "next/image";
import { useState } from "react";
import { SkeletonBlock } from "./Skeleton";

type BannerImageLayerProps = {
  src: string;
  alt: string;
  priority?: boolean;
  sizes: string;
  className?: string;
  imageClassName?: string;
  fallbackLabel?: string;
  onLoad?: (image: HTMLImageElement) => void;
};

const BannerImageLayer = ({
  src,
  alt,
  priority = false,
  sizes,
  className = "",
  imageClassName = "object-cover object-center",
  fallbackLabel = "Imagem indisponivel",
  onLoad,
}: BannerImageLayerProps) => {
  const [imageStatus, setImageStatus] = useState({
    src,
    isLoaded: false,
    hasError: false,
  });
  const isLoaded = imageStatus.src === src && imageStatus.isLoaded;
  const hasError = imageStatus.src === src && imageStatus.hasError;

  return (
    <div className={`absolute inset-0 overflow-hidden ${className}`}>
      {!isLoaded && !hasError && (
        <SkeletonBlock className="absolute inset-0 z-[2] h-full w-full rounded-none bg-zinc-100" />
      )}

      {hasError ? (
        <div className="absolute inset-0 z-[2] flex items-center justify-center bg-zinc-100 text-xs font-bold uppercase tracking-wide text-zinc-400">
          {fallbackLabel}
        </div>
      ) : (
        <Image
          src={src}
          alt={alt}
          fill
          priority={priority}
          sizes={sizes}
          className={`${imageClassName} transition-opacity duration-500 ${
            isLoaded ? "opacity-100" : "opacity-0"
          }`}
          onLoad={(event) => {
            setImageStatus({
              src,
              isLoaded: true,
              hasError: false,
            });
            onLoad?.(event.currentTarget);
          }}
          onError={() =>
            setImageStatus({
              src,
              isLoaded: false,
              hasError: true,
            })
          }
        />
      )}
    </div>
  );
};

export default BannerImageLayer;
