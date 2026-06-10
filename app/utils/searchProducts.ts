import { activeProducts, type Product } from "../data/products";

export const normalizeSearchText = (text: string) => {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
};

export const searchProducts = (query: string): Product[] => {
  const normalizedQuery = normalizeSearchText(query);

  if (!normalizedQuery) return [];

  return activeProducts.filter((product) => {
    const searchableText = normalizeSearchText(
      [
        product.name,
        product.category,
        product.team,
        product.brand,
        product.season,
        product.description,
      ]
        .filter(Boolean)
        .join(" "),
    );

    return searchableText.includes(normalizedQuery);
  });
};
