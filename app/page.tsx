import BannerMain from "./components/bannerMain";
import Header from "./components/header";
import OfertaHeader from "./components/ofertaHeader";

const Home = () => {
  return (
    <div>
      <OfertaHeader/>
      <Header />
      <BannerMain/>
    </div>
  );
}
 
export default Home;