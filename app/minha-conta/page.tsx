"use client";

import { FormEvent, useEffect, useState } from "react";
import type { ReactNode } from "react";
import Link from "next/link";
import { Loader2, LogOut, Package, Save, User } from "lucide-react";
import { toast } from "sonner";
import Header from "../components/header";
import Footer from "../components/Footer";
import { useAuth } from "../context/AuthContext";
import { formatPrice } from "../utils/price";

type CustomerOrder = {
  id: string;
  status: "unpaid" | "paid";
  deliveryStatus: string;
  total: number;
  createdAt: string;
  items: Array<{
    title?: string;
    quantity?: number;
    size?: string;
  }>;
};

type ViaCepResponse = {
  erro?: boolean;
  logradouro?: string;
  bairro?: string;
  localidade?: string;
  uf?: string;
};

const deliveryLabels: Record<string, string> = {
  not_separated: "Não separado",
  separated: "Separado",
  shipped: "Enviado",
  delivered: "Entregue",
  canceled: "Cancelado",
};

const emptyProfileForm = {
  name: "",
  email: "",
  whatsapp: "",
  cpf: "",
  cep: "",
  street: "",
  number: "",
  complement: "",
  neighborhood: "",
  city: "",
  state: "",
};

const onlyDigits = (value = "") => value.replace(/\D/g, "");

const requiredProfileFields: Array<keyof typeof emptyProfileForm> = [
  "name",
  "email",
  "whatsapp",
  "cpf",
  "cep",
  "street",
  "number",
  "neighborhood",
  "city",
  "state",
];

const formatWhatsapp = (value: string) => {
  const digits = onlyDigits(value).slice(0, 11);

  if (digits.length <= 2) return digits;
  if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  if (digits.length <= 10) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  }

  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
};

const formatCep = (value: string) => {
  const digits = onlyDigits(value).slice(0, 8);

  if (digits.length <= 5) return digits;

  return `${digits.slice(0, 5)}-${digits.slice(5)}`;
};

const formatCpf = (value: string) => {
  const digits = onlyDigits(value).slice(0, 11);

  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return `${digits.slice(0, 3)}.${digits.slice(3)}`;
  if (digits.length <= 9) {
    return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6)}`;
  }

  return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9)}`;
};

const isValidEmail = (email: string) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
};

const isValidCpf = (value: string) => {
  const cpf = onlyDigits(value);

  if (cpf.length !== 11) return false;
  if (/^(\d)\1{10}$/.test(cpf)) return false;

  const calculateDigit = (digits: string, factor: number) => {
    const total = digits.split("").reduce((sum, digit) => {
      const result = sum + Number(digit) * factor;
      factor -= 1;

      return result;
    }, 0);
    const rest = (total * 10) % 11;

    return rest === 10 ? 0 : rest;
  };

  const firstDigit = calculateDigit(cpf.slice(0, 9), 10);
  const secondDigit = calculateDigit(cpf.slice(0, 10), 11);

  return firstDigit === Number(cpf[9]) && secondDigit === Number(cpf[10]);
};

const getProfileFieldError = (
  field: keyof typeof emptyProfileForm,
  value: string
) => {
  if (requiredProfileFields.includes(field) && !value.trim()) {
    return "Campo obrigatório";
  }

  if (field === "email" && value.trim() && !isValidEmail(value)) {
    return "Digite um e-mail válido";
  }

  if (field === "cpf" && value.trim() && !isValidCpf(value)) {
    return "Digite um CPF válido";
  }

  if (field === "whatsapp" && value.trim()) {
    const digits = onlyDigits(value);

    if (digits.length < 10 || digits.length > 11) {
      return "Digite um WhatsApp válido";
    }
  }

  if (field === "cep" && value.trim() && onlyDigits(value).length !== 8) {
    return "Digite um CEP válido";
  }

  if (field === "state" && value.trim().length !== 2) {
    return "UF deve ter 2 letras";
  }

  return "";
};

