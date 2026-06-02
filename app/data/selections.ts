export type Continent =
  | "Todos"
  | "América do Sul"
  | "Europa"
  | "América do Norte"
  | "África"
  | "Ásia";

export type Selection = {
  name: string;
  slug: string;
  continent: Exclude<Continent, "Todos">;
  products: number;
  image?: string;
  productTeam?: string;
};

export const continents: Continent[] = [
  "Todos",
  "América do Sul",
  "Europa",
  "América do Norte",
  "África",
  "Ásia",
];

export const selections: Selection[] = [
  {
    name: "Brasil",
    slug: "brasil",
    continent: "América do Sul",
    products: 36,
    image: "/selecoes/brasil.svg",
  },
  {
    name: "Argentina",
    slug: "argentina",
    continent: "América do Sul",
    products: 32,
    image: "/selecoes/argentina.svg",
  },
  {
    name: "França",
    slug: "franca",
    continent: "Europa",
    products: 30,
    image: "/selecoes/franca.svg",
  },
  {
    name: "Portugal",
    slug: "portugal",
    continent: "Europa",
    products: 28,
    image: "/selecoes/portugal.svg",
  },
  {
    name: "Espanha",
    slug: "espanha",
    continent: "Europa",
    products: 27,
    image: "/selecoes/espanha.svg",
  },
  {
    name: "Alemanha",
    slug: "alemanha",
    continent: "Europa",
    products: 25,
    image: "/selecoes/alemanha.svg",
  },
  {
    name: "Itália",
    slug: "italia",
    continent: "Europa",
    products: 24,
    image: "/selecoes/italia.svg",
  },
  {
    name: "Inglaterra",
    slug: "inglaterra",
    continent: "Europa",
    products: 24,
    image: "/selecoes/inglaterra.svg",
  },
  {
    name: "Uruguai",
    slug: "uruguai",
    continent: "América do Sul",
    products: 20,
    image: "/selecoes/uruguai.svg",
  },
  {
    name: "México",
    slug: "mexico",
    continent: "América do Norte",
    products: 18,
    image: "/selecoes/mexico.svg",
  },
  {
    name: "Japão",
    slug: "japao",
    continent: "Ásia",
    products: 16,
    image: "/selecoes/japao.svg",
  },
  {
    name: "Nigéria",
    slug: "nigeria",
    continent: "África",
    products: 14,
    image: "/selecoes/nigeria.svg",
  },
];

export const getSelectionBySlug = (slug: string) => {
  return selections.find((selection) => selection.slug === slug);
};
