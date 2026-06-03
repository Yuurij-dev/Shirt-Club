import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/app/lib/adminAuth";
import { listOrders } from "@/app/lib/orderStore";

export const GET = async () => {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Nao autorizado" }, { status: 401 });
  }

  const orders = await listOrders();

  return NextResponse.json({
    unpaid: orders.filter((order) => order.status === "unpaid"),
    paid: orders.filter((order) => order.status === "paid"),
  });
};
