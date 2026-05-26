"use client";

import Banner from "../components/Banner";
import Header from "../components/header";
import bannerRetro from "public/assets/bannerRetro.png";

import RetroProductsGrid from "./components/RetroProductsGrid";
import HistoricMoments from "./components/HistoricMoments";
import RetroPromoBanner from "./components/RetroPromoBanner";
import MostWantedCarousel from "./components/MostWantedCarousel";

import StoreHighlights from "../components/StoreHighlights";
import NewsletterSection from "../components/NewsletterSection";
import InstagramSection from "../components/InstagramSection";
import Footer from "../components/Footer";

import Link from "next/link";

const Retro = () => {
  return (
    <div>
      <Header />

      <main>
        <section className="container !mx-auto !px-4 !py-8 sm:!px-6 lg:!px-0">
          
          {/* BREADCRUMB */}
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
                Retro
              </Link>

            </div>
          </div>

          {/* BANNER */}
          <Banner
            image={bannerRetro}
            title={`MAIS QUE\nUMA CAMISA,\nUMA HISTÓRIA.`}
            description="Camisas dos maiores times do mundo com qualidade premium."
          />

          {/* PRODUTOS */}
          <div className="!mt-10">
            <RetroProductsGrid />
          </div>

          {/* MOMENTOS HISTÓRICOS */}
          <div className="!mt-16">
            <HistoricMoments />
          </div>

          {/* BANNER PROMOCIONAL */}
          <div className="!mt-16">
            <RetroPromoBanner />
          </div>

          {/* CARROSSEL */}
          <div className="!mt-16">
            <MostWantedCarousel />
          </div>

          {/* BENEFÍCIOS */}
          <div className="!mt-16">
            <StoreHighlights />
          </div>

          {/* NEWSLETTER */}
          <div className="!mt-16">
            <NewsletterSection />
          </div>

          {/* INSTAGRAM */}
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