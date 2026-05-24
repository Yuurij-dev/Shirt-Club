import Image, { StaticImageData } from "next/image";

type BannerProps = {
  image: StaticImageData;

  title?: string;
  description?: string;

  textPosition?: "left" | "center" | "right";

  imageFit?: "cover" | "contain";

  height?: string;
};

const Banner = ({
  image,
  title,
  description,

  textPosition = "left",

  imageFit = "cover",

  height = "h-[320px] sm:h-[420px] md:h-[520px] lg:h-[520px]",
}: BannerProps) => {
  return (
    <section className="flex w-full justify-center">
      
      <div
        className={`
          relative
          w-full
          max-w-[1600px]
          overflow-hidden
          ${height}
        `}
      >

        <Image
          src={image}
          alt={title || "Banner"}
          priority
          fill
          className={`
            object-${imageFit}
            object-center
          `}
        />

        {/* TEXTO */}
        {(title || description) && (
          <div
            className={`
              absolute
              bottom-6

              sm:bottom-8
              md:bottom-10
              lg:bottom-16

              ${
                textPosition === "left"
                  ? "left-4 sm:left-6 md:left-10 lg:left-16 text-left"
                  : textPosition === "center"
                  ? "left-1/2 -translate-x-1/2 text-center"
                  : "right-4 sm:right-6 md:right-10 lg:right-16 text-right"
              }
            `}
          >
            {title && (
              <h1
                className="
                  whitespace-pre-line
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
                {title}
              </h1>
            )}

            {description && (
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
                {description}
              </p>
            )}
          </div>
        )}

      </div>

    </section>
  );
};

export default Banner;