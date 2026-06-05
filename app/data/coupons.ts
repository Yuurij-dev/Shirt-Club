export type CouponType = "percentage" | "fixed" | "free_shipping";
export type CouponStatus = "active" | "scheduled" | "expired";

export type Coupon = {
  id: string;
  code: string;
  type: CouponType;
  value: number;
  minSubtotal: number;
  maxDiscount?: number;
  startsAt: string;
  expiresAt: string;
  usageLimit: number;
  usedCount: number;
  usagePerCustomer: number;
};

export const defaultCoupons: Coupon[] = [
  {
    id: "welcome10",
    code: "WELCOME10",
    type: "percentage",
    value: 10,
    minSubtotal: 50,
    maxDiscount: 50,
    startsAt: "2026-01-01",
    expiresAt: "2026-12-31",
    usageLimit: 500,
    usedCount: 245,
    usagePerCustomer: 1,
  },
  {
    id: "camisa15",
    code: "CAMISA15",
    type: "percentage",
    value: 15,
    minSubtotal: 100,
    maxDiscount: 80,
    startsAt: "2026-01-01",
    expiresAt: "2026-12-31",
    usageLimit: 300,
    usedCount: 123,
    usagePerCustomer: 1,
  },
  {
    id: "primeira5",
    code: "PRIMEIRA5",
    type: "fixed",
    value: 5,
    minSubtotal: 100,
    startsAt: "2026-01-01",
    expiresAt: "2026-12-31",
    usageLimit: 500,
    usedCount: 156,
    usagePerCustomer: 1,
  },
  {
    id: "novidade10",
    code: "NOVIDADE10",
    type: "percentage",
    value: 10,
    minSubtotal: 50,
    maxDiscount: 50,
    startsAt: "2026-01-01",
    expiresAt: "2026-12-31",
    usageLimit: 250,
    usedCount: 90,
    usagePerCustomer: 2,
  },
];

export const normalizeCouponCode = (code: string) => {
  return code.trim().toUpperCase().replace(/\s+/g, "");
};

export const getCouponStatus = (coupon: Coupon, date = new Date()) => {
  const startsAt = new Date(`${coupon.startsAt}T00:00:00`);
  const expiresAt = new Date(`${coupon.expiresAt}T23:59:59`);

  if (date < startsAt) return "scheduled";
  if (date > expiresAt || coupon.usedCount >= coupon.usageLimit) {
    return "expired";
  }

  return "active";
};

export const getCouponDiscount = (coupon: Coupon, subtotal: number) => {
  if (coupon.type === "free_shipping") return 0;

  const discount =
    coupon.type === "percentage" ? subtotal * (coupon.value / 100) : coupon.value;

  return Math.min(discount, coupon.maxDiscount ?? discount, subtotal);
};
