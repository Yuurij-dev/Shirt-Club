import Link from "next/link";
import Footer from "../components/Footer";
import Header from "../components/header";
import InstagramSection from "../components/InstagramSection";
import NewsletterSection from "../components/NewsletterSection";
import OfertaHeader from "../components/ofertaHeader";
import PromoBannerTimes from "../times/components/PromoBannerTimes";
import StoreHighlights from "../components/StoreHighlights";
import SelectionsGrid from "./components/SelectionsGrid";

export const metadata = {
  title: "Seleções | Shirt Club",
  description: "Camisas das principais seleções do mundo.",
};

const SelecoesPage = () => {
  return (
    <div>
      <OfertaHeader />
      <Header />

      <main>
        <section className="container !mx-auto !px-4 !py-8 sm:!px-6 lg:!px-0">
          <div className="!mb-6">
            <div className="!mb-4 flex items-center gap-2 text-sm text-zinc-500">
              <Link
                href="/"
                className="transition-all duration-200 hover:text-black"
              >
                Início
              </Link>

              <span>›</span>

              <Link
                href="/selecoes"
                className="transition-all duration-200 hover:text-black"
              >
                Seleções
              </Link>
            </div>

            <h1 className="font-[family-name:var(--font-bebas)] text-5xl leading-none text-zinc-950">
              SELEÇÕES
            </h1>

            <p className="!mt-5 max-w-[420px] text-base text-zinc-700">
              Encontre camisas das maiores seleções do mundo. Qualidade premium
              para vestir sua paixão pelo futebol.
            </p>
          </div>

          <PromoBannerTimes />
          <SelectionsGrid />
          <StoreHighlights />
          <NewsletterSection />
          <InstagramSection />
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default SelecoesPage;
