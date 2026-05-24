import { Headset, ShieldCheck, Truck, BadgeCheck } from "lucide-react";

const highlights = [
  {
    title: "COMPRA SEGURA",
    description: "Seus dados protegidos",
    icon: ShieldCheck,
  },
  {
    title: "ENVIO RÁPIDO",
    description: "Postagem em até 24h",
    icon: Truck,
  },
  {
    title: "QUALIDADE PREMIUM",
    description: "Camisas de alta qualidade",
    icon: BadgeCheck,
  },
  {
    title: "ATENDIMENTO HUMANIZADO",
    description: "Suporte sempre que precisar",
    icon: Headset,
  },
];

const StoreHighlights = () => {
  return (
    <section className="w-full bg-white !px-4 !py-8 sm:!px-6 lg:!px-0">
      <div className="container !mx-auto">
        <div
          className="
            grid
            grid-cols-1
            gap-6
            rounded-xl
            bg-zinc-950
            !px-6
            !py-6
            text-white

            sm:grid-cols-2
            lg:grid-cols-4
            lg:!px-10
          "
        >
          {highlights.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.title}
                className="
                  flex
                  items-center
                  gap-4
                "
              >
                <Icon className="h-9 w-9 shrink-0 text-white" />

                <div>
                  <h3 className="text-sm font-bold">{item.title}</h3>
                  <p className="!mt-1 text-xs text-zinc-300">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default StoreHighlights;