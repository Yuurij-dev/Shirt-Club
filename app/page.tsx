import BannerMain from "./components/bannerMain";
import BenefitsSection from "./components/BenefitsSection"
import Header from "./components/header";
import OfertaHeader from "./components/ofertaHeader";
import ProductsSection from "./components/productionsSection";

const Home = () => {
  return (
    <div>
      <OfertaHeader/>
      <Header />
      <BannerMain/>
      <BenefitsSection/>
      <ProductsSection/>
    </div>
  );
}
 
export default Home;