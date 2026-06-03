import Link from "next/link";
import { CircleAlert, CircleCheck, Clock } from "lucide-react";
import Footer from "@/app/components/Footer";
import Header from "@/app/components/header";

type CheckoutStatusPageProps = {
  status: "success" | "failure" | "pending";
};

const statusContent = {
  success: {
    icon: CircleCheck,
    title: "PAGAMENTO APROVADO",
    description:
      "Recebemos a confirmacao do pagamento. Em breve vamos preparar seu pedido.",
  },
  failure: {
    icon: CircleAlert,
    title: "PAGAMENTO NAO CONCLUIDO",
    description:
      "O pagamento nao foi concluido. Voce pode voltar ao carrinho e tentar novamente.",
  },
  pending: {
    icon: Clock,
    title: "PAGAMENTO PENDENTE",
    description:
      "Seu pagamento ainda esta em analise. Assim que houver confirmacao, o pedido sera atualizado.",
  },
};

const CheckoutStatusPage = ({ status }: CheckoutStatusPageProps) => {
  const content = statusContent[status];
  const Icon = content.icon;

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="container !mx-auto flex flex-1 items-center justify-center !px-4 !py-12 sm:!px-6 lg:!px-0">
        <section className="w-full max-w-xl rounded-xl border border-zinc-200 bg-white !p-8 text-center">
          <Icon className="mx-auto text-zinc-950" size={48} />

          <h1 className="!mt-5 font-[family-name:var(--font-bebas)] text-5xl leading-none text-zinc-950">
            {content.title}
          </h1>

          <p className="!mx-auto !mt-3 max-w-md text-sm leading-6 text-zinc-600">
            {content.description}
          </p>

          <div className="!mt-7 flex flex-col !gap-3 sm:flex-row sm:justify-center">
            <Link
              href="/"
              className="inline-flex h-12 items-center justify-center rounded-lg bg-black !px-6 text-sm font-bold text-white transition-all duration-200 hover:bg-zinc-800"
            >
              VOLTAR PARA HOME
            </Link>

            <Link
              href="/carrinho"
              className="inline-flex h-12 items-center justify-center rounded-lg border border-black bg-white !px-6 text-sm font-bold text-black transition-all duration-200 hover:bg-zinc-50"
            >
              VER CARRINHO
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default CheckoutStatusPage;
