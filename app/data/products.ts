export type Product = {
  id: string;
  name: string;
  category: string;
  team: string;
  brand?: string;
  season?: string;
  price: number | string;
  image: string;
  images: string[];
  description: string;
  details: string[];
  badge?: string;
};

export const products: Product[] = [
  {
    id: "camisa-flamengo-home-24-25",
    name: "Camisa Flamengo Home 24/25",
    category: "Camisas",
    team: "Flamengo",
    brand: "Adidas",
    season: "Home 24/25",
    price: "R$ 0,01",
    image: "/products/flamengo-home.png",
    images: [
      "/products/flamengo-home.png",
      "/products/flamengo-home.png",
      "/products/flamengo-home.png",
      "/products/flamengo-home.png",
    ],
    badge: "NOVO",
    description:
      "Camisa Flamengo Home 24/25 feita com tecido leve, confortável e acabamento premium. Ideal para usar no dia a dia, treinos ou para torcer pelo Mengão.",
    details: [
      "Escudo do Flamengo aplicado no peito",
      "Tecido leve com toque macio",
      "Acabamento premium",
      "Corte regular com liberdade de movimento",
    ],
  },
  {
    id: "camisa-real-madrid-home-24-25",
    name: "Camisa Real Madrid Home 24/25",
    category: "Camisas",
    team: "Real Madrid",
    brand: "Adidas",
    season: "Home 24/25",
    price: "R$ 189,90",
    image: "/products/real-madrid-home.png",
    images: [
      "/products/real-madrid-home.png",
      "/products/real-madrid-home.png",
      "/products/real-madrid-home.png",
      "/products/real-madrid-home.png",
    ],
    badge: "NOVO",
    description:
      "Camisa Real Madrid Home 24/25 Torcedor Adidas, feita com tecido leve, confortável e acabamento premium. Ideal para usar no dia a dia, treinos ou para torcer pelo seu time.",
    details: [
      "Escudo do Real Madrid aplicado no peito",
      "Tecnologia respirável para maior conforto",
      "Tecido leve que absorve o suor",
      "Corte regular: conforto e liberdade de movimento",
    ],
  },
  {
    id: "camisa-palmeiras-home-24-25",
    name: "Camisa Palmeiras Home 24/25",
    category: "Camisas",
    team: "Palmeiras",
    brand: "Puma",
    season: "Home 24/25",
    price: "R$ 189,90",
    image: "/products/palmeiras-home.png",
    images: ["/products/palmeiras-home.png", "/products/palmeiras-home.png"],
    badge: "NOVO",
    description:
      "Camisa Palmeiras Home 24/25 com visual clássico, tecido confortável e acabamento premium para acompanhar todos os momentos da temporada.",
    details: [
      "Escudo do Palmeiras aplicado no peito",
      "Tecido leve e respirável",
      "Acabamento premium",
      "Modelagem confortável",
    ],
  },
  {
    id: "camisa-barcelona-home-24-25",
    name: "Camisa Barcelona Home 24/25",
    category: "Camisas",
    team: "Barcelona",
    brand: "Nike",
    season: "Home 24/25",
    price: "R$ 189,90",
    image: "/products/barcelona-home.png",
    images: ["/products/barcelona-home.png", "/products/barcelona-home.png"],
    badge: "NOVO",
    description:
      "Camisa Barcelona Home 24/25 com as cores tradicionais do clube, acabamento premium e tecido macio para torcer com estilo.",
    details: [
      "Escudo do Barcelona aplicado no peito",
      "Tecido confortável",
      "Visual clássico da temporada",
      "Corte regular",
    ],
  },
  {
    id: "camisa-vasco-home-24-25",
    name: "Camisa Vasco Home 24/25",
    category: "Camisas",
    team: "Vasco",
    brand: "Kappa",
    season: "Home 24/25",
    price: "R$ 189,90",
    image: "/products/vasco-home.png",
    images: ["/products/vasco-home.png", "/products/vasco-home.png"],
    badge: "NOVO",
    description:
      "Camisa Vasco Home 24/25 com design tradicional, tecido leve e acabamento premium para o torcedor cruz-maltino.",
    details: [
      "Escudo do Vasco aplicado no peito",
      "Tecido leve",
      "Acabamento premium",
      "Modelagem regular",
    ],
  },
  {
    id: "camisa-corinthians-home-24-25",
    name: "Camisa Corinthians Home 24/25",
    category: "Camisas",
    team: "Corinthians",
    brand: "Nike",
    season: "Home 24/25",
    price: "R$ 189,90",
    image: "/products/corinthians-home.png",
    images: ["/products/corinthians-home.png", "/products/corinthians-home.png"],
    badge: "NOVO",
    description:
      "Camisa Corinthians Home 24/25 com tecido leve, visual clássico e acabamento premium para vestir o Timão.",
    details: [
      "Escudo do Corinthians aplicado no peito",
      "Tecido leve e confortável",
      "Acabamento premium",
      "Corte regular",
    ],
  },
  {
    id: "camisa-flamengo-retro",
    name: "Camisa Flamengo Retrô",
    category: "Retrô",
    team: "Flamengo",
    brand: "Umbro",
    season: "Retrô",
    price: "R$ 179,90",
    image: "/products/retro/flamengo-retro.png",
    images: ["/products/retro/flamengo-retro.png", "/products/retro/flamengo-retro.png"],
    badge: "RETRO",
    description:
      "Camisa Flamengo Retrô inspirada em momentos históricos do clube, com visual marcante e acabamento premium.",
    details: [
      "Design retrô inspirado em uniformes clássicos",
      "Tecido confortável",
      "Acabamento premium",
      "Ideal para coleção ou uso casual",
    ],
  },
  {
    id: "camisa-barcelona-retro-2015",
    name: "Camisa Barcelona Retrô 2015",
    category: "Retrô",
    team: "Barcelona",
    brand: "Nike",
    season: "Retrô 2015",
    price: "R$ 179,90",
    image: "/products/retro/barcelona-2015.png",
    images: ["/products/retro/barcelona-2015.png", "/products/retro/barcelona-2015.png"],
    badge: "RETRO",
    description:
      "Camisa Barcelona Retrô 2015 inspirada em uma das temporadas mais lembradas do clube, com tecido confortável e acabamento premium.",
    details: [
      "Design inspirado na temporada 2015",
      "Escudo do Barcelona aplicado",
      "Tecido confortável",
      "Corte regular",
    ],
  },
  {
    id: "camisa-milan-retro-96-99",
    name: "Camisa Milan Retrô 96/99",
    category: "Retrô",
    team: "Milan",
    brand: "Adidas",
    season: "Retrô 96/99",
    price: "R$ 189,90",
    image: "/products/retro/milan-retro.png",
    images: ["/products/retro/milan-retro.png", "/products/retro/milan-retro.png"],
    badge: "RETRO",
    description:
      "Camisa Milan Retrô 96/99 com visual clássico, acabamento premium e inspiração em uma era marcante do futebol italiano.",
    details: [
      "Design retrô do Milan",
      "Tecido confortável",
      "Acabamento premium",
      "Corte regular",
    ],
  },
  {
    id: "camisa-vasco-retro-1997",
    name: "Camisa Vasco Retrô 1997",
    category: "Retrô",
    team: "Vasco",
    brand: "Retrô",
    season: "Retrô 1997",
    price: "R$ 179,90",
    image: "/products/retro/vasco-retro.png",
    images: ["/products/retro/vasco-retro.png", "/products/retro/vasco-retro.png"],
    badge: "RETRO",
    description:
      "Camisa Vasco Retrô 1997 inspirada em um uniforme histórico, com visual tradicional e acabamento premium.",
    details: [
      "Design retrô do Vasco",
      "Tecido leve",
      "Acabamento premium",
      "Modelagem regular",
    ],
  },
  {
    id: "camisa-milan-retro-2007",
    name: "Camisa Milan Retrô 2007",
    category: "Retrô",
    team: "Milan",
    brand: "Adidas",
    season: "Retrô 2007",
    price: "R$ 229,90",
    image: "/products/retro/milan-2007.png",
    images: ["/products/retro/milan-2007.png", "/products/retro/milan-2007.png"],
    badge: "RETRO",
    description:
      "Camisa Milan Retrô 2007 inspirada em uma temporada histórica, com visual clássico e acabamento premium.",
    details: [
      "Design retrô do Milan",
      "Tecido macio e confortável",
      "Acabamento premium",
      "Ideal para colecionadores",
    ],
  },
  {
    id: "camisa-brasil-retro-1994",
    name: "Camisa Brasil Retrô 1994",
    category: "Retrô",
    team: "Brasil",
    brand: "Umbro",
    season: "Retrô 1994",
    price: "R$ 239,90",
    image: "/products/retro/brasil-1994.png",
    images: ["/products/retro/brasil-1994.png", "/products/retro/brasil-1994.png"],
    badge: "RETRO",
    description:
      "Camisa Brasil Retrô 1994 inspirada no tetracampeonato, com visual clássico e acabamento premium.",
    details: [
      "Design inspirado em 1994",
      "Tecido confortável",
      "Acabamento premium",
      "Modelagem regular",
    ],
  },
  {
    id: "camisa-vasco-retro-1998",
    name: "Camisa Vasco Retrô 1998",
    category: "Retrô",
    team: "Vasco",
    brand: "Retrô",
    season: "Retrô 1998",
    price: "R$ 209,90",
    image: "/products/retro/vasco-1998.png",
    images: ["/products/retro/vasco-1998.png", "/products/retro/vasco-1998.png"],
    badge: "RETRO",
    description:
      "Camisa Vasco Retrô 1998 com visual nostálgico, tecido confortável e acabamento premium.",
    details: [
      "Design inspirado em 1998",
      "Tecido confortável",
      "Acabamento premium",
      "Corte regular",
    ],
  },
  {
    id: "camisa-inter-retro-1998",
    name: "Camisa Inter Retrô 1998",
    category: "Retrô",
    team: "Inter",
    brand: "Retrô",
    season: "Retrô 1998",
    price: "R$ 209,90",
    image: "/products/retro/inter-1998.png",
    images: ["/products/retro/inter-1998.png", "/products/retro/inter-1998.png"],
    badge: "RETRO",
    description:
      "Camisa Inter Retrô 1998 inspirada em uma fase clássica do clube, com acabamento premium.",
    details: [
      "Design retrô do Inter",
      "Tecido leve",
      "Acabamento premium",
      "Modelagem regular",
    ],
  },
  {
    id: "camisa-flamengo-retro-1981",
    name: "Camisa Flamengo Retrô 1981",
    category: "Retrô",
    team: "Flamengo",
    brand: "Retrô",
    season: "Retrô 1981",
    price: "R$ 219,90",
    image: "/products/retro/flamengo-1981.png",
    images: ["/products/retro/flamengo-1981.png", "/products/retro/flamengo-1981.png"],
    badge: "RETRO",
    description:
      "Camisa Flamengo Retrô 1981 inspirada em uma das fases mais lendárias do clube.",
    details: [
      "Design inspirado em 1981",
      "Tecido leve",
      "Acabamento premium",
      "Corte regular",
    ],
  },
];

