"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import {
  CircleDollarSign,
  Clock,
  LogOut,
  Package,
  RefreshCw,
} from "lucide-react";
import { toast } from "sonner";
import { formatPrice } from "../utils/price";

type AdminOrder = {
  id: string;
  customer: {
    name?: string;
    email?: string;
    whatsapp?: string;
    cep?: string;
    street?: string;
    number?: string;
    complement?: string;
    neighborhood?: string;
    city?: string;
    state?: string;
    notes?: string;
  };
  items: Array<{
    title?: string;
    quantity?: number;
    size?: string;
  }>;
  status: "unpaid" | "paid";
  total: number;
  createdAt: string;
  preferenceId?: string | null;
  paymentId?: string | null;
};

type OrdersResponse = {
  unpaid: AdminOrder[];
  paid: AdminOrder[];
};

const reconcileOrderPayment = async (order: AdminOrder) => {
  const response = await fetch("/api/admin/orders/reconcile", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      orderId: order.id,
      preferenceId: order.preferenceId,
      paymentId: order.paymentId,
    }),
  });

  if (response.status === 404) return false;

  if (!response.ok) {
    throw new Error("Nao foi possivel verificar o pagamento");
  }

  return true;
};

const AdminPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoadingSession, setIsLoadingSession] = useState(true);
  const [isLoadingOrders, setIsLoadingOrders] = useState(false);
  const [orders, setOrders] = useState<OrdersResponse>({
    unpaid: [],
    paid: [],
  });

  const loadOrders = useCallback(async () => {
    const response = await fetch("/api/admin/orders");

    if (!response.ok) {
      setIsAuthenticated(false);
      return null;
    }

    const data = (await response.json()) as OrdersResponse;
    setOrders(data);

    return data;
  }, []);

  const fetchOrders = useCallback(async () => {
    setIsLoadingOrders(true);

    try {
      await loadOrders();
    } catch {
      toast.error("Nao foi possivel buscar os pedidos");
    } finally {
      setIsLoadingOrders(false);
    }
  }, [loadOrders]);

  const refreshAndReconcileOrders = useCallback(async () => {
    setIsLoadingOrders(true);

    try {
      const results = await Promise.allSettled(
        orders.unpaid.map((order) => reconcileOrderPayment(order))
      );

      const updatedCount = results.filter((result) => {
        return result.status === "fulfilled" && result.value;
      }).length;
      const failedCount = results.filter((result) => {
        return result.status === "rejected";
      }).length;

      await loadOrders();

      if (updatedCount > 0) {
        toast.success(
          `${updatedCount} pedido${updatedCount > 1 ? "s" : ""} atualizado${
            updatedCount > 1 ? "s" : ""
          } para pago`
        );
      } else if (orders.unpaid.length > 0) {
        toast.info("Nenhum pagamento aprovado encontrado ainda");
      }

      if (failedCount > 0) {
        toast.error("Alguns pedidos nao puderam ser verificados");
      }
    } catch {
      toast.error("Nao foi possivel atualizar os pedidos");
    } finally {
      setIsLoadingOrders(false);
    }
  }, [loadOrders, orders.unpaid]);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await fetch("/api/admin/session");
        const data = (await response.json()) as { authenticated: boolean };

        setIsAuthenticated(data.authenticated);

        if (data.authenticated) {
          await fetchOrders();
        }
      } finally {
        setIsLoadingSession(false);
      }
    };

    void checkSession();
  }, [fetchOrders]);

  const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const response = await fetch("/api/admin/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username,
        password,
      }),
    });

    if (!response.ok) {
      toast.error("Credenciais invalidas");
      return;
    }

    setIsAuthenticated(true);
    await fetchOrders();
  };

  const handleLogout = async () => {
    await fetch("/api/admin/logout", {
      method: "POST",
    });

    setIsAuthenticated(false);
    setOrders({ unpaid: [], paid: [] });
  };

  if (isLoadingSession) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-zinc-50 !p-4">
        <RefreshCw className="animate-spin text-zinc-500" size={28} />
      </main>
    );
  }

  if (!isAuthenticated) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-zinc-50 !p-4">
        <form
          onSubmit={handleLogin}
          className="w-full max-w-sm rounded-xl border border-zinc-200 bg-white !p-6 shadow-sm"
        >
          <h1 className="font-[family-name:var(--font-bebas)] text-4xl text-zinc-950">
            ADMIN
          </h1>
          <p className="!mt-1 text-sm text-zinc-500">
            Entre com as credenciais do painel.
          </p>

          <div className="!mt-6 flex flex-col !gap-4">
            <input
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              placeholder="Usuario"
              className="h-12 rounded-lg border border-zinc-200 !px-4 text-sm outline-none focus:border-black"
            />

            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Senha"
              className="h-12 rounded-lg border border-zinc-200 !px-4 text-sm outline-none focus:border-black"
            />

            <button
              type="submit"
              className="h-12 rounded-lg bg-black text-sm font-bold text-white transition-all duration-200 hover:bg-zinc-800"
            >
              ENTRAR
            </button>
          </div>
        </form>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-zinc-50 !p-4 sm:!p-6">
      <section className="!mx-auto max-w-7xl">
        <div className="flex flex-col !gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="font-[family-name:var(--font-bebas)] text-5xl text-zinc-950">
              PEDIDOS
            </h1>
            <p className="!mt-1 text-sm text-zinc-500">
              Acompanhe pedidos nao pagos e pagos.
            </p>
          </div>

          <div className="flex !gap-3">
            <button
              type="button"
              onClick={refreshAndReconcileOrders}
              disabled={isLoadingOrders}
              className="inline-flex h-11 items-center justify-center !gap-2 rounded-lg border border-zinc-200 bg-white !px-4 text-sm font-bold transition-all duration-200 hover:border-black disabled:cursor-not-allowed disabled:opacity-60"
            >
              <RefreshCw
                size={18}
                className={isLoadingOrders ? "animate-spin" : ""}
              />
              ATUALIZAR
            </button>

            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex h-11 items-center justify-center !gap-2 rounded-lg bg-black !px-4 text-sm font-bold text-white transition-all duration-200 hover:bg-zinc-800"
            >
              <LogOut size={18} />
              SAIR
            </button>
          </div>
        </div>

        <div className="!mt-6 grid grid-cols-1 !gap-6 xl:grid-cols-2">
          <OrderColumn
            title="NAO PAGOS"
            icon={Clock}
            orders={orders.unpaid}
            emptyText="Nenhum pedido aguardando pagamento."
            onRefresh={fetchOrders}
          />

          <OrderColumn
            title="PAGOS"
            icon={CircleDollarSign}
            orders={orders.paid}
            emptyText="Nenhum pedido pago ainda."
            onRefresh={fetchOrders}
          />
        </div>
      </section>
    </main>
  );
};

