import Link from "next/link";
import CategoryBannerCarousel from "../components/CategoryBannerCarousel";
import Footer from "../components/Footer";
import Header from "../components/header";
import InstagramSection from "../components/InstagramSection";
import NewsletterSection from "../components/NewsletterSection";
import StoreHighlights from "../components/StoreHighlights";
import { StoreBanner } from "../data/banners";
import SelectionsGrid from "./components/SelectionsGrid";

export const metadata = {
  title: "Seleções | Shirt Club",
  description: "Camisas das principais seleções do mundo.",
};

const fallbackSelecoesBanner: StoreBanner = {
  id: "selecoes-hero-default",
  name: "Banner padrão seleções",
  page: "selecoes",
  position: "hero",
  desktopImageUrl: "/assets/banner/bannerTeams.png",
  title: "SELEÇÕES",
  linkUrl: "/selecoes",
  isActive: true,
  sortOrder: 1,
};

const SelecoesPage = () => {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1">
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

          <CategoryBannerCarousel
            page="selecoes"
            fallbackBanner={fallbackSelecoesBanner}
            heading="SELEÇÕES"
          />

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
