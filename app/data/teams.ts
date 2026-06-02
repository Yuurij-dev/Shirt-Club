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
  products: number;
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
    products: 45,
    image: "/teams/flamengo.svg",
  },
  {
    name: "Corinthians",
    slug: "corinthians",
    country: "Brasil",
    products: 42,
    image: "/teams/corinthians.svg",
  },
  {
    name: "Palmeiras",
    slug: "palmeiras",
    country: "Brasil",
    products: 40,
    image: "/teams/palmeiras.svg",
  },
  {
    name: "São Paulo",
    slug: "sao-paulo",
    country: "Brasil",
    products: 38,
  },
  {
    name: "Santos",
    slug: "santos",
    country: "Brasil",
    products: 35,
  },
  {
    name: "Real Madrid",
    slug: "real-madrid",
    country: "Espanha",
    products: 50,
    image: "/teams/real-madrid.svg",
  },
  {
    name: "Barcelona",
    slug: "barcelona",
    country: "Espanha",
    products: 48,
    image: "/teams/barcelona.svg",
  },
  {
    name: "Liverpool",
    slug: "liverpool",
    country: "Inglaterra",
    products: 46,
  },
  {
    name: "Paris Saint-Germain",
    slug: "psg",
    country: "França",
    products: 44,
  },
  {
    name: "Manchester City",
    slug: "manchester-city",
    country: "Inglaterra",
    products: 40,
  },
  {
    name: "Bayern de Munique",
    slug: "bayern-de-munique",
    country: "Alemanha",
    products: 38,
  },
  {
    name: "Chelsea",
    slug: "chelsea",
    country: "Inglaterra",
    products: 36,
  },
  {
    name: "Arsenal",
    slug: "arsenal",
    country: "Inglaterra",
    products: 35,
  },
  {
    name: "AC Milan",
    slug: "milan",
    country: "Itália",
    products: 34,
    productTeam: "Milan",
  },
  {
    name: "Juventus",
    slug: "juventus",
    country: "Itália",
    products: 32,
  },
  {
    name: "Internacional",
    slug: "internacional",
    country: "Brasil",
    products: 30,
    productTeam: "Inter",
  },
  {
    name: "Grêmio",
    slug: "gremio",
    country: "Brasil",
    products: 28,
  },
  {
    name: "Atlético-MG",
    slug: "atletico-mg",
    country: "Brasil",
    products: 28,
  },
  {
    name: "Cruzeiro",
    slug: "cruzeiro",
    country: "Brasil",
    products: 26,
  },
];

export const getTeamBySlug = (slug: string) => {
  return teams.find((team) => team.slug === slug);
};
