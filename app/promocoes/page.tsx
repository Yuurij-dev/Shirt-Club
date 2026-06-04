import Footer from "../components/Footer";
import Header from "../components/header";
import PageInDevelopment from "../components/PageInDevelopment";

const PromocoesPage = () => {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <PageInDevelopment />
      </main>
      <Footer />
    </div>
  );
};

export default PromocoesPage;
