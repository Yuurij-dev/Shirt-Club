import {
  Flag,
  Globe2,
  Paintbrush,
  Shirt,
  Sparkles,
  type LucideIcon,
} from "lucide-react";

type Benefit = {
  title: string;
  icon: LucideIcon;
};

const benefits: Benefit[] = [
  {
    title: "NACIONAIS",
    icon: Flag,
  },
  {
    title: "INTERNACIONAIS",
    icon: Globe2,
  },
  {
    title: "LANÇAMENTOS",
    icon: Sparkles,
  },
  {
    title: "RETRO",
    icon: Shirt,
  },
  {
    title: "PERSONALIZE",
    icon: Paintbrush,
  },
];

const BenefitsSection = () => {
  return (
    <div className="w-full border-y border-zinc-200 bg-white">
      <section className="w-full !py-6 sm:!py-8 lg:!py-10">
        <div className="container !mx-auto !px-4 sm:!px-6 lg:!px-0">
          <div
            className="
              flex
              overflow-x-auto
              items-center
              justify-between
              gap-3

              sm:flex-wrap
              sm:overflow-visible
              sm:justify-center
              sm:gap-y-8
            "
          >
            {benefits.map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.title}
                  className="
                    flex
                    min-w-[70px]
                    flex-col
                    items-center
                    justify-center
                    gap-2

                    sm:w-1/3
                    sm:gap-3

                    lg:w-1/5
                  "
                >
                  <Icon
                    aria-hidden="true"
                    strokeWidth={1.8}
                    className="
                      h-6
                      w-6
                      text-zinc-700

                      sm:h-8
                      sm:w-8

                      lg:h-9
                      lg:w-9
                    "
                  />

                  <span
                    className="
                      w-full
                      whitespace-nowrap
                      text-center
                      text-[8px]
                      font-semibold
                      leading-none

                      min-[390px]:text-[9px]
                      sm:text-xs
                      sm:tracking-wide

                      lg:text-sm
                    "
                  >
                    {item.title}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
};

export default BenefitsSection;
