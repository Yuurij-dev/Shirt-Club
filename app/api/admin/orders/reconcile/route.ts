import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/app/lib/adminAuth";
import {
  updateOrderStatus,
  updateOrderStatusByPreferenceId,
} from "@/app/lib/orderStore";
import {
  getMercadoPagoOrder,
  getMercadoPagoPayment,
  searchMercadoPagoPaymentsByExternalReference,
} from "@/app/lib/mercadoPago";

type ReconcileBody = {
  orderId?: string;
  preferenceId?: string;
  paymentId?: string;
};

export const POST = async (request: Request) => {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Nao autorizado" }, { status: 401 });
  }

  const body = (await request.json()) as ReconcileBody;
  const payments = body.paymentId
    ? [await getMercadoPagoPayment(body.paymentId)].filter(Boolean)
    : body.orderId
      ? await searchMercadoPagoPaymentsByExternalReference(body.orderId)
      : [];

  const approvedPayment = payments.find((payment) => {
    return payment?.status === "approved";
  });

  if (approvedPayment?.external_reference) {
    await updateOrderStatus({
      orderId: approvedPayment.external_reference,
      status: "paid",
      paymentId: String(approvedPayment.id),
    });

    return NextResponse.json({
      updated: true,
      paymentId: approvedPayment.id,
    });
  }

  const mercadoPagoOrder = body.preferenceId
    ? await getMercadoPagoOrder(body.preferenceId)
    : null;
  const approvedOrderPayment = mercadoPagoOrder?.transactions?.payments?.find(
    (payment) => {
      return payment.status === "approved";
    }
  );

  if (approvedOrderPayment && mercadoPagoOrder?.external_reference) {
    await updateOrderStatus({
      orderId: mercadoPagoOrder.external_reference,
      status: "paid",
      paymentId: String(approvedOrderPayment.id),
    });

    return NextResponse.json({
      updated: true,
      paymentId: approvedOrderPayment.id,
    });
  }

  if (!approvedPayment) {
    return NextResponse.json(
      {
        updated: false,
        message: "Nenhum pagamento aprovado encontrado",
      },
      { status: 404 }
    );
  }

  if (body.preferenceId) {
    await updateOrderStatusByPreferenceId({
      preferenceId: body.preferenceId,
      status: "paid",
      paymentId: String(approvedPayment.id),
    });
  }

  return NextResponse.json({
    updated: true,
    paymentId: approvedPayment.id,
  });
};
