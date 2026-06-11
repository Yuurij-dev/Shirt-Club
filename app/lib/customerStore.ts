import type { Product } from "@/app/data/products";
import type { CartItem } from "@/app/context/CartContext";
import type { Coupon } from "@/app/data/coupons";
import type { AuthenticatedUser } from "./customerAuth";
import { listOrders } from "./orderStore";

export type CustomerProfile = {
  id: string;
  authUserId?: string | null;
  name?: string | null;
  email?: string | null;
  whatsapp?: string | null;
  cpf?: string | null;
  cep?: string | null;
  street?: string | null;
  number?: string | null;
  complement?: string | null;
  neighborhood?: string | null;
  city?: string | null;
  state?: string | null;
  createdAt?: string;
  updatedAt?: string;
};

export type CustomerProfileInput = Partial<
  Omit<CustomerProfile, "id" | "authUserId" | "createdAt" | "updatedAt">
>;

type SupabaseCustomer = {
  id: string;
  auth_user_id?: string | null;
  name?: string | null;
  email?: string | null;
  whatsapp?: string | null;
  cpf?: string | null;
  cep?: string | null;
  street?: string | null;
  number?: string | null;
  complement?: string | null;
  neighborhood?: string | null;
  city?: string | null;
  state?: string | null;
  created_at?: string;
  updated_at?: string;
};

type CustomerCartRow = {
  customer_id: string;
  items: CartItem[];
  coupon?: unknown | null;
};

type CustomerFavoritesRow = {
  customer_id: string;
  products: Product[];
};

export type CustomerCartPayload = {
  items: CartItem[];
  coupon?: {
    coupon: Coupon;
    discount: number;
    total: number;
  } | null;
};

const hasSupabaseConfig = () => {
  return Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);
};

const getSupabaseHeaders = () => {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

  return {
    apikey: serviceRoleKey,
    Authorization: `Bearer ${serviceRoleKey}`,
    "Content-Type": "application/json",
    Prefer: "resolution=merge-duplicates",
  };
};

const sanitizeIdPart = (value = "") => {
  return value.replace(/[^a-zA-Z0-9_-]/g, "-").replace(/-+/g, "-");
};

const getCustomerIdFromUser = (user: AuthenticatedUser) => {
  return `CUS-${sanitizeIdPart(user.id)}`;
};

const toCustomer = (customer: SupabaseCustomer): CustomerProfile => {
  return {
    id: customer.id,
    authUserId: customer.auth_user_id,
    name: customer.name,
    email: customer.email,
    whatsapp: customer.whatsapp,
    cpf: customer.cpf,
    cep: customer.cep,
    street: customer.street,
    number: customer.number,
    complement: customer.complement,
    neighborhood: customer.neighborhood,
    city: customer.city,
    state: customer.state,
    createdAt: customer.created_at,
    updatedAt: customer.updated_at,
  };
};

const toSupabaseCustomer = (
  customer: CustomerProfile
): SupabaseCustomer => {
  return {
    id: customer.id,
    auth_user_id: customer.authUserId,
    name: customer.name || null,
    email: customer.email || null,
    whatsapp: customer.whatsapp || null,
    cpf: customer.cpf || null,
    cep: customer.cep || null,
    street: customer.street || null,
    number: customer.number || null,
    complement: customer.complement || null,
    neighborhood: customer.neighborhood || null,
    city: customer.city || null,
    state: customer.state || null,
    updated_at: new Date().toISOString(),
  };
};

const getCustomerByAuthUserId = async (authUserId: string) => {
  if (!hasSupabaseConfig()) return null;

  const response = await fetch(
    `${process.env.SUPABASE_URL}/rest/v1/customers?auth_user_id=eq.${encodeURIComponent(
      authUserId
    )}&select=*&limit=1`,
    {
      headers: getSupabaseHeaders(),
      cache: "no-store",
    }
  );

  if (!response.ok) return null;

  const customers = (await response.json()) as SupabaseCustomer[];

  return customers[0] ? toCustomer(customers[0]) : null;
};

export const upsertCustomerFromUser = async (
  user: AuthenticatedUser,
  input: CustomerProfileInput = {}
) => {
  const existingCustomer = await getCustomerByAuthUserId(user.id);
  const customer: CustomerProfile = {
    id: existingCustomer?.id || getCustomerIdFromUser(user),
    authUserId: user.id,
    name: input.name || existingCustomer?.name || user.name || "",
    email: input.email || existingCustomer?.email || user.email || "",
    whatsapp: input.whatsapp || existingCustomer?.whatsapp || "",
    cpf: input.cpf || existingCustomer?.cpf || "",
    cep: input.cep || existingCustomer?.cep || "",
    street: input.street || existingCustomer?.street || "",
    number: input.number || existingCustomer?.number || "",
    complement: input.complement || existingCustomer?.complement || "",
    neighborhood: input.neighborhood || existingCustomer?.neighborhood || "",
    city: input.city || existingCustomer?.city || "",
    state: input.state || existingCustomer?.state || "",
  };

  if (!hasSupabaseConfig()) return customer;

  const response = await fetch(
    `${process.env.SUPABASE_URL}/rest/v1/customers?on_conflict=id`,
    {
      method: "POST",
      headers: getSupabaseHeaders(),
      cache: "no-store",
      body: JSON.stringify(toSupabaseCustomer(customer)),
    }
  );

  if (!response.ok) {
    throw new Error("Não foi possível salvar o cliente");
  }

  return customer;
};

