import { NextResponse } from "next/server";
import { isAsaasPaymentPaid } from "@/app/lib/asaas";
import { updateOrderStatus } from "@/app/lib/orderStore";

type AsaasWebhookPayload = {
  event?: string;
  payment?: {
    id?: string;
    status?: string;
    externalReference?: string;
  };
};

export const POST = async (request: Request) => {
  const payload = (await request.json().catch(() => null)) as
    | AsaasWebhookPayload
    | null;
  const payment = payload?.payment;

  if (
    payment?.id &&
    payment.externalReference &&
    isAsaasPaymentPaid(payment.status)
  ) {
    await updateOrderStatus({
      orderId: payment.externalReference,
      status: "paid",
      paymentId: payment.id,
    });
  }

  console.log("Asaas webhook", {
    event: payload?.event,
    paymentId: payment?.id,
    paymentStatus: payment?.status,
    orderId: payment?.externalReference,
  });

  return NextResponse.json({ received: true });
};
