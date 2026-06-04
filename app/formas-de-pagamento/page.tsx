import type { Metadata } from "next";
import Footer from "../components/Footer";
import Header from "../components/header";
import InstitutionalPage from "../components/InstitutionalPage";
import { helpPages } from "../data/helpPages";

export const metadata: Metadata = {
  title: "Formas de pagamento | Shirt Club",
  description: helpPages["formas-de-pagamento"].description,
};

const FormasDePagamentoPage = () => {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <InstitutionalPage
          eyebrow="Ajuda"
          page={helpPages["formas-de-pagamento"]}
        />
      </main>
      <Footer />
    </div>
  );
};

export default FormasDePagamentoPage;
