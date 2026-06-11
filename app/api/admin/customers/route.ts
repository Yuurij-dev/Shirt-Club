import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/app/lib/adminAuth";
import { listCustomersWithStats } from "@/app/lib/customerStore";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const GET = async () => {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  const customers = await listCustomersWithStats();

  return NextResponse.json({ customers });
};
