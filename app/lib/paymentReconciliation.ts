import { getAsaasPayment, isAsaasPaymentPaid } from "@/app/lib/asaas";
import {
  getMercadoPagoPayment,
  searchMercadoPagoPaymentsByExternalReference,
} from "@/app/lib/mercadoPago";
import {
  listOrders,
  StoredOrder,
  updateOrderStatus,
  updateOrderStatusByPreferenceId,
} from "@/app/lib/orderStore";

export type PaymentReconciliationResult = {
  checked: boolean;
  updated: boolean;
  orderId: string;
  paymentId?: string | null;
  reason?: string;
};

export const reconcileOrderPayment = async (
  order: StoredOrder
): Promise<PaymentReconciliationResult> => {
  if (order.status === "paid") {
    if (!order.paidNotifiedAt) {
      await updateOrderStatus({
        orderId: order.id,
        status: "paid",
        paymentId: order.paymentId,
      });

      return {
        checked: true,
        updated: true,
        orderId: order.id,
        paymentId: order.paymentId,
        reason: "paid_notification_retried",
      };
    }

    return {
      checked: false,
      updated: false,
      orderId: order.id,
      paymentId: order.paymentId,
      reason: "already_paid",
    };
  }

  if (order.paymentId?.startsWith("pay_")) {
    const asaasPayment = await getAsaasPayment(order.paymentId);

    if (asaasPayment && isAsaasPaymentPaid(asaasPayment.status)) {
      const orderId = asaasPayment.externalReference || order.id;

      await updateOrderStatus({
        orderId,
        status: "paid",
        paymentId: asaasPayment.id,
      });

      return {
        checked: true,
        updated: true,
        orderId,
        paymentId: asaasPayment.id,
        reason: "asaas_paid",
      };
    }

    return {
      checked: true,
      updated: false,
      orderId: order.id,
      paymentId: order.paymentId,
      reason: "asaas_not_paid",
    };
  }

  const payments = order.paymentId
    ? [await getMercadoPagoPayment(order.paymentId)].filter(Boolean)
    : await searchMercadoPagoPaymentsByExternalReference(order.id);

  const approvedPayment = payments.find((payment) => {
    return payment?.status === "approved";
  });

  if (approvedPayment?.external_reference) {
    await updateOrderStatus({
      orderId: approvedPayment.external_reference,
      status: "paid",
      paymentId: String(approvedPayment.id),
    });

    return {
      checked: true,
      updated: true,
      orderId: approvedPayment.external_reference,
      paymentId: String(approvedPayment.id),
      reason: "mercado_pago_paid",
    };
  }

  if (approvedPayment && order.preferenceId) {
    await updateOrderStatusByPreferenceId({
      preferenceId: order.preferenceId,
      status: "paid",
      paymentId: String(approvedPayment.id),
    });

    return {
      checked: true,
      updated: true,
      orderId: order.id,
      paymentId: String(approvedPayment.id),
      reason: "mercado_pago_paid_by_preference",
    };
  }

  return {
    checked: true,
    updated: false,
    orderId: order.id,
    paymentId: order.paymentId,
    reason: "payment_not_paid",
  };
};

export const reconcilePendingPayments = async () => {
  const orders = await listOrders();
  const candidates = orders.filter((order) => {
    return order.status === "unpaid" || !order.paidNotifiedAt;
  });
  const results = await Promise.allSettled(
    candidates.map((order) => reconcileOrderPayment(order))
  );

  const fulfilledResults = results
    .filter((result) => result.status === "fulfilled")
    .map((result) => result.value);
  const failedResults = results.filter((result) => {
    return result.status === "rejected";
  });

  return {
    checked: fulfilledResults.filter((result) => result.checked).length,
    updated: fulfilledResults.filter((result) => result.updated).length,
    failed: failedResults.length,
    results: fulfilledResults,
  };
};
