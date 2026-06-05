type AsaasCustomerInput = {
  name: string;
  email: string;
  cpfCnpj: string;
  mobilePhone: string;
  postalCode: string;
  address: string;
  addressNumber: string;
  complement?: string;
  province: string;
  externalReference: string;
};

type AsaasPaymentInput = {
  customerId: string;
  orderId: string;
  value: number;
  description: string;
};

type AsaasCustomerResponse = {
  id: string;
  errors?: Array<{
    description?: string;
  }>;
};

type AsaasPaymentResponse = {
  id: string;
  status?: string;
  externalReference?: string;
  errors?: Array<{
    description?: string;
  }>;
};

type AsaasPixQrCodeResponse = {
  encodedImage?: string;
  payload?: string;
  expirationDate?: string;
  errors?: Array<{
    description?: string;
  }>;
};

const getAsaasBaseUrl = () => {
  if (process.env.ASAAS_API_URL) return process.env.ASAAS_API_URL;

  if (process.env.ASAAS_ENV === "production") {
    return "https://api.asaas.com/v3";
  }

  if (process.env.NODE_ENV === "production") {
    return "https://api.asaas.com/v3";
  }

  return "https://api-sandbox.asaas.com/v3";
};

const getAsaasHeaders = () => {
  const apiKey = process.env.ASAAS_API_KEY;

  if (!apiKey) {
    throw new Error("Configure ASAAS_API_KEY para gerar Pix");
  }

  return {
    access_token: apiKey,
    "Content-Type": "application/json",
  };
};

const getAsaasErrorMessage = async (response: Response) => {
  const data = (await response.json().catch(() => null)) as
    | { errors?: Array<{ description?: string }>; message?: string }
    | null;

  return (
    data?.errors?.[0]?.description ||
    data?.message ||
    "Não foi possível comunicar com o Asaas"
  );
};

const getDueDate = () => {
  return new Date().toISOString().slice(0, 10);
};

export const createAsaasCustomer = async (customer: AsaasCustomerInput) => {
  const response = await fetch(`${getAsaasBaseUrl()}/customers`, {
    method: "POST",
    headers: getAsaasHeaders(),
    body: JSON.stringify(customer),
  });

  if (!response.ok) {
    throw new Error(await getAsaasErrorMessage(response));
  }

  return (await response.json()) as AsaasCustomerResponse;
};

export const createAsaasPixPayment = async ({
  customerId,
  orderId,
  value,
  description,
}: AsaasPaymentInput) => {
  const response = await fetch(`${getAsaasBaseUrl()}/lean/payments`, {
    method: "POST",
    headers: getAsaasHeaders(),
    body: JSON.stringify({
      customer: customerId,
      billingType: "PIX",
      value: Number(value.toFixed(2)),
      dueDate: getDueDate(),
      description,
      externalReference: orderId,
    }),
  });

  if (!response.ok) {
    throw new Error(await getAsaasErrorMessage(response));
  }

  return (await response.json()) as AsaasPaymentResponse;
};

export const getAsaasPixQrCode = async (paymentId: string) => {
  const response = await fetch(
    `${getAsaasBaseUrl()}/payments/${paymentId}/pixQrCode`,
    {
      headers: getAsaasHeaders(),
    }
  );

  if (!response.ok) {
    throw new Error(await getAsaasErrorMessage(response));
  }

  return (await response.json()) as AsaasPixQrCodeResponse;
};

export const getAsaasPayment = async (paymentId: string) => {
  const response = await fetch(`${getAsaasBaseUrl()}/payments/${paymentId}`, {
    headers: getAsaasHeaders(),
  });

  if (!response.ok) return null;

  return (await response.json()) as AsaasPaymentResponse;
};

export const isAsaasPaymentPaid = (status?: string) => {
  return status === "RECEIVED" || status === "CONFIRMED";
};