const AccountPage = () => {
  const {
    customer,
    isLoading,
    isAuthenticated,
    loginWithGoogle,
    logout,
    authFetch,
    refreshCustomer,
  } = useAuth();
  const [orders, setOrders] = useState<CustomerOrder[]>([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isFetchingCep, setIsFetchingCep] = useState(false);
  const [cepLookupError, setCepLookupError] = useState("");
  const [touchedFields, setTouchedFields] = useState<
    Partial<Record<keyof typeof emptyProfileForm, boolean>>
  >({});
  const [formData, setFormData] = useState(emptyProfileForm);

  useEffect(() => {
    if (!customer) return;

    setFormData({
      name: customer.name || "",
      email: customer.email || "",
      whatsapp: formatWhatsapp(customer.whatsapp || ""),
      cpf: formatCpf(customer.cpf || ""),
      cep: formatCep(customer.cep || ""),
      street: customer.street || "",
      number: customer.number || "",
      complement: customer.complement || "",
      neighborhood: customer.neighborhood || "",
      city: customer.city || "",
      state: customer.state || "",
    });
  }, [customer]);

  useEffect(() => {
    if (!isAuthenticated) return;

    const loadOrders = async () => {
      setIsLoadingOrders(true);

      try {
        const response = await authFetch("/api/customer/orders");
        if (!response.ok) return;

        const data = (await response.json()) as { orders?: CustomerOrder[] };
        setOrders(data.orders || []);
      } finally {
        setIsLoadingOrders(false);
      }
    };

    void loadOrders();
  }, [authFetch, isAuthenticated]);

  const updateField = (field: keyof typeof emptyProfileForm, value: string) => {
    setFormData((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const fieldErrors = Object.keys(formData).reduce((errors, key) => {
    const field = key as keyof typeof emptyProfileForm;

    return {
      ...errors,
      [field]:
        field === "cep"
          ? cepLookupError || getProfileFieldError(field, formData[field])
          : getProfileFieldError(field, formData[field]),
    };
  }, {} as Record<keyof typeof emptyProfileForm, string>);

  const markFieldAsTouched = (field: keyof typeof emptyProfileForm) => {
    setTouchedFields((current) => ({
      ...current,
      [field]: true,
    }));
  };

  const handleWhatsappChange = (value: string) => {
    updateField("whatsapp", formatWhatsapp(value));
  };

  const handleCpfChange = (value: string) => {
    updateField("cpf", formatCpf(value));
  };

  const fetchAddressByCep = async (cep: string) => {
    const digits = onlyDigits(cep);

    if (digits.length !== 8) return;

    setIsFetchingCep(true);
    setCepLookupError("");

    try {
      const response = await fetch(`https://viacep.com.br/ws/${digits}/json/`);
      const address = (await response.json()) as ViaCepResponse;

      if (address.erro) {
        setCepLookupError("CEP não encontrado");
        markFieldAsTouched("cep");
        toast.error("CEP não encontrado");
        return;
      }

      setFormData((current) => ({
        ...current,
        street: address.logradouro || current.street,
        neighborhood: address.bairro || current.neighborhood,
        city: address.localidade || current.city,
        state: address.uf || current.state,
      }));

      setTouchedFields((current) => ({
        ...current,
        cep: true,
        street: true,
        neighborhood: true,
        city: true,
        state: true,
      }));
    } catch {
      toast.error("Não foi possível validar o CEP agora");
    } finally {
      setIsFetchingCep(false);
    }
  };

  const handleCepChange = (value: string) => {
    const formattedCep = formatCep(value);

    setCepLookupError("");
    updateField("cep", formattedCep);

    if (onlyDigits(formattedCep).length === 8) {
      void fetchAddressByCep(formattedCep);
    }
  };

  const validateProfile = () => {
    const invalidFields = requiredProfileFields.filter((field) => {
      return fieldErrors[field];
    });

    setTouchedFields(
      requiredProfileFields.reduce((fields, field) => {
        return {
          ...fields,
          [field]: true,
        };
      }, {} as Partial<Record<keyof typeof emptyProfileForm, boolean>>)
    );

    return invalidFields.length === 0;
  };

  const saveProfile = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!validateProfile()) {
      toast.error("Revise os campos destacados");
      return;
    }

    setIsSaving(true);

    try {
      const response = await authFetch("/api/customer/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          whatsapp: onlyDigits(formData.whatsapp),
          cpf: onlyDigits(formData.cpf),
          cep: onlyDigits(formData.cep),
          state: formData.state.toUpperCase().trim(),
        }),
      });

      if (!response.ok) {
        toast.error("Não foi possível salvar seus dados");
        return;
      }

      await refreshCustomer();
      toast.success("Dados salvos");
    } finally {
      setIsSaving(false);
    }
  };

  const renderField = (
    label: string,
    field: keyof typeof emptyProfileForm,
    placeholder = "",
    options?: {
      inputMode?: "numeric";
      maxLength?: number;
      type?: string;
      onChange?: (value: string) => void;
      onBlur?: () => void;
      rightIcon?: ReactNode;
    }
  ) => (
    <label className="flex flex-col !gap-2">
      <span className="text-xs font-bold uppercase text-zinc-950">{label}</span>
      <div className="relative">
        <input
          type={options?.type}
          inputMode={options?.inputMode}
          maxLength={options?.maxLength}
          value={formData[field]}
          onBlur={() => {
            markFieldAsTouched(field);
            options?.onBlur?.();
          }}
          onChange={(event) => {
            if (options?.onChange) {
              options.onChange(event.target.value);
              return;
            }

            updateField(field, event.target.value);
          }}
          placeholder={placeholder}
          className={`h-12 w-full rounded-lg border !px-4 text-sm font-medium outline-none transition-all duration-200 ${
            options?.rightIcon ? "!pr-10" : ""
          } ${
            touchedFields[field] && fieldErrors[field]
              ? "border-red-500 text-red-600 focus:border-red-600"
              : "border-zinc-200 focus:border-black"
          }`}
        />
        {options?.rightIcon}
      </div>
      {touchedFields[field] && fieldErrors[field] && (
        <span className="text-xs font-medium text-red-600">
          {fieldErrors[field]}
        </span>
      )}
    </label>
  );

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Header />

      <main className="container !mx-auto flex-1 !px-4 !py-10 sm:!px-6 lg:!px-0">
        {!isAuthenticated && !isLoading ? (
          <section className="!mx-auto w-full max-w-xl rounded-xl border border-zinc-200 bg-white !p-8 text-center shadow-sm">
            <User className="mx-auto" size={34} />
            <h1 className="!mt-4 font-[family-name:var(--font-bebas)] text-5xl">
              Minha conta
            </h1>
            <p className="!mt-2 text-sm text-zinc-500">
              Entre com Google para acompanhar seus pedidos, salvar endereço e
              manter carrinho e favoritos na sua conta.
            </p>
            <button
              type="button"
              onClick={loginWithGoogle}
              className="!mt-6 inline-flex h-12 cursor-pointer items-center justify-center rounded-lg bg-black !px-6 text-sm font-bold text-white"
            >
              ENTRAR COM GOOGLE
            </button>
          </section>
        ) : (
          <div className="grid grid-cols-1 !gap-6 lg:grid-cols-[420px_1fr]">
            <section className="rounded-xl border border-zinc-200 bg-white !p-5 shadow-sm">
              <div className="flex items-start justify-between !gap-4">
                <div>
                  <h1 className="font-[family-name:var(--font-bebas)] text-5xl">
                    Minha conta
                  </h1>
                  <p className="text-sm text-zinc-500">
                    {customer?.email || "Cliente Shirt Club"}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={logout}
                  className="inline-flex h-10 cursor-pointer items-center !gap-2 rounded-lg border border-zinc-200 !px-3 text-xs font-bold"
                >
                  <LogOut size={15} />
                  SAIR
                </button>
              </div>

              <form onSubmit={saveProfile} className="!mt-6 grid grid-cols-1 !gap-4">
                {renderField("Nome", "name")}
                {renderField("E-mail", "email", "seuemail@email.com", {
                  type: "email",
                })}
                {renderField("WhatsApp", "whatsapp", "(00) 00000-0000", {
                  inputMode: "numeric",
                  onChange: handleWhatsappChange,
                })}
                {renderField("CPF", "cpf", "000.000.000-00", {
                  inputMode: "numeric",
                  onChange: handleCpfChange,
                })}
                {renderField("CEP", "cep", "00000-000", {
                  inputMode: "numeric",
                  onChange: handleCepChange,
                  onBlur: () => void fetchAddressByCep(formData.cep),
                  rightIcon: isFetchingCep ? (
                    <Loader2
                      size={18}
                      className="absolute right-3 top-1/2 -translate-y-1/2 animate-spin text-zinc-500"
                    />
                  ) : null,
                })}
                {renderField("Rua", "street")}
                <div className="grid grid-cols-2 !gap-3">
                  {renderField("Número", "number")}
                  {renderField("UF", "state", "DF", {
                    maxLength: 2,
                    onChange: (value) => updateField("state", value.toUpperCase()),
                  })}
                </div>
                {renderField("Complemento", "complement")}
                {renderField("Bairro", "neighborhood")}
                {renderField("Cidade", "city")}

                <button
                  type="submit"
                  disabled={isSaving || isFetchingCep}
                  className="inline-flex h-12 cursor-pointer items-center justify-center !gap-2 rounded-lg bg-black text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <Save size={17} />
                  {isSaving ? "SALVANDO..." : "SALVAR DADOS"}
                </button>
              </form>
            </section>

            <section className="rounded-xl border border-zinc-200 bg-white !p-5 shadow-sm">
              <div className="flex items-center justify-between !gap-4">
                <div>
                  <h2 className="font-[family-name:var(--font-bebas)] text-4xl">
                    Meus pedidos
                  </h2>
                  <p className="text-sm text-zinc-500">
                    Acompanhe suas compras feitas com esta conta.
                  </p>
                </div>
                <Package size={24} />
              </div>

              <div className="!mt-5 divide-y divide-zinc-100 overflow-hidden rounded-lg border border-zinc-100">
                {isLoadingOrders ? (
                  <div className="!p-6 text-sm text-zinc-500">Carregando pedidos...</div>
                ) : orders.length === 0 ? (
                  <div className="!p-8 text-center">
                    <p className="font-bold">Nenhum pedido encontrado</p>
                    <Link
                      href="/"
                      className="!mt-3 inline-flex h-10 items-center rounded-lg bg-black !px-4 text-xs font-bold text-white"
                    >
                      VER CAMISAS
                    </Link>
                  </div>
                ) : (
                  orders.map((order) => (
                    <article key={order.id} className="!p-4">
                      <div className="flex flex-wrap items-start justify-between !gap-3">
                        <div>
                          <h3 className="font-bold">{order.id}</h3>
                          <p className="text-xs text-zinc-500">
                            {new Date(order.createdAt).toLocaleString("pt-BR")}
                          </p>
                        </div>
                        <div className="text-right">
                          <strong>{formatPrice(order.total)}</strong>
                          <p
                            className={`text-xs font-bold ${
                              order.status === "paid"
                                ? "text-emerald-600"
                                : "text-amber-600"
                            }`}
                          >
                            {order.status === "paid" ? "Pago" : "Não pago"}
                          </p>
                          <p className="text-xs text-zinc-500">
                            {deliveryLabels[order.deliveryStatus] || order.deliveryStatus}
                          </p>
                        </div>
                      </div>
                      <div className="!mt-3 rounded-lg bg-zinc-50 !p-3 text-sm">
                        {order.items.map((item, index) => (
                          <p key={`${order.id}-${index}`}>
                            {item.quantity || 1}x {item.title || "Produto"} - Tam.{" "}
                            {item.size || "M"}
                          </p>
                        ))}
                      </div>
                    </article>
                  ))
                )}
              </div>
            </section>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default AccountPage;
