"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import {
  CreditCard,
  ClipboardCheck,
  Loader2,
  Lock,
  MapPin,
  QrCode,
  User,
} from "lucide-react";
import { toast } from "sonner";
import CartCouponCard from "@/app/carrinho/components/CartCouponCard";
import type { CartItem } from "@/app/context/CartContext";
import { useAuth } from "@/app/context/AuthContext";
import { formatPrice } from "@/app/utils/price";

type CustomerDataFormProps = {
  items: CartItem[];
  discount: number;
  pixDiscount: number;
  total: number;
  couponCode: string | null;
  paymentMethod: PaymentMethod;
  onPaymentMethodChange: (paymentMethod: PaymentMethod) => void;
};

type CheckoutFormData = {
  name: string;
  cpf: string;
  email: string;
  whatsapp: string;
  cep: string;
  street: string;
  number: string;
  complement: string;
  neighborhood: string;
  city: string;
  state: string;
  notes: string;
};

type ViaCepResponse = {
  erro?: boolean;
  logradouro?: string;
  bairro?: string;
  localidade?: string;
  uf?: string;
};

type CheckoutApiResponse = {
  order?: {
    id: string;
  };
  checkoutUrl?: string | null;
  mode?: "mercado_pago" | "pix" | "development";
  pix?: {
    ticketUrl?: string | null;
    qrCode?: string | null;
    qrCodeBase64?: string | null;
    expirationDate?: string | null;
  } | null;
  errors?: string[];
};

export type PaymentMethod = "pix" | "mercado_pago";

const initialFormData: CheckoutFormData = {
  name: "",
  cpf: "",
  email: "",
  whatsapp: "",
  cep: "",
  street: "",
  number: "",
  complement: "",
  neighborhood: "",
  city: "",
  state: "",
  notes: "",
};

const requiredFields: Array<keyof CheckoutFormData> = [
  "name",
  "cpf",
  "email",
  "whatsapp",
  "cep",
  "street",
  "number",
  "neighborhood",
  "city",
  "state",
];

const labelClass = "text-xs font-bold uppercase text-zinc-950";

const onlyDigits = (value: string) => value.replace(/\D/g, "");

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

