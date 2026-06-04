import { NextResponse } from "next/server";
import { listOrders } from "@/app/lib/orderStore";

type OrderStatusRouteContext = {
  params: Promise<{
    orderId: string;
  }>;
};

export const GET = async (_request: Request, context: OrderStatusRouteContext) => {
  const { orderId } = await context.params;
  const orders = await listOrders();
  const order = orders.find((currentOrder) => {
    return currentOrder.id === orderId;
  });

  if (!order) {
    return NextResponse.json({ error: "Pedido nao encontrado" }, { status: 404 });
  }

  return NextResponse.json({
    id: order.id,
    status: order.status,
    paymentId: order.paymentId || null,
    updatedAt: order.updatedAt,
  });
};
