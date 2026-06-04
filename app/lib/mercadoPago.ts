type MercadoPagoPayment = {
  id: number | string;
  status?: string;
  external_reference?: string;
};

type MercadoPagoOrder = {
  id: string;
  status?: string;
  external_reference?: string;
  transactions?: {
    payments?: Array<{
      id?: string;
      status?: string;
    }>;
  };
};

type MercadoPagoSearchResponse = {
  results?: MercadoPagoPayment[];
};

export const getMercadoPagoPayment = async (paymentId: string) => {
  const accessToken = process.env.MERCADO_PAGO_ACCESS_TOKEN;

  if (!accessToken) return null;

  const response = await fetch(
    `https://api.mercadopago.com/v1/payments/${paymentId}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  if (!response.ok) return null;

  return (await response.json()) as MercadoPagoPayment;
};

export const getMercadoPagoOrder = async (orderId: string) => {
  const accessToken = process.env.MERCADO_PAGO_ACCESS_TOKEN;

  if (!accessToken) return null;

  const response = await fetch(
    `https://api.mercadopago.com/v1/orders/${orderId}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  if (!response.ok) return null;

  return (await response.json()) as MercadoPagoOrder;
};

export const searchMercadoPagoPaymentsByExternalReference = async (
  externalReference: string
) => {
  const accessToken = process.env.MERCADO_PAGO_ACCESS_TOKEN;

  if (!accessToken) return [];

  const searchParams = new URLSearchParams({
    external_reference: externalReference,
    sort: "date_created",
    criteria: "desc",
  });

  const response = await fetch(
    `https://api.mercadopago.com/v1/payments/search?${searchParams.toString()}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  if (!response.ok) return [];

  const data = (await response.json()) as MercadoPagoSearchResponse;

  return data.results || [];
};
