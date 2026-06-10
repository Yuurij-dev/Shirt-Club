export type Product = {
  id: string;
  name: string;
  category: string;
  gender?: "masculino" | "feminino" | "unissex";
  active?: boolean;
  ownerType?: "team" | "selection";
  country?: string;
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
    active: true,
    ownerType: "team",
    country: "Brasil",
    image: "/products/teams/flamengo/flamengo-home.png",
    images: [
      "/products/teams/flamengo/flamengo-home.png",
      "/products/teams/flamengo/flamengo-home.png",
      "/products/teams/flamengo/flamengo-home.png",
      "/products/teams/flamengo/flamengo-home.png",
    ],
    badge: "NOVO",
    description:
      "Camisa Flamengo Home 24/25 feita com tecido leve, confortÃ¡vel e acabamento premium. Ideal para usar no dia a dia, treinos ou para torcer pelo MengÃ£o.",
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
    active: true,
    ownerType: "team",
    country: "Espanha",
    image: "/products/teams/real-madrid/real-madrid-home.png",
    images: [
      "/products/teams/real-madrid/real-madrid-home.png",
      "/products/teams/real-madrid/real-madrid-home.png",
      "/products/teams/real-madrid/real-madrid-home.png",
      "/products/teams/real-madrid/real-madrid-home.png",
    ],
    badge: "NOVO",
    description:
      "Camisa Real Madrid Home 24/25 Torcedor Adidas, feita com tecido leve, confortÃ¡vel e acabamento premium. Ideal para usar no dia a dia, treinos ou para torcer pelo seu time.",
    details: [
      "Escudo do Real Madrid aplicado no peito",
      "Tecnologia respirÃ¡vel para maior conforto",
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
    active: true,
    ownerType: "team",
    country: "Brasil",
    image: "/products/teams/palmeiras/palmeiras-home.png",
    images: ["/products/teams/palmeiras/palmeiras-home.png", "/products/teams/palmeiras/palmeiras-home.png"],
    badge: "NOVO",
    description:
      "Camisa Palmeiras Home 24/25 com visual clÃ¡ssico, tecido confortÃ¡vel e acabamento premium para acompanhar todos os momentos da temporada.",
    details: [
      "Escudo do Palmeiras aplicado no peito",
      "Tecido leve e respirÃ¡vel",
      "Acabamento premium",
      "Modelagem confortÃ¡vel",
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
    active: true,
    ownerType: "team",
    country: "Espanha",
    image: "/products/teams/barcelona/barcelona-home.png",
    images: ["/products/teams/barcelona/barcelona-home.png", "/products/teams/barcelona/barcelona-home.png"],
    badge: "NOVO",
    description:
      "Camisa Barcelona Home 24/25 com as cores tradicionais do clube, acabamento premium e tecido macio para torcer com estilo.",
    details: [
      "Escudo do Barcelona aplicado no peito",
      "Tecido confortÃ¡vel",
      "Visual clÃ¡ssico da temporada",
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
    active: true,
    ownerType: "team",
    country: "Brasil",
    image: "/products/teams/vasco/vasco-home.png",
    images: ["/products/teams/vasco/vasco-home.png", "/products/teams/vasco/vasco-home.png"],
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
    active: true,
    ownerType: "team",
    country: "Brasil",
    image: "/products/teams/corinthians/corinthians-home.png",
    images: ["/products/teams/corinthians/corinthians-home.png", "/products/teams/corinthians/corinthians-home.png"],
    badge: "NOVO",
    description:
      "Camisa Corinthians Home 24/25 com tecido leve, visual clÃ¡ssico e acabamento premium para vestir o TimÃ£o.",
    details: [
      "Escudo do Corinthians aplicado no peito",
      "Tecido leve e confortÃ¡vel",
      "Acabamento premium",
      "Corte regular",
    ],
  },
  {
    id: "camisa-flamengo-retro",
    name: "Camisa Flamengo RetrÃ´",
    category: "RetrÃ´",
    team: "Flamengo",
    brand: "Umbro",
    season: "RetrÃ´",
    price: "R$ 179,90",
    active: true,
    ownerType: "team",
    country: "Brasil",
    image: "/products/teams/flamengo/flamengo-retro.png",
    images: ["/products/teams/flamengo/flamengo-retro.png", "/products/teams/flamengo/flamengo-retro.png"],
    badge: "RETRO",
    description:
      "Camisa Flamengo RetrÃ´ inspirada em momentos histÃ³ricos do clube, com visual marcante e acabamento premium.",
    details: [
      "Design retrÃ´ inspirado em uniformes clÃ¡ssicos",
      "Tecido confortÃ¡vel",
      "Acabamento premium",
      "Ideal para coleÃ§Ã£o ou uso casual",
    ],
  },
  {
    id: "camisa-barcelona-retro-2015",
    name: "Camisa Barcelona RetrÃ´ 2015",
    category: "RetrÃ´",
    team: "Barcelona",
    brand: "Nike",
    season: "RetrÃ´ 2015",
    price: "R$ 179,90",
    active: true,
    ownerType: "team",
    country: "Espanha",
    image: "/products/teams/barcelona/barcelona-2015.png",
    images: ["/products/teams/barcelona/barcelona-2015.png", "/products/teams/barcelona/barcelona-2015.png"],
    badge: "RETRO",
    description:
      "Camisa Barcelona RetrÃ´ 2015 inspirada em uma das temporadas mais lembradas do clube, com tecido confortÃ¡vel e acabamento premium.",
    details: [
      "Design inspirado na temporada 2015",
      "Escudo do Barcelona aplicado",
      "Tecido confortÃ¡vel",
      "Corte regular",
    ],
  },
  {
    id: "camisa-milan-retro-96-99",
    name: "Camisa Milan RetrÃ´ 96/99",
    category: "RetrÃ´",
    team: "Milan",
    brand: "Adidas",
    season: "RetrÃ´ 96/99",
    price: "R$ 189,90",
    image: "/products/teams/milan/milan-retro.png",
    images: ["/products/teams/milan/milan-retro.png", "/products/teams/milan/milan-retro.png"],
    badge: "RETRO",
    description:
      "Camisa Milan RetrÃ´ 96/99 com visual clÃ¡ssico, acabamento premium e inspiraÃ§Ã£o em uma era marcante do futebol italiano.",
    details: [
      "Design retrÃ´ do Milan",
      "Tecido confortÃ¡vel",
      "Acabamento premium",
      "Corte regular",
    ],
  },
  {
    id: "camisa-vasco-retro-1997",
    name: "Camisa Vasco RetrÃ´ 1997",
    category: "RetrÃ´",
    team: "Vasco",
    brand: "RetrÃ´",
    season: "RetrÃ´ 1997",
    price: "R$ 179,90",
    image: "/products/teams/vasco/vasco-retro.png",
    images: ["/products/teams/vasco/vasco-retro.png", "/products/teams/vasco/vasco-retro.png"],
    badge: "RETRO",
    description:
      "Camisa Vasco RetrÃ´ 1997 inspirada em um uniforme histÃ³rico, com visual tradicional e acabamento premium.",
    details: [
      "Design retrÃ´ do Vasco",
      "Tecido leve",
      "Acabamento premium",
      "Modelagem regular",
    ],
  },
  {
    id: "camisa-milan-retro-2007",
    name: "Camisa Milan RetrÃ´ 2007",
    category: "RetrÃ´",
    team: "Milan",
    brand: "Adidas",
    season: "RetrÃ´ 2007",
    price: "R$ 229,90",
    image: "/products/teams/milan/milan-2007.png",
    images: ["/products/teams/milan/milan-2007.png", "/products/teams/milan/milan-2007.png"],
    badge: "RETRO",
    description:
      "Camisa Milan RetrÃ´ 2007 inspirada em uma temporada histÃ³rica, com visual clÃ¡ssico e acabamento premium.",
    details: [
      "Design retrÃ´ do Milan",
      "Tecido macio e confortÃ¡vel",
      "Acabamento premium",
      "Ideal para colecionadores",
    ],
  },
  {
    id: "camisa-brasil-retro-1994",
    name: "Camisa Brasil RetrÃ´ 1994",
    category: "RetrÃ´",
    team: "Brasil",
    brand: "Umbro",
    season: "RetrÃ´ 1994",
    price: "R$ 239,90",
    image: "/products/selections/brasil/brasil-1994.png",
    images: ["/products/selections/brasil/brasil-1994.png", "/products/selections/brasil/brasil-1994.png"],
    badge: "RETRO",
    description:
      "Camisa Brasil RetrÃ´ 1994 inspirada no tetracampeonato, com visual clÃ¡ssico e acabamento premium.",
    details: [
      "Design inspirado em 1994",
      "Tecido confortÃ¡vel",
      "Acabamento premium",
      "Modelagem regular",
    ],
  },
  {
    id: "camisa-vasco-retro-1998",
    name: "Camisa Vasco RetrÃ´ 1998",
    category: "RetrÃ´",
    team: "Vasco",
    brand: "RetrÃ´",
    season: "RetrÃ´ 1998",
    price: "R$ 209,90",
    image: "/products/teams/vasco/vasco-1998.png",
    images: ["/products/teams/vasco/vasco-1998.png", "/products/teams/vasco/vasco-1998.png"],
    badge: "RETRO",
    description:
      "Camisa Vasco RetrÃ´ 1998 com visual nostÃ¡lgico, tecido confortÃ¡vel e acabamento premium.",
    details: [
      "Design inspirado em 1998",
      "Tecido confortÃ¡vel",
      "Acabamento premium",
      "Corte regular",
    ],
  },
  {
    id: "camisa-inter-retro-1998",
    name: "Camisa Inter RetrÃ´ 1998",
    category: "RetrÃ´",
    team: "Inter",
    brand: "RetrÃ´",
    season: "RetrÃ´ 1998",
    price: "R$ 209,90",
    image: "/products/teams/internacional/inter-1998.png",
    images: ["/products/teams/internacional/inter-1998.png", "/products/teams/internacional/inter-1998.png"],
    badge: "RETRO",
    description:
      "Camisa Inter RetrÃ´ 1998 inspirada em uma fase clÃ¡ssica do clube, com acabamento premium.",
    details: [
      "Design retrÃ´ do Inter",
      "Tecido leve",
      "Acabamento premium",
      "Modelagem regular",
    ],
  },
  {
    id: "camisa-flamengo-retro-1981",
    name: "Camisa Flamengo RetrÃ´ 1981",
    category: "RetrÃ´",
    team: "Flamengo",
    brand: "RetrÃ´",
    season: "RetrÃ´ 1981",
    price: "R$ 219,90",
    image: "/products/teams/flamengo/flamengo-1981.png",
    images: ["/products/teams/flamengo/flamengo-1981.png", "/products/teams/flamengo/flamengo-1981.png"],
    badge: "RETRO",
    description:
      "Camisa Flamengo RetrÃ´ 1981 inspirada em uma das fases mais lendÃ¡rias do clube.",
    details: [
      "Design inspirado em 1981",
      "Tecido leve",
      "Acabamento premium",
      "Corte regular",
    ],
  },
  {
    id: "camisa-flamengo-home-24-25-feminina",
    name: "Camisa Flamengo Home 24/25 Feminina",
    category: "Camisas",
    gender: "feminino",
    team: "Flamengo",
    brand: "Adidas",
    season: "Home 24/25",
    price: "R$ 189,90",
    image: "/products/teams/flamengo/flamengo-home.png",
    images: ["/products/teams/flamengo/flamengo-home.png", "/products/teams/flamengo/flamengo-home.png"],
    badge: "NOVO",
    description:
      "Camisa Flamengo Home 24/25 Feminina com tecido leve, acabamento premium e modelagem pensada para vestir com conforto.",
    details: [
      "Escudo do Flamengo aplicado no peito",
      "Modelagem feminina",
      "Tecido leve com toque macio",
      "Acabamento premium",
    ],
  },
  {
    id: "camisa-real-madrid-home-24-25-feminina",
    name: "Camisa Real Madrid Home 24/25 Feminina",
    category: "Camisas",
    gender: "feminino",
    team: "Real Madrid",
    brand: "Adidas",
    season: "Home 24/25",
    price: "R$ 189,90",
    image: "/products/teams/real-madrid/real-madrid-home.png",
    images: ["/products/teams/real-madrid/real-madrid-home.png", "/products/teams/real-madrid/real-madrid-home.png"],
    badge: "NOVO",
    description:
      "Camisa Real Madrid Home 24/25 Feminina com visual clÃ¡ssico, tecido confortÃ¡vel e acabamento premium.",
    details: [
      "Escudo do Real Madrid aplicado no peito",
      "Modelagem feminina",
      "Tecido respirÃ¡vel",
      "Corte confortÃ¡vel",
    ],
  },
  {
    id: "camisa-palmeiras-home-24-25-feminina",
    name: "Camisa Palmeiras Home 24/25 Feminina",
    category: "Camisas",
    gender: "feminino",
    team: "Palmeiras",
    brand: "Puma",
    season: "Home 24/25",
    price: "R$ 189,90",
    image: "/products/teams/palmeiras/palmeiras-home.png",
    images: ["/products/teams/palmeiras/palmeiras-home.png", "/products/teams/palmeiras/palmeiras-home.png"],
    badge: "NOVO",
    description:
      "Camisa Palmeiras Home 24/25 Feminina com tecido leve, modelagem confortÃ¡vel e acabamento premium.",
    details: [
      "Escudo do Palmeiras aplicado no peito",
      "Modelagem feminina",
      "Tecido leve e respirÃ¡vel",
      "Acabamento premium",
    ],
  },
  {
    id: "camisa-barcelona-home-24-25-feminina",
    name: "Camisa Barcelona Home 24/25 Feminina",
    category: "Camisas",
    gender: "feminino",
    team: "Barcelona",
    brand: "Nike",
    season: "Home 24/25",
    price: "R$ 189,90",
    image: "/products/teams/barcelona/barcelona-home.png",
    images: ["/products/teams/barcelona/barcelona-home.png", "/products/teams/barcelona/barcelona-home.png"],
    badge: "NOVO",
    description:
      "Camisa Barcelona Home 24/25 Feminina com as cores tradicionais do clube, tecido macio e acabamento premium.",
    details: [
      "Escudo do Barcelona aplicado no peito",
      "Modelagem feminina",
      "Visual clÃ¡ssico da temporada",
      "Corte confortÃ¡vel",
    ],
  },
];

export const getProductById = (id: string) => {
  return products.find((product) => product.id === id && product.active !== false);
};

export const getAnyProductById = (id: string) => {
  return products.find((product) => product.id === id);
};

export const activeProducts = products.filter((product) => product.active !== false);

export const getProductsByIds = (ids: string[]) => {
  return ids
    .map((id) => getProductById(id))
    .filter((product): product is Product => Boolean(product));
};

const getProductGender = (product: Product) => {
  return product.gender || "masculino";
};

export const masculineProducts = getProductsByIds([
  "camisa-real-madrid-home-24-25",
  "camisa-flamengo-home-24-25",
  "camisa-corinthians-home-24-25",
  "camisa-palmeiras-home-24-25",
]).filter((product) => getProductGender(product) === "masculino");

export const feminineProducts = products.filter((product) => {
  return product.active !== false && getProductGender(product) === "feminino";
});

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

