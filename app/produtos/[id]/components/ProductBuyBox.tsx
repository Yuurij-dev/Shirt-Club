"use client";

import {
  Check,
  CreditCard,
  Info,
  Ruler,
  ShieldCheck,
  ShoppingCart,
  Truck,
  Zap,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { Product } from "@/app/data/products";
import {
  defaultStoreSettings,
  type StoreSettings,
} from "@/app/data/storeSettings";
import { useCart } from "@/app/context/CartContext";
import { formatPrice, getPriceNumber } from "@/app/utils/price";

type ProductBuyBoxProps = {
  product: Product;
};

const sizes = ["P", "M", "G", "GG", "XG"];

const buildCustomizationSummary = ({
  phrase,
  name,
  number,
}: {
  phrase: string;
  name: string;
  number: string;
}) => {
  const parts = [
    phrase.trim() ? `Frase: ${phrase.trim()}` : "",
    name.trim() ? `Nome: ${name.trim()}` : "",
    number.trim() ? `Número: ${number.trim()}` : "",
  ].filter(Boolean);

  return parts.length ? parts.join(" | ") : "Com personalização";
};

const ProductBuyBox = ({ product }: ProductBuyBoxProps) => {
  const router = useRouter();
  const { addItem } = useCart();
  const [selectedSize, setSelectedSize] = useState("M");
  const [quantity, setQuantity] = useState(1);
  const [cartButtonState, setCartButtonState] = useState<"idle" | "added">(
    "idle"
  );
  const [hasCustomization, setHasCustomization] = useState(false);
  const [customPhrase, setCustomPhrase] = useState("");
  const [customName, setCustomName] = useState("");
  const [customNumber, setCustomNumber] = useState("");
  const [showCustomizationInfo, setShowCustomizationInfo] = useState(false);
  const [showSizeGuide, setShowSizeGuide] = useState(false);
  const [storeSettings, setStoreSettings] =
    useState<StoreSettings>(defaultStoreSettings);
  const price = getPriceNumber(product.price);
  const phrasePrice = storeSettings.customizationPricing.phrase;
  const namePrice = storeSettings.customizationPricing.name;
  const numberDigitPrice = storeSettings.customizationPricing.numberDigit;
  const numberPrice = customNumber.length * numberDigitPrice;
  const customizationPrice = hasCustomization
    ? (customPhrase.trim() ? phrasePrice : 0) +
      (customName.trim() ? namePrice : 0) +
      numberPrice
    : 0;
  const unitPrice = price + customizationPrice;
  const installment = unitPrice / 12;
  const customizationSummary = hasCustomization
    ? buildCustomizationSummary({
        phrase: customPhrase,
        name: customName,
        number: customNumber,
      })
    : "Sem personalização";
  const customizationDetails = {
    enabled: hasCustomization,
    phrase: customPhrase.trim() || undefined,
    name: customName.trim() || undefined,
    number: customNumber.trim() || undefined,
    price: customizationPrice,
  };

  useEffect(() => {
    let shouldIgnore = false;

    const loadSettings = async () => {
      try {
        const response = await fetch("/api/settings", { cache: "no-store" });
        const data = (await response.json()) as { settings?: StoreSettings };

        if (!shouldIgnore && data.settings) {
          setStoreSettings(data.settings);
        }
      } catch {
        if (!shouldIgnore) {
          setStoreSettings(defaultStoreSettings);
        }
      }
    };

    void loadSettings();

    return () => {
      shouldIgnore = true;
    };
  }, []);

  const handleAddToCart = () => {
    if (cartButtonState !== "idle") return;

    addItem({
      product,
      quantity,
      size: selectedSize,
      customization: customizationSummary,
      customizationPrice,
      customizationDetails,
    });

    setCartButtonState("added");

    setTimeout(() => {
      setCartButtonState("idle");
    }, 1200);
  };

  const handleBuyNow = () => {
    addItem({
      product,
      quantity,
      size: selectedSize,
      customization: customizationSummary,
      customizationPrice,
      customizationDetails,
      silent: true,
    });

    router.push("/checkout");
  };

  return (
    <div>
      {product.badge && (
        <span className="inline-flex rounded-md bg-black !px-3 !py-1 text-xs font-bold text-white">
          {product.badge}
        </span>
      )}

      <h1 className="!mt-3 text-3xl font-bold text-zinc-950 sm:text-4xl">
        {product.name}
      </h1>

      <div className="!mt-3 flex flex-wrap items-center !gap-2 text-sm text-zinc-600">
        <span>{product.team}</span>
        {product.brand && <span>• {product.brand}</span>}
        {product.season && <span>• {product.season}</span>}
      </div>

      <p className="!mt-5 text-3xl font-bold text-zinc-950">
        {formatPrice(unitPrice)}
      </p>

      {customizationPrice > 0 && (
        <p className="!mt-1 text-sm font-medium text-emerald-700">
          Inclui {formatPrice(customizationPrice)} de personalização
        </p>
      )}

      <p className="!mt-1 text-sm text-zinc-600">
        ou 12x de R$ {installment.toFixed(2).replace(".", ",")} sem juros
      </p>

      <p className="!mt-6 max-w-[620px] text-sm leading-7 text-zinc-700">
        {product.description}
      </p>

      <div className="!my-7 h-px w-full bg-zinc-200" />

      <div className="!mb-7">
        <div className="flex items-center justify-between !gap-3">
          <h2 className="text-xs font-bold uppercase text-zinc-950">
            Personalização
          </h2>

          <div className="relative">
            <button
              type="button"
              onClick={() => setShowCustomizationInfo((current) => !current)}
              onMouseEnter={() => setShowCustomizationInfo(true)}
              onMouseLeave={() => setShowCustomizationInfo(false)}
              className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border border-zinc-200 text-zinc-700 transition-all duration-200 hover:border-black"
              aria-label="Informações sobre personalização"
            >
              <Info size={15} />
            </button>

            {showCustomizationInfo && (
              <div className="absolute right-0 top-10 z-20 w-72 rounded-lg bg-zinc-900 !p-4 text-center text-xs leading-5 text-white shadow-xl">
                <strong className="block text-base">Serviço de Personalização</strong>
                <span className="!mt-2 block">
                  Este serviço acrescenta até 5 dias úteis ao prazo de postagem.
                  Confira se as informações digitadas estão corretas antes de
                  fechar o pedido. Produtos personalizados não podem ser
                  trocados por erro de digitação.
                </span>
                <strong className="!mt-3 block">Garantia de 7 dias</strong>
                <span className="!mt-1 block">
                  Em caso de defeito ou erro na aplicação, entre em contato com
                  nossa equipe.
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="!mt-3 grid grid-cols-2 !gap-3">
          <button
            type="button"
            onClick={() => setHasCustomization(false)}
            className={`h-11 cursor-pointer rounded-md border !px-3 text-sm font-bold transition-all duration-200 ${
              !hasCustomization
                ? "border-black bg-black text-white"
                : "border-zinc-200 bg-white text-zinc-950 hover:border-black"
            }`}
          >
            Sem personalização
          </button>
          <button
            type="button"
            onClick={() => setHasCustomization(true)}
            className={`h-11 cursor-pointer rounded-md border !px-3 text-sm font-bold transition-all duration-200 ${
              hasCustomization
                ? "border-black bg-black text-white"
                : "border-zinc-200 bg-white text-zinc-950 hover:border-black"
            }`}
          >
            Com personalização
          </button>
        </div>

        {hasCustomization && (
          <div className="!mt-4 rounded-lg border border-zinc-200 bg-zinc-50 !p-4">
            <div className="flex flex-col !gap-4">
              <label className="flex flex-col !gap-2">
                <div className="flex items-center justify-between !gap-3">
                  <span className="text-xs font-bold uppercase text-zinc-700">
                    Frase
                  </span>
                  <span className="text-xs font-bold text-zinc-950">
                    + {formatPrice(phrasePrice)}
                  </span>
                </div>
                <input
                  value={customPhrase}
                  maxLength={70}
                  onChange={(event) => setCustomPhrase(event.target.value)}
                  className="h-11 rounded-md border border-zinc-200 bg-white !px-4 text-sm font-semibold outline-none transition-all duration-200 focus:border-black"
                  placeholder="Frase"
                />
                <span className="text-[11px] text-zinc-500">
                  {70 - customPhrase.length} caracteres restantes
                </span>
              </label>

              <div className="grid grid-cols-1 !gap-4 sm:grid-cols-2">
                <label className="flex flex-col !gap-2">
                  <div className="flex items-center justify-between !gap-3">
                    <span className="text-xs font-bold uppercase text-zinc-700">
                      Nome
                    </span>
                    <span className="text-xs font-bold text-zinc-950">
                      + {formatPrice(namePrice)}
                    </span>
                  </div>
                  <input
                    value={customName}
                    maxLength={12}
                    onChange={(event) => setCustomName(event.target.value)}
                    className="h-11 rounded-md border border-zinc-200 bg-white !px-4 text-sm font-semibold outline-none transition-all duration-200 focus:border-black"
                    placeholder="Nome"
                  />
                  <span className="text-[11px] text-zinc-500">
                    {12 - customName.length} caracteres restantes
                  </span>
                </label>

                <label className="flex flex-col !gap-2">
                  <div className="flex items-center justify-between !gap-3">
                    <span className="text-xs font-bold uppercase text-zinc-700">
                      Número
                    </span>
                    <span className="text-xs font-bold text-zinc-950">
                      + {formatPrice(numberPrice || numberDigitPrice)}
                    </span>
                  </div>
                  <input
                    value={customNumber}
                    maxLength={3}
                    inputMode="numeric"
                    onChange={(event) =>
                      setCustomNumber(event.target.value.replace(/\D/g, ""))
                    }
                    className="h-11 rounded-md border border-zinc-200 bg-white !px-4 text-sm font-semibold outline-none transition-all duration-200 focus:border-black"
                    placeholder="Número"
                  />
                  <span className="text-[11px] text-zinc-500">
                    {3 - customNumber.length} caracteres restantes
                  </span>
                </label>
              </div>
            </div>
          </div>
        )}
      </div>

      <div>
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-bold uppercase text-zinc-950">
            Tamanho
          </h2>

          <button
            type="button"
            onClick={() => setShowSizeGuide(true)}
            className="flex cursor-pointer items-center !gap-2 text-xs font-medium text-zinc-700 transition-all duration-200 hover:text-black"
          >
            <Ruler size={14} />
            Guia de tamanhos
          </button>
        </div>

        <div className="!mt-3 flex flex-wrap !gap-3">
          {sizes.map((size) => (
            <button
              key={size}
              type="button"
              onClick={() => setSelectedSize(size)}
              className={`
                h-11 min-w-14 rounded-md border !px-4 text-sm font-bold transition-all duration-200
                ${
                  selectedSize === size
                    ? "border-black bg-black text-white"
                    : "border-zinc-200 bg-white text-zinc-950 hover:border-black"
                }
              `}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      <div className="!mt-6">
        <h2 className="text-xs font-bold uppercase text-zinc-950">
          Quantidade
        </h2>

        <div className="!mt-3 inline-flex h-11 items-center rounded-md border border-zinc-200">
          <button
            type="button"
            onClick={() => setQuantity((current) => Math.max(1, current - 1))}
            className="h-full w-11 text-xl"
          >
            -
          </button>
          <span className="w-10 text-center text-sm font-bold">{quantity}</span>
          <button
            type="button"
            onClick={() => setQuantity((current) => current + 1)}
            className="h-full w-11 text-xl"
          >
            +
          </button>
        </div>
      </div>

      <div className="!mt-7 grid grid-cols-1 !gap-3 sm:grid-cols-2">
        <button
          type="button"
          onClick={handleAddToCart}
          className="group relative flex h-14 cursor-pointer items-center justify-center overflow-hidden rounded-lg bg-black !px-5 text-sm font-bold text-white transition-all duration-200 hover:bg-zinc-800"
        >
          <span
            className={`
              absolute inset-0 flex items-center justify-center !gap-3 whitespace-nowrap transition-all duration-300
              ${
                cartButtonState === "added"
                  ? "-translate-y-2 scale-95 opacity-0"
                  : "translate-y-0 scale-100 opacity-100"
              }
            `}
          >
            <ShoppingCart size={20} />
            ADICIONAR AO CARRINHO
          </span>

          <span
            className={`
              absolute inset-0 flex items-center justify-center !gap-3 whitespace-nowrap transition-all duration-300
              ${
                cartButtonState === "added"
                  ? "translate-y-0 scale-100 opacity-100"
                  : "translate-y-2 scale-95 opacity-0"
              }
            `}
          >
            <Check size={20} />
            ADICIONADO
          </span>
        </button>

        <button
          type="button"
          onClick={handleBuyNow}
          className="flex h-14 cursor-pointer items-center justify-center !gap-3 rounded-lg border border-black bg-white !px-5 text-sm font-bold text-black transition-all duration-200 hover:bg-zinc-50"
        >
          <Zap size={20} />
          COMPRAR AGORA
        </button>
      </div>

      <div className="!mt-7 grid grid-cols-1 !gap-4 border-t border-zinc-200 !pt-6 sm:grid-cols-3">
        <div className="flex items-center justify-center !gap-3 text-center sm:justify-start sm:text-left">
          <ShieldCheck size={24} />
          <div>
            <p className="text-xs font-bold">COMPRA SEGURA</p>
            <span className="text-xs text-zinc-500">Seus dados protegidos</span>
          </div>
        </div>

        <div className="flex items-center justify-center !gap-3 text-center sm:justify-start sm:text-left">
          <Truck size={26} />
          <div>
            <p className="text-xs font-bold">ENVIO RÁPIDO</p>
            <span className="text-xs text-zinc-500">Postagem em até 24h</span>
          </div>
        </div>

        <div className="flex items-center justify-center !gap-3 text-center sm:justify-start sm:text-left">
          <CreditCard size={25} />
          <div>
            <p className="text-xs font-bold">12X SEM JUROS</p>
            <span className="text-xs text-zinc-500">Parcele com facilidade</span>
          </div>
        </div>
      </div>

      {showSizeGuide && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 !px-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="size-guide-title"
          onClick={() => setShowSizeGuide(false)}
        >
          <div
            className="w-full max-w-lg rounded-xl bg-white !p-6 shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between !gap-4">
              <div>
                <h2
                  id="size-guide-title"
                  className="font-[family-name:var(--font-bebas)] text-4xl text-zinc-950"
                >
                  Guia de tamanhos
                </h2>
                <p className="!mt-1 text-sm text-zinc-500">
                  Medidas aproximadas da camisa.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowSizeGuide(false)}
                className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-zinc-200 text-xl font-bold text-zinc-700 transition-all duration-200 hover:border-black hover:text-black"
                aria-label="Fechar guia de tamanhos"
              >
                ×
              </button>
            </div>

            <div className="!mt-5 overflow-hidden rounded-lg border border-zinc-200">
              <table className="w-full text-left text-sm">
                <thead className="bg-zinc-50 text-xs font-bold uppercase text-zinc-600">
                  <tr>
                    <th className="!px-4 !py-3">Tamanho</th>
                    <th className="!px-4 !py-3">Altura</th>
                    <th className="!px-4 !py-3">Largura</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200 font-semibold text-zinc-900">
                  {[
                    ["P", "68 cm", "48 cm"],
                    ["M", "70 cm", "50 cm"],
                    ["G", "72 cm", "52 cm"],
                    ["GG", "74 cm", "54 cm"],
                    ["XG", "76 cm", "56 cm"],
                  ].map(([size, height, width]) => (
                    <tr key={size}>
                      <td className="!px-4 !py-3">{size}</td>
                      <td className="!px-4 !py-3">{height}</td>
                      <td className="!px-4 !py-3">{width}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <p className="!mt-4 text-sm leading-6 text-zinc-600">
              As medidas podem variar de 1 a 3 cm. Recomendamos comparar com
              uma camisa que você já usa.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductBuyBox;
