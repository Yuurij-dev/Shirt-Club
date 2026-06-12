"use client";

import {
  FormEvent,
  forwardRef,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  BarChart3,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  CircleDollarSign,
  Copy,
  Clock3,
  Gift,
  ImageIcon,
  LayoutDashboard,
  LogOut,
  Package,
  Pencil,
  Plus,
  RefreshCw,
  Search,
  Settings,
  ShoppingBag,
  SlidersHorizontal,
  Star,
  Store,
  TicketPercent,
  Trash2,
  Truck,
  Users,
} from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";
import {
  bannerPageLabels,
  bannerPositionLabels,
  BannerPage,
  BannerPosition,
  StoreBanner,
} from "../data/banners";
import { Coupon, CouponType, getCouponStatus } from "../data/coupons";
import { isMascotProduct, products, type Product } from "../data/products";
import type { ProductPriceGroup } from "../lib/productStore";
import { formatPrice, getPriceNumber } from "../utils/price";

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
  deliveryStatus:
    | "not_separated"
    | "separated"
    | "shipped"
    | "delivered"
    | "canceled";
  total: number;
  createdAt: string;
  preferenceId?: string | null;
  paymentId?: string | null;
};

type OrdersResponse = {
  unpaid: AdminOrder[];
  paid: AdminOrder[];
};

type AdminCustomer = {
  id: string;
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
  ordersCount: number;
  paidOrdersCount: number;
  totalSpent: number;
  lastOrderAt?: string | null;
};

type AdminSection =
  | "dashboard"
  | "orders"
  | "deliveries"
  | "products"
  | "clients"
  | "coupons"
  | "banners"
  | "reviews"
  | "settings";

type OrderFilter = "all" | "paid" | "unpaid";
type DeliveryFilter =
  | "all"
  | AdminOrder["deliveryStatus"];
type CouponFilter = "all" | "active" | "scheduled" | "expired";
type ProductOwnerFilter =
  | "all"
  | "masculino"
  | "feminino"
  | "retro"
  | "mascote";
type DashboardPeriod = 7 | 30 | 90;
type PendingBulkPriceUpdate = {
  group: ProductPriceGroup;
  price: string;
  count: number;
};

type CouponsResponse = {
  coupons: Coupon[];
};

type BannersResponse = {
  banners: StoreBanner[];
};

type ProductsResponse = {
  products: Product[];
};

type CustomersResponse = {
  customers: AdminCustomer[];
};

const bannerPageOptions = Object.entries(bannerPageLabels) as Array<
  [BannerPage, string]
>;
const bannerPositionOptions = Object.entries(bannerPositionLabels) as Array<
  [BannerPosition, string]
>;

const deliveryStatusLabels: Record<AdminOrder["deliveryStatus"], string> = {
  not_separated: "Não separado",
  separated: "Separado",
  shipped: "Enviado",
  delivered: "Entregue",
  canceled: "Cancelado",
};

const deliveryStatusOptions: Array<{
  value: AdminOrder["deliveryStatus"];
  label: string;
}> = [
  { value: "not_separated", label: deliveryStatusLabels.not_separated },
  { value: "separated", label: deliveryStatusLabels.separated },
  { value: "shipped", label: deliveryStatusLabels.shipped },
  { value: "delivered", label: deliveryStatusLabels.delivered },
  { value: "canceled", label: deliveryStatusLabels.canceled },
];

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
    throw new Error("Não foi possível verificar o pagamento");
  }

  return true;
};

const getOrderDate = (order: AdminOrder) => {
  return new Date(order.createdAt).toLocaleString("pt-BR");
};

const getAddressLine = (order: AdminOrder) => {
  return [
    order.customer?.street,
    order.customer?.number,
    order.customer?.complement,
  ]
    .filter(Boolean)
    .join(", ");
};

const getCityLine = (order: AdminOrder) => {
  return [
    order.customer?.neighborhood,
    order.customer?.city &&
      order.customer?.state &&
      `${order.customer.city} / ${order.customer.state}`,
  ]
    .filter(Boolean)
    .join(" - ");
};

const getOrderItemsCount = (order: AdminOrder) => {
  return order.items.reduce((total, item) => total + (item.quantity || 1), 0);
};

const AdminPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoadingSession, setIsLoadingSession] = useState(true);
  const [isLoadingOrders, setIsLoadingOrders] = useState(false);
  const [isLoadingCoupons, setIsLoadingCoupons] = useState(false);
  const [isLoadingBanners, setIsLoadingBanners] = useState(false);
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);
  const [isLoadingCustomers, setIsLoadingCustomers] = useState(false);
  const [activeSection, setActiveSection] = useState<AdminSection>("dashboard");
  const [orderFilter, setOrderFilter] = useState<OrderFilter>("all");
  const [deliveryFilter, setDeliveryFilter] = useState<DeliveryFilter>("all");
  const [couponFilter, setCouponFilter] = useState<CouponFilter>("all");
  const [productCountryFilter, setProductCountryFilter] = useState("all");
  const [productOwnerFilter, setProductOwnerFilter] =
    useState<ProductOwnerFilter>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [banners, setBanners] = useState<StoreBanner[]>([]);
  const [productCatalog, setProductCatalog] = useState<Product[]>(products);
  const [customers, setCustomers] = useState<AdminCustomer[]>([]);
  const [orders, setOrders] = useState<OrdersResponse>({
    unpaid: [],
    paid: [],
  });

  const loadOrders = useCallback(async () => {
    const response = await fetch("/api/admin/orders");

    if (!response.ok) {
      if (response.status === 401) {
        setIsAuthenticated(false);
      }
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
      toast.error("Não foi possível buscar os pedidos");
    } finally {
      setIsLoadingOrders(false);
    }
  }, [loadOrders]);

  const loadCoupons = useCallback(async () => {
    const response = await fetch("/api/admin/coupons");

    if (!response.ok) {
      if (response.status === 401) {
        setIsAuthenticated(false);
      }
      return null;
    }

    const data = (await response.json()) as CouponsResponse;
    setCoupons(data.coupons);

    return data.coupons;
  }, []);

  const fetchCoupons = useCallback(async () => {
    setIsLoadingCoupons(true);

    try {
      await loadCoupons();
    } catch {
      toast.error("Não foi possível buscar os cupons");
    } finally {
      setIsLoadingCoupons(false);
    }
  }, [loadCoupons]);

  const loadBanners = useCallback(async () => {
    const response = await fetch("/api/admin/banners");

    if (!response.ok) {
      if (response.status === 401) {
        setIsAuthenticated(false);
      }
      return null;
    }

    const data = (await response.json()) as BannersResponse;
    setBanners(data.banners);

    return data.banners;
  }, []);

  const fetchBanners = useCallback(async () => {
    setIsLoadingBanners(true);

    try {
      await loadBanners();
    } catch {
      toast.error("Não foi possível buscar os banners");
    } finally {
      setIsLoadingBanners(false);
    }
  }, [loadBanners]);

  const loadProducts = useCallback(async () => {
    const response = await fetch("/api/admin/products");

    if (!response.ok) {
      if (response.status === 401) {
        setIsAuthenticated(false);
      }
      return null;
    }

    const data = (await response.json()) as ProductsResponse;
    setProductCatalog(data.products);

    return data.products;
  }, []);

  const fetchProducts = useCallback(async () => {
    setIsLoadingProducts(true);

    try {
      await loadProducts();
    } catch {
      toast.error("Não foi possível buscar os produtos");
    } finally {
      setIsLoadingProducts(false);
    }
  }, [loadProducts]);

  const loadCustomers = useCallback(async () => {
    const response = await fetch("/api/admin/customers");

    if (!response.ok) {
      if (response.status === 401) {
        setIsAuthenticated(false);
      }
      return [];
    }

    const data = (await response.json()) as CustomersResponse;
    setCustomers(data.customers);

    return data.customers;
  }, []);

  const fetchCustomers = useCallback(async () => {
    setIsLoadingCustomers(true);

    try {
      await loadCustomers();
    } catch {
      toast.error("Não foi possível buscar os clientes");
    } finally {
      setIsLoadingCustomers(false);
    }
  }, [loadCustomers]);

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
        toast.error("Alguns pedidos não puderam ser verificados");
      }
    } catch {
      toast.error("Não foi possível atualizar os pedidos");
    } finally {
      setIsLoadingOrders(false);
    }
  }, [loadOrders, orders.unpaid]);

  const autoReconcileOrders = useCallback(async () => {
    try {
      const response = await fetch("/api/admin/orders/reconcile-pending", {
        method: "POST",
      });

      if (!response.ok) {
        if (response.status === 401) {
          setIsAuthenticated(false);
        }
        return;
      }

      const data = (await response.json()) as { updated?: number };

      if (data.updated && data.updated > 0) {
        await loadOrders();
      }
    } catch (error) {
      console.error("Não foi possível reconciliar pedidos automaticamente", error);
    }
  }, [loadOrders]);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await fetch("/api/admin/session");
        const data = (await response.json()) as { authenticated: boolean };

        setIsAuthenticated(data.authenticated);

        if (data.authenticated) {
          await Promise.all([
            fetchOrders(),
            fetchCoupons(),
            fetchBanners(),
            fetchProducts(),
            fetchCustomers(),
          ]);
        }
      } finally {
        setIsLoadingSession(false);
      }
    };

    void checkSession();
  }, [fetchBanners, fetchCoupons, fetchCustomers, fetchOrders, fetchProducts]);

  useEffect(() => {
    if (!isAuthenticated) return;

    const intervalId = window.setInterval(() => {
      void autoReconcileOrders();
    }, 30000);

    void autoReconcileOrders();

    return () => window.clearInterval(intervalId);
  }, [autoReconcileOrders, isAuthenticated]);

  const allOrders = useMemo(() => {
    return [...orders.unpaid, ...orders.paid].sort((first, second) => {
      return (
        new Date(second.createdAt).getTime() -
        new Date(first.createdAt).getTime()
      );
    });
  }, [orders.paid, orders.unpaid]);

  const visibleOrders = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    return allOrders.filter((order) => {
      const matchesStatus =
        orderFilter === "all" || order.status === orderFilter;
      const searchableText = [
        order.id,
        order.customer?.name,
        order.customer?.email,
        order.customer?.whatsapp,
        order.customer?.city,
        order.items.map((item) => item.title).join(" "),
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return matchesStatus && searchableText.includes(normalizedSearch);
    });
  }, [allOrders, orderFilter, searchTerm]);

  const visibleDeliveryOrders = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    return allOrders.filter((order) => {
      if (order.status !== "paid") return false;

      const deliveryStatus = order.deliveryStatus || "not_separated";
      const matchesStatus =
        deliveryFilter === "all" || deliveryStatus === deliveryFilter;
      const searchableText = [
        order.id,
        order.customer?.name,
        order.customer?.email,
        order.customer?.whatsapp,
        order.customer?.city,
        getAddressLine(order),
        getCityLine(order),
        order.items.map((item) => item.title).join(" "),
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return matchesStatus && searchableText.includes(normalizedSearch);
    });
  }, [allOrders, deliveryFilter, searchTerm]);

  useEffect(() => {
    if (visibleOrders.length === 0) {
      setSelectedOrderId(null);
      return;
    }

    const selectedOrderExists = visibleOrders.some((order) => {
      return order.id === selectedOrderId;
    });

    if (!selectedOrderExists) {
      setSelectedOrderId(visibleOrders[0].id);
    }
  }, [selectedOrderId, visibleOrders]);

  const selectedOrder = useMemo(() => {
    return allOrders.find((order) => order.id === selectedOrderId) || null;
  }, [allOrders, selectedOrderId]);

  const visibleCoupons = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    return coupons.filter((coupon) => {
      const status = getCouponStatus(coupon);
      const matchesStatus = couponFilter === "all" || status === couponFilter;
      const searchableText = [coupon.code, coupon.type, status]
        .join(" ")
        .toLowerCase();

      return matchesStatus && searchableText.includes(normalizedSearch);
    });
  }, [couponFilter, coupons, searchTerm]);

  const visibleBanners = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    return banners.filter((banner) => {
      const searchableText = [
        banner.name,
        banner.page,
        banner.position,
        banner.title,
        banner.desktopImageUrl,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return searchableText.includes(normalizedSearch);
    });
  }, [banners, searchTerm]);

  const productCountries = useMemo(() => {
    return Array.from(
      new Set(
        productCatalog
          .map((product) => product.country?.trim())
          .filter((country): country is string => Boolean(country))
      )
    ).sort((first, second) => first.localeCompare(second));
  }, [productCatalog]);

  const visibleProducts = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    return productCatalog.filter((product) => {
      const productOwnerType = product.ownerType || "team";
      const productGender = product.gender || "masculino";
      const productIsRetro = isProductRetro(product);
      const productIsMascot = isMascotProduct(product);
      const matchesCountry =
        productCountryFilter === "all" ||
        product.country === productCountryFilter;
      const matchesOwner =
        productOwnerFilter === "all" ||
        (productOwnerFilter === "mascote" && productIsMascot) ||
        (productOwnerFilter === "retro" && productIsRetro && !productIsMascot) ||
        (productOwnerFilter === "masculino" &&
          productGender === "masculino" &&
          !productIsRetro &&
          !productIsMascot) ||
        (productOwnerFilter === "feminino" &&
          productGender === "feminino" &&
          !productIsRetro &&
          !productIsMascot);
      const searchableText = [
        product.id,
        product.name,
        product.team,
        product.country,
        product.brand,
        product.category,
        product.gender,
        productOwnerType,
        productIsRetro ? "retro" : "",
        productIsMascot ? "mascote" : "",
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return (
        matchesCountry && matchesOwner && searchableText.includes(normalizedSearch)
      );
    });
  }, [productCatalog, productCountryFilter, productOwnerFilter, searchTerm]);

  const visibleCustomers = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    return customers.filter((customer) => {
      const searchableText = [
        customer.name,
        customer.email,
        customer.whatsapp,
        customer.cpf,
        customer.city,
        customer.state,
        customer.street,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return searchableText.includes(normalizedSearch);
    });
  }, [customers, searchTerm]);

  const paidTotal = orders.paid.reduce((total, order) => total + order.total, 0);
  const pendingTotal = orders.unpaid.reduce(
    (total, order) => total + order.total,
    0
  );
  const customersCount = new Set(
    allOrders.map((order) => order.customer?.email || order.customer?.whatsapp)
  ).size;

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
      toast.error("Credenciais inválidas");
      return;
    }

    setIsAuthenticated(true);
    await Promise.all([
      fetchOrders(),
      fetchCoupons(),
      fetchBanners(),
      fetchProducts(),
      fetchCustomers(),
    ]);
  };

  const handleLogout = async () => {
    await fetch("/api/admin/logout", {
      method: "POST",
    });

    setIsAuthenticated(false);
    setOrders({ unpaid: [], paid: [] });
    setCoupons([]);
    setBanners([]);
    setProductCatalog(products);
    setCustomers([]);
  };

  const handleDeliveryStatusChange = async (
    orderId: string,
    deliveryStatus: AdminOrder["deliveryStatus"]
  ) => {
    try {
      const response = await fetch("/api/admin/orders/delivery-status", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          orderId,
          deliveryStatus,
        }),
      });

      if (!response.ok) {
        const data = (await response.json()) as { error?: string };
        throw new Error(data.error || "Não foi possível atualizar a entrega");
      }

      toast.success("Status de entrega atualizado");
      await loadOrders();
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Não foi possível atualizar a entrega"
      );
    }
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
          <Image
            src="/assets/logo2.png"
            alt="Shirt Club"
            width={86}
            height={60}
            className="h-auto w-20"
            priority
          />
          <h1 className="!mt-5 font-[family-name:var(--font-bebas)] text-4xl text-zinc-950">
            ADMIN
          </h1>
          <p className="!mt-1 text-sm text-zinc-500">
            Entre com as credenciais do painel.
          </p>

          <div className="!mt-6 flex flex-col !gap-4">
            <input
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              placeholder="Usuário"
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
              className="h-12 cursor-pointer rounded-lg bg-black text-sm font-bold text-white transition-all duration-200 hover:bg-zinc-800"
            >
              ENTRAR
            </button>
          </div>
        </form>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-zinc-100 text-zinc-950">
      <div className="grid min-h-screen grid-cols-1 lg:grid-cols-[260px_minmax(0,1fr)]">
        <AdminSidebar
          activeSection={activeSection}
          onSectionChange={setActiveSection}
          totalOrders={allOrders.length}
          pendingOrders={orders.unpaid.length}
          onLogout={handleLogout}
        />

        <section className="min-w-0">
          <AdminTopbar
            activeSection={activeSection}
            searchTerm={searchTerm}
            onSearchTermChange={setSearchTerm}
            isLoadingOrders={isLoadingOrders}
            onRefresh={refreshAndReconcileOrders}
            onLogout={handleLogout}
          />

          <div className="flex w-full max-w-none flex-col !gap-5 !p-3 sm:!p-4 xl:!p-5">
            {activeSection === "orders" && (
              <OrdersPanel
                orders={orders}
                allOrders={allOrders}
                visibleOrders={visibleOrders}
                selectedOrder={selectedOrder}
                orderFilter={orderFilter}
                searchTerm={searchTerm}
                isLoadingOrders={isLoadingOrders}
                paidTotal={paidTotal}
                pendingTotal={pendingTotal}
                customersCount={customersCount}
                onFilterChange={setOrderFilter}
                onSelectOrder={setSelectedOrderId}
                onRefresh={fetchOrders}
              />
            )}

            {activeSection === "dashboard" && (
              <DashboardPanel
                orders={allOrders}
                onGoToOrders={() => setActiveSection("orders")}
              />
            )}

            {activeSection === "deliveries" && (
              <DeliveriesPanel
                allOrders={orders.paid}
                visibleOrders={visibleDeliveryOrders}
                deliveryFilter={deliveryFilter}
                isLoadingOrders={isLoadingOrders}
                onFilterChange={setDeliveryFilter}
                onStatusChange={handleDeliveryStatusChange}
                onRefresh={fetchOrders}
              />
            )}

            {activeSection === "coupons" && (
              <CouponsPanel
                coupons={coupons}
                visibleCoupons={visibleCoupons}
                couponFilter={couponFilter}
                searchTerm={searchTerm}
                isLoadingCoupons={isLoadingCoupons}
                onFilterChange={setCouponFilter}
                onRefresh={fetchCoupons}
              />
            )}

            {activeSection === "banners" && (
              <BannersPanel
                banners={banners}
                visibleBanners={visibleBanners}
                isLoadingBanners={isLoadingBanners}
                onRefresh={fetchBanners}
              />
            )}

            {activeSection === "products" && (
              <ProductsPanel
                products={productCatalog}
                visibleProducts={visibleProducts}
                countries={productCountries}
                countryFilter={productCountryFilter}
                ownerFilter={productOwnerFilter}
                isLoadingProducts={isLoadingProducts}
                onCountryFilterChange={setProductCountryFilter}
                onOwnerFilterChange={setProductOwnerFilter}
                onRefresh={fetchProducts}
              />
            )}

            {activeSection === "clients" && (
              <ClientsPanel
                customers={customers}
                visibleCustomers={visibleCustomers}
                isLoadingCustomers={isLoadingCustomers}
                onRefresh={fetchCustomers}
              />
            )}

            {activeSection !== "orders" &&
              activeSection !== "dashboard" &&
              activeSection !== "deliveries" &&
              activeSection !== "coupons" &&
              activeSection !== "banners" &&
              activeSection !== "products" &&
              activeSection !== "clients" && (
              <ComingSoonPanel section={activeSection} />
            )}
          </div>
        </section>
      </div>
    </main>
  );
};

