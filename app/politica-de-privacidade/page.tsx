import type { Metadata } from "next";
import Footer from "../components/Footer";
import Header from "../components/header";
import InstitutionalPage from "../components/InstitutionalPage";
import { institutionalPages } from "../data/institutionalPages";

export const metadata: Metadata = {
  title: "Política de privacidade | Shirt Club",
  description: institutionalPages["politica-de-privacidade"].description,
};

const PoliticaDePrivacidadePage = () => {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <InstitutionalPage
          page={institutionalPages["politica-de-privacidade"]}
        />
      </main>
      <Footer />
    </div>
  );
};

export default PoliticaDePrivacidadePage;
