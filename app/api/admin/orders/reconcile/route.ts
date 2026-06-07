import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/app/lib/adminAuth";
import { reconcileOrderPayment } from "@/app/lib/paymentReconciliation";
import { listOrders } from "@/app/lib/orderStore";

type ReconcileBody = {
  orderId?: string;
};

export const POST = async (request: Request) => {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  const body = (await request.json()) as ReconcileBody;

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

  const result = await reconcileOrderPayment(order);

  if (!result.updated) {
    return NextResponse.json(
      {
        updated: false,
        message: "Nenhum pagamento aprovado encontrado",
        reason: result.reason,
      },
      { status: 404 }
    );
  }

  return NextResponse.json({
    updated: true,
    paymentId: result.paymentId,
    reason: result.reason,
  });
};
