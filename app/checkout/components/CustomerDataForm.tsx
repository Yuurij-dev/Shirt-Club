"use client";

import { FormEvent, useMemo, useState } from "react";
import { CreditCard, Loader2, Lock, MapPin, User } from "lucide-react";
import { toast } from "sonner";
import type { CartItem } from "@/app/context/CartContext";
import { formatPrice } from "@/app/utils/price";

type CustomerDataFormProps = {
  items: CartItem[];
  subtotal: number;
};

type CheckoutFormData = {
  name: string;
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

const initialFormData: CheckoutFormData = {
  name: "",
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

const isValidEmail = (email: string) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
};

const getFieldError = (
  field: keyof CheckoutFormData,
  value: string
): string => {
  if (requiredFields.includes(field) && !value.trim()) {
    return "Campo obrigatorio";
  }

  if (field === "email" && value.trim() && !isValidEmail(value)) {
    return "Digite um e-mail valido";
  }

  if (field === "whatsapp" && value.trim()) {
    const digits = onlyDigits(value);

    if (digits.length < 10 || digits.length > 11) {
      return "Digite um WhatsApp valido";
    }
  }

  if (field === "cep" && value.trim() && onlyDigits(value).length !== 8) {
    return "Digite um CEP valido";
  }

  if (field === "state" && value.trim().length !== 2) {
    return "UF deve ter 2 letras";
  }

  return "";
};

const CustomerDataForm = ({ items, subtotal }: CustomerDataFormProps) => {
  const [formData, setFormData] = useState(initialFormData);
  const [touchedFields, setTouchedFields] = useState<
    Partial<Record<keyof CheckoutFormData, boolean>>
  >({});
  const [isFetchingCep, setIsFetchingCep] = useState(false);
  const [cepLookupError, setCepLookupError] = useState("");

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

  const fetchAddressByCep = async (cep: string) => {
    const digits = onlyDigits(cep);

    if (digits.length !== 8) return;

    setIsFetchingCep(true);
    setCepLookupError("");

    try {
      const response = await fetch(`https://viacep.com.br/ws/${digits}/json/`);
      const address = (await response.json()) as ViaCepResponse;

      if (address.erro) {
        setCepLookupError("CEP nao encontrado");
        markFieldAsTouched("cep");
        toast.error("CEP nao encontrado");
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
      toast.error("Nao foi possivel validar o CEP agora");
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

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!validateForm()) {
      toast.error("Revise os campos destacados");
      return;
    }

    const orderDraft = {
      id: `SC-${Date.now()}`,
      customer: {
        ...formData,
        whatsappDigits: onlyDigits(formData.whatsapp),
        cepDigits: onlyDigits(formData.cep),
      },
      items: items.map((item) => ({
        productId: item.product.id,
        name: item.product.name,
        price: item.product.price,
        quantity: item.quantity,
        size: item.size,
        customization: item.customization,
      })),
      status: "Pendente",
      subtotal,
      total: subtotal,
      createdAt: new Date().toISOString(),
    };

    localStorage.setItem("@shirtclub:checkout-draft", JSON.stringify(orderDraft));

    toast.success("Dados salvos. Checkout Mercado Pago em breve.");
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col !gap-6">
      <section className="rounded-xl border border-zinc-200 bg-white !p-5">
        <div className="flex items-center !gap-3">
          <User size={22} />
          <h2 className="font-[family-name:var(--font-bebas)] text-3xl leading-none text-zinc-950">
            DADOS DO CLIENTE
          </h2>
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
            <span className={labelClass}>Endereco</span>
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
            <span className={labelClass}>Numero</span>
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
          <span className={labelClass}>Observacoes do pedido</span>
          <textarea
            value={formData.notes}
            onChange={(event) => handleChange("notes", event.target.value)}
            className={getTextareaClass("notes")}
            placeholder="Ex: preferencias de entrega, duvidas ou detalhes sobre personalizacao."
          />
        </label>
      </section>

      <button
        type="submit"
        disabled={isFetchingCep}
        className="flex h-14 items-center justify-center !gap-3 rounded-lg bg-black !px-5 text-sm font-bold text-white transition-all duration-200 hover:bg-zinc-800 disabled:cursor-not-allowed disabled:bg-zinc-400"
      >
        <CreditCard size={20} />
        CONTINUAR PARA PAGAMENTO - {formatPrice(subtotal)}
      </button>

      <div className="flex items-center justify-center !gap-2 text-xs text-zinc-500">
        <Lock size={14} />
        Seus dados serao usados apenas para processar este pedido.
      </div>
    </form>
  );
};

export default CustomerDataForm;
