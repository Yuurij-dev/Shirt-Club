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
    image: "/selecoes/brasil.svg",
  },
  {
    name: "Argentina",
    slug: "argentina",
    continent: "América do Sul",
    image: "/selecoes/argentina.svg",
  },
  {
    name: "França",
    slug: "franca",
    continent: "Europa",
    image: "/selecoes/franca.svg",
  },
  {
    name: "Portugal",
    slug: "portugal",
    continent: "Europa",
    image: "/selecoes/portugal.svg",
  },
  {
    name: "Espanha",
    slug: "espanha",
    continent: "Europa",
    image: "/selecoes/espanha.svg",
  },
  {
    name: "Alemanha",
    slug: "alemanha",
    continent: "Europa",
    image: "/selecoes/alemanha.svg",
  },
  {
    name: "Itália",
    slug: "italia",
    continent: "Europa",
    image: "/selecoes/italia.svg",
  },
  {
    name: "Inglaterra",
    slug: "inglaterra",
    continent: "Europa",
    image: "/selecoes/inglaterra.svg",
  },
  {
    name: "Uruguai",
    slug: "uruguai",
    continent: "América do Sul",
    image: "/selecoes/uruguai.svg",
  },
  {
    name: "México",
    slug: "mexico",
    continent: "América do Norte",
    image: "/selecoes/mexico.svg",
  },
  {
    name: "Japão",
    slug: "japao",
    continent: "Ásia",
    image: "/selecoes/japao.svg",
  },
  {
    name: "Nigéria",
    slug: "nigeria",
    continent: "África",
    image: "/selecoes/nigeria.svg",
  },
];

export const getSelectionBySlug = (slug: string) => {
  return selections.find((selection) => selection.slug === slug);
};
