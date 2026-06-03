import { products, type Product } from "../data/products";

type ProductOwner = {
  name: string;
  productTeam?: string;
};

export const getProductsByOwner = (owner: ProductOwner): Product[] => {
  const ownerName = owner.productTeam || owner.name;

  return products.filter((product) => product.team === ownerName);
};

export const getProductCountByOwner = (owner: ProductOwner) => {
  return getProductsByOwner(owner).length;
};
