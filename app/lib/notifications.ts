import { formatPrice } from "@/app/utils/price";
import type { DeliveryStatus, StoredOrder } from "@/app/lib/orderStore";

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

const deliveryStatusLabels: Record<DeliveryStatus, string> = {
  not_separated: "N\u00e3o separado",
  separated: "Separado",
  shipped: "Enviado",
  delivered: "Entregue",
  canceled: "Cancelado",
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
      `Fala, ${customerName}! \u2705`,
      "",
      `Seu pedido #${order.id} foi confirmado com sucesso.`,
      "",
      `Valor: ${formatPrice(order.total)}`,
      "",
      "Itens:",
      items,
      "",
      "Obrigado por comprar com a gente! \u{1f64c}",
      "Seu pedido j\u00e1 entrou na nossa fila de prepara\u00e7\u00e3o. Em breve voc\u00ea receber\u00e1 novas atualiza\u00e7\u00f5es. \u{1f4e6}",
    ].join("\n"),
    html: `
      <div style="font-family: Arial, sans-serif; color: #111; line-height: 1.5;">
        <h1 style="font-size: 24px; margin: 0 0 12px;">Pedido confirmado &#9989;</h1>
        <p>Fala, <strong>${customerName}</strong>!</p>
        <p>Seu pedido <strong>#${order.id}</strong> foi confirmado com sucesso.</p>
        <p><strong>Valor:</strong> ${formatPrice(order.total)}</p>
        <p><strong>Itens:</strong></p>
        <pre style="font-family: Arial, sans-serif; white-space: pre-wrap;">${items}</pre>
        <p>Obrigado por comprar com a gente! &#128588;</p>
        <p>Seu pedido j&aacute; entrou na nossa fila de prepara&ccedil;&atilde;o. Em breve voc&ecirc; receber&aacute; novas atualiza&ccedil;&otilde;es. &#128230;</p>
      </div>
    `,
  };
};

const createDeliveryStatusText = (
  order: StoredOrder,
  deliveryStatus: DeliveryStatus
) => {
  const customer = getCustomer(order);
  const customerName = customer.name || "cliente";

  const messages: Record<DeliveryStatus, string[]> = {
    shipped: [
      `Fala, ${customerName}! \u{1f4e6}`,
      "",
      `Boa not\u00edcia: seu pedido #${order.id} acabou de ser enviado! \u{1f69a}`,
      "",
      "Agora \u00e9 s\u00f3 ficar de olho. Em breve ele chega por a\u00ed.",
      "",
      "Qualquer d\u00favida, chama a gente por aqui. \u{1f64c}",
    ],
    delivered: [
      `Fala, ${customerName}! \u2705`,
      "",
      `Seu pedido #${order.id} foi marcado como entregue.`,
      "",
      "Esperamos que voc\u00ea curta muito sua camisa! \u26bd\u{1f525}",
      "",
      "Obrigado por comprar com a gente. \u{1f64c}",
    ],
    canceled: [
      `Fala, ${customerName}!`,
      "",
      `Passando para avisar que o pedido #${order.id} foi cancelado. \u274c`,
      "",
      "Se isso n\u00e3o foi esperado ou se voc\u00ea tiver qualquer d\u00favida, chama nossa equipe por aqui.",
      "",
      "Vamos te ajudar no que for preciso. \u{1f64c}",
    ],
    not_separated: [
      `Fala, ${customerName}! \u{1f4e6}`,
      "",
      `Temos uma atualiza\u00e7\u00e3o sobre o seu pedido #${order.id}.`,
      "",
      "Ele voltou para nossa fila de prepara\u00e7\u00e3o, mas fica tranquilo: vamos organizar tudo certinho por aqui.",
      "",
      "Assim que tivermos uma nova atualiza\u00e7\u00e3o, te avisamos. \u{1f64c}",
    ],
    separated: [
      `Fala, ${customerName}! \u{1f4e6}`,
      "",
      `Seu pedido #${order.id} j\u00e1 foi separado e est\u00e1 pronto para a pr\u00f3xima etapa.`,
      "",
      "Assim que ele for enviado, te avisamos por aqui. \u{1f64c}",
    ],
  };

  return messages[deliveryStatus].join("\n");
};

const createDeliveryStatusMessage = (
  order: StoredOrder,
  deliveryStatus: DeliveryStatus
) => {
  const messageText = createDeliveryStatusText(order, deliveryStatus);

  return {
    subject: `Atualiza\u00e7\u00e3o do pedido ${order.id} - Shirt Club`,
    text: messageText,
    html: `
      <div style="font-family: Arial, sans-serif; color: #111; line-height: 1.5;">
        <h1 style="font-size: 24px; margin: 0 0 12px;">Atualiza&ccedil;&atilde;o do pedido</h1>
        <pre style="font-family: Arial, sans-serif; white-space: pre-wrap; margin: 0;">${messageText}</pre>
      </div>
    `,
  };
};

