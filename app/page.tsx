import Banner from "./components/Banner";
import homeBanner from "public/assets/BannerHome.png"
import BenefitsSection from "./components/BenefitsSection"
import Footer from "./components/Footer";
import Header from "./components/header";
import InstagramSection from "./components/InstagramSection";
import NewsletterSection from "./components/NewsletterSection";
import OfertaHeader from "./components/ofertaHeader";
import ProductCarouselSection from "./components/ProductCarouselSection";
import ProductsSection from "./components/productionsSection";
import PromoBanner from "./components/PromoBanner";
import StoreHighlights from "./components/StoreHighlights";
import TeamsSection from "./components/TeamsSection";

const Home = () => {
  return (
    <div>
      <OfertaHeader/>
      <Header />
      <Banner image={homeBanner} title={`MAIS QUE\nUMA CAMISA,\nUMA HISTÓRIA.`} description="Camisas dos maiores times do mundo com qualidade premium."/>
      <BenefitsSection/>
      <ProductsSection/>
      <PromoBanner/>
      <TeamsSection/>
      <ProductCarouselSection/>
      <StoreHighlights/>
      <NewsletterSection/>
      <InstagramSection/>
      <Footer/>
    </div>
  );
}
 
export default Home;