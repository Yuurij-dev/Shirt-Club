import Image from "next/image";
import bannerImage from "../assets/Banner.png";

const BannerMain = () => {
  return (
    <section className="flex w-full justify-center">
      <div className="relative w-full max-w-[1600px] overflow-hidden">
        
        <Image
          src={bannerImage}
          alt="Banner"
          priority
          className="
            h-[320px]
            w-full
            object-cover
            object-center

            sm:h-[420px]
            md:h-[520px]
            lg:h-[650px]
          "
        />

        <div
          className="
            absolute

            left-4
            bottom-6

            sm:left-6
            sm:bottom-8

            md:left-10
            md:bottom-10

            lg:left-16
            lg:bottom-16
          "
        >
          <h1
            className="
              font-[family-name:var(--font-bebas)]
              leading-[0.9]

              text-white
              drop-shadow-[0_2px_10px_rgba(0,0,0,0.6)]

              text-4xl
              sm:text-5xl
              md:text-6xl
              lg:text-8xl
            "
          >
            MAIS QUE <br />
            UMA CAMISA, <br />
            UMA HISTÓRIA.
          </h1>

          <p
            className="
              !mt-3
              max-w-[260px]
              text-sm

              text-zinc-200
              drop-shadow-[0_2px_10px_rgba(0,0,0,0.6)]

              sm:text-base

              lg:!mt-6
              lg:max-w-[420px]
              lg:text-[1.1em]
            "
          >
            Camisas dos maiores times do mundo
            <br />
            com qualidade premium.
          </p>
        </div>

      </div>
    </section>
  );
};

export default BannerMain;