const sendPaidEmail = async (order: StoredOrder) => {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL;
  const customer = getCustomer(order);

  if (!apiKey || !from) {
    console.info("Email de pedido pago ignorado: Resend n\u00e3o configurado");
    return false;
  }

  if (!customer.email) {
    console.info("Email de pedido pago ignorado: cliente sem e-mail");
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

const sendDeliveryStatusEmail = async (
  order: StoredOrder,
  deliveryStatus: DeliveryStatus
) => {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL;
  const customer = getCustomer(order);

  if (!apiKey || !from) {
    console.info("Email de entrega ignorado: Resend n\u00e3o configurado");
    return false;
  }

  if (!customer.email) {
    console.info("Email de entrega ignorado: cliente sem e-mail");
    return false;
  }

  const message = createDeliveryStatusMessage(order, deliveryStatus);
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
    throw new Error(`Resend delivery error: ${response.status} ${errorText}`);
  }

  return true;
};

const sendPaidWhatsapp = async (order: StoredOrder) => {
  const botUrl = process.env.WHATSAPP_BOT_URL;
  const botSecret = process.env.WHATSAPP_BOT_SECRET;
  const customer = getCustomer(order);
  const phone = getBrazilPhoneNumber(customer);

  if (!botUrl || !botSecret) {
    console.info(
      "WhatsApp de pedido pago ignorado: bot Baileys n\u00e3o configurado"
    );
    return false;
  }

  if (!phone) {
    console.info("WhatsApp de pedido pago ignorado: cliente sem WhatsApp");
    return false;
  }

  const response = await fetch(`${botUrl.replace(/\/$/, "")}/send-order-paid`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-bot-secret": botSecret,
    },
    body: JSON.stringify({
      phone,
      customerName: customer.name || "cliente",
      orderId: order.id,
      total: formatPrice(order.total),
    }),
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => "");
    throw new Error(`Baileys bot error: ${response.status} ${errorText}`);
  }

  return true;
};

const sendDeliveryStatusWhatsapp = async (
  order: StoredOrder,
  deliveryStatus: DeliveryStatus
) => {
  const botUrl = process.env.WHATSAPP_BOT_URL;
  const botSecret = process.env.WHATSAPP_BOT_SECRET;
  const customer = getCustomer(order);
  const phone = getBrazilPhoneNumber(customer);

  if (!botUrl || !botSecret) {
    console.info(
      "WhatsApp de entrega ignorado: bot Baileys n\u00e3o configurado"
    );
    return false;
  }

  if (!phone) {
    console.info("WhatsApp de entrega ignorado: cliente sem WhatsApp");
    return false;
  }

  const message = createDeliveryStatusMessage(order, deliveryStatus);
  const response = await fetch(
    `${botUrl.replace(/\/$/, "")}/send-delivery-status`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-bot-secret": botSecret,
      },
      body: JSON.stringify({
        phone,
        customerName: customer.name || "cliente",
        orderId: order.id,
        status: deliveryStatusLabels[deliveryStatus],
        message: message.text,
      }),
    }
  );

  if (!response.ok) {
    const errorText = await response.text().catch(() => "");
    throw new Error(`Baileys delivery bot error: ${response.status} ${errorText}`);
  }

  return true;
};

export const notifyOrderPaid = async (order: StoredOrder) => {
  const results = await Promise.allSettled([
    sendPaidEmail(order),
    sendPaidWhatsapp(order),
  ]);

  let sentNotification = false;

  results.forEach((result) => {
    if (result.status === "fulfilled") {
      sentNotification = sentNotification || result.value;
      return;
    }

    console.error("Erro ao enviar notifica\u00e7\u00e3o de pedido pago", result.reason);
  });

  if (!sentNotification) {
    console.info("Nenhuma notifica\u00e7\u00e3o de pedido pago foi enviada", {
      orderId: order.id,
    });
  }

  return sentNotification;
};

export const notifyOrderDeliveryStatusChanged = async (
  order: StoredOrder,
  deliveryStatus: DeliveryStatus
) => {
  const results = await Promise.allSettled([
    sendDeliveryStatusEmail(order, deliveryStatus),
    sendDeliveryStatusWhatsapp(order, deliveryStatus),
  ]);

  let sentNotification = false;

  results.forEach((result) => {
    if (result.status === "fulfilled") {
      sentNotification = sentNotification || result.value;
      return;
    }

    console.error("Erro ao enviar notifica\u00e7\u00e3o de entrega", result.reason);
  });

  if (!sentNotification) {
    console.info("Nenhuma notifica\u00e7\u00e3o de entrega foi enviada", {
      orderId: order.id,
      deliveryStatus,
    });
  }

  return sentNotification;
};