export const getProductById = (id: string) => {
  return products.find((product) => product.id === id);
};

export const getProductsByIds = (ids: string[]) => {
  return ids
    .map((id) => getProductById(id))
    .filter((product): product is Product => Boolean(product));
};

export const masculineProducts = getProductsByIds([
  "camisa-real-madrid-home-24-25",
  "camisa-flamengo-home-24-25",
  "camisa-corinthians-home-24-25",
  "camisa-palmeiras-home-24-25",
]);

export const homeProducts = getProductsByIds([
  "camisa-flamengo-home-24-25",
  "camisa-real-madrid-home-24-25",
  "camisa-palmeiras-home-24-25",
  "camisa-vasco-home-24-25",
  "camisa-corinthians-home-24-25",
]);

export const bestSellerProducts = getProductsByIds([
  "camisa-flamengo-home-24-25",
  "camisa-real-madrid-home-24-25",
  "camisa-palmeiras-home-24-25",
  "camisa-barcelona-home-24-25",
  "camisa-vasco-home-24-25",
  "camisa-corinthians-home-24-25",
]);

export const retroCarouselProducts = getProductsByIds([
  "camisa-flamengo-retro",
  "camisa-barcelona-retro-2015",
  "camisa-milan-retro-96-99",
  "camisa-vasco-retro-1997",
]);

export const mostWantedProducts = getProductsByIds([
  "camisa-brasil-retro-1994",
  "camisa-milan-retro-2007",
  "camisa-barcelona-retro-2015",
  "camisa-flamengo-retro-1981",
  "camisa-vasco-retro-1998",
  "camisa-inter-retro-1998",
]);
