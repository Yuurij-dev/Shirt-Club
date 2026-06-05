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
              grid
              grid-cols-5
              items-center
              gap-1

              sm:flex
              sm:overflow-visible
              sm:justify-center
              sm:gap-3
            "
          >
            {benefits.map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.title}
                  className="
                    flex
                    min-w-0
                    flex-col
                    items-center
                    justify-center
                    gap-2

                    sm:w-1/5
                    sm:gap-3
                  "
                >
                  <Icon
                    aria-hidden="true"
                    strokeWidth={1.8}
                    className="
                      h-6
                      w-6
                      text-zinc-700

                      sm:h-7
                      sm:w-7

                      lg:h-8
                      lg:w-8
                    "
                  />

                  <span
                    className="
                      w-full
                      whitespace-nowrap
                      text-center
                      text-[7px]
                      font-semibold
                      leading-none

                      min-[390px]:text-[8px]
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
