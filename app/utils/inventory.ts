import { activeProducts, type Product } from "../data/products";

type ProductOwner = {
  name: string;
  slug?: string;
  productTeam?: string;
};

const normalizeOwnerValue = (value?: string) => {
  return (value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
};

export const productMatchesOwner = (
  product: Product,
  owner: ProductOwner,
  ownerType: NonNullable<Product["ownerType"]> = "team"
) => {
  const productOwnerType = product.ownerType || "team";

  if (productOwnerType !== ownerType) return false;

  const ownerKeys = [owner.productTeam, owner.name, owner.slug]
    .map(normalizeOwnerValue)
    .filter(Boolean);
  const productKeys = [product.team, product.country]
    .map(normalizeOwnerValue)
    .filter(Boolean);

  return productKeys.some((productKey) => ownerKeys.includes(productKey));
};

export const getProductsByOwner = (
  owner: ProductOwner,
  ownerType: NonNullable<Product["ownerType"]> = "team"
): Product[] => {
  return activeProducts.filter((product) =>
    productMatchesOwner(product, owner, ownerType)
  );
};

export const getProductCountByOwner = (
  owner: ProductOwner,
  ownerType: NonNullable<Product["ownerType"]> = "team"
) => {
  return getProductsByOwner(owner, ownerType).length;
};
