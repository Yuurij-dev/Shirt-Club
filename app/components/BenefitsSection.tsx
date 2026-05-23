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
    <div className="container">
      <section className="!py-5 w-full">
      
      <div className="container mx-auto">

        <div className="grid grid-cols-5">

          {benefits.map((item) => (
            <div
              key={item.title}
              className="
                flex
                flex-col
                items-center
                justify-center
                gap-4
                py-10
                cursor-pointer
                transition-all
                duration-200
                hover:bg-zinc-50
              "
            >
              
              <Image
                src={item.icon}
                alt={item.title}
                width={42}
                height={42}
                className="opacity-80"
              />

              <span className="font-semibold text-sm tracking-wide">
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