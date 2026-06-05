"use client";

import Image from "next/image";
import Link from "next/link";
import { Check, CircleCheck, Copy, QrCode, ShoppingCart } from "lucide-react";
import { useEffect, useMemo, useState, useSyncExternalStore } from "react";
import { toast } from "sonner";
import { useCart } from "@/app/context/CartContext";

type PixCheckout = {
  order?: {
    id: string;
  };
  paymentId?: string | null;
  pix?: {
    qrCode?: string | null;
    qrCodeBase64?: string | null;
    expirationDate?: string | null;
  } | null;
};

type OrderStatusResponse = {
  status?: "unpaid" | "paid";
  paymentId?: string | null;
};

const pixStorageKey = "@shirtclub:last-pix";
const missingPixStorageValue = "__missing_pix__";

const subscribeToPixStorage = (callback: () => void) => {
  window.addEventListener("storage", callback);

  return () => {
    window.removeEventListener("storage", callback);
  };
};

const getPixStorageSnapshot = () => {
  return localStorage.getItem(pixStorageKey) || missingPixStorageValue;
};

const getServerPixStorageSnapshot = () => "";

const PixPaymentContent = () => {
  const { clearCart } = useCart();
  const storedPix = useSyncExternalStore(
    subscribeToPixStorage,
    getPixStorageSnapshot,
    getServerPixStorageSnapshot
  );
  const checkout = useMemo(() => {
    if (!storedPix || storedPix === missingPixStorageValue) return null;

    return JSON.parse(storedPix) as PixCheckout;
  }, [storedPix]);
  const [copiedPixCode, setCopiedPixCode] = useState(false);
  const [orderStatus, setOrderStatus] = useState<"unpaid" | "paid">("unpaid");

  useEffect(() => {
    const orderId = checkout?.order?.id;

    if (!orderId || orderStatus === "paid") return;

    const checkOrderStatus = async () => {
      const response = await fetch(`/api/orders/${orderId}/status`, {
        cache: "no-store",
      });

      if (!response.ok) return;

      const data = (await response.json()) as OrderStatusResponse;

      if (data.status === "paid") {
        setOrderStatus("paid");
        clearCart();
        toast.success("Pagamento aprovado");
      }
    };

    void checkOrderStatus();

    const interval = window.setInterval(() => {
      void checkOrderStatus();
    }, 1500);

    return () => {
      window.clearInterval(interval);
    };
  }, [checkout?.order?.id, clearCart, orderStatus]);

  const copyPixCode = async () => {
    const qrCode = checkout?.pix?.qrCode;

    if (!qrCode) return;

    try {
      await navigator.clipboard.writeText(qrCode);
      setCopiedPixCode(true);
      toast.success("Código Pix copiado");

      window.setTimeout(() => {
        setCopiedPixCode(false);
      }, 1800);
    } catch {
      toast.error("Não foi possível copiar o código Pix");
    }
  };

  if (!storedPix) {
    return (
      <section className="rounded-xl border border-zinc-200 bg-white !p-10 text-center">
        <div className="mx-auto h-11 w-11 animate-pulse rounded-full bg-zinc-200" />
        <div className="!mt-5 h-10 animate-pulse rounded bg-zinc-200" />
        <div className="!mx-auto !mt-3 h-4 max-w-sm animate-pulse rounded bg-zinc-100" />
      </section>
    );
  }

  if (!checkout?.pix) {
    return (
      <section className="rounded-xl border border-zinc-200 bg-white !p-10 text-center">
        <ShoppingCart className="mx-auto !mb-4 text-zinc-400" size={44} />
        <h1 className="font-[family-name:var(--font-bebas)] text-4xl text-zinc-950">
          PIX NAO ENCONTRADO
        </h1>
        <p className="!mt-2 text-sm text-zinc-500">
          Gere o pagamento Pix novamente para visualizar o QR Code.
        </p>
        <Link
          href="/checkout"
          className="!mt-6 inline-flex h-12 items-center justify-center rounded-lg bg-black !px-6 text-sm font-bold text-white transition-all duration-200 hover:bg-zinc-800"
        >
          VOLTAR AO CHECKOUT
        </Link>
      </section>
    );
  }

  if (orderStatus === "paid") {
    return (
      <section className="!mx-auto max-w-2xl rounded-xl border border-emerald-200 bg-white !p-6 text-center shadow-sm sm:!p-10">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-600 text-white">
          <CircleCheck size={34} />
        </div>

        <h1 className="!mt-5 font-[family-name:var(--font-bebas)] text-5xl leading-none text-zinc-950">
          PAGAMENTO APROVADO
        </h1>

        <p className="!mx-auto !mt-3 max-w-md text-sm leading-6 text-zinc-600">
          Recebemos seu Pix com sucesso. Seu pedido já foi marcado como pago e
          será preparado para envio.
        </p>

        <p className="!mx-auto !mt-3 max-w-md text-sm leading-6 text-zinc-600">
          Você receberá uma confirmação pelo WhatsApp com os próximos passos do
          pedido.
        </p>

        <div className="!mt-6 rounded-lg bg-emerald-50 !p-4 text-sm text-emerald-900">
          <span className="block text-xs font-bold uppercase text-emerald-700">
            Pedido
          </span>
          <strong>{checkout.order?.id || "-"}</strong>
        </div>

        <Link
          href="/"
          className="!mt-6 inline-flex h-12 items-center justify-center rounded-lg bg-black !px-6 text-sm font-bold text-white transition-all duration-200 hover:bg-zinc-800"
        >
          VOLTAR PARA LOJA
        </Link>
      </section>
    );
  }

  return (
    <section className="!mx-auto grid max-w-5xl grid-cols-1 !gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
      <div className="rounded-xl border border-zinc-200 bg-white !p-5 sm:!p-8">
        <div className="flex flex-col items-center text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-black text-white">
            <QrCode size={26} />
          </div>

          <h1 className="!mt-5 font-[family-name:var(--font-bebas)] text-5xl leading-none text-zinc-950">
            PIX GERADO
          </h1>
          <p className="!mt-2 max-w-md text-sm text-zinc-500">
            Escaneie o QR Code no app do seu banco ou copie o código Pix.
          </p>

          {checkout.pix.qrCodeBase64 && (
            <Image
              src={`data:image/png;base64,${checkout.pix.qrCodeBase64}`}
              alt="QR Code Pix"
              width={260}
              height={260}
              unoptimized
              className="!mt-6 h-[260px] w-[260px] rounded-lg border border-zinc-200 bg-white !p-3"
            />
          )}

          {checkout.pix.qrCode && (
            <div className="!mt-6 w-full">
              <label className="flex flex-col !gap-2 text-left">
                <span className="text-xs font-bold uppercase text-zinc-950">
                  Pix copia e cola
                </span>
                <textarea
                  readOnly
                  value={checkout.pix.qrCode}
                  className="min-h-[120px] w-full resize-none rounded-lg border border-zinc-200 bg-zinc-50 !p-3 text-xs text-zinc-700 outline-none"
                />
              </label>

              <button
                type="button"
                onClick={copyPixCode}
                className="!mt-3 flex h-12 w-full cursor-pointer items-center justify-center !gap-2 rounded-lg border border-black bg-white !px-4 text-sm font-bold text-black transition-all duration-200 hover:bg-zinc-50"
              >
                {copiedPixCode ? <Check size={18} /> : <Copy size={18} />}
                {copiedPixCode ? "CODIGO COPIADO" : "COPIAR CODIGO PIX"}
              </button>
            </div>
          )}
        </div>
      </div>

      <aside className="rounded-xl border border-zinc-200 bg-white !p-5">
        <h2 className="font-[family-name:var(--font-bebas)] text-3xl leading-none text-zinc-950">
          SEU PEDIDO
        </h2>

        <div className="!mt-5 flex flex-col !gap-3 text-sm text-zinc-600">
          <div>
            <span className="block text-xs font-bold uppercase text-zinc-500">
              Pedido
            </span>
            <strong className="text-zinc-950">{checkout.order?.id || "-"}</strong>
          </div>

          <div>
            <span className="block text-xs font-bold uppercase text-zinc-500">
              Pagamento
            </span>
            <strong className="text-zinc-950">
              {checkout.paymentId || "-"}
            </strong>
          </div>

          {checkout.pix.expirationDate && (
            <div>
              <span className="block text-xs font-bold uppercase text-zinc-500">
                Validade
              </span>
              <strong className="text-zinc-950">
                {new Date(checkout.pix.expirationDate).toLocaleString("pt-BR")}
              </strong>
            </div>
          )}
        </div>

        <div className="!mt-5 rounded-lg bg-zinc-50 !p-4 text-xs text-zinc-500">
          Depois do pagamento, o pedido será atualizado automaticamente quando o
          Asaas confirmar o recebimento.
        </div>

        <div className="!mt-3 rounded-lg border border-zinc-200 !p-4 text-xs text-zinc-500">
          Aguardando confirmação do pagamento...
        </div>

        <div className="!mt-3 rounded-lg border border-zinc-200 !p-4 text-xs text-zinc-500">
          Assim que o pagamento for aprovado, você receberá uma confirmação pelo
          WhatsApp.
        </div>

        <Link
          href="/"
          className="!mt-5 flex h-12 items-center justify-center rounded-lg bg-black !px-5 text-sm font-bold text-white transition-all duration-200 hover:bg-zinc-800"
        >
          VOLTAR PARA LOJA
        </Link>
      </aside>
    </section>
  );
};

export default PixPaymentContent;
