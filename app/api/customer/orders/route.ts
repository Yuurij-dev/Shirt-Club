import { NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/app/lib/customerAuth";
import {
  getCustomerOrders,
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
  const orders = await getCustomerOrders(customer);

  return NextResponse.json({ orders });
};
