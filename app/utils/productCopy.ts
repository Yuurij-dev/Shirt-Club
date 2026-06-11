import type { Product } from "@/app/data/products";

const genericDescriptionSignals = [
  "acabamento premium",
  "tecido leve",
  "tecido confort",
  "visual cl",
  "modelagem confort",
  "ideal para usar",
  "inspirada em",
  "inspirado em",
  "Ã",
];

const teamNicknames: Record<string, string> = {
  Barcelona: "blaugrana",
  Brasil: "da Seleção",
  Corinthians: "do Timão",
  Flamengo: "rubro-negra",
  Inter: "colorada",
  Milan: "rossonera",
  Palmeiras: "alviverde",
  "Real Madrid": "merengue",
  Vasco: "cruz-maltina",
};

const normalizeText = (value?: string) => {
  return (value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
};

const isRetroProduct = (product: Product) => {
  return [product.id, product.name, product.category, product.season]
    .map(normalizeText)
    .join(" ")
    .includes("retro");
};

const hasGenericCopy = (product: Product) => {
  const description = normalizeText(product.description);
  const details = product.details.map(normalizeText).join(" ");

  if (!description || product.details.length === 0) return true;
  if (product.description.includes("Ã") || details.includes("Ã")) return true;

  return genericDescriptionSignals.some((signal) => {
    return description.includes(normalizeText(signal));
  });
};

const getSeasonLabel = (product: Product) => {
  return product.season?.replace(/retro/i, "retrô").trim() || "temporada atual";
};

const getTeamStyle = (product: Product) => {
  return teamNicknames[product.team] || `do ${product.team}`;
};

const getProductStory = (product: Product) => {
  const season = getSeasonLabel(product);

  if (isRetroProduct(product)) {
    return `resgata a nostalgia ${getTeamStyle(product)} de ${season.replace(
      /^retrô\s*/i,
      ""
    )}`;
  }

  if (product.ownerType === "selection") {
    return `celebra a identidade da seleção ${product.team} para ${season}`;
  }

  if (product.gender === "feminino") {
    return `traz a força da linha feminina ${getTeamStyle(product)} em ${season}`;
  }

  return `leva a tradição ${getTeamStyle(product)} para ${season}`;
};

export const getPersonalizedProductCopy = (product: Product) => {
  const season = getSeasonLabel(product);
  const brand = product.brand || "linha torcedor";
  const isRetro = isRetroProduct(product);
  const isSelection = product.ownerType === "selection";
  const lineLabel =
    product.gender === "feminino"
      ? "modelagem feminina"
      : product.gender === "unissex"
        ? "modelagem unissex"
        : "modelagem masculina";

  const description = `${product.name} ${getProductStory(
    product
  )}. Uma peça pensada para quem quer vestir futebol com presença, conforto e acabamento caprichado no dia a dia ou na coleção.`;

  const details = [
    isRetro
      ? `Visual retrô inspirado na memória ${getTeamStyle(product)}`
      : isSelection
        ? `Escudo e cores da seleção ${product.team} em destaque`
        : `Identidade ${getTeamStyle(product)} com visual da ${season}`,
    `${brand} com caimento confortável e tecido de toque macio`,
    `${lineLabel} com corte regular para usar na arquibancada, no treino ou no casual`,
    isRetro
      ? "Peça ideal para coleção, presente ou uso casual"
      : `Acabamento reforçado para acompanhar a rotina de quem torce pelo ${product.team}`,
  ];

  return {
    description,
    details,
  };
};

export const withPersonalizedProductCopy = (product: Product): Product => {
  if (!hasGenericCopy(product)) return product;

  return {
    ...product,
    ...getPersonalizedProductCopy(product),
  };
};
