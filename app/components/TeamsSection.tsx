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
    <section className="w-full bg-white !py-6">
      <div className="container !mx-auto">
        <div className="!mb-5 flex items-center justify-between">
          <h2 className="font-[family-name:var(--font-bebas)] text-4xl text-zinc-950">
            TIMES
          </h2>

          <a
            href="#"
            className="text-sm font-medium text-zinc-700 hover:underline"
          >
            Ver todos ›
          </a>
        </div>

        <div className="grid grid-cols-6 gap-5">
          {teams.map((team) => (
            <a
            href="#"
            key={team.name}
            className="
                group
                relative
                flex
                h-[256px]
                items-center
                justify-center
                overflow-hidden
                rounded-lg
                bg-zinc-100
            "
            >
              <Image
                    src={team.image}
                    alt={team.name}
                    width={140}
                    height={140}
                    className="
                    object-contain
                    transition-all
                    duration-300
                    group-hover:scale-110
                    "
                />

              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

              <h3 className="absolute !bottom-5 left-0 right-0 text-center font-[family-name:var(--font-bebas)] text-2xl text-white">
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