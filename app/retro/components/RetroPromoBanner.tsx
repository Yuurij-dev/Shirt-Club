import Image from "next/image";
import retroPromoBannerImg from "public/assets/banner/retro-promo-banner.png"

const RetroPromoBanner = () => {
  return (
    <section className="w-full bg-white !px-4 !py-8 sm:!px-6 lg:!px-0">
      <div className="container !mx-auto">
        <div
          className="
            relative
            h-[180px]
            overflow-hidden
            rounded-lg
            bg-black

            sm:h-[220px]
            lg:h-[260px]
          "
        >
          <Image
            src={retroPromoBannerImg}
            alt="Clássicos nunca saem de moda"
            fill
            priority
            className="object-cover object-center"
          />

          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />

          <div
            className="
              absolute
              left-5
              top-1/2
              max-w-[300px]
              -translate-y-1/2
              text-white

              sm:left-8
              sm:max-w-[420px]

              lg:left-12
            "
          >
            <h2
              className="
                font-[family-name:var(--font-bebas)]
                text-4xl
                leading-none

                sm:text-5xl
                lg:text-6xl
              "
            >
              CLÁSSICOS <br />
              NUNCA SAEM DE MODA
            </h2>

            <p className="!mt-3 text-xs text-zinc-300 sm:text-sm">
              Reviva conquistas. Vista histórias. Faça parte da memória.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RetroPromoBanner;
