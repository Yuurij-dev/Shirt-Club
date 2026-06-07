import { promises as fs } from "fs";
import path from "path";
import { incrementCouponUsageByCode } from "@/app/lib/couponStore";

export type OrderStatus = "unpaid" | "paid";
export type DeliveryStatus =
  | "not_separated"
  | "separated"
  | "shipped"
  | "delivered"
  | "canceled";

export type StoredOrder = {
  id: string;
  customer: unknown;
  items: unknown[];
  coupon?: unknown | null;
  status: OrderStatus;
  deliveryStatus: DeliveryStatus;
  total: number;
  preferenceId?: string | null;
  paymentId?: string | null;
  createdAt: string;
  updatedAt: string;
};

type SupabaseOrder = {
  id: string;
  customer: unknown;
  items: unknown[];
  coupon?: unknown | null;
  status: OrderStatus;
  delivery_status?: DeliveryStatus | null;
  total: number;
  preference_id?: string | null;
  payment_id?: string | null;
  created_at: string;
  updated_at: string;
};

const localOrdersFile = path.join(process.cwd(), ".data", "orders.json");

const hasSupabaseConfig = () => {
  return Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);
};

export const getOrderStoreMode = () => {
  return hasSupabaseConfig() ? "supabase" : "local";
};

const getSupabaseHeaders = () => {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

  return {
    apikey: serviceRoleKey,
    Authorization: `Bearer ${serviceRoleKey}`,
    "Content-Type": "application/json",
  };
};

const toStoredOrder = (order: SupabaseOrder): StoredOrder => {
  return {
    id: order.id,
    customer: order.customer,
    items: order.items,
    coupon: order.coupon,
    status: order.status,
    deliveryStatus:
      order.status === "paid"
        ? order.delivery_status || "not_separated"
        : "not_separated",
    total: order.total,
    preferenceId: order.preference_id,
    paymentId: order.payment_id,
    createdAt: order.created_at,
    updatedAt: order.updated_at,
  };
};

const toSupabaseOrder = (order: StoredOrder) => {
  return {
    id: order.id,
    customer: order.customer,
    items: order.items,
    coupon: order.coupon ?? null,
    status: order.status,
    delivery_status: order.deliveryStatus || "not_separated",
    total: order.total,
    preference_id: order.preferenceId,
    payment_id: order.paymentId,
    created_at: order.createdAt,
    updated_at: order.updatedAt,
  };
};

const readLocalOrders = async (): Promise<StoredOrder[]> => {
  try {
    const file = await fs.readFile(localOrdersFile, "utf-8");

    return JSON.parse(file) as StoredOrder[];
  } catch {
    return [];
  }
};

const writeLocalOrders = async (orders: StoredOrder[]) => {
  await fs.mkdir(path.dirname(localOrdersFile), { recursive: true });
  await fs.writeFile(localOrdersFile, JSON.stringify(orders, null, 2));
};

const getCouponCodeFromOrder = (order?: StoredOrder | null) => {
  if (!order?.coupon || typeof order.coupon !== "object") return null;
  if (!("code" in order.coupon)) return null;

  return typeof order.coupon.code === "string" ? order.coupon.code : null;
};

const registerCouponUsageIfNeeded = async ({
  previousOrder,
  nextStatus,
}: {
  previousOrder?: StoredOrder | null;
  nextStatus: OrderStatus;
}) => {
  if (!previousOrder || previousOrder.status === "paid" || nextStatus !== "paid") {
    return;
  }

  const couponCode = getCouponCodeFromOrder(previousOrder);

  if (couponCode) {
    await incrementCouponUsageByCode(couponCode);
  }
};

const createSupabaseOrder = async (order: StoredOrder) => {
  const response = await fetch(`${process.env.SUPABASE_URL}/rest/v1/orders`, {
    method: "POST",
    headers: getSupabaseHeaders(),
    body: JSON.stringify(toSupabaseOrder(order)),
  });

  if (!response.ok) {
    throw new Error("Não foi possível salvar o pedido no Supabase");
  }
};

const listSupabaseOrders = async () => {
  const response = await fetch(
    `${process.env.SUPABASE_URL}/rest/v1/orders?select=*&order=created_at.desc`,
    {
      headers: getSupabaseHeaders(),
    }
  );

  if (!response.ok) {
    throw new Error("Não foi possível buscar pedidos no Supabase");
  }

  const orders = (await response.json()) as SupabaseOrder[];

  return orders.map(toStoredOrder);
};