const OrderColumn = ({
  title,
  icon: Icon,
  orders,
  emptyText,
  onRefresh,
}: {
  title: string;
  icon: typeof Clock;
  orders: AdminOrder[];
  emptyText: string;
  onRefresh: () => Promise<void>;
}) => {
  return (
    <section className="rounded-xl border border-zinc-200 bg-white !p-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center !gap-3">
          <Icon size={22} />
          <h2 className="font-[family-name:var(--font-bebas)] text-3xl text-zinc-950">
            {title}
          </h2>
        </div>

        <span className="rounded-full bg-zinc-100 !px-3 !py-1 text-xs font-bold">
          {orders.length}
        </span>
      </div>

      <div className="!mt-5 flex flex-col !gap-4">
        {orders.length === 0 ? (
          <div className="rounded-lg border border-dashed border-zinc-200 !p-8 text-center">
            <Package className="mx-auto text-zinc-400" size={34} />
            <p className="!mt-3 text-sm text-zinc-500">{emptyText}</p>
          </div>
        ) : (
          orders.map((order) => (
            <OrderCard key={order.id} order={order} onRefresh={onRefresh} />
          ))
        )}
      </div>
    </section>
  );
};

const OrderCard = ({
  order,
  onRefresh,
}: {
  order: AdminOrder;
  onRefresh: () => Promise<void>;
}) => {
  const createdAt = new Date(order.createdAt).toLocaleString("pt-BR");
  const [isReconciling, setIsReconciling] = useState(false);
  const addressLine = [
    order.customer?.street,
    order.customer?.number,
    order.customer?.complement,
  ]
    .filter(Boolean)
    .join(", ");
  const cityLine = [
    order.customer?.neighborhood,
    order.customer?.city &&
      order.customer?.state &&
      `${order.customer.city} / ${order.customer.state}`,
  ]
    .filter(Boolean)
    .join(" - ");

  const reconcilePayment = async () => {
    setIsReconciling(true);

    try {
      const wasUpdated = await reconcileOrderPayment(order);

      if (!wasUpdated) {
        toast.info("Nenhum pagamento aprovado encontrado ainda");
        return;
      }

      toast.success("Pedido atualizado para pago");
      await onRefresh();
    } catch {
      toast.error("Nao foi possivel verificar o pagamento");
    } finally {
      setIsReconciling(false);
    }
  };

  return (
    <article className="rounded-lg border border-zinc-200 !p-4">
      <div className="flex flex-col !gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h3 className="text-sm font-bold text-zinc-950">{order.id}</h3>
          <p className="!mt-1 text-sm text-zinc-600">
            {order.customer?.name || "Cliente sem nome"}
          </p>
          <p className="text-xs text-zinc-500">
            {order.customer?.email} | {order.customer?.whatsapp}
          </p>
        </div>

        <strong className="text-lg text-zinc-950">
          {formatPrice(order.total)}
        </strong>
      </div>

      <div className="!mt-4 rounded-lg bg-zinc-50 !p-3">
        <p className="text-xs font-bold uppercase text-zinc-500">Itens</p>
        <ul className="!mt-2 flex flex-col !gap-2">
          {order.items.map((item, index) => (
            <li key={index} className="text-sm text-zinc-700">
              {item.quantity || 1}x {item.title} - Tam. {item.size || "M"}
            </li>
          ))}
        </ul>
      </div>

      <div className="!mt-4 rounded-lg border border-zinc-100 bg-white !p-3">
        <p className="text-xs font-bold uppercase text-zinc-500">Endereco</p>
        <div className="!mt-2 flex flex-col !gap-1 text-xs text-zinc-600">
          <span>
            <strong className="text-zinc-700">CEP:</strong>{" "}
            {order.customer?.cep || "-"}
          </span>
          <span>
            <strong className="text-zinc-700">Rua:</strong>{" "}
            {addressLine || "-"}
          </span>
          <span>
            <strong className="text-zinc-700">Bairro/Cidade:</strong>{" "}
            {cityLine || "-"}
          </span>
          {order.customer?.notes && (
            <span>
              <strong className="text-zinc-700">Observacoes:</strong>{" "}
              {order.customer.notes}
            </span>
          )}
        </div>
      </div>

      <div className="!mt-4 grid grid-cols-1 !gap-2 text-xs text-zinc-500 sm:grid-cols-2">
        <span>
          <strong className="text-zinc-700">Criado:</strong> {createdAt}
        </span>
        <span>
          <strong className="text-zinc-700">Cidade:</strong>{" "}
          {order.customer?.city || "-"} / {order.customer?.state || "-"}
        </span>
        {order.preferenceId && (
          <span>
            <strong className="text-zinc-700">Preference:</strong>{" "}
            {order.preferenceId}
          </span>
        )}
        {order.paymentId && (
          <span>
            <strong className="text-zinc-700">Pagamento:</strong>{" "}
            {order.paymentId}
          </span>
        )}
      </div>

      {order.status === "unpaid" && (
        <button
          type="button"
          onClick={reconcilePayment}
          disabled={isReconciling}
          className="!mt-4 inline-flex h-10 w-full items-center justify-center !gap-2 rounded-lg bg-black !px-4 text-xs font-bold text-white transition-all duration-200 hover:bg-zinc-800 disabled:cursor-not-allowed disabled:bg-zinc-400"
        >
          <RefreshCw
            size={16}
            className={isReconciling ? "animate-spin" : ""}
          />
          VERIFICAR PAGAMENTO
        </button>
      )}
    </article>
  );
};

export default AdminPage;
