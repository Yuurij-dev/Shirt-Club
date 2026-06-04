import type { Metadata } from "next";
import Footer from "../components/Footer";
import Header from "../components/header";
import InstitutionalPage from "../components/InstitutionalPage";
import { institutionalPages } from "../data/institutionalPages";

export const metadata: Metadata = {
  title: "Contato | Shirt Club",
  description: institutionalPages.contato.description,
};

const ContatoPage = () => {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <InstitutionalPage page={institutionalPages.contato} />
      </main>
      <Footer />
    </div>
  );
};

export default ContatoPage;
