import Banner from "../components/Banner";
import Header from "../components/header";
import bannerRetro from "public/assets/bannerRetro.png"
import RetroProductsGrid from "./components/RetroProductsGrid";
import HistoricMoments from "./components/HistoricMoments";
import RetroPromoBanner from "./components/RetroPromoBanner";
import MostWantedCarousel from "./components/MostWantedCarousel"
import StoreHighlights from "../components/StoreHighlights";
import NewsletterSection from "../components/NewsletterSection";
import InstagramSection from "../components/InstagramSection";
import Footer from "../components/Footer";
import Link from "next/link";

const Retro = () => {
    return ( 
        <div>
            <Header/>
            <main>
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
                                href="/retro"
                                className="transition-all duration-200 hover:text-black"
                            >
                                Retro
                            </Link>

                        </div>
                    </div>

                    <Banner image={bannerRetro} title={`MAIS QUE\nUMA CAMISA,\nUMA HISTÓRIA.`} description="Camisas dos maiores times do mundo com qualidade premium."/>
                    <RetroProductsGrid/>
                    <HistoricMoments/>
                    <RetroPromoBanner/>
                    <MostWantedCarousel/>
                    <StoreHighlights/>
                    <NewsletterSection/>
                    <InstagramSection/>
                </section>
            </main>
            <Footer/>
        </div>
     );
}
 
export default Retro;