export type StoreSettings = {
  customizationPricing: {
    phrase: number;
    name: number;
    numberDigit: number;
  };
};

export const defaultStoreSettings: StoreSettings = {
  customizationPricing: {
    phrase: 45,
    name: 15,
    numberDigit: 10,
  },
};
