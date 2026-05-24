import Image from "next/image";

const moments = [
  {
    year: "1981",
    title: "Flamengo campeão mundial",
    image: "/moments/flamengo-1981.png",
    href: "#",
  },
  {
    year: "1994",
    title: "Brasil tetra campeão",
    image: "/moments/brasil-1994.png",
    href: "#",
  },
  {
    year: "2005",
    title: "Liverpool milagre de Istambul",
    image: "/moments/liverpool-2005.png",
    href: "#",
  },
  {
    year: "2007",
    title: "Milan campeão da Champions",
    image: "/moments/milan-2007.png",
    href: "#",
  },
  {
    year: "2015",
    title: "Barcelona conquista a tríplice coroa",
    image: "/moments/barcelona-2015.png",
    href: "#",
  },
];

const HistoricMoments = () => {
  return (
    <section className="w-full bg-white !px-4 !py-8 sm:!px-6 lg:!px-0">
      <div className="container !mx-auto">
        <h2 className="font-[family-name:var(--font-bebas)] text-3xl text-zinc-950 sm:text-4xl">
          MOMENTOS HISTÓRICOS
        </h2>

        <div className="!mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {moments.map((moment) => (
            <a
              href={moment.href}
              key={moment.year}
              className="
                group
                relative
                block
                h-[170px]
                overflow-hidden
                rounded-xl
                bg-zinc-100
                shadow-sm
                transition-all
                duration-300
                hover:-translate-y-1
                hover:shadow-xl
              "
            >
              <Image
                src={moment.image}
                alt={moment.title}
                fill
                className="
                  object-cover
                  transition-all
                  duration-500
                  group-hover:scale-110
                "
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

              <div className="absolute bottom-4 left-4 right-4 text-white">
                <h3 className="text-3xl font-bold leading-none">
                  {moment.year}
                </h3>

                <p className="!mt-1 text-sm font-medium">
                  {moment.title}
                </p>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HistoricMoments;