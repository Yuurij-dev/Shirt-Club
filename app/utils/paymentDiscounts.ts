export const pixDiscountRate = 0.05;

export const getPixDiscount = (amount: number) => {
  return Math.max(0, amount * pixDiscountRate);
};
