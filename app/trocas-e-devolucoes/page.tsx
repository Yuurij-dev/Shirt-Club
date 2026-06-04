import type { Metadata } from "next";
import Footer from "../components/Footer";
import Header from "../components/header";
import InstitutionalPage from "../components/InstitutionalPage";
import { institutionalPages } from "../data/institutionalPages";

export const metadata: Metadata = {
  title: "Trocas e devoluções | Shirt Club",
  description: institutionalPages["trocas-e-devolucoes"].description,
};

const TrocasEDevolucoesPage = () => {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <InstitutionalPage page={institutionalPages["trocas-e-devolucoes"]} />
      </main>
      <Footer />
    </div>
  );
};

export default TrocasEDevolucoesPage;
