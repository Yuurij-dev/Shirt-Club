import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/app/lib/adminAuth";
import {
  updateOrderStatus,
  updateOrderStatusByPreferenceId,
} from "@/app/lib/orderStore";
import { getAsaasPayment, isAsaasPaymentPaid } from "@/app/lib/asaas";
import {
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

  if (body.paymentId?.startsWith("pay_")) {
    const asaasPayment = body.paymentId
      ? await getAsaasPayment(body.paymentId)
      : null;

    if (asaasPayment && isAsaasPaymentPaid(asaasPayment.status)) {
      const orderId = asaasPayment.externalReference || body.orderId;

      if (!orderId) {
        throw new Error("Pedido nao encontrado para esse pagamento Asaas");
      }

      await updateOrderStatus({
        orderId,
        status: "paid",
        paymentId: asaasPayment.id,
      });

      return NextResponse.json({
        updated: true,
        paymentId: asaasPayment.id,
      });
    }

    return NextResponse.json(
      {
        updated: false,
        message: "Nenhum pagamento aprovado encontrado",
      },
      { status: 404 }
    );
  }

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
