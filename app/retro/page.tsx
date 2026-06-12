import Link from "next/link";
import BannerCarousel from "../components/BannerCarousel";
import CategoryBannerCarousel from "../components/CategoryBannerCarousel";
import Footer from "../components/Footer";
import Header from "../components/header";
import InstagramSection from "../components/InstagramSection";
import NewsletterSection from "../components/NewsletterSection";
import StoreHighlights from "../components/StoreHighlights";
import { StoreBanner } from "../data/banners";
import { listActiveBanners } from "../lib/bannerStore";
import HistoricMoments from "./components/HistoricMoments";
import MostWantedCarousel from "./components/MostWantedCarousel";
import RetroProductsGrid from "./components/RetroProductsGrid";
import RetroPromoBanner from "./components/RetroPromoBanner";

const fallbackRetroBanner: StoreBanner = {
  id: "retro-hero-default",
  name: "Banner padrão retrô",
  page: "retro",
  position: "hero",
  desktopImageUrl: "/assets/banner/bannerRetro.png",
  title: "RETRÔ",
  linkUrl: "/retro",
  isActive: true,
  sortOrder: 1,
};

const Retro = async () => {
  const promoBanners = await listActiveBanners({
    page: "retro",
    position: "promo",
  });

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1">
        <section className="container !mx-auto !px-4 !py-8 sm:!px-6 lg:!px-0">
          <div className="!mb-6">
            <div className="!mb-4 flex items-center !gap-2 text-sm text-zinc-500">
              <Link
                href="/"
                className="transition-all duration-200 hover:text-black"
              >
                Início
              </Link>

              <span>›</span>

              <Link
                href="/retro"
                className="transition-all duration-200 hover:text-black"
              >
                Retrô
              </Link>
            </div>
          </div>

          <CategoryBannerCarousel
            page="retro"
            fallbackBanner={fallbackRetroBanner}
            heading="RETRÔ"
          />
          <div className="!mt-16">
            <HistoricMoments />
          </div>

          <div className="!mt-16">
            {promoBanners.length > 0 ? (
              <BannerCarousel banners={promoBanners} />
            ) : (
              <RetroPromoBanner />
            )}
          </div>
          
          <div className="!mt-10">
            <RetroProductsGrid />
          </div>



          <div className="!mt-16">
            <MostWantedCarousel />
          </div>

          <div className="!mt-16">
            <StoreHighlights />
          </div>

          <div className="!mt-16">
            <NewsletterSection />
          </div>

          <div className="!mt-16">
            <InstagramSection />
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Retro;
