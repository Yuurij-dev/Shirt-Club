import { NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/app/lib/customerAuth";
import {
  getCustomerFavorites,
  saveCustomerFavorites,
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
  const products = await getCustomerFavorites(customer.id);

  return NextResponse.json({ products });
};

export const PUT = async (request: Request) => {
  const user = await getAuthenticatedUser(request);

  if (!user) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  const customer = await upsertCustomerFromUser(user);
  const body = await request.json();
  const products = await saveCustomerFavorites(customer.id, body.products || []);

  return NextResponse.json({ products });
};