const AdminSidebar = ({
  activeSection,
  onSectionChange,
  totalOrders,
  pendingOrders,
  onLogout,
}: {
  activeSection: AdminSection;
  onSectionChange: (section: AdminSection) => void;
  totalOrders: number;
  pendingOrders: number;
  onLogout: () => Promise<void>;
}) => {
  const menuItems: Array<{
    id: AdminSection;
    label: string;
    icon: typeof LayoutDashboard;
    badge?: number;
  }> = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "orders", label: "Pedidos", icon: ShoppingBag, badge: totalOrders },
    { id: "deliveries", label: "Entregas", icon: Truck },
    { id: "products", label: "Produtos", icon: Package },
    { id: "clients", label: "Clientes", icon: Users },
    { id: "coupons", label: "Cupons", icon: Gift },
    { id: "banners", label: "Banners", icon: ImageIcon },
    { id: "reviews", label: "Avaliações", icon: Star },
    { id: "settings", label: "Configurações", icon: Settings },
  ];

  return (
    <aside className="flex flex-col border-b border-zinc-800 bg-black text-white lg:sticky lg:top-0 lg:h-screen lg:overflow-hidden lg:border-b-0 lg:border-r">
      <div className="flex items-center justify-between !p-5 lg:block">
        <Image
          src="/assets/logo2.png"
          alt="Shirt Club"
          width={92}
          height={64}
          className="h-auto w-20 invert"
          priority
        />
        <button
          type="button"
          onClick={onLogout}
          className="inline-flex h-10 cursor-pointer items-center justify-center !gap-2 rounded-lg border border-white/15 !px-3 text-xs font-bold text-white lg:hidden"
        >
          <LogOut size={16} />
          SAIR
        </button>
      </div>

      <nav className="flex overflow-x-auto !px-4 !pb-4 lg:flex-1 lg:flex-col lg:overflow-y-auto lg:overflow-x-hidden lg:!px-5">
        <p className="hidden text-[10px] font-bold uppercase tracking-wider text-zinc-500 lg:!mb-3 lg:block">
          Menu
        </p>
        <div className="flex min-w-max !gap-2 lg:min-w-0 lg:flex-col">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onSectionChange(item.id)}
                className={`inline-flex h-11 cursor-pointer items-center justify-between !gap-3 rounded-lg !px-3 text-sm font-bold transition-all duration-200 ${
                  isActive
                    ? "bg-white text-black"
                    : "text-zinc-300 hover:bg-white/10 hover:text-white"
                }`}
              >
                <span className="inline-flex items-center !gap-3">
                  <Icon size={17} />
                  {item.label}
                </span>
                {item.badge !== undefined && item.badge > 0 && (
                  <span
                    className={`rounded-full !px-2 !py-0.5 text-[10px] ${
                      isActive
                        ? "bg-black text-white"
                        : "bg-white/10 text-zinc-200"
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </nav>

      <div className="hidden border-t border-white/10 !p-5 lg:block">
        <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">
          Loja online
        </p>
        <div className="!mt-3 flex items-center justify-between rounded-lg bg-white/5 !p-3">
          <div className="flex items-center !gap-3">
            <Store size={18} />
            <div>
              <p className="text-xs font-bold">Shirt Club</p>
              <p className="text-[11px] text-zinc-400">
                {pendingOrders} pendente{pendingOrders === 1 ? "" : "s"}
              </p>
            </div>
          </div>
          <span className="rounded-full bg-emerald-500/15 !px-2 !py-1 text-[10px] font-bold text-emerald-300">
            Ativo
          </span>
        </div>
      </div>
    </aside>
  );
};

const AdminTopbar = ({
  activeSection,
  searchTerm,
  onSearchTermChange,
  isLoadingOrders,
  onRefresh,
  onLogout,
}: {
  activeSection: AdminSection;
  searchTerm: string;
  onSearchTermChange: (value: string) => void;
  isLoadingOrders: boolean;
  onRefresh: () => Promise<void>;
  onLogout: () => Promise<void>;
}) => {
  const placeholder =
    activeSection === "coupons"
      ? "Buscar cupons..."
      : activeSection === "clients"
        ? "Buscar clientes..."
      : activeSection === "deliveries"
        ? "Buscar entregas..."
        : activeSection === "products"
          ? "Buscar produtos..."
          : activeSection === "banners"
            ? "Buscar banners..."
            : "Buscar pedidos...";

  return (
    <header className="sticky top-0 z-20 border-b border-zinc-200 bg-white/95 backdrop-blur">
      <div className="flex min-h-16 flex-col !gap-3 !px-4 !py-3 sm:flex-row sm:items-center sm:justify-between sm:!px-6">
        <div className="relative w-full max-w-md">
          <Search
            size={16}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400"
          />
          <input
            value={searchTerm}
            onChange={(event) => onSearchTermChange(event.target.value)}
            placeholder={placeholder}
            className="h-11 w-full rounded-lg border border-zinc-200 bg-zinc-50 !pl-10 !pr-4 text-sm outline-none transition-all duration-200 focus:border-black focus:bg-white"
          />
        </div>

        <div className="flex !gap-2">
          <button
            type="button"
            onClick={onRefresh}
            disabled={isLoadingOrders}
            className="inline-flex h-11 cursor-pointer items-center justify-center !gap-2 rounded-lg border border-zinc-200 bg-white !px-4 text-sm font-bold transition-all duration-200 hover:border-black disabled:cursor-not-allowed disabled:opacity-60"
          >
            <RefreshCw
              size={18}
              className={isLoadingOrders ? "animate-spin" : ""}
            />
            ATUALIZAR
          </button>

          <button
            type="button"
            onClick={onLogout}
            className="hidden h-11 cursor-pointer items-center justify-center !gap-2 rounded-lg bg-black !px-4 text-sm font-bold text-white transition-all duration-200 hover:bg-zinc-800 sm:inline-flex"
          >
            <LogOut size={18} />
            SAIR
          </button>
        </div>
      </div>
    </header>
  );
};

const OrdersPanel = ({
  orders,
  allOrders,
  visibleOrders,
  selectedOrder,
  orderFilter,
  searchTerm,
  isLoadingOrders,
  paidTotal,
  pendingTotal,
  customersCount,
  onFilterChange,
  onSelectOrder,
  onRefresh,
}: {
  orders: OrdersResponse;
  allOrders: AdminOrder[];
  visibleOrders: AdminOrder[];
  selectedOrder: AdminOrder | null;
  orderFilter: OrderFilter;
  searchTerm: string;
  isLoadingOrders: boolean;
  paidTotal: number;
  pendingTotal: number;
  customersCount: number;
  onFilterChange: (filter: OrderFilter) => void;
  onSelectOrder: (orderId: string) => void;
  onRefresh: () => Promise<void>;
}) => {
  return (
    <>
      <div className="flex flex-col !gap-1">
        <h1 className="font-[family-name:var(--font-bebas)] text-5xl text-zinc-950">
          Pedidos
        </h1>
        <p className="text-sm text-zinc-500">
          Gerencie e acompanhe todos os pedidos da loja.
        </p>
      </div>

      <div className="grid grid-cols-2 !gap-3 xl:grid-cols-4">
        <MetricCard
          title="Total de pedidos"
          value={String(allOrders.length)}
          helper={`${customersCount} cliente${customersCount === 1 ? "" : "s"}`}
          icon={ShoppingBag}
        />
        <MetricCard
          title="Pedidos pagos"
          value={String(orders.paid.length)}
          helper={formatPrice(paidTotal)}
          icon={CheckCircle2}
          tone="success"
        />
        <MetricCard
          title="Pedidos não pagos"
          value={String(orders.unpaid.length)}
          helper={formatPrice(pendingTotal)}
          icon={Clock3}
          tone="warning"
        />
        <MetricCard
          title="Faturamento"
          value={formatPrice(paidTotal)}
          helper="Total confirmado"
          icon={CircleDollarSign}
        />
      </div>

      <div className="grid grid-cols-1 !gap-5 xl:grid-cols-[minmax(0,1fr)_380px]">
        <section className="min-w-0 rounded-xl border border-zinc-200 bg-white shadow-sm">
          <div className="flex flex-col !gap-4 border-b border-zinc-100 !p-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-wrap !gap-2">
              <FilterButton
                label="Todos"
                count={allOrders.length}
                active={orderFilter === "all"}
                onClick={() => onFilterChange("all")}
              />
              <FilterButton
                label="Pagos"
                count={orders.paid.length}
                active={orderFilter === "paid"}
                onClick={() => onFilterChange("paid")}
              />
              <FilterButton
                label="Não pagos"
                count={orders.unpaid.length}
                active={orderFilter === "unpaid"}
                onClick={() => onFilterChange("unpaid")}
              />
            </div>

            <button
              type="button"
              className="inline-flex h-10 cursor-pointer items-center justify-center !gap-2 rounded-lg border border-zinc-200 !px-3 text-xs font-bold transition-all duration-200 hover:border-black"
            >
              <SlidersHorizontal size={16} />
              FILTROS
            </button>
          </div>

          <OrderList
            orders={visibleOrders}
            selectedOrderId={selectedOrder?.id || null}
            searchTerm={searchTerm}
            isLoadingOrders={isLoadingOrders}
            onSelectOrder={onSelectOrder}
            onRefresh={onRefresh}
          />
        </section>

        <div className="hidden xl:block">
          <OrderDetailPanel order={selectedOrder} onRefresh={onRefresh} />
        </div>
      </div>
    </>
  );
};

const DeliveriesPanel = ({
  allOrders,
  visibleOrders,
  deliveryFilter,
  isLoadingOrders,
  onFilterChange,
  onStatusChange,
  onRefresh,
}: {
  allOrders: AdminOrder[];
  visibleOrders: AdminOrder[];
  deliveryFilter: DeliveryFilter;
  isLoadingOrders: boolean;
  onFilterChange: (filter: DeliveryFilter) => void;
  onStatusChange: (
    orderId: string,
    deliveryStatus: AdminOrder["deliveryStatus"]
  ) => Promise<void>;
  onRefresh: () => Promise<void>;
}) => {
  const getCount = (status: AdminOrder["deliveryStatus"]) => {
    return allOrders.filter((order) => {
      return (order.deliveryStatus || "not_separated") === status;
    }).length;
  };

  return (
    <>
      <div className="flex flex-col !gap-1">
        <h1 className="font-[family-name:var(--font-bebas)] text-5xl text-zinc-950">
          Entregas
        </h1>
        <p className="text-sm text-zinc-500">
          Acompanhe separação, envio e conclusão dos pedidos.
        </p>
      </div>

      <div className="grid grid-cols-2 !gap-3 xl:grid-cols-5">
        <MetricCard
          title="Não separados"
          value={String(getCount("not_separated"))}
          helper="Aguardando separação"
          icon={Package}
          tone="warning"
        />
        <MetricCard
          title="Separados"
          value={String(getCount("separated"))}
          helper="Prontos para envio"
          icon={ShoppingBag}
        />
        <MetricCard
          title="Enviados"
          value={String(getCount("shipped"))}
          helper="Em transporte"
          icon={Truck}
        />
        <MetricCard
          title="Entregues"
          value={String(getCount("delivered"))}
          helper="Finalizados"
          icon={CheckCircle2}
          tone="success"
        />
        <MetricCard
          title="Cancelados"
          value={String(getCount("canceled"))}
          helper="Fora da entrega"
          icon={Trash2}
        />
      </div>

      <section className="rounded-xl border border-zinc-200 bg-white shadow-sm">
        <div className="flex flex-col !gap-4 border-b border-zinc-100 !p-4 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex flex-wrap !gap-2">
            <FilterButton
              label="Todos"
              count={allOrders.length}
              active={deliveryFilter === "all"}
              onClick={() => onFilterChange("all")}
            />
            <FilterButton
              label="Não separados"
              count={getCount("not_separated")}
              active={deliveryFilter === "not_separated"}
              onClick={() => onFilterChange("not_separated")}
            />
            <FilterButton
              label="Separados"
              count={getCount("separated")}
              active={deliveryFilter === "separated"}
              onClick={() => onFilterChange("separated")}
            />
            <FilterButton
              label="Enviados"
              count={getCount("shipped")}
              active={deliveryFilter === "shipped"}
              onClick={() => onFilterChange("shipped")}
            />
            <FilterButton
              label="Entregues"
              count={getCount("delivered")}
              active={deliveryFilter === "delivered"}
              onClick={() => onFilterChange("delivered")}
            />
            <FilterButton
              label="Cancelados"
              count={getCount("canceled")}
              active={deliveryFilter === "canceled"}
              onClick={() => onFilterChange("canceled")}
            />
          </div>

          <button
            type="button"
            onClick={onRefresh}
            disabled={isLoadingOrders}
            className="inline-flex h-10 cursor-pointer items-center justify-center !gap-2 rounded-lg border border-zinc-200 !px-3 text-xs font-bold transition-all duration-200 hover:border-black disabled:cursor-not-allowed disabled:opacity-60"
          >
            <RefreshCw
              size={16}
              className={isLoadingOrders ? "animate-spin" : ""}
            />
            ATUALIZAR
          </button>
        </div>

        {visibleOrders.length === 0 ? (
          <div className="!p-10 text-center">
            <Truck className="mx-auto text-zinc-400" size={38} />
            <p className="!mt-3 text-sm font-bold text-zinc-700">
              Nenhuma entrega encontrada.
            </p>
            <p className="!mt-1 text-xs text-zinc-500">
              Ajuste os filtros ou busque por outro pedido.
            </p>
          </div>
        ) : (
          <div className="overflow-hidden">
            <div className="hidden grid-cols-[1fr_1.2fr_1.2fr_0.9fr_1fr] border-b border-zinc-100 !px-4 !py-3 text-xs font-bold uppercase text-zinc-500 xl:grid">
              <span>Pedido</span>
              <span>Cliente</span>
              <span>Endereço</span>
              <span>Pagamento</span>
              <span>Status de entrega</span>
            </div>

            <div className="divide-y divide-zinc-100">
              {visibleOrders.map((order) => (
                <DeliveryOrderRow
                  key={order.id}
                  order={order}
                  onStatusChange={onStatusChange}
                />
              ))}
            </div>
          </div>
        )}
      </section>
    </>
  );
};

const DeliveryOrderRow = ({
  order,
  onStatusChange,
}: {
  order: AdminOrder;
  onStatusChange: (
    orderId: string,
    deliveryStatus: AdminOrder["deliveryStatus"]
  ) => Promise<void>;
}) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [pendingStatus, setPendingStatus] = useState<
    AdminOrder["deliveryStatus"] | null
  >(null);
  const deliveryStatus = order.deliveryStatus || "not_separated";

  const handleChange = async (nextStatus: AdminOrder["deliveryStatus"]) => {
    setIsUpdating(true);

    try {
      await onStatusChange(order.id, nextStatus);
      setPendingStatus(null);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <article className="grid grid-cols-1 !gap-4 !px-4 !py-4 xl:grid-cols-[1fr_1.2fr_1.2fr_0.9fr_1fr] xl:items-center">
      <div>
        <strong className="block text-sm text-zinc-950">{order.id}</strong>
        <span className="text-xs text-zinc-500">
          {getOrderItemsCount(order)} item
          {getOrderItemsCount(order) === 1 ? "" : "s"} • {getOrderDate(order)}
        </span>
      </div>

      <div>
        <p className="text-sm font-bold text-zinc-800">
          {order.customer?.name || "Cliente sem nome"}
        </p>
        <p className="text-xs text-zinc-500">{order.customer?.email}</p>
        <p className="text-xs text-zinc-500">{order.customer?.whatsapp}</p>
      </div>

      <div className="rounded-lg bg-zinc-50 !p-3 xl:bg-transparent xl:!p-0">
        <p className="text-xs font-bold text-zinc-700">
          {getAddressLine(order) || "-"}
        </p>
        <p className="text-xs text-zinc-500">{getCityLine(order) || "-"}</p>
        <p className="text-xs text-zinc-500">CEP: {order.customer?.cep || "-"}</p>
      </div>

      <div className="flex items-center !gap-2">
        <OrderStatusBadge status={order.status} />
        <strong className="text-sm text-zinc-950">{formatPrice(order.total)}</strong>
      </div>

      <div className="flex flex-col !gap-2">
        <DeliveryStatusBadge status={deliveryStatus} />
        <DeliveryStatusSelect
          value={deliveryStatus}
          isUpdating={isUpdating}
          onChange={(nextStatus) => {
            if (nextStatus === deliveryStatus) return;
            setPendingStatus(nextStatus);
          }}
        />
      </div>

      {pendingStatus && (
        <DeliveryStatusConfirmModal
          order={order}
          currentStatus={deliveryStatus}
          nextStatus={pendingStatus}
          isUpdating={isUpdating}
          onCancel={() => setPendingStatus(null)}
          onConfirm={() => handleChange(pendingStatus)}
        />
      )}
    </article>
  );
};

const DeliveryStatusBadge = ({
  status,
}: {
  status: AdminOrder["deliveryStatus"];
}) => {
  const styles: Record<AdminOrder["deliveryStatus"], string> = {
    not_separated: "bg-amber-50 text-amber-700",
    separated: "bg-blue-50 text-blue-700",
    shipped: "bg-violet-50 text-violet-700",
    delivered: "bg-emerald-50 text-emerald-700",
    canceled: "bg-red-50 text-red-700",
  };

  return (
    <span
      className={`inline-flex w-fit rounded-full !px-2.5 !py-1 text-xs font-bold ${styles[status]}`}
    >
      {deliveryStatusLabels[status]}
    </span>
  );
};

const DeliveryStatusSelect = ({
  value,
  isUpdating,
  onChange,
}: {
  value: AdminOrder["deliveryStatus"];
  isUpdating: boolean;
  onChange: (value: AdminOrder["deliveryStatus"]) => void;
}) => {
  return (
    <select
      value={value}
      disabled={isUpdating}
      onChange={(event) => {
        void onChange(event.target.value as AdminOrder["deliveryStatus"]);
      }}
      className="h-10 cursor-pointer rounded-lg border border-zinc-200 bg-white !px-3 text-xs font-bold outline-none transition-all duration-200 hover:border-black disabled:cursor-not-allowed disabled:opacity-60"
    >
      {deliveryStatusOptions.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
};

const DeliveryStatusConfirmModal = ({
  order,
  currentStatus,
  nextStatus,
  isUpdating,
  onCancel,
  onConfirm,
}: {
  order: AdminOrder;
  currentStatus: AdminOrder["deliveryStatus"];
  nextStatus: AdminOrder["deliveryStatus"];
  isUpdating: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 !p-4">
      <section className="w-full max-w-md rounded-xl border border-zinc-200 bg-white !p-5 shadow-2xl">
        <div className="flex items-start !gap-4">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-zinc-100 text-zinc-950">
            <Truck size={20} />
          </span>
          <div>
            <h2 className="font-[family-name:var(--font-bebas)] text-3xl leading-none text-zinc-950">
              Alterar entrega
            </h2>
            <p className="!mt-2 text-sm leading-relaxed text-zinc-600">
              Tem certeza que deseja alterar o pedido{" "}
              <strong className="text-zinc-950">{order.id}</strong> de{" "}
              <strong className="text-zinc-950">
                {deliveryStatusLabels[currentStatus]}
              </strong>{" "}
              para{" "}
              <strong className="text-zinc-950">
                {deliveryStatusLabels[nextStatus]}
              </strong>
              ?
            </p>
          </div>
        </div>

        <div className="!mt-5 rounded-lg bg-zinc-50 !p-3 text-xs text-zinc-600">
          <p>
            Cliente:{" "}
            <strong className="text-zinc-950">
              {order.customer?.name || "Cliente sem nome"}
            </strong>
          </p>
          <p className="!mt-1">
            Essa alteração será usada para acompanhar a preparação e envio do
            pedido.
          </p>
          <p className="!mt-2 font-medium text-zinc-700">
            Obs: essa ação poderá gerar uma mensagem de atualização para o
            cliente.
          </p>
        </div>

        <div className="!mt-6 flex flex-col-reverse !gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onCancel}
            disabled={isUpdating}
            className="h-11 cursor-pointer rounded-lg border border-zinc-200 !px-5 text-sm font-bold transition-all duration-200 hover:border-black disabled:cursor-not-allowed disabled:opacity-60"
          >
            CANCELAR
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isUpdating}
            className="inline-flex h-11 cursor-pointer items-center justify-center !gap-2 rounded-lg bg-black !px-5 text-sm font-bold text-white transition-all duration-200 hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isUpdating && <RefreshCw size={16} className="animate-spin" />}
            ALTERAR STATUS
          </button>
        </div>
      </section>
    </div>
  );
};

const MetricCard = ({
  title,
  value,
  helper,
  icon: Icon,
  tone = "neutral",
}: {
  title: string;
  value: string;
  helper: string;
  icon: typeof ShoppingBag;
  tone?: "neutral" | "success" | "warning";
}) => {
  const toneClass = {
    neutral: "bg-zinc-100 text-zinc-700",
    success: "bg-emerald-50 text-emerald-700",
    warning: "bg-amber-50 text-amber-700",
  }[tone];

  return (
    <article className="rounded-xl border border-zinc-200 bg-white !p-3 shadow-sm sm:!p-4">
      <div className="flex items-start justify-between !gap-4">
        <div className="min-w-0">
          <p className="text-xs font-bold text-zinc-500">{title}</p>
          <strong className="!mt-2 block break-words text-xl text-zinc-950 sm:text-2xl">
            {value}
          </strong>
          <span className="!mt-1 block text-xs text-zinc-500">{helper}</span>
        </div>
        <span
          className={`inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full sm:h-10 sm:w-10 ${toneClass}`}
        >
          <Icon size={17} />
        </span>
      </div>
    </article>
  );
};

const FilterButton = ({
  label,
  count,
  active,
  onClick,
}: {
  label: string;
  count: number;
  active: boolean;
  onClick: () => void;
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`h-10 cursor-pointer rounded-lg !px-3 text-sm font-bold transition-all duration-200 ${
        active
          ? "bg-black text-white"
          : "bg-zinc-50 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-950"
      }`}
    >
      {label} <span className="opacity-70">{count}</span>
    </button>
  );
};

const OrderList = ({
  orders,
  selectedOrderId,
  searchTerm,
  isLoadingOrders,
  onSelectOrder,
  onRefresh,
}: {
  orders: AdminOrder[];
  selectedOrderId: string | null;
  searchTerm: string;
  isLoadingOrders: boolean;
  onSelectOrder: (orderId: string) => void;
  onRefresh: () => Promise<void>;
}) => {
  if (orders.length === 0) {
    return (
      <div className="!p-10 text-center">
        <Package className="mx-auto text-zinc-400" size={36} />
        <p className="!mt-3 text-sm font-bold text-zinc-700">
          Nenhum pedido encontrado.
        </p>
        {searchTerm && (
          <p className="!mt-1 text-xs text-zinc-500">
            Tente buscar por outro cliente, produto ou código.
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="overflow-hidden">
      <div className="hidden grid-cols-[1.1fr_1.3fr_0.8fr_0.9fr_0.8fr] border-b border-zinc-100 !px-4 !py-3 text-xs font-bold uppercase text-zinc-500 lg:grid">
        <span>Pedido</span>
        <span>Cliente</span>
        <span>Data</span>
        <span>Status</span>
        <span className="text-right">Total</span>
      </div>

      <div className="divide-y divide-zinc-100">
        {orders.map((order) => (
          <OrderRow
            key={order.id}
            order={order}
            isSelected={selectedOrderId === order.id}
            isLoadingOrders={isLoadingOrders}
            onSelect={() => onSelectOrder(order.id)}
            onRefresh={onRefresh}
          />
        ))}
      </div>
    </div>
  );
};

const OrderRow = ({
  order,
  isSelected,
  isLoadingOrders,
  onSelect,
  onRefresh,
}: {
  order: AdminOrder;
  isSelected: boolean;
  isLoadingOrders: boolean;
  onSelect: () => void;
  onRefresh: () => Promise<void>;
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <article
      className={`transition-all duration-200 ${
        isSelected ? "bg-zinc-50" : "bg-white"
      }`}
    >
      <button
        type="button"
        onClick={() => {
          onSelect();
          setIsExpanded((current) => !current);
        }}
        aria-expanded={isExpanded}
        className="grid w-full cursor-pointer grid-cols-1 !gap-3 !px-4 !py-4 text-left lg:grid-cols-[1.1fr_1.3fr_0.8fr_0.9fr_0.8fr] lg:items-center"
      >
        <div className="flex items-start !gap-2">
          <ChevronDown
            size={17}
            className={`!mt-0.5 shrink-0 text-zinc-400 transition-transform duration-200 ${
              isExpanded ? "rotate-180" : ""
            }`}
          />
          <div>
            <strong className="block text-sm text-zinc-950">{order.id}</strong>
            <span className="text-xs text-zinc-500">
              {getOrderItemsCount(order)} item
              {getOrderItemsCount(order) === 1 ? "" : "s"}
            </span>
          </div>
        </div>

        <div>
          <p className="text-sm font-bold text-zinc-800">
            {order.customer?.name || "Cliente sem nome"}
          </p>
          <p className="text-xs text-zinc-500">{order.customer?.email}</p>
        </div>

        <div className="grid grid-cols-2 !gap-3 rounded-lg bg-zinc-50 !p-3 lg:contents lg:bg-transparent lg:!p-0">
          <div className="lg:contents">
            <span className="block text-[10px] font-bold uppercase text-zinc-400 lg:hidden">
              Data
            </span>
            <span className="text-xs text-zinc-500">{getOrderDate(order)}</span>
          </div>

          <div className="lg:contents">
            <span className="block text-[10px] font-bold uppercase text-zinc-400 lg:hidden">
              Status
            </span>
            <OrderStatusBadge status={order.status} />
          </div>

          <div className="col-span-2 lg:contents">
            <span className="block text-[10px] font-bold uppercase text-zinc-400 lg:hidden">
              Total
            </span>
            <strong className="text-left text-sm text-zinc-950 lg:text-right">
              {formatPrice(order.total)}
            </strong>
          </div>
        </div>
      </button>

      {isExpanded && (
        <div className="border-t border-zinc-100 !px-4 !pb-4">
          <OrderCard order={order} onRefresh={onRefresh} />
          {isLoadingOrders && (
            <p className="!mt-2 text-xs text-zinc-400">
              Atualizando informações do pedido...
            </p>
          )}
        </div>
      )}
    </article>
  );
};

const OrderStatusBadge = ({ status }: { status: AdminOrder["status"] }) => {
  const isPaid = status === "paid";

  return (
    <span
      className={`inline-flex w-fit items-center !gap-1 rounded-full !px-2.5 !py-1 text-xs font-bold ${
        isPaid
          ? "bg-emerald-50 text-emerald-700"
          : "bg-amber-50 text-amber-700"
      }`}
    >
      {isPaid ? <CheckCircle2 size={13} /> : <Clock3 size={13} />}
      {isPaid ? "Pago" : "Não pago"}
    </span>
  );
};

const OrderDetailPanel = ({
  order,
  onRefresh,
}: {
  order: AdminOrder | null;
  onRefresh: () => Promise<void>;
}) => {
  if (!order) {
    return (
      <aside className="rounded-xl border border-zinc-200 bg-white !p-6 text-center shadow-sm">
        <Package className="mx-auto text-zinc-400" size={34} />
        <p className="!mt-3 text-sm font-bold text-zinc-700">
          Selecione um pedido
        </p>
        <p className="!mt-1 text-xs text-zinc-500">
          Os detalhes completos aparecem aqui.
        </p>
      </aside>
    );
  }

  return (
    <aside className="h-fit rounded-xl border border-zinc-200 bg-white !p-5 shadow-sm xl:sticky xl:top-24">
      <div className="flex items-start justify-between !gap-4">
        <div>
          <h2 className="font-[family-name:var(--font-bebas)] text-3xl text-zinc-950">
            Pedido {order.id}
          </h2>
          <p className="text-xs text-zinc-500">Realizado em {getOrderDate(order)}</p>
        </div>
        <OrderStatusBadge status={order.status} />
      </div>

      <div className="!mt-5 space-y-5">
        <DetailBlock title="Cliente">
          <p className="text-sm font-bold text-zinc-800">
            {order.customer?.name || "Cliente sem nome"}
          </p>
          <p className="text-xs text-zinc-500">{order.customer?.email}</p>
          <p className="text-xs text-zinc-500">{order.customer?.whatsapp}</p>
        </DetailBlock>

        <DetailBlock title="Endereço de entrega">
          <p className="text-xs text-zinc-600">{getAddressLine(order) || "-"}</p>
          <p className="text-xs text-zinc-600">{getCityLine(order) || "-"}</p>
          <p className="text-xs text-zinc-600">CEP: {order.customer?.cep || "-"}</p>
          <div className="!mt-3">
            <DeliveryStatusBadge
              status={order.deliveryStatus || "not_separated"}
            />
          </div>
          {order.customer?.notes && (
            <p className="text-xs text-zinc-500">
              Observações: {order.customer.notes}
            </p>
          )}
        </DetailBlock>

        <DetailBlock title="Itens do pedido">
          <ul className="flex flex-col !gap-3">
            {order.items.map((item, index) => (
              <li
                key={`${item.title}-${index}`}
                className="rounded-lg bg-zinc-50 !p-3 text-sm text-zinc-700"
              >
                <span className="font-bold text-zinc-900">
                  {item.quantity || 1}x {item.title}
                </span>
                <span className="block text-xs text-zinc-500">
                  Tamanho: {item.size || "M"}
                </span>
              </li>
            ))}
          </ul>
        </DetailBlock>

        <DetailBlock title="Pagamento">
          <div className="flex items-center justify-between text-sm">
            <span>Total</span>
            <strong>{formatPrice(order.total)}</strong>
          </div>
          {order.preferenceId && (
            <p className="!mt-2 break-all text-xs text-zinc-500">
              Preference: {order.preferenceId}
            </p>
          )}
          {order.paymentId && (
            <p className="!mt-1 break-all text-xs text-zinc-500">
              Pagamento: {order.paymentId}
            </p>
          )}
        </DetailBlock>

        {order.status === "unpaid" && (
          <OrderPaymentButton order={order} onRefresh={onRefresh} />
        )}
      </div>
    </aside>
  );
};

const DetailBlock = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => {
  return (
    <section className="border-t border-zinc-100 !pt-4">
      <p className="!mb-2 text-xs font-bold uppercase text-zinc-500">{title}</p>
      {children}
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
  return (
    <div className="!mt-3 rounded-lg border border-zinc-100 bg-white !p-3">
      <div className="rounded-lg bg-zinc-50 !p-3">
        <p className="text-xs font-bold uppercase text-zinc-500">Itens</p>
        <ul className="!mt-2 flex flex-col !gap-2">
          {order.items.map((item, index) => (
            <li key={index} className="text-sm text-zinc-700">
              {item.quantity || 1}x {item.title} - Tam. {item.size || "M"}
            </li>
          ))}
        </ul>
      </div>

      <div className="!mt-3 rounded-lg border border-zinc-100 bg-white !p-3">
        <p className="text-xs font-bold uppercase text-zinc-500">Endereço</p>
        <div className="!mt-2 flex flex-col !gap-1 text-xs text-zinc-600">
          <span>
            <strong className="text-zinc-700">CEP:</strong>{" "}
            {order.customer?.cep || "-"}
          </span>
          <span>
            <strong className="text-zinc-700">Rua:</strong>{" "}
            {getAddressLine(order) || "-"}
          </span>
          <span>
            <strong className="text-zinc-700">Bairro/Cidade:</strong>{" "}
            {getCityLine(order) || "-"}
          </span>
          {order.customer?.notes && (
            <span>
              <strong className="text-zinc-700">Observações:</strong>{" "}
              {order.customer.notes}
            </span>
          )}
          <div className="!mt-2">
            <DeliveryStatusBadge
              status={order.deliveryStatus || "not_separated"}
            />
          </div>
        </div>
      </div>

      <div className="!mt-3 grid grid-cols-1 !gap-2 text-xs text-zinc-500 sm:grid-cols-2">
        <span>
          <strong className="text-zinc-700">Criado:</strong>{" "}
          {getOrderDate(order)}
        </span>
        <span>
          <strong className="text-zinc-700">Cidade:</strong>{" "}
          {order.customer?.city || "-"} / {order.customer?.state || "-"}
        </span>
        {order.preferenceId && (
          <span className="break-all">
            <strong className="text-zinc-700">Preference:</strong>{" "}
            {order.preferenceId}
          </span>
        )}
        {order.paymentId && (
          <span className="break-all">
            <strong className="text-zinc-700">Pagamento:</strong>{" "}
            {order.paymentId}
          </span>
        )}
      </div>

      {order.status === "unpaid" && (
        <OrderPaymentButton order={order} onRefresh={onRefresh} />
      )}
    </div>
  );
};

const OrderPaymentButton = ({
  order,
  onRefresh,
}: {
  order: AdminOrder;
  onRefresh: () => Promise<void>;
}) => {
  const [isReconciling, setIsReconciling] = useState(false);

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
      toast.error("Não foi possível verificar o pagamento");
    } finally {
      setIsReconciling(false);
    }
  };

  return (
    <button
      type="button"
      onClick={reconcilePayment}
      disabled={isReconciling}
      className="!mt-4 inline-flex h-10 w-full cursor-pointer items-center justify-center !gap-2 rounded-lg bg-black !px-4 text-xs font-bold text-white transition-all duration-200 hover:bg-zinc-800 disabled:cursor-not-allowed disabled:bg-zinc-400"
    >
      <RefreshCw size={16} className={isReconciling ? "animate-spin" : ""} />
      VERIFICAR PAGAMENTO
    </button>
  );
};

const ClientsPanel = ({
  customers,
  visibleCustomers,
  isLoadingCustomers,
  onRefresh,
}: {
  customers: AdminCustomer[];
  visibleCustomers: AdminCustomer[];
  isLoadingCustomers: boolean;
  onRefresh: () => Promise<void>;
}) => {
  const customersWithOrders = customers.filter((customer) => {
    return customer.ordersCount > 0;
  }).length;
  const totalOrders = customers.reduce((total, customer) => {
    return total + customer.ordersCount;
  }, 0);
  const totalSpent = customers.reduce((total, customer) => {
    return total + customer.totalSpent;
  }, 0);

  return (
    <>
      <div className="flex flex-col !gap-1">
        <h1 className="font-[family-name:var(--font-bebas)] text-5xl text-zinc-950">
          Clientes
        </h1>
        <p className="text-sm text-zinc-500">
          Acompanhe contas cadastradas, contatos e historico de compras.
        </p>
      </div>

      <div className="grid grid-cols-2 !gap-3 xl:grid-cols-4">
        <MetricCard
          title="Clientes"
          value={String(customers.length)}
          helper="Contas registradas"
          icon={Users}
        />
        <MetricCard
          title="Com pedidos"
          value={String(customersWithOrders)}
          helper="Ja compraram ou tentaram comprar"
          icon={ShoppingBag}
          tone="success"
        />
        <MetricCard
          title="Pedidos"
          value={String(totalOrders)}
          helper="Total vinculado a clientes"
          icon={Package}
        />
        <MetricCard
          title="Faturamento"
          value={formatPrice(totalSpent)}
          helper="Pedidos pagos"
          icon={CircleDollarSign}
          tone="success"
        />
      </div>

      <section className="rounded-xl border border-zinc-200 bg-white shadow-sm">
        <div className="flex flex-col !gap-3 border-b border-zinc-100 !p-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-base font-bold">Lista de clientes</h2>
            <p className="text-xs text-zinc-500">
              Mostrando {visibleCustomers.length} de {customers.length} clientes.
            </p>
          </div>

          <button
            type="button"
            onClick={onRefresh}
            disabled={isLoadingCustomers}
            className="inline-flex h-10 cursor-pointer items-center justify-center !gap-2 rounded-lg border border-zinc-200 !px-3 text-xs font-bold transition-all duration-200 hover:border-black disabled:cursor-not-allowed disabled:opacity-60"
          >
            <RefreshCw
              size={16}
              className={isLoadingCustomers ? "animate-spin" : ""}
            />
            ATUALIZAR
          </button>
        </div>

        {isLoadingCustomers ? (
          <div className="grid grid-cols-1 !gap-3 !p-4 lg:grid-cols-2">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="h-44 animate-pulse rounded-xl bg-zinc-100"
              />
            ))}
          </div>
        ) : visibleCustomers.length === 0 ? (
          <div className="!p-10 text-center">
            <Users className="mx-auto text-zinc-400" size={38} />
            <p className="!mt-3 text-sm font-bold text-zinc-700">
              Nenhum cliente encontrado.
            </p>
            <p className="!mt-1 text-xs text-zinc-500">
              Assim que alguem entrar com Google ou finalizar uma compra, aparece aqui.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 !gap-3 !p-4 xl:grid-cols-2">
            {visibleCustomers.map((customer) => (
              <CustomerCard key={customer.id} customer={customer} />
            ))}
          </div>
        )}
      </section>
    </>
  );
};

const CustomerCard = ({ customer }: { customer: AdminCustomer }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const address = [customer.street, customer.number, customer.complement]
    .filter(Boolean)
    .join(", ");
  const cityLine = [
    customer.neighborhood,
    customer.city && customer.state && `${customer.city} / ${customer.state}`,
  ]
    .filter(Boolean)
    .join(" - ");

  return (
    <article className="rounded-xl border border-zinc-200 bg-white shadow-sm">
      <button
        type="button"
        onClick={() => setIsExpanded((current) => !current)}
        className="flex w-full cursor-pointer flex-col !gap-3 !p-4 text-left transition-all duration-200 hover:bg-zinc-50 sm:flex-row sm:items-start sm:justify-between"
      >
        <div className="flex min-w-0 items-start !gap-3">
          <ChevronDown
            size={18}
            className={`!mt-1 shrink-0 text-zinc-400 transition-transform duration-200 ${
              isExpanded ? "rotate-180" : ""
            }`}
          />
          <div className="min-w-0">
            <h3 className="truncate text-base font-bold text-zinc-950">
              {customer.name || "Cliente sem nome"}
            </h3>
            <p className="truncate text-sm text-zinc-500">
              {customer.email || "-"}
            </p>
            <p className="text-sm text-zinc-500">{customer.whatsapp || "-"}</p>
          </div>
        </div>

        <div className="text-left sm:text-right">
          <strong className="text-lg text-zinc-950">
            {formatPrice(customer.totalSpent)}
          </strong>
          <p className="text-xs font-bold text-emerald-600">
            {customer.paidOrdersCount} pedido
            {customer.paidOrdersCount === 1 ? "" : "s"} pago
            {customer.paidOrdersCount === 1 ? "" : "s"}
          </p>
        </div>
      </button>

      {isExpanded && (
        <div className="border-t border-zinc-100 !p-4">
          <div className="grid grid-cols-1 !gap-3 text-sm sm:grid-cols-2">
            <div className="rounded-lg bg-zinc-50 !p-3">
              <p className="text-xs font-bold uppercase text-zinc-500">
                Documento
              </p>
              <p className="!mt-1 font-medium text-zinc-800">
                CPF: {customer.cpf || "-"}
              </p>
            </div>
            <div className="rounded-lg bg-zinc-50 !p-3">
              <p className="text-xs font-bold uppercase text-zinc-500">
                Historico
              </p>
              <p className="!mt-1 font-medium text-zinc-800">
                {customer.ordersCount} pedido
                {customer.ordersCount === 1 ? "" : "s"} no total
              </p>
            </div>
          </div>

          <div className="!mt-3 rounded-lg border border-zinc-100 !p-3 text-sm">
            <p className="text-xs font-bold uppercase text-zinc-500">
              Endereco salvo
            </p>
            <p className="!mt-1 font-medium text-zinc-800">{address || "-"}</p>
            <p className="text-zinc-500">{cityLine || "-"}</p>
            <p className="text-zinc-500">CEP: {customer.cep || "-"}</p>
          </div>

          <div className="!mt-3 flex flex-wrap items-center justify-between !gap-3 border-t border-zinc-100 !pt-3 text-xs text-zinc-500">
            <span>ID: {customer.id}</span>
            <span>
              Ultimo pedido:{" "}
              {customer.lastOrderAt
                ? new Date(customer.lastOrderAt).toLocaleString("pt-BR")
                : "-"}
            </span>
          </div>
        </div>
      )}
    </article>
  );
};

const emptyProductForm: Product = {
  id: "",
  name: "",
  price: "R$ 0,00",
  image: "",
  images: [],
  category: "Camisas",
  team: "",
  brand: "",
  season: "24/25",
  description: "",
  details: [],
  badge: "NOVO",
  gender: "masculino",
  active: true,
  ownerType: "team",
  country: "",
};

const emptyMascotProductForm: Product = {
  ...emptyProductForm,
  category: "Bonecos de Mascote",
  brand: "",
  season: "",
  gender: "unissex",
  price: "R$ 129,90",
  badge: "MASCOTE",
  description:
    "Mascote colecionavel com acabamento premium, ideal para decorar o quarto, presentear ou levar a energia da arquibancada para sua colecao.",
  details: [
    "Produto colecionavel",
    "Acabamento premium",
    "Visual inspirado no clube ou selecao",
    "Ideal para decoracao ou presente",
  ],
};

const productGenderLabels: Record<NonNullable<Product["gender"]>, string> = {
  masculino: "Masculino",
  feminino: "Feminino",
  unissex: "Unissex",
};

const productOwnerLabels: Record<NonNullable<Product["ownerType"]>, string> = {
  team: "Time",
  selection: "Seleção",
};

const productImageBasePath = "/products/";
const mascotImageBasePath = "/products/mascotes/";

const getProductImageInputValue = (
  value?: string,
  basePath = productImageBasePath
) => {
  if (!value) return "";
  return value.startsWith(basePath)
    ? value.slice(basePath.length)
    : value;
};

const normalizeProductImagePath = (
  value: string,
  basePath = productImageBasePath
) => {
  const trimmedValue = value.trim();

  if (!trimmedValue) return "";

  if (trimmedValue.startsWith("/") || trimmedValue.startsWith("http")) {
    return trimmedValue;
  }

  return `${basePath}${trimmedValue}`;
};

const formatProductPriceInput = (value: string) => {
  const digits = value.replace(/\D/g, "");
  const cents = Number(digits || "0") / 100;

  return formatPrice(cents);
};

const productPriceGroupLabels: Record<ProductPriceGroup, string> = {
  shirts: "Camisas",
  retro: "Retrô",
  selections: "Seleções",
};

const isProductRetro = (product: Product) => {
  const searchableText = [
    product.id,
    product.name,
    product.category,
    product.season,
  ]
    .filter(Boolean)
    .join(" ")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();

  return searchableText.includes("retro");
};

const matchesProductPriceGroup = (
  product: Product,
  group: ProductPriceGroup
) => {
  if (group === "selections") return product.ownerType === "selection";
  if (group === "retro") return isProductRetro(product);

  return (product.ownerType || "team") === "team" && !isProductRetro(product);
};

const ProductsPanel = ({
  products: allProducts,
  visibleProducts,
  countries,
  countryFilter,
  ownerFilter,
  isLoadingProducts,
  onCountryFilterChange,
  onOwnerFilterChange,
  onRefresh,
}: {
  products: Product[];
  visibleProducts: Product[];
  countries: string[];
  countryFilter: string;
  ownerFilter: ProductOwnerFilter;
  isLoadingProducts: boolean;
  onCountryFilterChange: (country: string) => void;
  onOwnerFilterChange: (owner: ProductOwnerFilter) => void;
  onRefresh: () => Promise<void>;
}) => {
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isCreatingProduct, setIsCreatingProduct] = useState(false);
  const [newProductType, setNewProductType] = useState<"product" | "mascot">(
    "product"
  );
  const [isSavingProduct, setIsSavingProduct] = useState(false);
  const [isChangingStatus, setIsChangingStatus] = useState<string | null>(null);
  const [bulkPriceGroup, setBulkPriceGroup] =
    useState<ProductPriceGroup>("shirts");
  const [bulkPriceInput, setBulkPriceInput] = useState("");
  const [pendingBulkPriceUpdate, setPendingBulkPriceUpdate] =
    useState<PendingBulkPriceUpdate | null>(null);
  const [isUpdatingBulkPrice, setIsUpdatingBulkPrice] = useState(false);
  const [pendingDeleteProduct, setPendingDeleteProduct] =
    useState<Product | null>(null);
  const [isDeletingProduct, setIsDeletingProduct] = useState(false);
  const productFormRef = useRef<HTMLFormElement | null>(null);

  const activeProductsCount = allProducts.filter((product) => {
    return product.active !== false;
  }).length;
  const inactiveProductsCount = allProducts.length - activeProductsCount;
  const masculineProductsCount = allProducts.filter((product) => {
    return (
      (product.gender || "masculino") === "masculino" &&
      !isProductRetro(product) &&
      !isMascotProduct(product)
    );
  }).length;
  const feminineProductsCount = allProducts.filter((product) => {
    return (
      product.gender === "feminino" &&
      !isProductRetro(product) &&
      !isMascotProduct(product)
    );
  }).length;
  const retroProductsCount = allProducts.filter((product) => {
    return isProductRetro(product) && !isMascotProduct(product);
  }).length;
  const mascotProductsCount = allProducts.filter((product) => {
    return isMascotProduct(product);
  }).length;
  const bulkPriceTargetCount = allProducts.filter((product) => {
    return matchesProductPriceGroup(product, bulkPriceGroup);
  }).length;

  const handleEditProduct = (product: Product) => {
    setIsCreatingProduct(false);
    setNewProductType("product");
    setEditingProduct(product);
    window.requestAnimationFrame(() => {
      productFormRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    });
  };

  const toggleStatus = async (product: Product) => {
    setIsChangingStatus(product.id);

    try {
      const response = await fetch("/api/admin/products", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: product.id,
          active: product.active === false,
        }),
      });
      const data = (await response.json()) as { error?: string };

      if (!response.ok) {
        toast.error(data.error || "Não foi possível alterar o produto");
        return;
      }

      toast.success(
        product.active === false ? "Produto ativado" : "Produto inativado"
      );
      await onRefresh();
    } finally {
      setIsChangingStatus(null);
    }
  };

  const saveProduct = async (product: Product) => {
    setIsSavingProduct(true);

    try {
      const response = await fetch("/api/admin/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(
          editingProduct
            ? {
                product,
                originalId: editingProduct.id,
              }
            : product
        ),
      });
      const data = (await response.json()) as { error?: string };

      if (!response.ok) {
        toast.error(data.error || "Não foi possível salvar o produto");
        return;
      }

      toast.success(editingProduct ? "Produto atualizado" : "Produto criado");
      setEditingProduct(null);
      setIsCreatingProduct(false);
      await onRefresh();
    } finally {
      setIsSavingProduct(false);
    }
  };

  const requestBulkPriceUpdate = () => {
    const priceNumber = getPriceNumber(bulkPriceInput);

    if (!Number.isFinite(priceNumber) || priceNumber <= 0) {
      toast.error("Informe um preço válido em reais");
      return;
    }

    if (bulkPriceTargetCount === 0) {
      toast.error("Nenhum produto encontrado para esse grupo");
      return;
    }

    setPendingBulkPriceUpdate({
      group: bulkPriceGroup,
      price: formatPrice(priceNumber),
      count: bulkPriceTargetCount,
    });
  };

  const confirmBulkPriceUpdate = async () => {
    if (!pendingBulkPriceUpdate) return;

    setIsUpdatingBulkPrice(true);

    try {
      const response = await fetch("/api/admin/products", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "bulk-price",
          group: pendingBulkPriceUpdate.group,
          price: pendingBulkPriceUpdate.price,
        }),
      });
      const data = (await response.json()) as {
        error?: string;
        updatedCount?: number;
      };

      if (!response.ok) {
        toast.error(data.error || "Não foi possível atualizar os preços");
        return;
      }

      toast.success(
        `${data.updatedCount || pendingBulkPriceUpdate.count} produtos atualizados`
      );
      setBulkPriceInput("");
      setPendingBulkPriceUpdate(null);
      await onRefresh();
    } finally {
      setIsUpdatingBulkPrice(false);
    }
  };

  const deleteSelectedProduct = async () => {
    if (!pendingDeleteProduct) return;

    setIsDeletingProduct(true);

    try {
      const response = await fetch("/api/admin/products", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: pendingDeleteProduct.id,
        }),
      });
      const data = (await response.json()) as { error?: string };

      if (!response.ok) {
        toast.error(data.error || "NÃ£o foi possÃ­vel excluir o produto");
        return;
      }

      toast.success("Produto excluÃ­do");
      setPendingDeleteProduct(null);

      if (editingProduct?.id === pendingDeleteProduct.id) {
        setEditingProduct(null);
        setIsCreatingProduct(false);
      }

      await onRefresh();
    } finally {
      setIsDeletingProduct(false);
    }
  };

  return (
    <section className="flex flex-col !gap-5">
      <div className="flex flex-col !gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="font-[family-name:var(--font-bebas)] text-5xl text-zinc-950">
            Produtos
          </h1>
          <p className="text-sm text-zinc-500">
            Cadastre, organize imagens e controle quais produtos aparecem na loja.
          </p>
        </div>

        <div className="flex flex-col !gap-2 sm:flex-row">
          <button
            type="button"
            onClick={() => {
              setEditingProduct(null);
              setNewProductType("product");
              setIsCreatingProduct((current) =>
                newProductType === "product" ? !current : true
              );
              window.requestAnimationFrame(() => {
                productFormRef.current?.scrollIntoView({
                  behavior: "smooth",
                  block: "start",
                });
              });
            }}
            className="inline-flex h-11 cursor-pointer items-center justify-center !gap-2 rounded-lg bg-black !px-4 text-sm font-bold text-white transition-all duration-200 hover:bg-zinc-800"
          >
            <Plus size={17} />
            NOVO PRODUTO
          </button>

          <button
            type="button"
            onClick={() => {
              setEditingProduct(null);
              setNewProductType("mascot");
              setIsCreatingProduct(true);
              window.requestAnimationFrame(() => {
                productFormRef.current?.scrollIntoView({
                  behavior: "smooth",
                  block: "start",
                });
              });
            }}
            className="inline-flex h-11 cursor-pointer items-center justify-center !gap-2 rounded-lg border border-zinc-200 bg-white !px-4 text-sm font-bold text-zinc-950 transition-all duration-200 hover:border-black"
          >
            <Plus size={17} />
            NOVO MASCOTE
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 !gap-3 xl:grid-cols-4">
        <MetricCard
          title="Total de produtos"
          value={String(allProducts.length)}
          helper="Cadastrados"
          icon={Package}
        />
        <MetricCard
          title="Ativos"
          value={String(activeProductsCount)}
          helper="Aparecem na loja"
          icon={CheckCircle2}
          tone="success"
        />
        <MetricCard
          title="Inativos"
          value={String(inactiveProductsCount)}
          helper="Ocultos da loja"
          icon={Clock3}
        />
        <MetricCard
          title="Países"
          value={String(countries.length)}
          helper="Times e seleções"
          icon={Store}
        />
      </div>

      {(isCreatingProduct || editingProduct) && (
        <ProductCreateForm
          key={editingProduct?.id || `new-${newProductType}`}
          ref={productFormRef}
          product={editingProduct}
          type={newProductType}
          isSaving={isSavingProduct}
          onCancel={() => {
            setEditingProduct(null);
            setIsCreatingProduct(false);
          }}
          onSave={saveProduct}
        />
      )}

      <div className="rounded-xl border border-zinc-200 bg-white !p-5 shadow-sm">
        <div className="flex flex-col !gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h2 className="font-[family-name:var(--font-bebas)] text-4xl text-zinc-950">
              Preços em massa
            </h2>
            <p className="text-sm text-zinc-500">
              Atualize o preço de camisas, retrôs ou seleções sem editar produto por produto.
            </p>
          </div>

          <div className="grid grid-cols-1 !gap-3 sm:grid-cols-[220px_180px_auto]">
            <AdminSelectField
              label="Grupo"
              value={bulkPriceGroup}
              options={[
                ["shirts", "Camisas"],
                ["retro", "Retrô"],
                ["selections", "Seleções"],
              ]}
              onChange={(value) =>
                setBulkPriceGroup(value as ProductPriceGroup)
              }
            />
            <AdminTextField
              label="Novo preço"
              value={bulkPriceInput}
              onChange={(value) =>
                setBulkPriceInput(formatProductPriceInput(value))
              }
              placeholder="R$ 189,90"
            />
            <button
              type="button"
              onClick={requestBulkPriceUpdate}
              className="inline-flex h-12 cursor-pointer items-center justify-center !gap-2 self-end rounded-lg bg-black !px-5 text-sm font-bold text-white transition-all duration-200 hover:bg-zinc-800"
            >
              <CircleDollarSign size={18} />
              APLICAR PREÇO
            </button>
          </div>
        </div>

        <div className="!mt-4 grid grid-cols-1 !gap-3 text-sm text-zinc-600 md:grid-cols-3">
          {(Object.keys(productPriceGroupLabels) as ProductPriceGroup[]).map(
            (group) => {
              const count = allProducts.filter((product) =>
                matchesProductPriceGroup(product, group)
              ).length;

              return (
                <button
                  key={group}
                  type="button"
                  onClick={() => setBulkPriceGroup(group)}
                  className={`cursor-pointer rounded-lg border !p-3 text-left transition-all duration-200 ${
                    bulkPriceGroup === group
                      ? "border-black bg-zinc-950 text-white"
                      : "border-zinc-200 bg-zinc-50 hover:border-black"
                  }`}
                >
                  <span className="block text-xs font-bold uppercase">
                    {productPriceGroupLabels[group]}
                  </span>
                  <strong className="!mt-1 block text-lg">{count}</strong>
                  <span className="text-xs opacity-75">produtos afetados</span>
                </button>
              );
            }
          )}
        </div>
      </div>

      <div className="rounded-xl border border-zinc-200 bg-white !p-5 shadow-sm">
        <div className="flex flex-col !gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap items-center !gap-2">
            <button
              type="button"
              onClick={() => onOwnerFilterChange("all")}
              className={`h-10 cursor-pointer rounded-lg !px-3 text-sm font-bold ${
                ownerFilter === "all"
                  ? "bg-black text-white"
                  : "bg-zinc-50 text-zinc-500"
              }`}
            >
              Todos {allProducts.length}
            </button>
            <button
              type="button"
              onClick={() => onOwnerFilterChange("masculino")}
              className={`h-10 cursor-pointer rounded-lg !px-3 text-sm font-bold ${
                ownerFilter === "masculino"
                  ? "bg-black text-white"
                  : "bg-zinc-50 text-zinc-500"
              }`}
            >
              Masculino {masculineProductsCount}
            </button>
            <button
              type="button"
              onClick={() => onOwnerFilterChange("feminino")}
              className={`h-10 cursor-pointer rounded-lg !px-3 text-sm font-bold ${
                ownerFilter === "feminino"
                  ? "bg-black text-white"
                  : "bg-zinc-50 text-zinc-500"
              }`}
            >
              Feminino {feminineProductsCount}
            </button>
            <button
              type="button"
              onClick={() => onOwnerFilterChange("retro")}
              className={`h-10 cursor-pointer rounded-lg !px-3 text-sm font-bold ${
                ownerFilter === "retro"
                  ? "bg-black text-white"
                  : "bg-zinc-50 text-zinc-500"
              }`}
            >
              Retrô {retroProductsCount}
            </button>
            <button
              type="button"
              onClick={() => onOwnerFilterChange("mascote")}
              className={`h-10 cursor-pointer rounded-lg !px-3 text-sm font-bold ${
                ownerFilter === "mascote"
                  ? "bg-black text-white"
                  : "bg-zinc-50 text-zinc-500"
              }`}
            >
              Mascotes {mascotProductsCount}
            </button>
            <select
              value={countryFilter}
              onChange={(event) => onCountryFilterChange(event.target.value)}
              className="h-10 cursor-pointer rounded-lg border border-zinc-200 !px-3 text-sm font-bold outline-none focus:border-black"
            >
              <option value="all">Filtrar por país</option>
              {countries.map((country) => (
                <option key={country} value={country}>
                  {country}
                </option>
              ))}
            </select>
          </div>

          <button
            type="button"
            onClick={onRefresh}
            disabled={isLoadingProducts}
            className="inline-flex h-10 cursor-pointer items-center justify-center !gap-2 rounded-lg border border-zinc-200 !px-3 text-xs font-bold transition-all duration-200 hover:border-black disabled:cursor-not-allowed disabled:opacity-60"
          >
            <RefreshCw
              size={16}
              className={isLoadingProducts ? "animate-spin" : ""}
            />
            ATUALIZAR
          </button>
        </div>

        <div className="!mt-4 overflow-hidden rounded-lg border border-zinc-100">
          {visibleProducts.length === 0 ? (
            <div className="!p-8 text-center text-sm text-zinc-500">
              Nenhum produto encontrado.
            </div>
          ) : (
            <div className="divide-y divide-zinc-100">
              {visibleProducts.map((product) => (
                <div
                  key={product.id}
                  className="grid grid-cols-1 !gap-4 !p-4 lg:grid-cols-[96px_1fr_auto]"
                >
                  <div className="relative h-24 overflow-hidden rounded-lg bg-zinc-100">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      sizes="96px"
                      className="object-cover"
                    />
                  </div>

                  <div>
                    <div className="flex flex-wrap items-center !gap-2">
                      <h3 className="font-bold">{product.name}</h3>
                      <span
                        className={`rounded-full !px-2 !py-1 text-[11px] font-bold ${
                          product.active === false
                            ? "bg-zinc-100 text-zinc-500"
                            : "bg-emerald-50 text-emerald-700"
                        }`}
                      >
                        {product.active === false ? "Inativo" : "Ativo"}
                      </span>
                    </div>
                    <p className="!mt-1 text-sm text-zinc-500">
                      {product.team} • {product.country || "Sem país"} •{" "}
                      {productGenderLabels[product.gender || "masculino"]} •{" "}
                      {productOwnerLabels[product.ownerType || "team"]}
                    </p>
                    <p className="!mt-1 text-sm font-bold">{product.price}</p>
                    <p className="!mt-1 break-all text-xs text-zinc-500">
                      {product.image}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center !gap-2 lg:justify-end">
                    <button
                      type="button"
                      onClick={() => handleEditProduct(product)}
                      className="inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg border border-zinc-200"
                      aria-label="Editar produto"
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      type="button"
                      onClick={() => void toggleStatus(product)}
                      disabled={isChangingStatus === product.id}
                      className={`inline-flex h-10 cursor-pointer items-center justify-center rounded-lg !px-3 text-xs font-bold disabled:cursor-not-allowed disabled:opacity-60 ${
                        product.active === false
                          ? "border border-emerald-200 text-emerald-700"
                          : "border border-zinc-200 text-zinc-700"
                      }`}
                    >
                      {isChangingStatus === product.id
                        ? "Salvando..."
                        : product.active === false
                          ? "Ativar"
                          : "Inativar"}
                    </button>
                    <button
                      type="button"
                      onClick={() => setPendingDeleteProduct(product)}
                      className="inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg border border-red-100 text-red-500 transition-all duration-200 hover:border-red-500"
                      aria-label="Excluir produto"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {pendingBulkPriceUpdate && (
        <BulkPriceConfirmModal
          update={pendingBulkPriceUpdate}
          isUpdating={isUpdatingBulkPrice}
          onCancel={() => setPendingBulkPriceUpdate(null)}
          onConfirm={confirmBulkPriceUpdate}
        />
      )}

      {pendingDeleteProduct && (
        <DeleteProductModal
          product={pendingDeleteProduct}
          isDeleting={isDeletingProduct}
          onCancel={() => setPendingDeleteProduct(null)}
          onConfirm={deleteSelectedProduct}
        />
      )}
    </section>
  );
};

const BulkPriceConfirmModal = ({
  update,
  isUpdating,
  onCancel,
  onConfirm,
}: {
  update: PendingBulkPriceUpdate;
  isUpdating: boolean;
  onCancel: () => void;
  onConfirm: () => Promise<void>;
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 !p-4">
      <section className="w-full max-w-md rounded-xl border border-zinc-200 bg-white !p-5 shadow-2xl">
        <div className="flex items-start !gap-4">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-zinc-100 text-zinc-950">
            <CircleDollarSign size={20} />
          </span>
          <div>
            <h2 className="font-[family-name:var(--font-bebas)] text-3xl leading-none text-zinc-950">
              Alterar preços
            </h2>
            <p className="!mt-2 text-sm leading-relaxed text-zinc-600">
              Tem certeza que deseja alterar{" "}
              <strong className="text-zinc-950">{update.count}</strong>{" "}
              produtos do grupo{" "}
              <strong className="text-zinc-950">
                {productPriceGroupLabels[update.group]}
              </strong>{" "}
              para{" "}
              <strong className="text-zinc-950">{update.price}</strong>?
            </p>
          </div>
        </div>

        <div className="!mt-5 rounded-lg bg-zinc-50 !p-3 text-xs text-zinc-600">
          Essa ação atualiza o valor exibido na loja, carrinho, checkout e páginas
          de produto para todos os itens desse grupo.
        </div>

        <div className="!mt-6 flex flex-col-reverse !gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onCancel}
            disabled={isUpdating}
            className="h-11 cursor-pointer rounded-lg border border-zinc-200 !px-5 text-sm font-bold transition-all duration-200 hover:border-black disabled:cursor-not-allowed disabled:opacity-60"
          >
            CANCELAR
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isUpdating}
            className="inline-flex h-11 cursor-pointer items-center justify-center !gap-2 rounded-lg bg-black !px-5 text-sm font-bold text-white transition-all duration-200 hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isUpdating && <RefreshCw size={16} className="animate-spin" />}
            ALTERAR PREÇOS
          </button>
        </div>
      </section>
    </div>
  );
};

const DeleteProductModal = ({
  product,
  isDeleting,
  onCancel,
  onConfirm,
}: {
  product: Product;
  isDeleting: boolean;
  onCancel: () => void;
  onConfirm: () => Promise<void>;
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 !p-4">
      <section className="w-full max-w-md rounded-xl border border-zinc-200 bg-white !p-5 shadow-2xl">
        <div className="flex items-start !gap-4">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-red-50 text-red-600">
            <Trash2 size={20} />
          </span>
          <div>
            <h2 className="font-[family-name:var(--font-bebas)] text-3xl leading-none text-zinc-950">
              Excluir produto
            </h2>
            <p className="!mt-2 text-sm leading-relaxed text-zinc-600">
              Tem certeza que deseja excluir{" "}
              <strong className="text-zinc-950">{product.name}</strong>? Essa
              aÃ§Ã£o remove o produto do catÃ¡logo e nÃ£o pode ser desfeita.
            </p>
          </div>
        </div>

        <div className="!mt-5 rounded-lg bg-zinc-50 !p-3 text-xs text-zinc-600">
          Para apenas esconder o produto da loja, use a opÃ§Ã£o inativar.
          Excluir deve ser usado para cadastros errados ou produtos que nÃ£o
          devem mais existir no catÃ¡logo.
        </div>

        <div className="!mt-6 flex flex-col-reverse !gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onCancel}
            disabled={isDeleting}
            className="h-11 cursor-pointer rounded-lg border border-zinc-200 !px-5 text-sm font-bold transition-all duration-200 hover:border-black disabled:cursor-not-allowed disabled:opacity-60"
          >
            CANCELAR
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isDeleting}
            className="inline-flex h-11 cursor-pointer items-center justify-center !gap-2 rounded-lg bg-red-600 !px-5 text-sm font-bold text-white transition-all duration-200 hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isDeleting && <RefreshCw size={16} className="animate-spin" />}
            EXCLUIR PRODUTO
          </button>
        </div>
      </section>
    </div>
  );
};

const ProductCreateForm = forwardRef<HTMLFormElement, {
  product?: Product | null;
  type?: "product" | "mascot";
  isSaving: boolean;
  onCancel: () => void;
  onSave: (product: Product) => Promise<void>;
}>(({
  product,
  type = "product",
  isSaving,
  onCancel,
  onSave,
}, ref) => {
  const initialProduct =
    product || (type === "mascot" ? emptyMascotProductForm : emptyProductForm);
  const isMascotForm =
    type === "mascot" || Boolean(product && isMascotProduct(product));
  const imageBasePath = isMascotForm ? mascotImageBasePath : productImageBasePath;
  const [formData, setFormData] = useState<Product>(initialProduct);
  const [imageInput, setImageInput] = useState(
    getProductImageInputValue(initialProduct.image, imageBasePath)
  );
  const [imagesInput, setImagesInput] = useState(
    initialProduct.images
      ?.map((image) => getProductImageInputValue(image, imageBasePath))
      .join("\n") || ""
  );
  const [detailsInput, setDetailsInput] = useState(
    initialProduct.details?.join("\n") || ""
  );

  const updateFormField = <Key extends keyof Product>(
    key: Key,
    value: Product[Key]
  ) => {
    setFormData((current) => ({ ...current, [key]: value }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const priceNumber = getPriceNumber(formData.price);

    if (!Number.isFinite(priceNumber) || priceNumber <= 0) {
      toast.error("Informe um preço válido em reais");
      return;
    }

    const image = normalizeProductImagePath(imageInput, imageBasePath);
    const images = imagesInput
      .split(/\n|,/)
      .map((galleryImage) =>
        normalizeProductImagePath(galleryImage, imageBasePath)
      )
      .filter(Boolean);
    const details = detailsInput
      .split("\n")
      .map((detail) => detail.trim())
      .filter(Boolean);

    await onSave({
      ...formData,
      id: formData.id.trim(),
      price: formatPrice(priceNumber),
      brand: isMascotForm ? undefined : formData.brand,
      season: isMascotForm ? undefined : formData.season,
      image,
      images: images.length > 0 ? images : [image],
      details,
      active: formData.active !== false,
    });
  };

  return (
    <form
      ref={ref}
      onSubmit={handleSubmit}
      className="scroll-mt-24 rounded-xl border border-zinc-200 bg-white !p-5 shadow-sm"
    >
      <div className="flex items-start justify-between !gap-4">
        <div>
          <h2 className="font-[family-name:var(--font-bebas)] text-4xl">
            {product ? "Editar produto" : type === "mascot" ? "Novo mascote" : "Novo produto"}
          </h2>
          <p className="text-sm text-zinc-500">
            {isMascotForm
              ? "Use imagens em mascotes. Ex: galo-doido.png."
              : "Use pastas por time ou selecao. Ex: teams/flamengo/flamengo-home.png."}
          </p>
        </div>

        <button
          type="button"
          onClick={onCancel}
          className="h-10 cursor-pointer rounded-lg border border-zinc-200 !px-4 text-xs font-bold"
        >
          Cancelar
        </button>
      </div>

      <div className="!mt-5 grid grid-cols-1 !gap-4 lg:grid-cols-4">
        <AdminTextField
          label="ID / rota"
          value={formData.id}
          onChange={(value) => updateFormField("id", value)}
          placeholder="camisa-flamengo-home-24-25"
        />
        <AdminTextField
          label="Nome"
          value={formData.name}
          onChange={(value) => updateFormField("name", value)}
        />
        <AdminTextField
          label="Preço"
          value={String(formData.price)}
          onChange={(value) =>
            updateFormField("price", formatProductPriceInput(value))
          }
          placeholder="R$ 189,90"
        />
        <AdminTextField
          label="Categoria"
          value={formData.category}
          onChange={(value) => updateFormField("category", value)}
        />
        <AdminTextField
          label="Time/Seleção"
          value={formData.team}
          onChange={(value) => updateFormField("team", value)}
        />
        <AdminTextField
          label="País"
          value={formData.country || ""}
          onChange={(value) => updateFormField("country", value)}
          placeholder="Brasil"
        />
        <AdminSelectField
          label="Dono"
          value={formData.ownerType || "team"}
          options={[
            ["team", "Time"],
            ["selection", "Seleção"],
          ]}
          onChange={(value) =>
            updateFormField("ownerType", value as Product["ownerType"])
          }
        />
        {!isMascotForm && (
          <>
            <AdminSelectField
              label="Linha"
              value={formData.gender || "masculino"}
              options={[
                ["masculino", "Masculino"],
                ["feminino", "Feminino"],
                ["unissex", "Unissex"],
              ]}
              onChange={(value) =>
                updateFormField("gender", value as Product["gender"])
              }
            />
            <AdminTextField
              label="Marca"
              value={formData.brand || ""}
              onChange={(value) => updateFormField("brand", value)}
              placeholder="Adidas"
            />
            <AdminTextField
              label="Temporada"
              value={formData.season || ""}
              onChange={(value) => updateFormField("season", value)}
              placeholder="24/25"
            />
          </>
        )}
        <AdminTextField
          label="Badge"
          value={formData.badge || ""}
          onChange={(value) => updateFormField("badge", value)}
          placeholder="NOVO"
        />
        <label className="flex h-[74px] items-center !gap-3 rounded-lg border border-zinc-200 !px-4 text-sm font-bold">
          <input
            type="checkbox"
            checked={formData.active !== false}
            onChange={(event) => updateFormField("active", event.target.checked)}
            className="h-4 w-4 accent-black"
          />
          Ativo
        </label>
        <div className="lg:col-span-2">
          <AdminTextField
            label="Imagem principal"
            value={imageInput}
            onChange={setImageInput}
            prefix={imageBasePath}
            placeholder={
              isMascotForm ? "galo-doido.png" : "teams/flamengo/flamengo-home.png"
            }
          />
        </div>
        <label className="flex flex-col !gap-2 text-xs font-bold uppercase text-zinc-500 lg:col-span-2">
          Galeria de imagens
          <textarea
            value={imagesInput}
            onChange={(event) => setImagesInput(event.target.value)}
            placeholder={
              isMascotForm
                ? "galo-doido-frente.png\ngalo-doido-costas.png"
                : "teams/flamengo/frente.png\nteams/flamengo/costas.png"
            }
            className="min-h-24 rounded-lg border border-zinc-200 !p-3 text-sm font-semibold normal-case text-zinc-950 outline-none focus:border-black"
          />
        </label>
        <label className="flex flex-col !gap-2 text-xs font-bold uppercase text-zinc-500 lg:col-span-2">
          Descrição
          <textarea
            value={formData.description}
            onChange={(event) =>
              updateFormField("description", event.target.value)
            }
            className="min-h-24 rounded-lg border border-zinc-200 !p-3 text-sm font-semibold normal-case text-zinc-950 outline-none focus:border-black"
          />
        </label>
        <label className="flex flex-col !gap-2 text-xs font-bold uppercase text-zinc-500 lg:col-span-2">
          Detalhes
          <textarea
            value={detailsInput}
            onChange={(event) => setDetailsInput(event.target.value)}
            placeholder={"Escudo aplicado no peito\nTecido confortável"}
            className="min-h-24 rounded-lg border border-zinc-200 !p-3 text-sm font-semibold normal-case text-zinc-950 outline-none focus:border-black"
          />
        </label>
        <button
          type="submit"
          disabled={isSaving}
          className="h-[74px] cursor-pointer rounded-lg bg-black text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-60 lg:col-span-4"
        >
          {isSaving ? "Salvando..." : "Salvar produto"}
        </button>
      </div>
    </form>
  );
});

ProductCreateForm.displayName = "ProductCreateForm";

const emptyBannerForm: Omit<StoreBanner, "id"> = {
  name: "",
  page: "home",
  position: "hero",
  desktopImageUrl: "",
  mobileImageUrl: "",
  title: "",
  description: "",
  linkUrl: "",
  isActive: true,
  sortOrder: 1,
  startsAt: "",
  endsAt: "",
};

const bannerAssetBasePath = "/assets/banner/";

const getBannerImageInputValue = (imageUrl?: string) => {
  if (!imageUrl) return "";

  return imageUrl.startsWith(bannerAssetBasePath)
    ? imageUrl.replace(bannerAssetBasePath, "")
    : imageUrl;
};

const resolveBannerImageUrl = (imageUrl?: string) => {
  const trimmedImageUrl = imageUrl?.trim();

  if (!trimmedImageUrl) return "";

  if (
    trimmedImageUrl.startsWith("/") ||
    trimmedImageUrl.startsWith("http://") ||
    trimmedImageUrl.startsWith("https://")
  ) {
    return trimmedImageUrl;
  }

  return `${bannerAssetBasePath}${trimmedImageUrl}`;
};

const BannersPanel = ({
  banners,
  visibleBanners,
  isLoadingBanners,
  onRefresh,
}: {
  banners: StoreBanner[];
  visibleBanners: StoreBanner[];
  isLoadingBanners: boolean;
  onRefresh: () => Promise<void>;
}) => {
  const [editingBanner, setEditingBanner] = useState<StoreBanner | null>(null);
  const [formData, setFormData] = useState<Omit<StoreBanner, "id">>(
    emptyBannerForm
  );
  const [isSaving, setIsSaving] = useState(false);
  const bannerFormRef = useRef<HTMLFormElement | null>(null);

  const activeBanners = banners.filter((banner) => banner.isActive);
  const homeHeroBanners = banners.filter((banner) => {
    return banner.page === "home" && banner.position === "hero";
  });

  const fillForm = (banner: StoreBanner | null) => {
    setEditingBanner(banner);
    setFormData(
      banner
        ? {
            name: banner.name,
            page: banner.page,
            position: banner.position,
            desktopImageUrl: getBannerImageInputValue(banner.desktopImageUrl),
            mobileImageUrl: getBannerImageInputValue(banner.mobileImageUrl),
            title: banner.title || "",
            description: banner.description || "",
            linkUrl: banner.linkUrl || "",
            isActive: banner.isActive,
            sortOrder: banner.sortOrder,
            startsAt: banner.startsAt || "",
            endsAt: banner.endsAt || "",
          }
        : emptyBannerForm
    );
  };

  const handleEditBanner = (banner: StoreBanner) => {
    fillForm(banner);

    window.requestAnimationFrame(() => {
      bannerFormRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    });
  };

  const updateFormField = <Key extends keyof Omit<StoreBanner, "id">>(
    key: Key,
    value: Omit<StoreBanner, "id">[Key]
  ) => {
    setFormData((currentData) => ({
      ...currentData,
      [key]: value,
    }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSaving(true);

    try {
      const response = await fetch("/api/admin/banners", {
        method: editingBanner ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          id: editingBanner?.id,
          desktopImageUrl: resolveBannerImageUrl(formData.desktopImageUrl),
          mobileImageUrl: resolveBannerImageUrl(formData.mobileImageUrl),
          sortOrder: Number(formData.sortOrder || 0),
        }),
      });
      const data = (await response.json()) as { error?: string };

      if (!response.ok) {
        toast.error(data.error || "Não foi possível salvar o banner");
        return;
      }

      toast.success(editingBanner ? "Banner atualizado" : "Banner criado");
      fillForm(null);
      await onRefresh();
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (banner: StoreBanner) => {
    const confirmed = window.confirm(
      `Remover o banner ${banner.name}? Essa ação não pode ser desfeita.`
    );

    if (!confirmed) return;

    const response = await fetch("/api/admin/banners", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id: banner.id }),
    });
    const data = (await response.json()) as { error?: string };

    if (!response.ok) {
      toast.error(data.error || "Não foi possível remover o banner");
      return;
    }

    toast.success("Banner removido");
    await onRefresh();
  };

  return (
    <section className="flex flex-col !gap-5">
      <div className="flex flex-col !gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-[family-name:var(--font-bebas)] text-5xl">
            Banners
          </h1>
          <p className="text-sm text-zinc-500">
            Controle quais imagens aparecem nas páginas da loja.
          </p>
        </div>

        <button
          type="button"
          onClick={() => fillForm(null)}
          className="inline-flex h-11 cursor-pointer items-center justify-center !gap-2 rounded-lg bg-black !px-4 text-sm font-bold text-white"
        >
          <Plus size={16} />
          Novo banner
        </button>
      </div>

      <div className="grid grid-cols-1 !gap-4 md:grid-cols-3">
        <MetricCard
          title="Total de banners"
          value={String(banners.length)}
          helper="Banners cadastrados"
          icon={ImageIcon}
        />
        <MetricCard
          title="Banners ativos"
          value={String(activeBanners.length)}
          helper="Disponíveis no site"
          icon={CheckCircle2}
          tone="success"
        />
        <MetricCard
          title="Home hero"
          value={String(homeHeroBanners.length)}
          helper="Slides no carrossel inicial"
          icon={LayoutDashboard}
        />
      </div>

      <form
        ref={bannerFormRef}
        onSubmit={handleSubmit}
        className="scroll-mt-24 rounded-xl border border-zinc-200 bg-white !p-5 shadow-sm"
      >
        <div className="flex items-start justify-between !gap-4">
          <div>
            <h2 className="font-[family-name:var(--font-bebas)] text-4xl">
              {editingBanner ? "Editar banner" : "Novo banner"}
            </h2>
            <p className="text-sm text-zinc-500">
              Use URLs do public, Supabase Storage ou qualquer imagem pública.
            </p>
          </div>

          {editingBanner && (
            <button
              type="button"
              onClick={() => fillForm(null)}
              className="h-10 cursor-pointer rounded-lg border border-zinc-200 !px-4 text-xs font-bold"
            >
              Cancelar
            </button>
          )}
        </div>

        <div className="!mt-5 grid grid-cols-1 !gap-4 lg:grid-cols-4">
          <AdminTextField
            label="Nome"
            value={formData.name}
            onChange={(value) => updateFormField("name", value)}
          />
          <AdminSelectField
            label="Página"
            value={formData.page}
            options={bannerPageOptions}
            onChange={(value) => updateFormField("page", value as BannerPage)}
          />
          <AdminSelectField
            label="Posição"
            value={formData.position}
            options={bannerPositionOptions}
            onChange={(value) =>
              updateFormField("position", value as BannerPosition)
            }
          />
          <AdminTextField
            label="Ordem"
            type="number"
            value={String(formData.sortOrder)}
            onChange={(value) => updateFormField("sortOrder", Number(value))}
          />
          <div className="lg:col-span-2">
            <AdminTextField
              label="Imagem desktop"
              value={formData.desktopImageUrl}
              onChange={(value) => updateFormField("desktopImageUrl", value)}
              placeholder="BannerHome.png"
              prefix={bannerAssetBasePath}
            />
          </div>
          <div className="lg:col-span-2">
            <AdminTextField
              label="Imagem mobile"
              value={formData.mobileImageUrl || ""}
              onChange={(value) => updateFormField("mobileImageUrl", value)}
              placeholder="Opcional, ex: BannerHome-mobile.png"
              prefix={bannerAssetBasePath}
            />
          </div>
          <AdminTextField
            label="Título"
            value={formData.title || ""}
            onChange={(value) => updateFormField("title", value)}
          />
          <AdminTextField
            label="Descrição"
            value={formData.description || ""}
            onChange={(value) => updateFormField("description", value)}
          />
          <AdminTextField
            label="Link"
            value={formData.linkUrl || ""}
            onChange={(value) => updateFormField("linkUrl", value)}
            placeholder="/masculino"
          />
          <label className="flex h-[74px] items-center !gap-3 rounded-lg border border-zinc-200 !px-4 text-sm font-bold">
            <input
              type="checkbox"
              checked={formData.isActive}
              onChange={(event) =>
                updateFormField("isActive", event.target.checked)
              }
              className="h-4 w-4 accent-black"
            />
            Ativo
          </label>
          <AdminTextField
            label="Início"
            type="date"
            value={formData.startsAt || ""}
            onChange={(value) => updateFormField("startsAt", value)}
          />
          <AdminTextField
            label="Fim"
            type="date"
            value={formData.endsAt || ""}
            onChange={(value) => updateFormField("endsAt", value)}
          />
          <button
            type="submit"
            disabled={isSaving}
            className="h-[74px] cursor-pointer rounded-lg bg-black text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-60 lg:col-span-2"
          >
            {isSaving ? "Salvando..." : "Salvar banner"}
          </button>
        </div>
      </form>

      <div className="rounded-xl border border-zinc-200 bg-white !p-5 shadow-sm">
        <div className="flex items-center justify-between">
          <h2 className="font-bold">Banners cadastrados</h2>
          <button
            type="button"
            onClick={onRefresh}
            disabled={isLoadingBanners}
            className="inline-flex h-10 cursor-pointer items-center !gap-2 rounded-lg border border-zinc-200 !px-4 text-xs font-bold disabled:cursor-not-allowed disabled:opacity-60"
          >
            <RefreshCw size={15} className={isLoadingBanners ? "animate-spin" : ""} />
            Atualizar
          </button>
        </div>

        <div className="!mt-4 overflow-hidden rounded-lg border border-zinc-100">
          {visibleBanners.length === 0 ? (
            <div className="!p-8 text-center text-sm text-zinc-500">
              Nenhum banner encontrado.
            </div>
          ) : (
            <div className="divide-y divide-zinc-100">
              {visibleBanners.map((banner) => (
                <div
                  key={banner.id}
                  className="grid grid-cols-1 !gap-4 !p-4 lg:grid-cols-[180px_1fr_auto]"
                >
                  <div className="relative h-28 overflow-hidden rounded-lg bg-zinc-100">
                    <Image
                      src={banner.desktopImageUrl}
                      alt={banner.name}
                      fill
                      sizes="180px"
                      className="object-cover"
                    />
                  </div>

                  <div>
                    <div className="flex flex-wrap items-center !gap-2">
                      <h3 className="font-bold">{banner.name}</h3>
                      <span
                        className={`rounded-full !px-2 !py-1 text-[11px] font-bold ${
                          banner.isActive
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-zinc-100 text-zinc-500"
                        }`}
                      >
                        {banner.isActive ? "Ativo" : "Inativo"}
                      </span>
                    </div>
                    <p className="!mt-1 text-sm text-zinc-500">
                      {bannerPageLabels[banner.page]} •{" "}
                      {bannerPositionLabels[banner.position]} • Ordem{" "}
                      {banner.sortOrder}
                    </p>
                    {banner.title && (
                      <p className="!mt-2 text-sm font-semibold text-zinc-800">
                        {banner.title}
                      </p>
                    )}
                    <p className="!mt-1 break-all text-xs text-zinc-500">
                      {banner.desktopImageUrl}
                    </p>
                  </div>

                  <div className="flex items-center !gap-2 lg:justify-end">
                    <button
                      type="button"
                      onClick={() => handleEditBanner(banner)}
                      className="inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg border border-zinc-200"
                      aria-label="Editar banner"
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      type="button"
                      onClick={() => void handleDelete(banner)}
                      className="inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg border border-red-200 text-red-600"
                      aria-label="Remover banner"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

const AdminTextField = ({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  prefix,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  placeholder?: string;
  prefix?: string;
}) => {
  return (
    <label className="flex flex-col !gap-2 text-xs font-bold uppercase text-zinc-500">
      {label}
      <span className="flex h-11 overflow-hidden rounded-lg border border-zinc-200 bg-white focus-within:border-black">
        {prefix && (
          <span className="flex items-center border-r border-zinc-200 bg-zinc-50 !px-3 text-sm font-semibold normal-case text-zinc-500">
            {prefix}
          </span>
        )}
        <input
          type={type}
          value={value}
          placeholder={placeholder}
          onChange={(event) => onChange(event.target.value)}
          className="min-w-0 flex-1 !px-3 text-sm font-semibold normal-case text-zinc-950 outline-none"
        />
      </span>
    </label>
  );
};

const AdminSelectField = ({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: Array<[string, string]>;
  onChange: (value: string) => void;
}) => {
  return (
    <label className="flex flex-col !gap-2 text-xs font-bold uppercase text-zinc-500">
      {label}
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-11 cursor-pointer rounded-lg border border-zinc-200 !px-3 text-sm font-semibold normal-case text-zinc-950 outline-none focus:border-black"
      >
        {options.map(([optionValue, optionLabel]) => (
          <option key={optionValue} value={optionValue}>
            {optionLabel}
          </option>
        ))}
      </select>
    </label>
  );
};

const CouponsPanel = ({
  coupons,
  visibleCoupons,
  couponFilter,
  searchTerm,
  isLoadingCoupons,
  onFilterChange,
  onRefresh,
}: {
  coupons: Coupon[];
  visibleCoupons: Coupon[];
  couponFilter: CouponFilter;
  searchTerm: string;
  isLoadingCoupons: boolean;
  onFilterChange: (filter: CouponFilter) => void;
  onRefresh: () => Promise<void>;
}) => {
  const [isCreatingCoupon, setIsCreatingCoupon] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);
  const [couponToDelete, setCouponToDelete] = useState<Coupon | null>(null);
  const [isDeletingCoupon, setIsDeletingCoupon] = useState(false);
  const activeCoupons = coupons.filter((coupon) => {
    return getCouponStatus(coupon) === "active";
  });
  const scheduledCoupons = coupons.filter((coupon) => {
    return getCouponStatus(coupon) === "scheduled";
  });
  const expiredCoupons = coupons.filter((coupon) => {
    return getCouponStatus(coupon) === "expired";
  });
  const totalUsage = coupons.reduce((total, coupon) => {
    return total + coupon.usedCount;
  }, 0);

  const deleteCoupon = async () => {
    if (!couponToDelete) return;

    setIsDeletingCoupon(true);

    try {
      const response = await fetch("/api/admin/coupons", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: couponToDelete.id }),
      });
      const data = (await response.json()) as { error?: string };

      if (!response.ok) {
        toast.error(data.error || "Não foi possível remover o cupom");
        return;
      }

      toast.success("Cupom removido");
      setCouponToDelete(null);
      await onRefresh();
    } finally {
      setIsDeletingCoupon(false);
    }
  };

  return (
    <>
      <div className="flex flex-col !gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="font-[family-name:var(--font-bebas)] text-5xl text-zinc-950">
            Cupons
          </h1>
          <p className="text-sm text-zinc-500">
            Crie e gerencie cupons de desconto da sua loja.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setEditingCoupon(null);
            setIsCreatingCoupon((current) => !current);
          }}
          className="inline-flex h-11 cursor-pointer items-center justify-center !gap-2 rounded-lg bg-black !px-4 text-sm font-bold text-white transition-all duration-200 hover:bg-zinc-800"
        >
          <Gift size={17} />
          NOVO CUPOM
        </button>
      </div>

      <div className="grid grid-cols-2 !gap-3 xl:grid-cols-5">
        <MetricCard
          title="Total de cupons"
          value={String(coupons.length)}
          helper="Cupons criados"
          icon={TicketPercent}
        />
        <MetricCard
          title="Cupons ativos"
          value={String(activeCoupons.length)}
          helper="Disponíveis no site"
          icon={CheckCircle2}
          tone="success"
        />
        <MetricCard
          title="Agendados"
          value={String(scheduledCoupons.length)}
          helper="Entram depois"
          icon={CalendarDays}
          tone="warning"
        />
        <MetricCard
          title="Expirados"
          value={String(expiredCoupons.length)}
          helper="Fora de uso"
          icon={Clock3}
        />
        <MetricCard
          title="Usos"
          value={String(totalUsage)}
          helper="Total de aplicações"
          icon={BarChart3}
        />
      </div>

      {(isCreatingCoupon || editingCoupon) && (
        <CouponCreateForm
          coupon={editingCoupon}
          onCancel={() => {
            setIsCreatingCoupon(false);
            setEditingCoupon(null);
          }}
          onSaved={async () => {
            setIsCreatingCoupon(false);
            setEditingCoupon(null);
            await onRefresh();
          }}
        />
      )}

      <section className="rounded-xl border border-zinc-200 bg-white shadow-sm">
        <div className="flex flex-col !gap-4 border-b border-zinc-100 !p-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap !gap-2">
            <CouponFilterButton
              label="Todos"
              count={coupons.length}
              active={couponFilter === "all"}
              onClick={() => onFilterChange("all")}
            />
            <CouponFilterButton
              label="Ativos"
              count={activeCoupons.length}
              active={couponFilter === "active"}
              onClick={() => onFilterChange("active")}
            />
            <CouponFilterButton
              label="Agendados"
              count={scheduledCoupons.length}
              active={couponFilter === "scheduled"}
              onClick={() => onFilterChange("scheduled")}
            />
            <CouponFilterButton
              label="Expirados"
              count={expiredCoupons.length}
              active={couponFilter === "expired"}
              onClick={() => onFilterChange("expired")}
            />
          </div>

          <button
            type="button"
            onClick={onRefresh}
            disabled={isLoadingCoupons}
            className="inline-flex h-10 cursor-pointer items-center justify-center !gap-2 rounded-lg border border-zinc-200 !px-3 text-xs font-bold transition-all duration-200 hover:border-black disabled:cursor-not-allowed disabled:opacity-60"
          >
            <RefreshCw
              size={16}
              className={isLoadingCoupons ? "animate-spin" : ""}
            />
            ATUALIZAR
          </button>
        </div>

        <CouponsTable
          coupons={visibleCoupons}
          searchTerm={searchTerm}
          onEdit={(coupon) => {
            setIsCreatingCoupon(false);
            setEditingCoupon(coupon);
          }}
          onDelete={setCouponToDelete}
        />
      </section>

      {couponToDelete && (
        <DeleteCouponModal
          coupon={couponToDelete}
          isDeleting={isDeletingCoupon}
          onCancel={() => setCouponToDelete(null)}
          onConfirm={deleteCoupon}
        />
      )}
    </>
  );
};

const CouponFilterButton = ({
  label,
  count,
  active,
  onClick,
}: {
  label: string;
  count: number;
  active: boolean;
  onClick: () => void;
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`h-10 cursor-pointer rounded-lg !px-3 text-sm font-bold transition-all duration-200 ${
        active
          ? "bg-black text-white"
          : "bg-zinc-50 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-950"
      }`}
    >
      {label} <span className="opacity-70">{count}</span>
    </button>
  );
};

const CouponCreateForm = ({
  coupon,
  onSaved,
  onCancel,
}: {
  coupon?: Coupon | null;
  onSaved: () => Promise<void>;
  onCancel: () => void;
}) => {
  const [code, setCode] = useState(coupon?.code || "");
  const [type, setType] = useState<CouponType>(coupon?.type || "percentage");
  const [value, setValue] = useState(String(coupon?.value ?? 10));
  const [minSubtotal, setMinSubtotal] = useState(
    String(coupon?.minSubtotal ?? 0)
  );
  const [maxDiscount, setMaxDiscount] = useState(
    coupon?.maxDiscount === undefined ? "" : String(coupon.maxDiscount)
  );
  const [startsAt, setStartsAt] = useState(
    coupon?.startsAt || new Date().toISOString().slice(0, 10)
  );
  const [expiresAt, setExpiresAt] = useState(
    coupon?.expiresAt || "2026-12-31"
  );
  const [usageLimit, setUsageLimit] = useState(
    String(coupon?.usageLimit ?? 100)
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isEditing = Boolean(coupon);

  useEffect(() => {
    setCode(coupon?.code || "");
    setType(coupon?.type || "percentage");
    setValue(String(coupon?.value ?? 10));
    setMinSubtotal(String(coupon?.minSubtotal ?? 0));
    setMaxDiscount(
      coupon?.maxDiscount === undefined ? "" : String(coupon.maxDiscount)
    );
    setStartsAt(coupon?.startsAt || new Date().toISOString().slice(0, 10));
    setExpiresAt(coupon?.expiresAt || "2026-12-31");
    setUsageLimit(String(coupon?.usageLimit ?? 100));
  }, [coupon]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/admin/coupons", {
        method: isEditing ? "PATCH" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: coupon?.id,
          code,
          type,
          value: Number(value),
          minSubtotal: Number(minSubtotal),
          maxDiscount: maxDiscount ? Number(maxDiscount) : undefined,
          startsAt,
          expiresAt,
          usageLimit: Number(usageLimit),
          usagePerCustomer: 1,
        }),
      });
      const data = (await response.json()) as { error?: string };

      if (!response.ok) {
        toast.error(data.error || "Não foi possível salvar o cupom");
        return;
      }

      toast.success(isEditing ? "Cupom atualizado" : "Cupom criado com sucesso");
      await onSaved();
      setCode("");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-xl border border-zinc-200 bg-white !p-5 shadow-sm"
    >
      <div className="!mb-4 flex items-center justify-between !gap-4">
        <div>
          <h2 className="font-[family-name:var(--font-bebas)] text-3xl text-zinc-950">
            {isEditing ? "Editar cupom" : "Novo cupom"}
          </h2>
          <p className="text-xs text-zinc-500">
            {isEditing
              ? "Atualize as regras desse desconto."
              : "Crie um desconto para usar no carrinho e checkout."}
          </p>
        </div>
        <button
          type="button"
          onClick={onCancel}
          className="h-10 cursor-pointer rounded-lg border border-zinc-200 !px-3 text-xs font-bold transition-all duration-200 hover:border-black"
        >
          CANCELAR
        </button>
      </div>

      <div className="grid grid-cols-1 !gap-4 md:grid-cols-6">
        <label className="flex flex-col !gap-2 md:col-span-2">
          <span className="text-xs font-bold uppercase text-zinc-500">
            Código
          </span>
          <input
            value={code}
            onChange={(event) => setCode(event.target.value.toUpperCase())}
            className="h-11 rounded-lg border border-zinc-200 !px-3 text-sm font-bold outline-none focus:border-black"
            placeholder="EX: CAMISA10"
          />
        </label>

        <label className="flex flex-col !gap-2">
          <span className="text-xs font-bold uppercase text-zinc-500">Tipo</span>
          <select
            value={type}
            onChange={(event) => setType(event.target.value as CouponType)}
            className="h-11 rounded-lg border border-zinc-200 !px-3 text-sm outline-none focus:border-black"
          >
            <option value="percentage">Percentual</option>
            <option value="fixed">Valor fixo</option>
            <option value="free_shipping">Frete grátis</option>
          </select>
        </label>

        <label className="flex flex-col !gap-2">
          <span className="text-xs font-bold uppercase text-zinc-500">
            Desconto
          </span>
          <input
            value={value}
            onChange={(event) => setValue(event.target.value)}
            inputMode="decimal"
            className="h-11 rounded-lg border border-zinc-200 !px-3 text-sm outline-none focus:border-black"
          />
        </label>

        <label className="flex flex-col !gap-2">
          <span className="text-xs font-bold uppercase text-zinc-500">
            Compra mínima
          </span>
          <input
            value={minSubtotal}
            onChange={(event) => setMinSubtotal(event.target.value)}
            inputMode="decimal"
            className="h-11 rounded-lg border border-zinc-200 !px-3 text-sm outline-none focus:border-black"
          />
        </label>

        <label className="flex flex-col !gap-2">
          <span className="text-xs font-bold uppercase text-zinc-500">
            Limite
          </span>
          <input
            value={usageLimit}
            onChange={(event) => setUsageLimit(event.target.value)}
            inputMode="numeric"
            className="h-11 rounded-lg border border-zinc-200 !px-3 text-sm outline-none focus:border-black"
          />
        </label>

        <label className="flex flex-col !gap-2 md:col-span-2">
          <span className="text-xs font-bold uppercase text-zinc-500">
            Desconto máximo
          </span>
          <input
            value={maxDiscount}
            onChange={(event) => setMaxDiscount(event.target.value)}
            inputMode="decimal"
            className="h-11 rounded-lg border border-zinc-200 !px-3 text-sm outline-none focus:border-black"
            placeholder="Opcional"
          />
        </label>

        <label className="flex flex-col !gap-2">
          <span className="text-xs font-bold uppercase text-zinc-500">
            Início
          </span>
          <input
            type="date"
            value={startsAt}
            onChange={(event) => setStartsAt(event.target.value)}
            className="h-11 rounded-lg border border-zinc-200 !px-3 text-sm outline-none focus:border-black"
          />
        </label>

        <label className="flex flex-col !gap-2">
          <span className="text-xs font-bold uppercase text-zinc-500">
            Expira em
          </span>
          <input
            type="date"
            value={expiresAt}
            onChange={(event) => setExpiresAt(event.target.value)}
            className="h-11 rounded-lg border border-zinc-200 !px-3 text-sm outline-none focus:border-black"
          />
        </label>

        <button
          type="submit"
          disabled={isSubmitting}
          className="h-11 cursor-pointer self-end rounded-lg bg-black !px-4 text-sm font-bold text-white transition-all duration-200 hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-60 md:col-span-2"
        >
          {isSubmitting
            ? "SALVANDO..."
            : isEditing
              ? "SALVAR ALTERAÇÕES"
              : "CRIAR CUPOM"}
        </button>
      </div>
    </form>
  );
};

const CouponsTable = ({
  coupons,
  searchTerm,
  onEdit,
  onDelete,
}: {
  coupons: Coupon[];
  searchTerm: string;
  onEdit: (coupon: Coupon) => void;
  onDelete: (coupon: Coupon) => void;
}) => {
  if (coupons.length === 0) {
    return (
      <div className="!p-10 text-center">
        <TicketPercent className="mx-auto text-zinc-400" size={36} />
        <p className="!mt-3 text-sm font-bold text-zinc-700">
          Nenhum cupom encontrado.
        </p>
        {searchTerm && (
          <p className="!mt-1 text-xs text-zinc-500">
            Tente buscar por outro código ou status.
          </p>
        )}
      </div>
    );
  }

  return (
    <>
      <div className="divide-y divide-zinc-100 md:hidden">
        {coupons.map((coupon) => (
          <CouponMobileCard
            key={coupon.id}
            coupon={coupon}
            onEdit={() => onEdit(coupon)}
            onDelete={() => onDelete(coupon)}
          />
        ))}
      </div>

      <div className="hidden overflow-x-auto md:block">
        <div className="min-w-[940px]">
        <div className="grid grid-cols-[1.2fr_1fr_1fr_1.2fr_1fr_1fr_0.8fr] border-b border-zinc-100 !px-4 !py-3 text-xs font-bold uppercase text-zinc-500">
          <span>Cupom</span>
          <span>Tipo</span>
          <span>Desconto</span>
          <span>Validade</span>
          <span>Usos</span>
          <span>Status</span>
          <span className="text-right">Ações</span>
        </div>

        <div className="divide-y divide-zinc-100">
          {coupons.map((coupon) => (
            <CouponRow
              key={coupon.id}
              coupon={coupon}
              onEdit={() => onEdit(coupon)}
              onDelete={() => onDelete(coupon)}
            />
          ))}
        </div>
      </div>
      </div>
    </>
  );
};

const CouponMobileCard = ({
  coupon,
  onEdit,
  onDelete,
}: {
  coupon: Coupon;
  onEdit: () => void;
  onDelete: () => void;
}) => {
  const status = getCouponStatus(coupon);

  const copyCoupon = async () => {
    await navigator.clipboard.writeText(coupon.code);
    toast.success("Cupom copiado");
  };

  return (
    <article className="!p-4">
      <div className="flex items-start justify-between !gap-3">
        <div className="min-w-0">
          <div className="flex items-center !gap-2">
            <span className="rounded-md border border-zinc-200 bg-white !px-2.5 !py-1 text-xs font-bold">
              {coupon.code}
            </span>
            <button
              type="button"
              onClick={copyCoupon}
              className="inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-md border border-zinc-200 transition-all duration-200 hover:border-black"
              aria-label={"Copiar cupom " + coupon.code}
            >
              <Copy size={14} />
            </button>
          </div>

          <div className="!mt-3 flex flex-wrap items-center !gap-2">
            <CouponTypeBadge type={coupon.type} />
            <CouponStatusBadge status={status} />
          </div>
        </div>

        <div className="flex shrink-0 !gap-2">
          <button
            type="button"
            onClick={onEdit}
            className="inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-md border border-zinc-200 text-zinc-500 transition-all duration-200 hover:border-black hover:text-black"
            aria-label="Editar cupom"
          >
            <SlidersHorizontal size={15} />
          </button>
          <button
            type="button"
            onClick={onDelete}
            className="inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-md border border-red-100 text-red-500 transition-all duration-200 hover:border-red-500"
            aria-label="Excluir cupom"
          >
            <Trash2 size={15} />
          </button>
        </div>
      </div>

      <div className="!mt-4 grid grid-cols-2 !gap-3 rounded-lg bg-zinc-50 !p-3 text-xs text-zinc-500">
        <div>
          <span className="font-bold uppercase">Desconto</span>
          <p className="!mt-1 text-sm font-bold text-zinc-950">
            {getCouponDiscountLabel(coupon)}
          </p>
          <p>Mín. {formatPrice(coupon.minSubtotal)}</p>
        </div>

        <div>
          <span className="font-bold uppercase">Usos</span>
          <p className="!mt-1 text-sm font-bold text-zinc-950">
            {coupon.usedCount}
          </p>
          <p>de {coupon.usageLimit}</p>
        </div>

        <div className="col-span-2">
          <span className="font-bold uppercase">Validade</span>
          <p className="!mt-1 text-sm text-zinc-700">
            De {formatDate(coupon.startsAt)} até {formatDate(coupon.expiresAt)}
          </p>
        </div>
      </div>
    </article>
  );
};

const CouponRow = ({
  coupon,
  onEdit,
  onDelete,
}: {
  coupon: Coupon;
  onEdit: () => void;
  onDelete: () => void;
}) => {
  const status = getCouponStatus(coupon);

  const copyCoupon = async () => {
    await navigator.clipboard.writeText(coupon.code);
    toast.success("Cupom copiado");
  };

  return (
    <div className="grid grid-cols-[1.2fr_1fr_1fr_1.2fr_1fr_1fr_0.8fr] items-center !gap-3 !px-4 !py-4 text-sm">
      <div className="flex items-center !gap-2">
        <span className="rounded-md border border-zinc-200 bg-white !px-2.5 !py-1 text-xs font-bold">
          {coupon.code}
        </span>
        <button
          type="button"
          onClick={copyCoupon}
          className="inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-md border border-zinc-200 transition-all duration-200 hover:border-black"
          aria-label={"Copiar cupom " + coupon.code}
        >
          <Copy size={14} />
        </button>
      </div>

      <CouponTypeBadge type={coupon.type} />

      <div>
        <p className="font-bold text-zinc-950">{getCouponDiscountLabel(coupon)}</p>
        <p className="text-xs text-zinc-500">
          Mín. {formatPrice(coupon.minSubtotal)}
        </p>
      </div>

      <div className="text-xs text-zinc-600">
        <p>De {formatDate(coupon.startsAt)}</p>
        <p>Até {formatDate(coupon.expiresAt)}</p>
      </div>

      <div>
        <p className="font-bold text-zinc-950">{coupon.usedCount}</p>
        <p className="text-xs text-zinc-500">de {coupon.usageLimit}</p>
      </div>

      <CouponStatusBadge status={status} />

      <div className="flex justify-end !gap-2">
        <button
          type="button"
          onClick={onEdit}
          className="inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-md border border-zinc-200 text-zinc-500 transition-all duration-200 hover:border-black hover:text-black"
          aria-label="Editar cupom"
        >
          <SlidersHorizontal size={15} />
        </button>
        <button
          type="button"
          onClick={onDelete}
          className="inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-md border border-red-100 text-red-500 transition-all duration-200 hover:border-red-500"
          aria-label="Excluir cupom"
        >
          <Trash2 size={15} />
        </button>
      </div>
    </div>
  );
};

const DeleteCouponModal = ({
  coupon,
  isDeleting,
  onCancel,
  onConfirm,
}: {
  coupon: Coupon;
  isDeleting: boolean;
  onCancel: () => void;
  onConfirm: () => Promise<void>;
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 !p-4">
      <section className="w-full max-w-md rounded-xl border border-zinc-200 bg-white !p-5 shadow-2xl">
        <div className="flex items-start !gap-4">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-red-50 text-red-600">
            <Trash2 size={20} />
          </span>
          <div>
            <h2 className="font-[family-name:var(--font-bebas)] text-3xl leading-none text-zinc-950">
              Remover cupom
            </h2>
            <p className="!mt-2 text-sm leading-relaxed text-zinc-600">
              Tem certeza que deseja remover o cupom{" "}
              <strong className="text-zinc-950">{coupon.code}</strong>? Essa
              ação não pode ser desfeita.
            </p>
          </div>
        </div>

        <div className="!mt-6 flex flex-col-reverse !gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onCancel}
            disabled={isDeleting}
            className="h-11 cursor-pointer rounded-lg border border-zinc-200 !px-5 text-sm font-bold transition-all duration-200 hover:border-black disabled:cursor-not-allowed disabled:opacity-60"
          >
            CANCELAR
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isDeleting}
            className="inline-flex h-11 cursor-pointer items-center justify-center !gap-2 rounded-lg bg-red-600 !px-5 text-sm font-bold text-white transition-all duration-200 hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isDeleting && <RefreshCw size={16} className="animate-spin" />}
            REMOVER CUPOM
          </button>
        </div>
      </section>
    </div>
  );
};

const CouponTypeBadge = ({ type }: { type: CouponType }) => {
  const labels: Record<CouponType, string> = {
    percentage: "Percentual",
    fixed: "Valor fixo",
    free_shipping: "Frete grátis",
  };

  return (
    <span className="w-fit rounded-full bg-emerald-50 !px-2.5 !py-1 text-xs font-bold text-emerald-700">
      {labels[type]}
    </span>
  );
};

const CouponStatusBadge = ({ status }: { status: CouponFilter }) => {
  const config = {
    all: "bg-zinc-100 text-zinc-700",
    active: "bg-emerald-50 text-emerald-700",
    scheduled: "bg-amber-50 text-amber-700",
    expired: "bg-red-50 text-red-700",
  }[status];
  const labels = {
    all: "Todos",
    active: "Ativo",
    scheduled: "Agendado",
    expired: "Expirado",
  };

  return (
    <span className={`w-fit rounded-full !px-2.5 !py-1 text-xs font-bold ${config}`}>
      {labels[status]}
    </span>
  );
};

const getCouponDiscountLabel = (coupon: Coupon) => {
  if (coupon.type === "percentage") return `${coupon.value}% OFF`;
  if (coupon.type === "fixed") return `${formatPrice(coupon.value)} OFF`;

  return "Frete grátis";
};

const formatDate = (date: string) => {
  return new Date(`${date}T00:00:00`).toLocaleDateString("pt-BR");
};

const DashboardPanel = ({
  orders,
  onGoToOrders,
}: {
  orders: AdminOrder[];
  onGoToOrders: () => void;
}) => {
  const [revenuePeriod, setRevenuePeriod] = useState<DashboardPeriod>(7);
  const [ordersPeriod, setOrdersPeriod] = useState<DashboardPeriod>(7);
  const paidOrders = orders.filter((order) => order.status === "paid");
  const unpaidOrders = orders.filter((order) => order.status === "unpaid");
  const paidTotal = paidOrders.reduce((total, order) => total + order.total, 0);
  const totalItemsSold = paidOrders.reduce((total, order) => {
    return total + getOrderItemsCount(order);
  }, 0);
  const customersCount = new Set(
    orders.map((order) => order.customer?.email || order.customer?.whatsapp)
  ).size;
  const averageTicket = paidOrders.length > 0 ? paidTotal / paidOrders.length : 0;
  const paidPercent = orders.length > 0 ? (paidOrders.length / orders.length) * 100 : 0;
  const unpaidPercent = orders.length > 0 ? (unpaidOrders.length / orders.length) * 100 : 0;
  const revenueSeries = getDashboardRevenueSeries(paidOrders, revenuePeriod);
  const orderSeries = getDashboardOrderSeries(orders, ordersPeriod);
  const periodRevenueTotal = revenueSeries.reduce((total, point) => total + point.value, 0);
  const periodOrdersTotal = orderSeries.reduce((total, point) => total + point.value, 0);
  const topProducts = getDashboardTopProducts(orders);
  const topCities = getDashboardTopCities(orders);
  const conversionSeries = getDashboardConversionSeries(orders);
  const conversionRate = orders.length > 0 ? paidPercent : 0;

  return (
    <>
      <div className="flex flex-col !gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-950 sm:text-3xl">
            Olá, Admin!👋
          </h1>
          <p className="!mt-1 text-sm text-zinc-500">
            Aqui está o resumo da sua loja hoje.
          </p>
        </div>

        <div className="inline-flex h-11 w-fit items-center !gap-2 rounded-lg border border-zinc-200 bg-white !px-4 text-sm font-bold text-zinc-700 shadow-sm">
          <CalendarDays size={17} />
          {getDashboardDateRange()}
        </div>
      </div>

      <div className="grid grid-cols-2 !gap-3 xl:grid-cols-5">
        <MetricCard
          title="Total de vendas"
          value={formatPrice(paidTotal)}
          helper="Pedidos pagos"
          icon={CalendarDays}
          tone="success"
        />
        <MetricCard
          title="Pedidos"
          value={String(orders.length)}
          helper={`${unpaidOrders.length} pendente${unpaidOrders.length === 1 ? "" : "s"}`}
          icon={ShoppingBag}
        />
        <MetricCard
          title="Ticket médio"
          value={formatPrice(averageTicket)}
          helper="Por pedido pago"
          icon={CircleDollarSign}
        />
        <MetricCard
          title="Novos clientes"
          value={String(customersCount)}
          helper="Clientes únicos"
          icon={Users}
          tone="success"
        />
        <MetricCard
          title="Produtos vendidos"
          value={String(totalItemsSold)}
          helper="Itens pagos"
          icon={Package}
        />
      </div>

      <div className="grid grid-cols-1 !gap-5 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_380px]">
        <DashboardChartCard
          title="Faturamento"
          value={formatPrice(periodRevenueTotal)}
          helper="Pedidos pagos no período"
          period={revenuePeriod}
          onPeriodChange={setRevenuePeriod}
        >
          <LineChart points={revenueSeries} formatter={formatPrice} />
        </DashboardChartCard>

        <DashboardChartCard
          title="Pedidos"
          value={String(periodOrdersTotal)}
          helper="Volume por período"
          period={ordersPeriod}
          onPeriodChange={setOrdersPeriod}
        >
          <BarChart
            points={orderSeries}
            formatter={(value) => `${value} pedido${value === 1 ? "" : "s"}`}
          />
        </DashboardChartCard>
        <DashboardStatusCard
          paid={paidOrders.length}
          unpaid={unpaidOrders.length}
          paidPercent={paidPercent}
          unpaidPercent={unpaidPercent}
        />
      </div>

      <div className="grid grid-cols-1 !gap-5 xl:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)_320px]">
        <DashboardRecentOrders orders={orders.slice(0, 5)} onGoToOrders={onGoToOrders} />
        <DashboardTopProducts products={topProducts} />
        <div className="flex flex-col !gap-5">
          <DashboardConversionCard
            conversionRate={conversionRate}
            points={conversionSeries}
          />
          <DashboardCitiesCard cities={topCities} />
        </div>
      </div>

      <section className="rounded-xl border border-emerald-100 bg-emerald-50 !p-4 shadow-sm">
        <div className="flex flex-col !gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center !gap-3">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-white">
              <ShoppingBag size={20} />
            </span>
            <div>
              <p className="font-bold text-emerald-950">Tudo certo!</p>
              <p className="text-sm text-emerald-800">
                Não há nenhum problema com sua loja no momento.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onGoToOrders}
            className="h-11 cursor-pointer rounded-lg border border-emerald-200 bg-white !px-4 text-sm font-bold text-emerald-950 transition-all duration-200 hover:border-emerald-700"
          >
            VERIFICAR LOJA
          </button>
        </div>
      </section>
    </>
  );
};

type DashboardChartPoint = {
  key: string;
  label: string;
  value: number;
};

const dashboardPeriods: DashboardPeriod[] = [7, 30, 90];

const DashboardChartCard = ({
  title,
  value,
  helper,
  period,
  onPeriodChange,
  children,
}: {
  title: string;
  value: string;
  helper: string;
  period: DashboardPeriod;
  onPeriodChange: (period: DashboardPeriod) => void;
  children: React.ReactNode;
}) => {
  return (
    <section className="rounded-xl border border-zinc-200 bg-white !p-5 shadow-sm">
      <div className="flex items-start justify-between !gap-4">
        <div>
          <p className="text-sm font-bold text-zinc-950">{title}</p>
          <div className="!mt-2 flex flex-wrap items-center !gap-2">
            <strong className="text-2xl text-zinc-950">{value}</strong>
            <span className="rounded-full bg-emerald-50 !px-2 !py-1 text-xs font-bold text-emerald-700">
              +12,3%
            </span>
          </div>
          <p className="!mt-1 text-xs text-zinc-500">{helper}</p>
        </div>
        <select
          value={period}
          onChange={(event) => onPeriodChange(Number(event.target.value) as DashboardPeriod)}
          className="h-10 cursor-pointer rounded-lg border border-zinc-200 bg-white !px-3 text-xs font-bold text-zinc-700 outline-none transition-all duration-200 hover:border-black focus:border-black"
          aria-label={'Selecionar período de ' + title.toLowerCase()}
        >
          {dashboardPeriods.map((currentPeriod) => (
            <option key={currentPeriod} value={currentPeriod}>
              Últimos {currentPeriod} dias
            </option>
          ))}
        </select>
      </div>
      <div className="!mt-5 h-52 overflow-visible">{children}</div>
    </section>
  );
};

const LineChart = ({
  points,
  formatter,
}: {
  points: DashboardChartPoint[];
  formatter: (value: number) => string;
}) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const safePoints = points.length > 0 ? points : getEmptyDashboardPoints(7);
  const values = safePoints.map((point) => point.value);
  const maxValue = Math.max(...values, 1);
  const chartPoints = safePoints.map((point, index) => {
    const x = (index / Math.max(1, safePoints.length - 1)) * 100;
    const y = 92 - (point.value / maxValue) * 78;

    return { ...point, x, y };
  });
  const visibleLabels = getVisibleDashboardLabels(safePoints);
  const activePoint = activeIndex === null ? null : chartPoints[activeIndex];

  return (
    <div className="grid h-full grid-rows-[1fr_auto] !gap-3">
      <div
        className="relative min-h-0 border-b border-zinc-100"
        onMouseLeave={() => setActiveIndex(null)}
      >
        <div className="absolute inset-0 flex flex-col justify-between">
          {Array.from({ length: 5 }).map((_, index) => (
            <span key={index} className="h-px bg-zinc-100" />
          ))}
        </div>
        <svg
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          className="relative h-full w-full overflow-visible"
        >
          <polyline
            points={chartPoints.map((point) => point.x + ',' + point.y).join(' ')}
            fill="none"
            stroke="black"
            strokeWidth="2.5"
            vectorEffect="non-scaling-stroke"
          />
        </svg>
        {chartPoints.map((point, index) => (
          <span
            key={point.key + '-dot-' + index}
            className={`pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-1/2 rounded-full bg-black transition-all duration-150 ${
              activeIndex === index ? "h-2.5 w-2.5" : "h-1.5 w-1.5"
            }`}
            style={{ left: point.x + "%", top: point.y + "%" }}
          />
        ))}
        <div className="absolute inset-0 flex">
          {chartPoints.map((point, index) => (
            <button
              key={point.key + '-hover-' + index}
              type="button"
              className="h-full flex-1 cursor-crosshair"
              aria-label={point.label + ': ' + formatter(point.value)}
              onMouseEnter={() => setActiveIndex(index)}
              onFocus={() => setActiveIndex(index)}
              onBlur={() => setActiveIndex(null)}
            />
          ))}
        </div>
        {activePoint && (
          <DashboardChartTooltip
            left={activePoint.x}
            top={activePoint.y}
            label={activePoint.label}
            value={formatter(activePoint.value)}
          />
        )}
      </div>
      <DashboardChartLabels labels={visibleLabels} />
    </div>
  );
};

const BarChart = ({
  points,
  formatter,
}: {
  points: DashboardChartPoint[];
  formatter: (value: number) => string;
}) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const safePoints = points.length > 0 ? points : getEmptyDashboardPoints(7);
  const maxValue = Math.max(...safePoints.map((point) => point.value), 1);
  const visibleLabels = getVisibleDashboardLabels(safePoints);
  const activePoint = activeIndex === null ? null : safePoints[activeIndex];
  const activeLeft = activeIndex === null
    ? 0
    : ((activeIndex + 0.5) / Math.max(1, safePoints.length)) * 100;
  const activeTop = activePoint
    ? 100 - Math.max(8, (activePoint.value / maxValue) * 100)
    : 0;

  return (
    <div className="grid h-full grid-rows-[1fr_auto] !gap-3">
      <div
        className="relative flex min-h-0 items-end justify-between !gap-2 border-b border-zinc-100 !px-2"
        onMouseLeave={() => setActiveIndex(null)}
      >
        <div className="pointer-events-none absolute inset-0 flex flex-col justify-between">
          {Array.from({ length: 5 }).map((_, index) => (
            <span key={index} className="h-px bg-zinc-100" />
          ))}
        </div>
        {safePoints.map((point, index) => (
          <button
            key={point.key + '-' + index}
            type="button"
            className="relative z-10 flex h-full flex-1 cursor-crosshair items-end justify-center"
            aria-label={point.label + ': ' + formatter(point.value)}
            onMouseEnter={() => setActiveIndex(index)}
            onFocus={() => setActiveIndex(index)}
            onBlur={() => setActiveIndex(null)}
          >
            <span
              className={[
                'block w-full max-w-8 rounded-t-md transition-all duration-200',
                activeIndex === index ? 'bg-zinc-700' : 'bg-black',
              ].join(' ')}
              style={{ height: Math.max(8, (point.value / maxValue) * 100) + '%' }}
            />
          </button>
        ))}
        {activePoint && (
          <DashboardChartTooltip
            left={activeLeft}
            top={activeTop}
            label={activePoint.label}
            value={formatter(activePoint.value)}
          />
        )}
      </div>
      <DashboardChartLabels labels={visibleLabels} />
    </div>
  );
};

const DashboardChartTooltip = ({
  left,
  top,
  label,
  value,
}: {
  left: number;
  top: number;
  label: string;
  value: string;
}) => {
  const safeLeft = Math.min(84, Math.max(16, left));
  const safeTop = Math.min(88, Math.max(18, top));

  return (
    <div
      className="pointer-events-none absolute z-20 min-w-20 -translate-x-1/2 -translate-y-[calc(100%+8px)] rounded-md bg-zinc-950 !px-2.5 !py-1.5 text-center text-[10px] text-white shadow-lg"
      style={{ left: safeLeft + '%', top: safeTop + '%' }}
    >
      <span className="block font-medium text-zinc-300">{label}</span>
      <strong className="block whitespace-nowrap text-xs">{value}</strong>
    </div>
  );
};

const DashboardChartLabels = ({ labels }: { labels: string[] }) => {
  return (
    <div className="flex items-center justify-between text-[10px] font-medium text-zinc-500">
      {labels.map((label, index) => (
        <span key={label + '-' + index}>{label}</span>
      ))}
    </div>
  );
};

const DashboardStatusCard = ({
  paid,
  unpaid,
  paidPercent,
  unpaidPercent,
}: {
  paid: number;
  unpaid: number;
  paidPercent: number;
  unpaidPercent: number;
}) => {
  const canceled = 0;
  const canceledPercent = 0;

  return (
    <section className="flex h-full flex-col rounded-xl border border-zinc-200 bg-white !p-5 shadow-sm">
      <h2 className="text-sm font-bold text-zinc-950">Status dos pedidos</h2>
      <div className="flex flex-1 flex-col items-center justify-center !gap-6 !pt-5 sm:flex-row xl:flex-col 2xl:flex-row">
        <DashboardDonutChart
          segments={[
            { label: "Pagos", value: paid, percent: paidPercent, color: "#22c55e" },
            { label: "Não pagos", value: unpaid, percent: unpaidPercent, color: "#fbbf24" },
            { label: "Cancelados", value: canceled, percent: canceledPercent, color: "#ef4444" },
          ]}
        />
        <div className="flex w-full flex-col !gap-4 text-sm">
          <DashboardLegend color="bg-emerald-500" label="Pagos" value={paid} percent={paidPercent} />
          <DashboardLegend color="bg-amber-400" label="Não pagos" value={unpaid} percent={unpaidPercent} />
          <DashboardLegend color="bg-red-500" label="Cancelados" value={canceled} percent={canceledPercent} />
        </div>
      </div>
    </section>
  );
};

const DashboardDonutChart = ({
  segments,
}: {
  segments: Array<{ label: string; value: number; percent: number; color: string }>;
}) => {
  const [activeSegment, setActiveSegment] = useState<{
    label: string;
    value: number;
    percent: number;
  } | null>(null);
  const radius = 46;
  const circumference = 2 * Math.PI * radius;
  const total = segments.reduce((sum, segment) => sum + segment.value, 0);
  let offset = 0;

  return (
    <div className="relative h-40 w-40 shrink-0" onMouseLeave={() => setActiveSegment(null)}>
      <svg
        viewBox="0 0 120 120"
        className="h-40 w-40 -rotate-90"
        role="img"
        aria-label="Gráfico de status dos pedidos"
      >
        <circle
          cx="60"
          cy="60"
          r={radius}
          fill="none"
          stroke="#f4f4f5"
          strokeWidth="18"
        />
        {total > 0 &&
          segments.map((segment, index) => {
            const dash = (segment.value / total) * circumference;
            const currentOffset = offset;
            offset += dash;

            if (segment.value <= 0) return null;

            return (
              <circle
                key={segment.color + '-' + index}
                cx="60"
                cy="60"
                r={radius}
                fill="none"
                stroke={segment.color}
                strokeWidth="18"
                strokeDasharray={Math.max(0, dash - 4) + ' ' + circumference}
                strokeDashoffset={-currentOffset}
                strokeLinecap="round"
                className="cursor-crosshair transition-opacity duration-150 hover:opacity-80"
                onMouseEnter={() => setActiveSegment(segment)}
                onFocus={() => setActiveSegment(segment)}
              />
            );
          })}
      </svg>
      {activeSegment && (
        <DashboardChartTooltip
          left={50}
          top={52}
          label={activeSegment.label}
          value={activeSegment.value + ' (' + activeSegment.percent.toFixed(1).replace('.', ',') + '%)'}
        />
      )}
    </div>
  );
};

const DashboardLegend = ({
  color,
  label,
  value,
  percent,
}: {
  color: string;
  label: string;
  value: number;
  percent: number;
}) => {
  return (
    <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center !gap-4">
      <span className="inline-flex min-w-0 items-center !gap-2 text-zinc-600">
        <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${color}`} />
        {label}
      </span>
      <strong className="whitespace-nowrap text-right text-xs text-zinc-950">
        {value} ({percent.toFixed(1).replace(".", ",")}%)
      </strong>
    </div>
  );
};

