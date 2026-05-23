import Image from "next/image";

const benefits = [
  {
    title: "NACIONAIS",
    icon: "/icons/nacionais.svg",
  },
  {
    title: "INTERNACIONAIS",
    icon: "/icons/internacionais.svg",
  },
  {
    title: "LANÇAMENTOS",
    icon: "/icons/lancamentos.svg",
  },
  {
    title: "RETRO",
    icon: "/icons/retro.svg",
  },
  {
    title: "PERSONALIZE",
    icon: "/icons/personalize.svg",
  },
];

const BenefitsSection = () => {
  return (
    <div className="w-full border-y border-zinc-200 bg-white">
      <section className="w-full !py-6 sm:!py-8 lg:!py-10">
        <div className="container !mx-auto">
          
          <div
            className="
              flex
              flex-wrap
              items-center
              justify-center
              gap-y-8
            "
          >
            {benefits.map((item) => (
              <div
                key={item.title}
                className="
                  flex
                  w-1/2
                  flex-col
                  items-center
                  justify-center
                  gap-3

                  sm:w-1/3

                  lg:w-1/5
                "
              >
                <Image
                  src={item.icon}
                  alt={item.title}
                  width={42}
                  height={42}
                  className="
                    opacity-80

                    h-[34px]
                    w-[34px]

                    sm:h-[38px]
                    sm:w-[38px]

                    lg:h-[42px]
                    lg:w-[42px]
                  "
                />

                <span
                  className="
                    text-center
                    text-[11px]
                    font-semibold
                    tracking-wide

                    sm:text-xs

                    lg:text-sm
                  "
                >
                  {item.title}
                </span>
              </div>
            ))}
          </div>

        </div>
      </section>
    </div>
  );
};

export default BenefitsSection;