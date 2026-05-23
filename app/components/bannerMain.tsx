import Image from "next/image";
import bannerImage from "../assets/Banner.png";

const BannerMain = () => {
  return (
    <section className="w-full flex justify-center">
      
      <div className="relative w-full max-w-[1600px]">

        <Image
          src={bannerImage}
          alt="Banner"
          priority
          className="
            w-full
            h-[650px]
            object-cover
            object-center
          "
        />

        {/* TEXTO */}
        <div className="absolute left-16 top-1/2 -translate-y-1/2">

          <h1
            className="
              font-[family-name:var(--font-bebas)]
              text-8xl
              leading-[0.9]
              text-black
            "
          >
            MAIS QUE <br />
            UMA CAMISA, <br />
            UMA HISTÓRIA.
          </h1>

          <p className="mt-6 text-zinc-700 text-[1.1em]">
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