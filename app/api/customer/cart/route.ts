import { NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/app/lib/customerAuth";
import {
  getCustomerCart,
  saveCustomerCart,
  upsertCustomerFromUser,
} from "@/app/lib/customerStore";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const GET = async (request: Request) => {
  const user = await getAuthenticatedUser(request);

  if (!user) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  const customer = await upsertCustomerFromUser(user);
  const cart = await getCustomerCart(customer.id);

  return NextResponse.json(cart);
};

export const PUT = async (request: Request) => {
  const user = await getAuthenticatedUser(request);

  if (!user) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  const customer = await upsertCustomerFromUser(user);
  const body = await request.json();
  const cart = await saveCustomerCart(customer.id, {
    items: body.items || [],
    coupon: body.coupon || null,
  });

  return NextResponse.json(cart);
};
