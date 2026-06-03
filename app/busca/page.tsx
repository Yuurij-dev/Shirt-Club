import Link from "next/link";
import Footer from "../components/Footer";
import Header from "../components/header";
import NewsletterSection from "../components/NewsletterSection";
import OfertaHeader from "../components/ofertaHeader";
import ProductCard from "../components/productCard";
import StoreHighlights from "../components/StoreHighlights";
import { searchProducts } from "../utils/searchProducts";

type SearchPageProps = {
  searchParams: Promise<{
    q?: string;
  }>;
};

const SearchPage = async ({ searchParams }: SearchPageProps) => {
  const { q = "" } = await searchParams;
  const query = q.trim();
  const results = searchProducts(query);

  return (
    <div className="flex min-h-screen flex-col">
      <OfertaHeader />
      <Header />

      <main className="flex-1">
        <section className="container !mx-auto !px-4 !py-8 sm:!px-6 lg:!px-0">
          <div className="!mb-8">
            <div className="!mb-4 flex items-center !gap-2 text-sm text-zinc-500">
              <Link
                href="/"
                className="transition-all duration-200 hover:text-black"
              >
                Início
              </Link>

              <span>›</span>

              <Link
                href="/busca"
                className="transition-all duration-200 hover:text-black"
              >
                Busca
              </Link>
            </div>

            <h1 className="font-[family-name:var(--font-bebas)] text-5xl leading-none text-zinc-950">
              BUSCA
            </h1>

            {query ? (
              <p className="!mt-3 text-sm text-zinc-600">
                {results.length}{" "}
                {results.length === 1
                  ? "produto encontrado"
                  : "produtos encontrados"}{" "}
                para <strong className="text-zinc-950">&quot;{query}&quot;</strong>
              </p>
            ) : (
              <p className="!mt-3 max-w-[520px] text-sm leading-6 text-zinc-600">
                Use a lupa no topo para buscar por produto, time, seleção,
                marca ou categoria.
              </p>
            )}
          </div>

          {results.length > 0 ? (
            <div className="grid grid-cols-1 !gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              {results.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-zinc-200 bg-white !p-8 text-center sm:!p-12">
              <h2 className="font-[family-name:var(--font-bebas)] text-3xl text-zinc-950">
                {query ? "NENHUM PRODUTO ENCONTRADO" : "COMECE UMA BUSCA"}
              </h2>

              <p className="!mx-auto !mt-2 max-w-[420px] text-sm leading-6 text-zinc-500">
                {query
                  ? "Tente buscar por outro time, categoria ou modelo de camisa."
                  : "Clique na lupa do header e digite o que você está procurando."}
              </p>
            </div>
          )}

          <div className="!mt-10">
            <StoreHighlights />
          </div>

          <div className="!mt-10">
            <NewsletterSection />
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default SearchPage;
