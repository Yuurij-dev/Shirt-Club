import Link from "next/link";

import Header from "../components/header";

import TeamsGrid from "./components/TeamsGrid";
import StoreHighlights from "../components/StoreHighlights";
import NewsletterSection from "../components/NewsletterSection";
import InstagramSection from "../components/InstagramSection";
import Footer from "../components/Footer";
import PromoBannerTimes from "./components/PromoBannerTimes";

const Times = () => {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1">
        <section className="container !mx-auto !px-4 !py-8 sm:!px-6 lg:!px-0">
          
          <div className="!mb-6">

            {/* BREADCRUMB */}
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

            {/* TITLE */}
            <h1 className="font-[family-name:var(--font-bebas)] text-5xl leading-none text-zinc-950">
              TIMES
            </h1>

            {/* DESCRIPTION */}
            <p className="!mt-5 max-w-[360px] text-base text-zinc-700">
              Encontre camisas dos seus times do coração.
              Qualidade premium para torcer com estilo.
            </p>

          </div>

          {/* BANNER */}
          <PromoBannerTimes/>
          <TeamsGrid/>
          <StoreHighlights/>
          <NewsletterSection/>
          <InstagramSection/>

        </section>
      </main>
      <Footer/>
    </div>
  );
};

export default Times;
