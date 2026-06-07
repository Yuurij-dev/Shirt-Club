import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/app/lib/adminAuth";
import { notifyOrderDeliveryStatusChanged } from "@/app/lib/notifications";
import {
  DeliveryStatus,
  listOrders,
  updateOrderDeliveryStatus,
} from "@/app/lib/orderStore";

const deliveryStatuses: DeliveryStatus[] = [
  "not_separated",
  "separated",
  "shipped",
  "delivered",
  "canceled",
];

export const PATCH = async (request: Request) => {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  try {
    const body = (await request.json()) as {
      orderId?: string;
      deliveryStatus?: DeliveryStatus;
    };

    if (!body.orderId || !body.deliveryStatus) {
      return NextResponse.json(
        { error: "Pedido e status de entrega são obrigatórios" },
        { status: 400 }
      );
    }

    if (!deliveryStatuses.includes(body.deliveryStatus)) {
      return NextResponse.json(
        { error: "Status de entrega inválido" },
        { status: 400 }
      );
    }

    const orders = await listOrders();
    const order = orders.find((currentOrder) => currentOrder.id === body.orderId);

    if (!order) {
      return NextResponse.json(
        { error: "Pedido não encontrado" },
        { status: 404 }
      );
    }

    if (order.status !== "paid") {
      if (order.deliveryStatus !== "not_separated") {
        await updateOrderDeliveryStatus({
          orderId: body.orderId,
          deliveryStatus: "not_separated",
        });
      }

      return NextResponse.json(
        {
          error:
            "Pedidos não pagos ficam com entrega fixa em Não separado",
        },
        { status: 400 }
      );
    }

    await updateOrderDeliveryStatus({
      orderId: body.orderId,
      deliveryStatus: body.deliveryStatus,
    });

    if (order.deliveryStatus !== body.deliveryStatus) {
      await notifyOrderDeliveryStatusChanged(
        {
          ...order,
          deliveryStatus: body.deliveryStatus,
          updatedAt: new Date().toISOString(),
        },
        body.deliveryStatus
      );
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Não foi possível atualizar a entrega";

    return NextResponse.json({ error: message }, { status: 500 });
  }
};
