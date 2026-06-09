import BannerCarousel from "./components/BannerCarousel";
import BenefitsSection from "./components/BenefitsSection";
import Footer from "./components/Footer";
import Header from "./components/header";
import InstagramSection from "./components/InstagramSection";
import NewsletterSection from "./components/NewsletterSection";
import ProductCarouselSection from "./components/ProductCarouselSection";
import ProductsSection from "./components/productionsSection";
import PromoBanner from "./components/PromoBanner";
import StoreHighlights from "./components/StoreHighlights";
import TeamsSection from "./components/TeamsSection";
import { listActiveBanners } from "./lib/bannerStore";

const Home = async () => {
  const heroBanners = await listActiveBanners({
    page: "home",
    position: "hero",
  });

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <section className="container !mx-auto !px-4 !py-8 sm:!px-6 lg:!px-0">
          <BannerCarousel banners={heroBanners} />
          <BenefitsSection />
          <ProductsSection />
          <PromoBanner />
          <TeamsSection />
          <ProductCarouselSection />
          <StoreHighlights />
          <NewsletterSection />
          <InstagramSection />
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Home;
