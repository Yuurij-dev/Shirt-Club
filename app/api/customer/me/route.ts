import { NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/app/lib/customerAuth";
import { upsertCustomerFromUser } from "@/app/lib/customerStore";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const GET = async (request: Request) => {
  const user = await getAuthenticatedUser(request);

  if (!user) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  const customer = await upsertCustomerFromUser(user);

  return NextResponse.json({ user, customer });
};

export const PATCH = async (request: Request) => {
  const user = await getAuthenticatedUser(request);

  if (!user) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  const body = await request.json();
  const customer = await upsertCustomerFromUser(user, body);

  return NextResponse.json({ user, customer });
};
