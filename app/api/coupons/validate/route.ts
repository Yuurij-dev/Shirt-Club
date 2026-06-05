import { NextResponse } from "next/server";
import { validateCoupon } from "@/app/lib/couponStore";

type ValidateCouponBody = {
  code?: string;
  subtotal?: number;
};

export const POST = async (request: Request) => {
  try {
    const body = (await request.json()) as ValidateCouponBody;
    const subtotal = Number(body.subtotal || 0);

    if (!body.code?.trim()) {
      return NextResponse.json(
        { valid: false, error: "Digite um cupom" },
        { status: 400 }
      );
    }

    if (subtotal <= 0) {
      return NextResponse.json(
        { valid: false, error: "Carrinho vazio" },
        { status: 400 }
      );
    }

    const result = await validateCoupon({
      code: body.code,
      subtotal,
    });

    return NextResponse.json(result, { status: result.valid ? 200 : 400 });
  } catch {
    return NextResponse.json(
      { valid: false, error: "Não foi possível validar o cupom" },
      { status: 500 }
    );
  }
};
