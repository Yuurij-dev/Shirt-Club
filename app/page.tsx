import BannerMain from "./components/bannerMain";
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
      <BannerMain/>
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