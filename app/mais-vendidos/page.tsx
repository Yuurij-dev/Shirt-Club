import Link from "next/link";
import Footer from "../components/Footer";
import Header from "../components/header";
import NewsletterSection from "../components/NewsletterSection";
import ProductCard from "../components/productCard";
import StoreHighlights from "../components/StoreHighlights";
import { bestSellerProducts, type Product } from "../data/products";
import { listProducts } from "../lib/productStore";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const BestSellersPage = async () => {
  const activeProducts = await listProducts({ includeInactive: false });
  const visibleProducts = bestSellerProducts
    .map((product) =>
      activeProducts.find((currentProduct) => currentProduct.id === product.id)
    )
    .filter((product): product is Product => Boolean(product));

  return (
    <div className="flex min-h-screen flex-col">
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
                href="/mais-vendidos"
                className="transition-all duration-200 hover:text-black"
              >
                Mais vendidos
              </Link>
            </div>

            <h1 className="font-[family-name:var(--font-bebas)] text-5xl leading-none text-zinc-950">
              MAIS VENDIDOS
            </h1>

            <p className="!mt-3 max-w-[520px] text-sm leading-6 text-zinc-600">
              As camisas preferidas da galera, reunidas em um só lugar.
            </p>
          </div>

          <div className="grid grid-cols-1 !gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {visibleProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

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

export default BestSellersPage;
