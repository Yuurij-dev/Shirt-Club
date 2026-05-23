import BannerMain from "./components/bannerMain";
import BenefitsSection from "./components/BenefitsSection"
import Header from "./components/header";
import OfertaHeader from "./components/ofertaHeader";

const Home = () => {
  return (
    <div>
      <OfertaHeader/>
      <Header />
      <BannerMain/>
      <BenefitsSection/>
    </div>
  );
}
 
export default Home;