const getFieldError = (
  field: keyof CheckoutFormData,
  value: string
): string => {
  if (requiredFields.includes(field) && !value.trim()) {
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

const CustomerDataForm = ({
  items,
  discount,
  pixDiscount,
  total,
  couponCode,
  paymentMethod,
  onPaymentMethodChange,
}: CustomerDataFormProps) => {
  const [formData, setFormData] = useState(initialFormData);
  const [touchedFields, setTouchedFields] = useState<
    Partial<Record<keyof CheckoutFormData, boolean>>
  >({});
  const [isFetchingCep, setIsFetchingCep] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [cepLookupError, setCepLookupError] = useState("");
  const { customer, authFetch } = useAuth();

  useEffect(() => {
    if (!customer) return;

    setFormData((currentFormData) => ({
      ...currentFormData,
      name: currentFormData.name || customer.name || "",
      cpf: currentFormData.cpf || formatCpf(customer.cpf || ""),
      email: currentFormData.email || customer.email || "",
      whatsapp: currentFormData.whatsapp || formatWhatsapp(customer.whatsapp || ""),
      cep: currentFormData.cep || formatCep(customer.cep || ""),
      street: currentFormData.street || customer.street || "",
      number: currentFormData.number || customer.number || "",
      complement: currentFormData.complement || customer.complement || "",
      neighborhood: currentFormData.neighborhood || customer.neighborhood || "",
      city: currentFormData.city || customer.city || "",
      state: currentFormData.state || customer.state || "",
    }));
  }, [customer]);

  const fieldErrors = useMemo(() => {
    return Object.keys(formData).reduce((errors, key) => {
      const field = key as keyof CheckoutFormData;

      return {
        ...errors,
        [field]:
          field === "cep"
            ? cepLookupError || getFieldError(field, formData[field])
            : getFieldError(field, formData[field]),
      };
    }, {} as Record<keyof CheckoutFormData, string>);
  }, [cepLookupError, formData]);

  const getInputClass = (field: keyof CheckoutFormData) => {
    const hasError = Boolean(touchedFields[field] && fieldErrors[field]);

    return `
      h-12 w-full rounded-lg border bg-white !px-4 text-sm outline-none
      transition-all duration-200
      ${
        hasError
          ? "border-red-500 text-red-600 focus:border-red-600"
          : "border-zinc-200 focus:border-black"
      }
    `;
  };

  const getTextareaClass = (field: keyof CheckoutFormData) => {
    const hasError = Boolean(touchedFields[field] && fieldErrors[field]);

    return `
      min-h-[120px] w-full resize-none rounded-lg border bg-white !p-4 text-sm
      outline-none transition-all duration-200
      ${
        hasError
          ? "border-red-500 text-red-600 focus:border-red-600"
          : "border-zinc-200 focus:border-black"
      }
    `;
  };

  const markFieldAsTouched = (field: keyof CheckoutFormData) => {
    setTouchedFields((currentTouchedFields) => ({
      ...currentTouchedFields,
      [field]: true,
    }));
  };

  const handleChange = (field: keyof CheckoutFormData, value: string) => {
    setFormData((currentFormData) => ({
      ...currentFormData,
      [field]: value,
    }));
  };

  const handleWhatsappChange = (value: string) => {
    handleChange("whatsapp", formatWhatsapp(value));
  };

  const handleCpfChange = (value: string) => {
    handleChange("cpf", formatCpf(value));
  };

  const fillTestCheckoutData = () => {
    setFormData({
      name: "Cliente Teste",
      cpf: "529.982.247-25",
      email: "cliente.teste@email.com",
      whatsapp: "(61) 99999-9999",
      cep: "71587-648",
      street: "Quadra 3 Conjunto 4 Lote 1 Bloco N",
      number: "12",
      complement: "Casa",
      neighborhood: "Paranoa Parque",
      city: "Brasilia",
      state: "DF",
      notes: "Pedido preenchido automaticamente para teste.",
    });

    setCepLookupError("");
    setTouchedFields(
      requiredFields.reduce((fields, field) => {
        return {
          ...fields,
          [field]: true,
        };
      }, {} as Partial<Record<keyof CheckoutFormData, boolean>>)
    );
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

      setFormData((currentFormData) => ({
        ...currentFormData,
        street: address.logradouro || currentFormData.street,
        neighborhood: address.bairro || currentFormData.neighborhood,
        city: address.localidade || currentFormData.city,
        state: address.uf || currentFormData.state,
      }));

      setTouchedFields((currentTouchedFields) => ({
        ...currentTouchedFields,
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
    handleChange("cep", formattedCep);

    if (onlyDigits(formattedCep).length === 8) {
      void fetchAddressByCep(formattedCep);
    }
  };

  const renderError = (field: keyof CheckoutFormData) => {
    if (!touchedFields[field] || !fieldErrors[field]) return null;

    return <span className="text-xs font-medium text-red-600">{fieldErrors[field]}</span>;
  };

  const validateForm = () => {
    const invalidFields = requiredFields.filter((field) => fieldErrors[field]);

    setTouchedFields(
      requiredFields.reduce((fields, field) => {
        return {
          ...fields,
          [field]: true,
        };
      }, {} as Partial<Record<keyof CheckoutFormData, boolean>>)
    );

    return invalidFields.length === 0;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!validateForm()) {
      toast.error("Revise os campos destacados");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await authFetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customer: {
            ...formData,
            whatsappDigits: onlyDigits(formData.whatsapp),
            cepDigits: onlyDigits(formData.cep),
            cpfDigits: onlyDigits(formData.cpf),
          },
          paymentMethod,
          couponCode,
          items: items.map((item) => ({
            productId: item.product.id,
            quantity: item.quantity,
            size: item.size,
            customization: item.customization,
            customizationPrice: item.customizationPrice || 0,
            customizationDetails: item.customizationDetails || null,
          })),
        }),
      });

      const checkout = (await response.json()) as CheckoutApiResponse;

      if (!response.ok) {
        toast.error(checkout.errors?.[0] || "Erro ao iniciar checkout");
        return;
      }

      localStorage.setItem("@shirtclub:last-order", JSON.stringify(checkout));

      if (paymentMethod === "pix" && checkout.pix) {
        localStorage.setItem("@shirtclub:last-pix", JSON.stringify(checkout));
        toast.success("Pix gerado com sucesso");
        window.location.assign(
          `/checkout/pix?orderId=${checkout.order?.id || ""}`
        );
        return;
      }

      if (checkout.checkoutUrl) {
        window.location.assign(checkout.checkoutUrl);
        return;
      }

      toast.success(
        checkout.mode === "development"
          ? "Pedido criado em modo desenvolvimento"
          : "Pedido criado"
      );
    } catch {
      toast.error("Não foi possível iniciar o checkout");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col !gap-6">
      <section className="rounded-xl border border-zinc-200 bg-white !p-5">
        <div className="flex flex-col !gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center !gap-3">
            <User size={22} />
            <h2 className="font-[family-name:var(--font-bebas)] text-3xl leading-none text-zinc-950">
              DADOS DO CLIENTE
            </h2>
          </div>

          <button
            type="button"
            onClick={fillTestCheckoutData}
            className="inline-flex h-10 cursor-pointer items-center justify-center !gap-2 rounded-lg border border-zinc-200 bg-white !px-4 text-xs font-bold text-zinc-950 transition-all duration-200 hover:border-black hover:bg-zinc-50"
          >
            <ClipboardCheck size={16} />
            PREENCHER TESTE
          </button>
        </div>

        <div className="!mt-5 grid grid-cols-1 !gap-4 md:grid-cols-2">
          <label className="flex flex-col !gap-2 md:col-span-2">
            <span className={labelClass}>Nome completo</span>
            <input
              value={formData.name}
              onBlur={() => markFieldAsTouched("name")}
              onChange={(event) => handleChange("name", event.target.value)}
              className={getInputClass("name")}
              placeholder="Digite seu nome"
            />
            {renderError("name")}
          </label>

          <label className="flex flex-col !gap-2">
            <span className={labelClass}>CPF</span>
            <input
              inputMode="numeric"
              value={formData.cpf}
              onBlur={() => markFieldAsTouched("cpf")}
              onChange={(event) => handleCpfChange(event.target.value)}
              className={getInputClass("cpf")}
              placeholder="000.000.000-00"
            />
            {renderError("cpf")}
          </label>

          <label className="flex flex-col !gap-2">
            <span className={labelClass}>E-mail</span>
            <input
              type="email"
              value={formData.email}
              onBlur={() => markFieldAsTouched("email")}
              onChange={(event) => handleChange("email", event.target.value)}
              className={getInputClass("email")}
              placeholder="seuemail@email.com"
            />
            {renderError("email")}
          </label>

          <label className="flex flex-col !gap-2">
            <span className={labelClass}>WhatsApp</span>
            <input
              inputMode="numeric"
              value={formData.whatsapp}
              onBlur={() => markFieldAsTouched("whatsapp")}
              onChange={(event) => handleWhatsappChange(event.target.value)}
              className={getInputClass("whatsapp")}
              placeholder="(00) 00000-0000"
            />
            {renderError("whatsapp")}
          </label>
        </div>
      </section>

      <section className="rounded-xl border border-zinc-200 bg-white !p-5">
        <div className="flex items-center !gap-3">
          <MapPin size={22} />
          <h2 className="font-[family-name:var(--font-bebas)] text-3xl leading-none text-zinc-950">
            ENTREGA
          </h2>
        </div>

        <div className="!mt-5 grid grid-cols-1 !gap-4 md:grid-cols-6">
          <label className="flex flex-col !gap-2 md:col-span-2">
            <span className={labelClass}>CEP</span>
            <div className="relative">
              <input
                inputMode="numeric"
                value={formData.cep}
                onBlur={() => {
                  markFieldAsTouched("cep");
                  void fetchAddressByCep(formData.cep);
                }}
                onChange={(event) => handleCepChange(event.target.value)}
                className={`${getInputClass("cep")} !pr-10`}
                placeholder="00000-000"
              />
              {isFetchingCep && (
                <Loader2
                  size={18}
                  className="absolute right-3 top-1/2 -translate-y-1/2 animate-spin text-zinc-500"
                />
              )}
            </div>
            {renderError("cep")}
          </label>

          <label className="flex flex-col !gap-2 md:col-span-4">
            <span className={labelClass}>Endereço</span>
            <input
              value={formData.street}
              onBlur={() => markFieldAsTouched("street")}
              onChange={(event) => handleChange("street", event.target.value)}
              className={getInputClass("street")}
              placeholder="Rua, avenida..."
            />
            {renderError("street")}
          </label>

          <label className="flex flex-col !gap-2 md:col-span-2">
            <span className={labelClass}>Número</span>
            <input
              value={formData.number}
              onBlur={() => markFieldAsTouched("number")}
              onChange={(event) => handleChange("number", event.target.value)}
              className={getInputClass("number")}
              placeholder="123"
            />
            {renderError("number")}
          </label>

          <label className="flex flex-col !gap-2 md:col-span-4">
            <span className={labelClass}>Complemento</span>
            <input
              value={formData.complement}
              onChange={(event) =>
                handleChange("complement", event.target.value)
              }
              className={getInputClass("complement")}
              placeholder="Apartamento, bloco, referencia..."
            />
          </label>

          <label className="flex flex-col !gap-2 md:col-span-2">
            <span className={labelClass}>Bairro</span>
            <input
              value={formData.neighborhood}
              onBlur={() => markFieldAsTouched("neighborhood")}
              onChange={(event) =>
                handleChange("neighborhood", event.target.value)
              }
              className={getInputClass("neighborhood")}
              placeholder="Seu bairro"
            />
            {renderError("neighborhood")}
          </label>

          <label className="flex flex-col !gap-2 md:col-span-3">
            <span className={labelClass}>Cidade</span>
            <input
              value={formData.city}
              onBlur={() => markFieldAsTouched("city")}
              onChange={(event) => handleChange("city", event.target.value)}
              className={getInputClass("city")}
              placeholder="Sua cidade"
            />
            {renderError("city")}
          </label>

          <label className="flex flex-col !gap-2 md:col-span-1">
            <span className={labelClass}>UF</span>
            <input
              maxLength={2}
              value={formData.state}
              onBlur={() => markFieldAsTouched("state")}
              onChange={(event) =>
                handleChange("state", event.target.value.toUpperCase())
              }
              className={getInputClass("state")}
              placeholder="SP"
            />
            {renderError("state")}
          </label>
        </div>
      </section>

      <section className="rounded-xl border border-zinc-200 bg-white !p-5">
        <label className="flex flex-col !gap-2">
          <span className={labelClass}>Observações do pedido</span>
          <textarea
            value={formData.notes}
            onChange={(event) => handleChange("notes", event.target.value)}
            className={getTextareaClass("notes")}
            placeholder="Ex: preferências de entrega, dúvidas ou detalhes sobre personalização."
          />
        </label>
      </section>

      <div className="lg:hidden">
        <CartCouponCard />
      </div>

      <section className="rounded-xl border border-zinc-200 bg-white !p-5">
        <div className="flex items-center !gap-3">
          <CreditCard size={22} />
          <h2 className="font-[family-name:var(--font-bebas)] text-3xl leading-none text-zinc-950">
            PAGAMENTO
          </h2>
        </div>

        <div className="!mt-5 grid grid-cols-1 !gap-3 sm:grid-cols-2">
          <button
            type="button"
            onClick={() => onPaymentMethodChange("pix")}
            className={`
              flex cursor-pointer items-center !gap-3 rounded-lg border !p-4 text-left transition-all duration-200
              ${
                paymentMethod === "pix"
                  ? "border-black bg-black text-white"
                  : "border-zinc-200 bg-white text-zinc-950 hover:border-black"
              }
            `}
          >
            <QrCode size={24} />
            <span>
              <strong className="block text-sm">Pix</strong>
              <small
                className={
                  paymentMethod === "pix" ? "text-zinc-300" : "text-zinc-500"
                }
              >
                QR Code e copia e cola (Desconto de 5%)
              </small>
            </span>
          </button>

          <button
            type="button"
            onClick={() => onPaymentMethodChange("mercado_pago")}
            className={`
              flex cursor-pointer items-center !gap-3 rounded-lg border !p-4 text-left transition-all duration-200
              ${
                paymentMethod === "mercado_pago"
                  ? "border-black bg-black text-white"
                  : "border-zinc-200 bg-white text-zinc-950 hover:border-black"
              }
            `}
          >
            <CreditCard size={24} />
            <span>
              <strong className="block text-sm">Cartão e outros</strong>
              <small
                className={
                  paymentMethod === "mercado_pago"
                    ? "text-zinc-300"
                    : "text-zinc-500"
                }
              >
                Redireciona para Mercado Pago
              </small>
            </span>
          </button>
        </div>
      </section>

      <button
        type="submit"
        disabled={isFetchingCep || isSubmitting}
        title={pixDiscount > 0 ? "Desconto de 5% aplicado no Pix" : undefined}
        className="flex h-14 cursor-pointer items-center justify-center !gap-3 rounded-lg bg-black !px-5 text-sm font-bold text-white transition-all duration-200 hover:bg-zinc-800 disabled:cursor-not-allowed disabled:bg-zinc-400"
      >
        {isSubmitting ? (
          <Loader2 size={20} className="animate-spin" />
        ) : paymentMethod === "pix" ? (
          <QrCode size={20} />
        ) : (
          <CreditCard size={20} />
        )}
        {isSubmitting
          ? "INICIANDO CHECKOUT..."
          : paymentMethod === "pix"
            ? `GERAR PIX - ${formatPrice(total)}`
            : `CONTINUAR PARA PAGAMENTO - ${formatPrice(total)}`}
      </button>

      <div className="flex items-center justify-center !gap-2 text-xs text-zinc-500">
        <Lock size={14} />
        {discount > 0 && couponCode
          ? `Cupom ${couponCode} aplicado no pedido.`
          : "Seus dados serão usados apenas para processar este pedido."}
      </div>
    </form>
  );
};

export default CustomerDataForm;
