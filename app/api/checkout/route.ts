import { NextResponse } from "next/server";
import { products } from "@/app/data/products";
import { createOrder, getOrderStoreMode } from "@/app/lib/orderStore";
import { getPriceNumber } from "@/app/utils/price";

type CheckoutCustomer = {
  name?: string;
  email?: string;
  whatsapp?: string;
  whatsappDigits?: string;
  cep?: string;
  cepDigits?: string;
  street?: string;
  number?: string;
  complement?: string;
  neighborhood?: string;
  city?: string;
  state?: string;
  notes?: string;
};

type CheckoutItemInput = {
  productId?: string;
  quantity?: number;
  size?: string;
  customization?: string;
};

type CheckoutRequestBody = {
  customer?: CheckoutCustomer;
  items?: CheckoutItemInput[];
};

type MercadoPagoPreferenceResponse = {
  id: string;
  init_point?: string;
  sandbox_init_point?: string;
};

const onlyDigits = (value = "") => value.replace(/\D/g, "");

const isMercadoPagoTestMode = () => {
  if (process.env.MERCADO_PAGO_ENV === "test") return true;
  if (process.env.NODE_ENV !== "production") return true;

  return process.env.MERCADO_PAGO_ACCESS_TOKEN?.startsWith("TEST-") ?? false;
};

const isValidEmail = (email = "") => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
};

const getRequiredCustomerErrors = (customer: CheckoutCustomer) => {
  const errors: string[] = [];

  if (!customer.name?.trim()) errors.push("Nome obrigatorio");
  if (!isValidEmail(customer.email)) errors.push("E-mail invalido");

  const whatsappDigits = customer.whatsappDigits || onlyDigits(customer.whatsapp);
  if (whatsappDigits.length < 10 || whatsappDigits.length > 11) {
    errors.push("WhatsApp invalido");
  }

  const cepDigits = customer.cepDigits || onlyDigits(customer.cep);
  if (cepDigits.length !== 8) errors.push("CEP invalido");

  if (!customer.street?.trim()) errors.push("Endereco obrigatorio");
  if (!customer.number?.trim()) errors.push("Numero obrigatorio");
  if (!customer.neighborhood?.trim()) errors.push("Bairro obrigatorio");
  if (!customer.city?.trim()) errors.push("Cidade obrigatoria");
  if (!customer.state?.trim() || customer.state.trim().length !== 2) {
    errors.push("UF invalida");
  }

  return errors;
};

const getBaseUrl = (request: Request) => {
  const baseUrl =
    process.env.NEXT_PUBLIC_APP_URL ||
    process.env.VERCEL_PROJECT_PRODUCTION_URL?.replace(/^/, "https://") ||
    new URL(request.url).origin;

  const normalizedBaseUrl = baseUrl.startsWith("http")
    ? baseUrl
    : `https://${baseUrl}`;

  return normalizedBaseUrl.replace(/\/$/, "");
};

const isPublicHttpsUrl = (url: string) => {
  return (
    url.startsWith("https://") &&
    !url.includes("localhost") &&
    !url.includes("127.0.0.1")
  );
};

const createMercadoPagoPreference = async ({
  request,
  orderId,
  customer,
  orderItems,
}: {
  request: Request;
  orderId: string;
  customer: Required<Pick<CheckoutCustomer, "name" | "email">> &
    CheckoutCustomer;
  orderItems: Array<{
    id: string;
    title: string;
    unitPrice: number;
    quantity: number;
  }>;
}) => {
  const accessToken = process.env.MERCADO_PAGO_ACCESS_TOKEN;

  if (!accessToken) return null;

  const baseUrl = getBaseUrl(request);
  const publicHttpsUrl = isPublicHttpsUrl(baseUrl);
  const preferencePayload: Record<string, unknown> = {
    external_reference: orderId,
    items: orderItems.map((item) => ({
      id: item.id,
      title: item.title,
      quantity: item.quantity,
      unit_price: item.unitPrice,
      currency_id: "BRL",
    })),
    payer: {
      name: customer.name,
      email: customer.email,
      phone: {
        number: customer.whatsappDigits || onlyDigits(customer.whatsapp),
      },
      address: {
        zip_code: customer.cepDigits || onlyDigits(customer.cep),
        street_name: customer.street,
        street_number: customer.number,
      },
    },
    back_urls: {
      success: `${baseUrl}/checkout/sucesso?orderId=${orderId}`,
      failure: `${baseUrl}/checkout/falha?orderId=${orderId}`,
      pending: `${baseUrl}/checkout/pendente?orderId=${orderId}`,
    },
  };

  if (publicHttpsUrl) {
    preferencePayload.notification_url = `${baseUrl}/api/webhook/mercadopago`;
    preferencePayload.auto_return = "approved";
  }

  const response = await fetch("https://api.mercadopago.com/checkout/preferences", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(preferencePayload),
  });

  const preference = (await response.json()) as MercadoPagoPreferenceResponse & {
    message?: string;
  };

  if (!response.ok) {
    throw new Error(preference.message || "Erro ao criar checkout Mercado Pago");
  }

  return preference;
};

export const POST = async (request: Request) => {
  try {
    const body = (await request.json()) as CheckoutRequestBody;
    const customer = body.customer || {};
    const items = body.items || [];

    const customerErrors = getRequiredCustomerErrors(customer);
    if (customerErrors.length > 0) {
      return NextResponse.json(
        { errors: customerErrors },
        { status: 400 }
      );
    }

    if (items.length === 0) {
      return NextResponse.json(
        { errors: ["Carrinho vazio"] },
        { status: 400 }
      );
    }

    const orderItems = items.map((item) => {
      const product = products.find((currentProduct) => {
        return currentProduct.id === item.productId;
      });

      if (!product) {
        throw new Error(`Produto invalido: ${item.productId}`);
      }

      const quantity = Math.max(1, Number(item.quantity || 1));

      return {
        id: product.id,
        title: product.name,
        unitPrice: getPriceNumber(product.price),
        quantity,
        size: item.size || "M",
        customization: item.customization || "Sem personalizacao",
      };
    });

    const total = orderItems.reduce((sum, item) => {
      return sum + item.unitPrice * item.quantity;
    }, 0);

    const orderId = `SC-${Date.now()}`;

    const now = new Date().toISOString();
    const order = {
      id: orderId,
      customer,
      items: orderItems,
      status: "unpaid" as const,
      total,
      createdAt: now,
      updatedAt: now,
    };

    const preference = await createMercadoPagoPreference({
      request,
      orderId,
      customer: customer as Required<Pick<CheckoutCustomer, "name" | "email">> &
        CheckoutCustomer,
      orderItems,
    });

    await createOrder({
      ...order,
      preferenceId: preference?.id || null,
    });

    const isTestMode = isMercadoPagoTestMode();

    return NextResponse.json({
      order,
      checkoutUrl: isTestMode
        ? preference?.sandbox_init_point || preference?.init_point || null
        : preference?.init_point || preference?.sandbox_init_point || null,
      preferenceId: preference?.id || null,
      mode: preference ? "mercado_pago" : "development",
      orderStore: getOrderStoreMode(),
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Erro ao iniciar checkout";

    return NextResponse.json({ errors: [message] }, { status: 500 });
  }
};
