import Link from "next/link";
import { Home, SearchX, Shirt } from "lucide-react";
import Footer from "./components/Footer";
import Header from "./components/header";

const NotFound = () => {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Header />

      <main className="flex flex-1 items-center justify-center">
        <section className="container !mx-auto flex min-h-[calc(100vh-420px)] items-center justify-center !px-4 !py-16 sm:!px-6 lg:!px-0">
          <div className="mx-auto flex max-w-4xl flex-col items-center text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-zinc-950 text-white">
              <SearchX size={30} />
            </div>

            <p className="!mt-8 text-sm font-bold uppercase tracking-[0.16em] text-zinc-500">
              Página não encontrada
            </p>

            <h1 className="font-[family-name:var(--font-bebas)] text-[112px] leading-none text-zinc-950 sm:text-[150px] lg:text-[180px]">
              404
            </h1>

            <h2 className="max-w-2xl font-[family-name:var(--font-bebas)] text-4xl leading-none text-zinc-950 sm:text-5xl">
              Essa camisa saiu de linha
            </h2>

            <p className="!mt-4 max-w-xl text-sm leading-6 text-zinc-600 sm:text-base">
              O endereço que você tentou acessar não existe ou foi movido.
              Continue navegando pela Shirt Club para encontrar sua próxima
              camisa.
            </p>

            <div className="!mt-8 flex w-full flex-col !gap-3 sm:w-auto sm:flex-row">
              <Link
                href="/"
                className="inline-flex h-12 cursor-pointer items-center justify-center !gap-2 rounded-lg bg-black !px-6 text-sm font-bold text-white transition-all duration-200 hover:bg-zinc-800"
              >
                <Home size={18} />
                IR PARA INÍCIO
              </Link>

              <Link
                href="/masculino"
                className="inline-flex h-12 cursor-pointer items-center justify-center !gap-2 rounded-lg border border-zinc-950 bg-white !px-6 text-sm font-bold text-zinc-950 transition-all duration-200 hover:bg-zinc-50"
              >
                <Shirt size={18} />
                VER MASCULINO
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default NotFound;
