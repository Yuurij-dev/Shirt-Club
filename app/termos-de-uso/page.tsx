import type { Metadata } from "next";
import Footer from "../components/Footer";
import Header from "../components/header";
import InstitutionalPage from "../components/InstitutionalPage";
import { institutionalPages } from "../data/institutionalPages";

export const metadata: Metadata = {
  title: "Termos de uso | Shirt Club",
  description: institutionalPages["termos-de-uso"].description,
};

const TermosDeUsoPage = () => {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <InstitutionalPage page={institutionalPages["termos-de-uso"]} />
      </main>
      <Footer />
    </div>
  );
};

export default TermosDeUsoPage;
