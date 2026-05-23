import BannerMain from "./components/bannerMain";
import BenefitsSection from "./components/BenefitsSection"
import Header from "./components/header";
import OfertaHeader from "./components/ofertaHeader";
import ProductCarouselSection from "./components/ProductCarouselSection";
import ProductsSection from "./components/productionsSection";
import PromoBanner from "./components/PromoBanner";
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
    </div>
  );
}
 
export default Home;