const updateSupabaseOrderStatus = async ({
  orderId,
  status,
  paymentId,
}: {
  orderId: string;
  status: OrderStatus;
  paymentId?: string | null;
}) => {
  const existingOrder = (await listSupabaseOrders()).find((order) => {
    return order.id === orderId;
  });
  const response = await fetch(
    `${process.env.SUPABASE_URL}/rest/v1/orders?id=eq.${orderId}`,
    {
      method: "PATCH",
      headers: getSupabaseHeaders(),
      body: JSON.stringify({
        status,
        payment_id: paymentId,
        ...(status === "unpaid"
          ? { delivery_status: "not_separated" }
          : {}),
        updated_at: new Date().toISOString(),
      }),
    }
  );

  if (!response.ok) {
    throw new Error("Não foi possível atualizar o pedido no Supabase");
  }

  await registerCouponUsageIfNeeded({
    previousOrder: existingOrder,
    nextStatus: status,
  });
};

export const createOrder = async (order: StoredOrder) => {
  if (hasSupabaseConfig()) {
    await createSupabaseOrder(order);
    return;
  }

  const orders = await readLocalOrders();
  await writeLocalOrders([order, ...orders]);
};

export const listOrders = async () => {
  if (hasSupabaseConfig()) {
    return listSupabaseOrders();
  }

  const orders = await readLocalOrders();

  return orders.map((order) => ({
    ...order,
    deliveryStatus:
      order.status === "paid"
        ? order.deliveryStatus || "not_separated"
        : "not_separated",
  }));
};

export const updateOrderStatus = async ({
  orderId,
  status,
  paymentId,
}: {
  orderId: string;
  status: OrderStatus;
  paymentId?: string | null;
}) => {
  if (hasSupabaseConfig()) {
    await updateSupabaseOrderStatus({ orderId, status, paymentId });
    return;
  }

  const orders = await readLocalOrders();
  const updatedAt = new Date().toISOString();
  const existingOrder = orders.find((order) => order.id === orderId);

  await writeLocalOrders(
    orders.map((order) => {
      if (order.id !== orderId) return order;

      return {
        ...order,
        status,
        deliveryStatus:
          status === "unpaid"
            ? "not_separated"
            : order.deliveryStatus || "not_separated",
        paymentId,
        updatedAt,
      };
    })
  );

  await registerCouponUsageIfNeeded({
    previousOrder: existingOrder,
    nextStatus: status,
  });
};

const updateSupabaseOrderDeliveryStatus = async ({
  orderId,
  deliveryStatus,
}: {
  orderId: string;
  deliveryStatus: DeliveryStatus;
}) => {
  const response = await fetch(
    `${process.env.SUPABASE_URL}/rest/v1/orders?id=eq.${orderId}`,
    {
      method: "PATCH",
      headers: getSupabaseHeaders(),
      body: JSON.stringify({
        delivery_status: deliveryStatus,
        updated_at: new Date().toISOString(),
      }),
    }
  );

  if (!response.ok) {
    throw new Error("Não foi possível atualizar a entrega no Supabase");
  }
};

export const updateOrderDeliveryStatus = async ({
  orderId,
  deliveryStatus,
}: {
  orderId: string;
  deliveryStatus: DeliveryStatus;
}) => {
  if (hasSupabaseConfig()) {
    await updateSupabaseOrderDeliveryStatus({ orderId, deliveryStatus });
    return;
  }

  const orders = await readLocalOrders();
  const updatedAt = new Date().toISOString();

  await writeLocalOrders(
    orders.map((order) => {
      if (order.id !== orderId) return order;

      return {
        ...order,
        deliveryStatus,
        updatedAt,
      };
    })
  );
};

export const updateOrderStatusByPreferenceId = async ({
  preferenceId,
  status,
  paymentId,
}: {
  preferenceId: string;
  status: OrderStatus;
  paymentId?: string | null;
}) => {
  const orders = await listOrders();
  const order = orders.find((currentOrder) => {
    return currentOrder.preferenceId === preferenceId;
  });

  if (!order) {
    throw new Error("Pedido não encontrado para essa preference");
  }

  await updateOrderStatus({
    orderId: order.id,
    status,
    paymentId,
  });
};
