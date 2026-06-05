import { NextResponse } from "next/server";
import { CouponType } from "@/app/data/coupons";
import { isAdminAuthenticated } from "@/app/lib/adminAuth";
import {
  createCoupon,
  deleteCoupon,
  listCoupons,
  updateCoupon,
} from "@/app/lib/couponStore";

type CouponRequestBody = {
  id?: string;
  code?: string;
  type?: CouponType;
  value?: number;
  minSubtotal?: number;
  maxDiscount?: number;
  startsAt?: string;
  expiresAt?: string;
  usageLimit?: number;
  usagePerCustomer?: number;
};

const allowedCouponTypes: CouponType[] = [
  "percentage",
  "fixed",
  "free_shipping",
];

const validateCouponBody = (body: CouponRequestBody) => {
  if (!body.code?.trim()) return "Informe o código do cupom";
  if (!body.type || !allowedCouponTypes.includes(body.type)) {
    return "Tipo de cupom inválido";
  }

  return null;
};

const getCouponPayload = (body: CouponRequestBody) => {
  return {
    code: body.code || "",
    type: body.type || "percentage",
    value: Math.max(0, Number(body.value || 0)),
    minSubtotal: Math.max(0, Number(body.minSubtotal || 0)),
    maxDiscount:
      body.maxDiscount === undefined
        ? undefined
        : Math.max(0, Number(body.maxDiscount || 0)),
    startsAt: body.startsAt || new Date().toISOString().slice(0, 10),
    expiresAt: body.expiresAt || "2026-12-31",
    usageLimit: Math.max(1, Number(body.usageLimit || 100)),
    usagePerCustomer: Math.max(1, Number(body.usagePerCustomer || 1)),
  };
};

export const GET = async () => {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  const coupons = await listCoupons();

  return NextResponse.json({ coupons });
};

export const POST = async (request: Request) => {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  try {
    const body = (await request.json()) as CouponRequestBody;
    const error = validateCouponBody(body);

    if (error) {
      return NextResponse.json({ error }, { status: 400 });
    }

    const coupon = await createCoupon(getCouponPayload(body));

    return NextResponse.json({ coupon }, { status: 201 });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Não foi possível criar o cupom";

    return NextResponse.json({ error: message }, { status: 400 });
  }
};

export const PATCH = async (request: Request) => {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  try {
    const body = (await request.json()) as CouponRequestBody;

    if (!body.id) {
      return NextResponse.json(
        { error: "Informe o cupom que será editado" },
        { status: 400 }
      );
    }

    const error = validateCouponBody(body);

    if (error) {
      return NextResponse.json({ error }, { status: 400 });
    }

    const coupon = await updateCoupon({
      id: body.id,
      coupon: getCouponPayload(body),
    });

    return NextResponse.json({ coupon });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Não foi possível atualizar o cupom";

    return NextResponse.json({ error: message }, { status: 400 });
  }
};

export const DELETE = async (request: Request) => {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  try {
    const body = (await request.json()) as { id?: string };

    if (!body.id) {
      return NextResponse.json(
        { error: "Informe o cupom que será removido" },
        { status: 400 }
      );
    }

    await deleteCoupon(body.id);

    return NextResponse.json({ success: true });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Não foi possível remover o cupom";

    return NextResponse.json({ error: message }, { status: 400 });
  }
};
