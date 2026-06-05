import { NextResponse } from "next/server";
import { getAsaasPayment, isAsaasPaymentPaid } from "@/app/lib/asaas";
import { listOrders, updateOrderStatus } from "@/app/lib/orderStore";

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
    return NextResponse.json({ error: "Pedido não encontrado" }, { status: 404 });
  }

  if (order.status === "unpaid" && order.paymentId?.startsWith("pay_")) {
    const asaasPayment = await getAsaasPayment(order.paymentId);

    if (asaasPayment && isAsaasPaymentPaid(asaasPayment.status)) {
      await updateOrderStatus({
        orderId: order.id,
        status: "paid",
        paymentId: asaasPayment.id,
      });

      return NextResponse.json({
        id: order.id,
        status: "paid",
        paymentId: asaasPayment.id,
        updatedAt: new Date().toISOString(),
      });
    }
  }

  return NextResponse.json({
    id: order.id,
    status: order.status,
    paymentId: order.paymentId || null,
    updatedAt: order.updatedAt,
  });
};
