import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/app/lib/adminAuth";
import { notifyOrderPaid } from "@/app/lib/notifications";
import { listOrders, markOrderAsPaidNotified } from "@/app/lib/orderStore";

export const POST = async (request: Request) => {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  try {
    const body = (await request.json()) as { orderId?: string };

    if (!body.orderId) {
      return NextResponse.json(
        { error: "Pedido é obrigatório" },
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
      return NextResponse.json(
        { error: "Apenas pedidos pagos podem receber confirmação" },
        { status: 400 }
      );
    }

    const sentNotification = await notifyOrderPaid(order);

    if (!sentNotification) {
      return NextResponse.json(
        {
          error:
            "Nenhuma notificação foi enviada. Verifique o e-mail do cliente e as variáveis do Resend.",
        },
        { status: 400 }
      );
    }

    await markOrderAsPaidNotified(order.id);

    return NextResponse.json({ ok: true });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Não foi possível enviar a notificação";

    return NextResponse.json({ error: message }, { status: 500 });
  }
};
