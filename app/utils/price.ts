export const getPriceNumber = (price: string | number) => {
  if (typeof price === "number") return price;

  return Number(price.replace("R$ ", "").replace(".", "").replace(",", "."));
};

export const formatPrice = (price: string | number) => {
  const priceNumber = getPriceNumber(price);

  return `R$ ${priceNumber.toFixed(2).replace(".", ",")}`;
};
