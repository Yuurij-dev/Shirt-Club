import Image from "next/image";

const teams = [
  {
    name: "REAL MADRID",
    image: "/teams/real-madrid.svg",
  },
  {
    name: "BARCELONA",
    image: "/teams/barcelona.svg",
  },
  {
    name: "FLAMENGO",
    image: "/teams/flamengo.svg",
  },
  {
    name: "VASCO",
    image: "/teams/vasco.svg",
  },
  {
    name: "CORINTHIANS",
    image: "/teams/corinthians.svg",
  },
  {
    name: "PALMEIRAS",
    image: "/teams/palmeiras.svg",
  },
];

const TeamsSection = () => {
  return (
    <section className="w-full bg-white !px-4 !py-6 sm:!px-6 lg:!px-0">
      <div className="container !mx-auto">
        
        <div className="!mb-5 flex items-center justify-between">
          
          <h2
            className="
              font-[family-name:var(--font-bebas)]
              text-3xl
              text-zinc-950

              sm:text-4xl
            "
          >
            TIMES
          </h2>

          <a
            href="#"
            className="
              text-xs
              font-medium
              text-zinc-700
              hover:underline

              sm:text-sm
            "
          >
            Ver todos ›
          </a>

        </div>

        <div
          className="
            grid
            grid-cols-2
            gap-4

            sm:grid-cols-3

            lg:grid-cols-4

            xl:grid-cols-6
          "
        >
          {teams.map((team) => (
            <a
              href="#"
              key={team.name}
              className="
                group
                relative
                flex
                h-[180px]
                items-center
                justify-center
                overflow-hidden
                rounded-xl
                bg-zinc-100

                sm:h-[220px]

                lg:h-[256px]
              "
            >
              <Image
                src={team.image}
                alt={team.name}
                width={140}
                height={140}
                className="
                  h-[90px]
                  w-[90px]
                  object-contain
                  transition-all
                  duration-300
                  group-hover:scale-110

                  sm:h-[110px]
                  sm:w-[110px]

                  lg:h-[140px]
                  lg:w-[140px]
                "
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

              <h3
                className="
                  absolute
                  !bottom-4
                  left-0
                  right-0
                  text-center
                  font-[family-name:var(--font-bebas)]
                  text-xl
                  text-white

                  sm:text-2xl
                "
              >
                {team.name}
              </h3>
            </a>
          ))}
        </div>

      </div>
    </section>
  );
};

export default TeamsSection;