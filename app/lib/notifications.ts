import { formatPrice } from "@/app/utils/price";
import type { StoredOrder } from "@/app/lib/orderStore";

type NotificationCustomer = {
  name?: string;
  email?: string;
  whatsapp?: string;
  whatsappDigits?: string;
};

type NotificationItem = {
  title?: string;
  quantity?: number;
  size?: string;
};

const getCustomer = (order: StoredOrder): NotificationCustomer => {
  return order.customer && typeof order.customer === "object"
    ? (order.customer as NotificationCustomer)
    : {};
};

const getItems = (order: StoredOrder): NotificationItem[] => {
  return Array.isArray(order.items) ? (order.items as NotificationItem[]) : [];
};

const onlyDigits = (value?: string) => {
  return (value || "").replace(/\D/g, "");
};

const getBrazilPhoneNumber = (customer: NotificationCustomer) => {
  const digits = onlyDigits(customer.whatsappDigits || customer.whatsapp);

  if (!digits) return null;
  if (digits.startsWith("55")) return digits;

  return `55${digits}`;
};

const getOrderItemsText = (order: StoredOrder) => {
  const items = getItems(order);

  if (items.length === 0) return "Itens do pedido";

  return items
    .map((item) => {
      const quantity = item.quantity || 1;
      const size = item.size ? ` - Tam. ${item.size}` : "";

      return `${quantity}x ${item.title || "Produto"}${size}`;
    })
    .join("\n");
};

const createPaidOrderMessage = (order: StoredOrder) => {
  const customer = getCustomer(order);
  const customerName = customer.name || "cliente";
  const items = getOrderItemsText(order);

  return {
    subject: `Pedido ${order.id} confirmado - Shirt Club`,
    text: [
      `Olá, ${customerName}!`,
      "",
      `Recebemos o pagamento do seu pedido ${order.id}.`,
      `Total: ${formatPrice(order.total)}`,
      "",
      "Itens:",
      items,
      "",
      "Vamos separar sua compra e enviar as próximas atualizações por e-mail e WhatsApp.",
      "",
      "Obrigado por comprar na Shirt Club.",
    ].join("\n"),
    html: `
      <div style="font-family: Arial, sans-serif; color: #111; line-height: 1.5;">
        <h1 style="font-size: 24px; margin: 0 0 12px;">Pedido confirmado</h1>
        <p>Olá, <strong>${customerName}</strong>!</p>
        <p>Recebemos o pagamento do seu pedido <strong>${order.id}</strong>.</p>
        <p><strong>Total:</strong> ${formatPrice(order.total)}</p>
        <p><strong>Itens:</strong></p>
        <pre style="font-family: Arial, sans-serif; white-space: pre-wrap;">${items}</pre>
        <p>Vamos separar sua compra e enviar as próximas atualizações por e-mail e WhatsApp.</p>
        <p>Obrigado por comprar na <strong>Shirt Club</strong>.</p>
      </div>
    `,
  };
};

const sendPaidEmail = async (order: StoredOrder) => {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL;
  const customer = getCustomer(order);

  if (!apiKey || !from || !customer.email) {
    return false;
  }

  const message = createPaidOrderMessage(order);
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: customer.email,
      subject: message.subject,
      text: message.text,
      html: message.html,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => "");
    throw new Error(`Resend error: ${response.status} ${errorText}`);
  }

  return true;
};

const sendPaidWhatsapp = async (order: StoredOrder) => {
  const token = process.env.WHATSAPP_CLOUD_API_TOKEN;
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  const templateName = process.env.WHATSAPP_ORDER_PAID_TEMPLATE_NAME;
  const templateLanguage =
    process.env.WHATSAPP_TEMPLATE_LANGUAGE || "pt_BR";
  const customer = getCustomer(order);
  const to = getBrazilPhoneNumber(customer);

  if (!token || !phoneNumberId || !to) {
    return false;
  }

  const endpoint = `https://graph.facebook.com/v20.0/${phoneNumberId}/messages`;
  const message = createPaidOrderMessage(order);
  const body = templateName
    ? {
        messaging_product: "whatsapp",
        to,
        type: "template",
        template: {
          name: templateName,
          language: {
            code: templateLanguage,
          },
          components: [
            {
              type: "body",
              parameters: [
                { type: "text", text: customer.name || "cliente" },
                { type: "text", text: order.id },
                { type: "text", text: formatPrice(order.total) },
              ],
            },
          ],
        },
      }
    : {
        messaging_product: "whatsapp",
        to,
        type: "text",
        text: {
          preview_url: false,
          body: message.text,
        },
      };

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => "");
    throw new Error(`WhatsApp error: ${response.status} ${errorText}`);
  }

  return true;
};

export const notifyOrderPaid = async (order: StoredOrder) => {
  const results = await Promise.allSettled([
    sendPaidEmail(order),
    sendPaidWhatsapp(order),
  ]);

  let attemptedNotification = false;

  results.forEach((result) => {
    if (result.status === "fulfilled") {
      attemptedNotification = attemptedNotification || result.value;
      return;
    }

    attemptedNotification = true;
    console.error("Erro ao enviar notificacao de pedido pago", result.reason);
  });

  return attemptedNotification;
};
