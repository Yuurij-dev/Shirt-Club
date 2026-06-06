import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/app/lib/adminAuth";
import { listOrders } from "@/app/lib/orderStore";

export const GET = async () => {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  try {
    const orders = await listOrders();

    return NextResponse.json({
      unpaid: orders.filter((order) => order.status === "unpaid"),
      paid: orders.filter((order) => order.status === "paid"),
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Não foi possível buscar os pedidos";

    return NextResponse.json({ error: message }, { status: 500 });
  }
};
