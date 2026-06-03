type SkeletonBlockProps = {
  className?: string;
};

export const SkeletonBlock = ({ className = "" }: SkeletonBlockProps) => {
  return (
    <div
      aria-hidden="true"
      className={`skeleton-shimmer rounded-xl bg-zinc-200 ${className}`}
    />
  );
};

export const ProductCardSkeleton = () => {
  return (
    <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
      <SkeletonBlock className="h-[320px] sm:h-[360px]" />

      <div className="!p-4">
        <SkeletonBlock className="h-4 w-4/5" />
        <SkeletonBlock className="!mt-2 h-4 w-3/5" />
        <SkeletonBlock className="!mt-4 h-6 w-1/2" />
      </div>
    </div>
  );
};

const PageLoadingSkeleton = () => {
  return (
    <div className="min-h-screen bg-white">
      <SkeletonBlock className="h-9 w-full rounded-none bg-zinc-950/80" />

      <div className="border-b border-zinc-200">
        <div className="container !mx-auto flex h-20 items-center justify-between !px-4 sm:!px-6 lg:!px-0">
          <SkeletonBlock className="h-12 w-20 rounded-lg" />
          <div className="hidden items-center !gap-5 lg:flex">
            {Array.from({ length: 6 }).map((_, index) => (
              <SkeletonBlock key={index} className="h-4 w-24" />
            ))}
          </div>
          <div className="flex items-center !gap-4">
            {Array.from({ length: 3 }).map((_, index) => (
              <SkeletonBlock key={index} className="h-7 w-7 rounded-full" />
            ))}
          </div>
        </div>
      </div>

      <main className="container !mx-auto !px-4 !py-8 sm:!px-6 lg:!px-0">
        <SkeletonBlock className="h-[260px] w-full rounded-2xl sm:h-[360px]" />

        <div className="!mt-10 flex items-center justify-between">
          <SkeletonBlock className="h-10 w-44" />
          <SkeletonBlock className="h-4 w-24" />
        </div>

        <div className="!mt-6 grid grid-cols-1 !gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {Array.from({ length: 5 }).map((_, index) => (
            <ProductCardSkeleton key={index} />
          ))}
        </div>

        <div className="!mt-12 grid grid-cols-1 !gap-4 rounded-xl border border-zinc-200 !p-5 md:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="flex items-center !gap-3">
              <SkeletonBlock className="h-9 w-9 rounded-full" />
              <div className="flex-1">
                <SkeletonBlock className="h-4 w-28" />
                <SkeletonBlock className="!mt-2 h-3 w-36" />
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default PageLoadingSkeleton;
