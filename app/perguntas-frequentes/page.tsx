import type { Metadata } from "next";
import Footer from "../components/Footer";
import Header from "../components/header";
import InstitutionalPage from "../components/InstitutionalPage";
import { helpPages } from "../data/helpPages";

export const metadata: Metadata = {
  title: "Perguntas frequentes | Shirt Club",
  description: helpPages["perguntas-frequentes"].description,
};

const PerguntasFrequentesPage = () => {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <InstitutionalPage
          eyebrow="Ajuda"
          page={helpPages["perguntas-frequentes"]}
        />
      </main>
      <Footer />
    </div>
  );
};

export default PerguntasFrequentesPage;