const DashboardRecentOrders = ({
  orders,
  onGoToOrders,
}: {
  orders: AdminOrder[];
  onGoToOrders: () => void;
}) => {
  return (
    <section className="rounded-xl border border-zinc-200 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-zinc-100 !p-4">
        <h2 className="text-sm font-bold text-zinc-950">Pedidos recentes</h2>
        <button
          type="button"
          onClick={onGoToOrders}
          className="h-9 cursor-pointer rounded-lg border border-zinc-200 !px-3 text-xs font-bold transition-all duration-200 hover:border-black"
        >
          Ver todos
        </button>
      </div>
      <div className="divide-y divide-zinc-100">
        {orders.length === 0 ? (
          <p className="!p-4 text-sm text-zinc-500">Nenhum pedido recente.</p>
        ) : (
          orders.map((order) => (
            <div key={order.id} className="grid grid-cols-1 !gap-2 !p-4 sm:grid-cols-[1fr_1fr_auto] sm:items-center">
              <div>
                <p className="text-sm font-bold text-zinc-950">{order.id}</p>
                <p className="text-xs text-zinc-500">{getOrderDate(order)}</p>
              </div>
              <div>
                <p className="text-sm font-bold text-zinc-700">{order.customer?.name || "Cliente"}</p>
                <p className="text-xs text-zinc-500">{order.customer?.email}</p>
              </div>
              <div className="flex items-center justify-between !gap-3 sm:justify-end">
                <OrderStatusBadge status={order.status} />
                <strong className="text-sm text-zinc-950">{formatPrice(order.total)}</strong>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
};

const DashboardTopProducts = ({
  products: topProducts,
}: {
  products: Array<{
    id: string;
    name: string;
    image: string;
    sales: number;
    revenue: number;
  }>;
}) => {
  return (
    <section className="rounded-xl border border-zinc-200 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-zinc-100 !p-4">
        <h2 className="text-sm font-bold text-zinc-950">Produtos mais vendidos</h2>
        <span className="rounded-lg border border-zinc-200 !px-3 !py-2 text-xs font-bold text-zinc-600">
          Top 5
        </span>
      </div>
      <div className="divide-y divide-zinc-100">
        {topProducts.map((product, index) => (
          <div key={product.id} className="flex items-center !gap-3 !p-4">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-zinc-100 text-xs font-bold">
              {index + 1}
            </span>
            <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-zinc-100">
              <Image src={product.image} alt={product.name} fill sizes="56px" className="object-cover" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="line-clamp-1 text-sm font-bold text-zinc-950">{product.name}</p>
              <p className="text-xs text-zinc-500">{product.sales} venda{product.sales === 1 ? "" : "s"}</p>
            </div>
            <strong className="text-sm text-zinc-950">{formatPrice(product.revenue)}</strong>
          </div>
        ))}
      </div>
    </section>
  );
};

const DashboardConversionCard = ({
  conversionRate,
  points,
}: {
  conversionRate: number;
  points: DashboardChartPoint[];
}) => {
  return (
    <section className="rounded-xl border border-zinc-200 bg-white !p-5 shadow-sm">
      <p className="text-sm font-bold text-zinc-950">Conversão da loja</p>
      <div className="!mt-3 flex items-center !gap-2">
        <strong className="text-3xl text-zinc-950">
          {conversionRate.toFixed(2).replace('.', ',')}%
        </strong>
        <span className="rounded-full bg-emerald-50 !px-2 !py-1 text-xs font-bold text-emerald-700">
          +12,3%
        </span>
      </div>
      <p className="!mt-1 text-xs text-zinc-500">Pedidos pagos sobre pedidos criados</p>
      <div className="!mt-5 h-24 overflow-visible">
        <ConversionLineChart points={points} />
      </div>
    </section>
  );
};

const ConversionLineChart = ({ points }: { points: DashboardChartPoint[] }) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const safePoints = points.length > 0 ? points : getEmptyDashboardPoints(7);
  const maxValue = Math.max(...safePoints.map((point) => point.value), 100);
  const chartPoints = safePoints.map((point, index) => {
    const x = (index / Math.max(1, safePoints.length - 1)) * 100;
    const y = 88 - (point.value / maxValue) * 72;

    return { ...point, x, y };
  });
  const activePoint = activeIndex === null ? null : chartPoints[activeIndex];

  return (
    <div
      className="relative h-full border-b border-zinc-100"
      onMouseLeave={() => setActiveIndex(null)}
    >
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        className="relative h-full w-full overflow-visible"
      >
        <polyline
          points={chartPoints.map((point) => point.x + ',' + point.y).join(' ')}
          fill="none"
          stroke="#16a34a"
          strokeWidth="3"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
      {chartPoints.map((point, index) => (
        <span
          key={point.key + '-conversion-dot-' + index}
          className={`pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-600 transition-all duration-150 ${
            activeIndex === index ? "h-2.5 w-2.5" : "h-0 w-0"
          }`}
          style={{ left: point.x + "%", top: point.y + "%" }}
        />
      ))}
      <div className="absolute inset-0 flex">
        {chartPoints.map((point, index) => (
          <button
            key={point.key + '-conversion-hover-' + index}
            type="button"
            className="h-full flex-1 cursor-crosshair"
            aria-label={point.label + ': ' + point.value.toFixed(2).replace('.', ',') + '%'}
            onMouseEnter={() => setActiveIndex(index)}
            onFocus={() => setActiveIndex(index)}
            onBlur={() => setActiveIndex(null)}
          />
        ))}
      </div>
      {activePoint && (
        <DashboardChartTooltip
          left={activePoint.x}
          top={activePoint.y}
          label={activePoint.label}
          value={activePoint.value.toFixed(2).replace('.', ',') + '%'}
        />
      )}
    </div>
  );
};

const DashboardCitiesCard = ({
  cities,
}: {
  cities: Array<{ city: string; count: number }>;
}) => {
  return (
    <section className="rounded-xl border border-zinc-200 bg-white !p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <p className="text-sm font-bold text-zinc-950">Top cidades</p>
        <span className="text-xs font-bold text-zinc-500">Ver todas</span>
      </div>
      <div className="!mt-4 flex flex-col !gap-3">
        {cities.length === 0 ? (
          <p className="text-sm text-zinc-500">Sem cidades registradas.</p>
        ) : (
          cities.map((city) => (
            <div key={city.city} className="flex items-center justify-between !gap-3 text-sm">
              <span className="text-zinc-700">{city.city}</span>
              <strong className="text-zinc-950">{city.count} pedido{city.count === 1 ? "" : "s"}</strong>
            </div>
          ))
        )}
      </div>
    </section>
  );
};

const getDashboardRevenueSeries = (
  orders: AdminOrder[],
  period: DashboardPeriod
) => {
  return getDashboardPeriodPoints(orders, period, (order) => order.total);
};

const getDashboardOrderSeries = (
  orders: AdminOrder[],
  period: DashboardPeriod
) => {
  return getDashboardPeriodPoints(orders, period, () => 1);
};

const getDashboardConversionSeries = (orders: AdminOrder[]) => {
  const totalPoints = getDashboardPeriodPoints(orders, 7, () => 1);
  const paidPoints = getDashboardPeriodPoints(
    orders.filter((order) => order.status === "paid"),
    7,
    () => 1
  );

  return totalPoints.map((point, index) => {
    const total = point.value;
    const paid = paidPoints[index]?.value || 0;

    return {
      ...point,
      value: total > 0 ? (paid / total) * 100 : 0,
    };
  });
};

const getDashboardPeriodPoints = (
  orders: AdminOrder[],
  period: DashboardPeriod,
  getValue: (order: AdminOrder) => number
): DashboardChartPoint[] => {
  const points = getEmptyDashboardPoints(period);
  const valuesByDate = new Map(points.map((point) => [point.key, 0]));

  orders.forEach((order) => {
    const dateKey = getDashboardDateKey(new Date(order.createdAt));

    if (!valuesByDate.has(dateKey)) return;

    valuesByDate.set(dateKey, (valuesByDate.get(dateKey) || 0) + getValue(order));
  });

  return points.map((point) => ({
    ...point,
    value: valuesByDate.get(point.key) || 0,
  }));
};

const getEmptyDashboardPoints = (period: DashboardPeriod) => {
  const today = new Date();

  return Array.from({ length: period }).map((_, index) => {
    const date = new Date(today);
    date.setHours(0, 0, 0, 0);
    date.setDate(today.getDate() - (period - 1 - index));

    return {
      key: getDashboardDateKey(date),
      label: date.toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
      }),
      value: 0,
    };
  });
};

const getDashboardDateKey = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const getVisibleDashboardLabels = (points: DashboardChartPoint[]) => {
  if (points.length <= 7) return points.map((point) => point.label);

  const lastIndex = points.length - 1;
  const indexes = [0, Math.floor(lastIndex / 4), Math.floor(lastIndex / 2), Math.ceil((lastIndex * 3) / 4), lastIndex];

  return indexes.map((index) => points[index]?.label).filter(Boolean);
};

const getDashboardTopProducts = (orders: AdminOrder[]) => {
  const productSales = new Map<string, { sales: number; revenue: number }>();

  orders.forEach((order) => {
    order.items.forEach((item) => {
      const title = item.title || "Produto";
      const quantity = item.quantity || 1;
      const product = products.find((currentProduct) => currentProduct.name === title);
      const unitPrice = product
        ? getPriceNumber(product.price)
        : order.total / Math.max(1, getOrderItemsCount(order));
      const current = productSales.get(title) || { sales: 0, revenue: 0 };

      productSales.set(title, {
        sales: current.sales + quantity,
        revenue: current.revenue + unitPrice * quantity,
      });
    });
  });

  const rankedProducts = products.map((product, index) => {
    const sale = productSales.get(product.name);
    const fallbackSales = Math.max(1, 5 - index);

    return {
      id: product.id,
      name: product.name,
      image: product.image,
      sales: sale?.sales ?? fallbackSales,
      revenue: sale?.revenue ?? getPriceNumber(product.price) * fallbackSales,
    };
  });

  return rankedProducts.sort((first, second) => second.sales - first.sales).slice(0, 5);
};

const getDashboardTopCities = (orders: AdminOrder[]) => {
  const cities = new Map<string, number>();

  orders.forEach((order) => {
    const city = [order.customer?.city, order.customer?.state]
      .filter(Boolean)
      .join(" / ");

    if (!city) return;

    cities.set(city, (cities.get(city) || 0) + 1);
  });

  return [...cities.entries()]
    .map(([city, count]) => ({ city, count }))
    .sort((first, second) => second.count - first.count)
    .slice(0, 5);
};

const getDashboardDateRange = () => {
  const formatter = new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
  const today = new Date();

  return `${formatter.format(today)} - ${formatter.format(today)}`;
};

const ComingSoonPanel = ({ section }: { section: AdminSection }) => {
  const content: Record<
    Exclude<AdminSection, "dashboard" | "orders" | "deliveries" | "banners">,
    { title: string; description: string; icon: typeof Package }
  > = {
    products: {
      title: "Produtos",
      description:
        "Área reservada para cadastrar e editar produtos depois. Por enquanto, seguimos usando os dados atuais do site.",
      icon: Package,
    },
    clients: {
      title: "Clientes",
      description:
        "Em breve você vai conseguir consultar clientes, histórico de compras e informações de contato.",
      icon: Users,
    },
    coupons: {
      title: "Cupons",
      description:
        "Tela em desenvolvimento para criar descontos, acompanhar uso e controlar validade dos cupons.",
      icon: Gift,
    },
    reviews: {
      title: "Avaliações",
      description:
        "Área em desenvolvimento para gerenciar avaliações dos produtos e feedbacks dos clientes.",
      icon: Star,
    },
    settings: {
      title: "Configurações",
      description:
        "Espaço reservado para ajustes da loja, integrações, dados comerciais e preferências do checkout.",
      icon: Settings,
    },
  };
  const current = content[section as keyof typeof content];
  const Icon = current.icon;

  return (
    <section className="flex min-h-[520px] items-center justify-center rounded-xl border border-zinc-200 bg-white !p-6 text-center shadow-sm">
      <div className="max-w-md">
        <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-zinc-100 text-zinc-700">
          <Icon size={28} />
        </span>
        <h1 className="!mt-5 font-[family-name:var(--font-bebas)] text-5xl text-zinc-950">
          {current.title}
        </h1>
        <p className="!mt-2 text-sm leading-relaxed text-zinc-500">
          {current.description}
        </p>
        <span className="!mt-6 inline-flex rounded-full bg-black !px-4 !py-2 text-xs font-bold uppercase text-white">
          Em desenvolvimento
        </span>
      </div>
    </section>
  );
};

export default AdminPage;