export const getCustomerOrders = async (customer: CustomerProfile) => {
  const orders = await listOrders();

  return orders.filter((order) => {
    const orderCustomer = order.customer as { email?: string } | null;

    return (
      order.customerId === customer.id ||
      order.authUserId === customer.authUserId ||
      (customer.email && orderCustomer?.email === customer.email)
    );
  });
};

export const listCustomersWithStats = async () => {
  if (!hasSupabaseConfig()) return [];

  const response = await fetch(
    `${process.env.SUPABASE_URL}/rest/v1/customers?select=*&order=created_at.desc`,
    {
      headers: getSupabaseHeaders(),
      cache: "no-store",
    }
  );

  if (!response.ok) {
    throw new Error("Não foi possível buscar clientes");
  }

  const customers = ((await response.json()) as SupabaseCustomer[]).map(toCustomer);
  const orders = await listOrders();

  return customers.map((customer) => {
    const customerOrders = orders.filter((order) => {
      const orderCustomer = order.customer as { email?: string } | null;

      return (
        order.customerId === customer.id ||
        order.authUserId === customer.authUserId ||
        (customer.email && orderCustomer?.email === customer.email)
      );
    });
    const paidOrders = customerOrders.filter((order) => order.status === "paid");

    return {
      ...customer,
      ordersCount: customerOrders.length,
      paidOrdersCount: paidOrders.length,
      totalSpent: paidOrders.reduce((total, order) => total + order.total, 0),
      lastOrderAt: customerOrders[0]?.createdAt || null,
    };
  });
};

export const getCustomerCart = async (customerId: string): Promise<CustomerCartPayload> => {
  if (!hasSupabaseConfig()) return { items: [], coupon: null };

  const response = await fetch(
    `${process.env.SUPABASE_URL}/rest/v1/customer_carts?customer_id=eq.${encodeURIComponent(
      customerId
    )}&select=*&limit=1`,
    {
      headers: getSupabaseHeaders(),
      cache: "no-store",
    }
  );

  if (!response.ok) return { items: [], coupon: null };

  const rows = (await response.json()) as CustomerCartRow[];

  return {
    items: rows[0]?.items || [],
    coupon: (rows[0]?.coupon as CustomerCartPayload["coupon"]) || null,
  };
};

export const saveCustomerCart = async (
  customerId: string,
  payload: CustomerCartPayload
) => {
  if (!hasSupabaseConfig()) return payload;

  const response = await fetch(
    `${process.env.SUPABASE_URL}/rest/v1/customer_carts?on_conflict=customer_id`,
    {
      method: "POST",
      headers: getSupabaseHeaders(),
      cache: "no-store",
      body: JSON.stringify({
        customer_id: customerId,
        items: payload.items,
        coupon: payload.coupon ?? null,
        updated_at: new Date().toISOString(),
      }),
    }
  );

  if (!response.ok) {
    throw new Error("Não foi possível salvar o carrinho");
  }

  return payload;
};

export const getCustomerFavorites = async (customerId: string) => {
  if (!hasSupabaseConfig()) return [];

  const response = await fetch(
    `${process.env.SUPABASE_URL}/rest/v1/customer_favorites?customer_id=eq.${encodeURIComponent(
      customerId
    )}&select=*&limit=1`,
    {
      headers: getSupabaseHeaders(),
      cache: "no-store",
    }
  );

  if (!response.ok) return [];

  const rows = (await response.json()) as CustomerFavoritesRow[];

  return rows[0]?.products || [];
};

export const saveCustomerFavorites = async (
  customerId: string,
  products: Product[]
) => {
  if (!hasSupabaseConfig()) return products;

  const response = await fetch(
    `${process.env.SUPABASE_URL}/rest/v1/customer_favorites?on_conflict=customer_id`,
    {
      method: "POST",
      headers: getSupabaseHeaders(),
      cache: "no-store",
      body: JSON.stringify({
        customer_id: customerId,
        products,
        updated_at: new Date().toISOString(),
      }),
    }
  );

  if (!response.ok) {
    throw new Error("Não foi possível salvar favoritos");
  }

  return products;
};
