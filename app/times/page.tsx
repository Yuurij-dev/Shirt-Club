import Link from "next/link";
import CategoryBannerCarousel from "../components/CategoryBannerCarousel";
import Footer from "../components/Footer";
import Header from "../components/header";
import InstagramSection from "../components/InstagramSection";
import NewsletterSection from "../components/NewsletterSection";
import StoreHighlights from "../components/StoreHighlights";
import { StoreBanner } from "../data/banners";
import TeamsGrid from "./components/TeamsGrid";

const fallbackTimesBanner: StoreBanner = {
  id: "times-hero-default",
  name: "Banner padrão times",
  page: "times",
  position: "hero",
  desktopImageUrl: "/assets/banner/bannerTeams.png",
  title: "TIMES",
  linkUrl: "/times",
  isActive: true,
  sortOrder: 1,
};

const Times = () => {
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
                href="/times"
                className="transition-all duration-200 hover:text-black"
              >
                Times
              </Link>
            </div>

            <h1 className="font-[family-name:var(--font-bebas)] text-5xl leading-none text-zinc-950">
              TIMES
            </h1>

            <p className="!mt-5 max-w-[360px] text-base text-zinc-700">
              Encontre camisas dos seus times do coração. Qualidade premium
              para torcer com estilo.
            </p>
          </div>

          <CategoryBannerCarousel
            page="times"
            fallbackBanner={fallbackTimesBanner}
            heading="TIMES"
          />

          <TeamsGrid />
          <StoreHighlights />
          <NewsletterSection />
          <InstagramSection />
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Times;
