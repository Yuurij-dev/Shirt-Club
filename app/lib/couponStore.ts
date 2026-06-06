import { promises as fs } from "fs";
import path from "path";
import {
  Coupon,
  defaultCoupons,
  getCouponDiscount,
  getCouponStatus,
  normalizeCouponCode,
} from "@/app/data/coupons";

type SupabaseCoupon = {
  id: string;
  code: string;
  type: Coupon["type"];
  value: number;
  min_subtotal: number;
  max_discount?: number | null;
  starts_at: string;
  expires_at: string;
  usage_limit: number;
  used_count: number;
  usage_per_customer: number;
  created_at?: string;
  updated_at?: string;
};

const localCouponsFile = path.join(process.cwd(), ".data", "coupons.json");

const hasSupabaseConfig = () => {
  return Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);
};

const getSupabaseHeaders = () => {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

  return {
    apikey: serviceRoleKey,
    Authorization: `Bearer ${serviceRoleKey}`,
    "Content-Type": "application/json",
  };
};

const toCoupon = (coupon: SupabaseCoupon): Coupon => {
  return {
    id: coupon.id,
    code: coupon.code,
    type: coupon.type,
    value: Number(coupon.value),
    minSubtotal: Number(coupon.min_subtotal),
    maxDiscount:
      coupon.max_discount === null || coupon.max_discount === undefined
        ? undefined
        : Number(coupon.max_discount),
    startsAt: coupon.starts_at,
    expiresAt: coupon.expires_at,
    usageLimit: Number(coupon.usage_limit),
    usedCount: Number(coupon.used_count),
    usagePerCustomer: Number(coupon.usage_per_customer),
  };
};

const toSupabaseCoupon = (coupon: Coupon): SupabaseCoupon => {
  return {
    id: coupon.id,
    code: coupon.code,
    type: coupon.type,
    value: coupon.value,
    min_subtotal: coupon.minSubtotal,
    max_discount: coupon.maxDiscount ?? null,
    starts_at: coupon.startsAt,
    expires_at: coupon.expiresAt,
    usage_limit: coupon.usageLimit,
    used_count: coupon.usedCount,
    usage_per_customer: coupon.usagePerCustomer,
  };
};

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

const listSupabaseCoupons = async () => {
  const response = await fetch(
    `${process.env.SUPABASE_URL}/rest/v1/coupons?select=*&order=created_at.desc`,
    {
      headers: getSupabaseHeaders(),
    }
  );

  if (!response.ok) {
    throw new Error("Não foi possível buscar cupons no Supabase");
  }

  const coupons = (await response.json()) as SupabaseCoupon[];

  return coupons.map(toCoupon);
};

const writeSupabaseCoupon = async (coupon: Coupon) => {
  const response = await fetch(`${process.env.SUPABASE_URL}/rest/v1/coupons`, {
    method: "POST",
    headers: getSupabaseHeaders(),
    body: JSON.stringify(toSupabaseCoupon(coupon)),
  });

  if (!response.ok) {
    throw new Error("Não foi possível salvar o cupom no Supabase");
  }
};

const patchSupabaseCoupon = async (coupon: Coupon) => {
  const response = await fetch(
    `${process.env.SUPABASE_URL}/rest/v1/coupons?id=eq.${encodeURIComponent(coupon.id)}`,
    {
      method: "PATCH",
      headers: getSupabaseHeaders(),
      body: JSON.stringify({
        ...toSupabaseCoupon(coupon),
        updated_at: new Date().toISOString(),
      }),
    }
  );

  if (!response.ok) {
    throw new Error("Não foi possível atualizar o cupom no Supabase");
  }
};

const removeSupabaseCoupon = async (id: string) => {
  const response = await fetch(
    `${process.env.SUPABASE_URL}/rest/v1/coupons?id=eq.${encodeURIComponent(id)}`,
    {
      method: "DELETE",
      headers: getSupabaseHeaders(),
    }
  );

  if (!response.ok) {
    throw new Error("Não foi possível remover o cupom no Supabase");
  }
};

export const listCoupons = async () => {
  if (hasSupabaseConfig()) {
    return listSupabaseCoupons();
  }

  return readLocalCoupons();
};

export const createCoupon = async (coupon: Omit<Coupon, "id" | "usedCount">) => {
  const coupons = await listCoupons();
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

  if (hasSupabaseConfig()) {
    await writeSupabaseCoupon(newCoupon);
    return newCoupon;
  }

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
  const coupons = await listCoupons();
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

  if (hasSupabaseConfig()) {
    await patchSupabaseCoupon(updatedCoupon);
    return updatedCoupon;
  }

  await writeLocalCoupons(
    coupons.map((item) => (item.id === id ? updatedCoupon : item))
  );

  return updatedCoupon;
};

export const deleteCoupon = async (id: string) => {
  const coupons = await listCoupons();
  const couponExists = coupons.some((coupon) => coupon.id === id);

  if (!couponExists) {
    throw new Error("Cupom não encontrado");
  }

  if (hasSupabaseConfig()) {
    await removeSupabaseCoupon(id);
    return;
  }

  await writeLocalCoupons(coupons.filter((coupon) => coupon.id !== id));
};

export const incrementCouponUsageByCode = async (code: string) => {
  const coupons = await listCoupons();
  const normalizedCode = normalizeCouponCode(code);
  const coupon = coupons.find((currentCoupon) => {
    return normalizeCouponCode(currentCoupon.code) === normalizedCode;
  });

  if (!coupon) return;

  const updatedCoupon: Coupon = {
    ...coupon,
    usedCount: coupon.usedCount + 1,
  };

  if (hasSupabaseConfig()) {
    await patchSupabaseCoupon(updatedCoupon);
    return;
  }

  await writeLocalCoupons(
    coupons.map((currentCoupon) => {
      return currentCoupon.id === coupon.id ? updatedCoupon : currentCoupon;
    })
  );
};

export const validateCoupon = async ({
  code,
  subtotal,
}: {
  code: string;
  subtotal: number;
}) => {
  const coupons = await listCoupons();
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
