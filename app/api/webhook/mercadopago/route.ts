import { NextResponse } from "next/server";
import { updateOrderStatus } from "@/app/lib/orderStore";
import { getMercadoPagoPayment } from "@/app/lib/mercadoPago";

const getPaymentId = (request: Request, payload: unknown) => {
  const searchParams = new URL(request.url).searchParams;
  const dataId = searchParams.get("data.id");

  if (dataId) return dataId;

  if (
    payload &&
    typeof payload === "object" &&
    "data" in payload &&
    payload.data &&
    typeof payload.data === "object" &&
    "id" in payload.data
  ) {
    return String(payload.data.id);
  }

  return null;
};

export const POST = async (request: Request) => {
  const payload = await request.json().catch(() => null);
  const searchParams = new URL(request.url).searchParams;
  const paymentId = getPaymentId(request, payload);
  const payment = paymentId ? await getMercadoPagoPayment(paymentId) : null;

  if (payment?.external_reference && payment.status === "approved") {
    await updateOrderStatus({
      orderId: payment.external_reference,
      status: "paid",
      paymentId: String(payment.id),
    });
  }

  console.log("Mercado Pago webhook", {
    type: searchParams.get("type"),
    dataId: searchParams.get("data.id"),
    paymentId,
    paymentStatus: payment?.status,
    orderId: payment?.external_reference,
    payload,
  });

  return NextResponse.json({ received: true });
};
