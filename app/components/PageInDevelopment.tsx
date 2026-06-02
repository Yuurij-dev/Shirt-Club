import Link from "next/link";
import { ArrowLeft, Construction } from "lucide-react";

const PageInDevelopment = () => {
  return (
    <main className="flex min-h-screen items-center justify-center bg-white !px-4">
      <div className="flex max-w-[520px] flex-col items-center text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-zinc-100">
          <Construction size={38} className="text-zinc-950" />
        </div>

        <h1 className="!mt-6 font-[family-name:var(--font-bebas)] text-5xl leading-none text-zinc-950 sm:text-6xl">
          PÁGINA EM DESENVOLVIMENTO
        </h1>

        <p className="!mt-4 text-base text-zinc-600">
          Estamos preparando essa área da Shirt Club para você.
          Em breve teremos novidades por aqui.
        </p>

        <Link
          href="/"
          className="!mt-8 flex items-center gap-2 rounded-lg bg-black !px-6 !py-3 text-sm font-bold text-white transition-all duration-200 hover:bg-zinc-800"
        >
          <ArrowLeft size={18} />
          VOLTAR PARA INÍCIO
        </Link>
      </div>
    </main>
  );
};

export default PageInDevelopment;