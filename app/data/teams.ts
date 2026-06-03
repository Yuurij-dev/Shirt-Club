export type Country =
  | "Todos"
  | "Brasil"
  | "Espanha"
  | "Inglaterra"
  | "França"
  | "Itália"
  | "Alemanha";

export type Team = {
  name: string;
  slug: string;
  country: Exclude<Country, "Todos">;
  image?: string;
  productTeam?: string;
};

export const countries: Country[] = [
  "Todos",
  "Brasil",
  "Espanha",
  "Inglaterra",
  "França",
  "Itália",
  "Alemanha",
];

export const teams: Team[] = [
  {
    name: "Flamengo",
    slug: "flamengo",
    country: "Brasil",
    image: "/teams/flamengo.svg",
  },
  {
    name: "Corinthians",
    slug: "corinthians",
    country: "Brasil",
    image: "/teams/corinthians.svg",
  },
  {
    name: "Palmeiras",
    slug: "palmeiras",
    country: "Brasil",
    image: "/teams/palmeiras.svg",
  },
  {
    name: "São Paulo",
    slug: "sao-paulo",
    country: "Brasil",
  },
  {
    name: "Santos",
    slug: "santos",
    country: "Brasil",
  },
  {
    name: "Real Madrid",
    slug: "real-madrid",
    country: "Espanha",
    image: "/teams/real-madrid.svg",
  },
  {
    name: "Barcelona",
    slug: "barcelona",
    country: "Espanha",
    image: "/teams/barcelona.svg",
  },
  {
    name: "Liverpool",
    slug: "liverpool",
    country: "Inglaterra",
  },
  {
    name: "Paris Saint-Germain",
    slug: "psg",
    country: "França",
  },
  {
    name: "Manchester City",
    slug: "manchester-city",
    country: "Inglaterra",
  },
  {
    name: "Bayern de Munique",
    slug: "bayern-de-munique",
    country: "Alemanha",
  },
  {
    name: "Chelsea",
    slug: "chelsea",
    country: "Inglaterra",
  },
  {
    name: "Arsenal",
    slug: "arsenal",
    country: "Inglaterra",
  },
  {
    name: "AC Milan",
    slug: "milan",
    country: "Itália",
    productTeam: "Milan",
  },
  {
    name: "Juventus",
    slug: "juventus",
    country: "Itália",
  },
  {
    name: "Internacional",
    slug: "internacional",
    country: "Brasil",
    productTeam: "Inter",
  },
  {
    name: "Grêmio",
    slug: "gremio",
    country: "Brasil",
  },
  {
    name: "Atlético-MG",
    slug: "atletico-mg",
    country: "Brasil",
  },
  {
    name: "Cruzeiro",
    slug: "cruzeiro",
    country: "Brasil",
  },
];

export const getTeamBySlug = (slug: string) => {
  return teams.find((team) => team.slug === slug);
};
