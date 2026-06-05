import { promises as fs } from "fs";
import path from "path";
import {
  Coupon,
  defaultCoupons,
  getCouponDiscount,
  getCouponStatus,
  normalizeCouponCode,
} from "@/app/data/coupons";

const localCouponsFile = path.join(process.cwd(), ".data", "coupons.json");

const readLocalCoupons = async (): Promise<Coupon[]> => {
  try {
    const file = await fs.readFile(localCouponsFile, "utf-8");
    const coupons = JSON.parse(file) as Coupon[];

    return coupons.length > 0 ? coupons : defaultCoupons;
  } catch {
    return defaultCoupons;
  }
};

const writeLocalCoupons = async (coupons: Coupon[]) => {
  await fs.mkdir(path.dirname(localCouponsFile), { recursive: true });
  await fs.writeFile(localCouponsFile, JSON.stringify(coupons, null, 2));
};

export const listCoupons = async () => {
  return readLocalCoupons();
};

export const createCoupon = async (coupon: Omit<Coupon, "id" | "usedCount">) => {
  const coupons = await readLocalCoupons();
  const normalizedCode = normalizeCouponCode(coupon.code);
  const couponExists = coupons.some((currentCoupon) => {
    return normalizeCouponCode(currentCoupon.code) === normalizedCode;
  });

  if (couponExists) {
    throw new Error("Já existe um cupom com esse código");
  }

  const newCoupon: Coupon = {
    ...coupon,
    id: `${normalizedCode.toLowerCase()}-${Date.now()}`,
    code: normalizedCode,
    usedCount: 0,
  };

  await writeLocalCoupons([newCoupon, ...coupons]);

  return newCoupon;
};

export const updateCoupon = async ({
  id,
  coupon,
}: {
  id: string;
  coupon: Omit<Coupon, "id" | "usedCount">;
}) => {
  const coupons = await readLocalCoupons();
  const currentCoupon = coupons.find((item) => item.id === id);

  if (!currentCoupon) {
    throw new Error("Cupom não encontrado");
  }

  const normalizedCode = normalizeCouponCode(coupon.code);
  const couponExists = coupons.some((item) => {
    return item.id !== id && normalizeCouponCode(item.code) === normalizedCode;
  });

  if (couponExists) {
    throw new Error("Já existe um cupom com esse código");
  }

  const updatedCoupon: Coupon = {
    ...coupon,
    id,
    code: normalizedCode,
    usedCount: currentCoupon.usedCount,
  };

  await writeLocalCoupons(
    coupons.map((item) => (item.id === id ? updatedCoupon : item))
  );

  return updatedCoupon;
};

export const deleteCoupon = async (id: string) => {
  const coupons = await readLocalCoupons();
  const couponExists = coupons.some((coupon) => coupon.id === id);

  if (!couponExists) {
    throw new Error("Cupom não encontrado");
  }

  await writeLocalCoupons(coupons.filter((coupon) => coupon.id !== id));
};

export const validateCoupon = async ({
  code,
  subtotal,
}: {
  code: string;
  subtotal: number;
}) => {
  const coupons = await readLocalCoupons();
  const normalizedCode = normalizeCouponCode(code);
  const coupon = coupons.find((currentCoupon) => {
    return normalizeCouponCode(currentCoupon.code) === normalizedCode;
  });

  if (!coupon) {
    return {
      valid: false,
      error: "Cupom não encontrado",
    };
  }

  const status = getCouponStatus(coupon);

  if (status === "scheduled") {
    return {
      valid: false,
      coupon,
      error: "Esse cupom ainda não está disponível",
    };
  }

  if (status === "expired") {
    return {
      valid: false,
      coupon,
      error: "Esse cupom expirou",
    };
  }

  if (subtotal < coupon.minSubtotal) {
    return {
      valid: false,
      coupon,
      error: `Compra mínima de R$ ${coupon.minSubtotal.toFixed(2).replace(".", ",")}`,
    };
  }

  const discount = getCouponDiscount(coupon, subtotal);

  return {
    valid: true,
    coupon,
    discount,
    total: Math.max(0, subtotal - discount),
  };
};
