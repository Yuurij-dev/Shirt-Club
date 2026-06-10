import Image from "next/image";
import promoBanner from "public/assets/banner/promo-banner.png";

const PromoBannerTimes = () => {
  return (
    <section className="container !mx-auto !px-4 !py-8 sm:!px-6 lg:!px-0">
      <div
        className="
          relative
          h-[230px]
          w-full
          overflow-hidden
          rounded-lg
          bg-black

          sm:h-[260px]
          lg:h-[290px]
        "
      >
        <Image
          src={promoBanner}
          alt="Nova coleção 25/26"
          fill
          priority
          className="
            object-cover
            object-[70%_center]

            md:object-center
          "
        />

        <div
          className="
            absolute
            inset-0
            flex
            items-center
            !pl-5

            sm:!pl-10
            lg:!pl-20
          "
        >
          <div className="flex max-w-[420px] flex-col gap-4 text-white sm:gap-5">
            <h2
              className="
                font-[family-name:var(--font-bebas)]
                text-4xl
                leading-none
                tracking-wide
                drop-shadow-[0_2px_10px_rgba(0,0,0,0.6)]

                sm:text-5xl
              "
            >
              NOVA COLEÇÃO 25/26
            </h2>

            <div className="!mt-2 flex flex-col gap-4 sm:!mt-4 sm:flex-row sm:gap-10">
              <div>
                <p className="text-xs font-bold uppercase sm:text-sm">
                  FRETE GRÁTIS
                </p>
                <span className="text-xs text-zinc-300">
                  Para todo Brasil
                </span>
              </div>

              <div>
                <p className="text-xs font-bold uppercase sm:text-sm">
                  5% OFF NO PIX
                </p>
                <span className="text-xs text-zinc-300">
                  Desconto exclusivo
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PromoBannerTimes;
