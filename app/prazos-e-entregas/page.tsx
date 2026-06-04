import type { Metadata } from "next";
import Footer from "../components/Footer";
import Header from "../components/header";
import InstitutionalPage from "../components/InstitutionalPage";
import { helpPages } from "../data/helpPages";

export const metadata: Metadata = {
  title: "Prazos e entregas | Shirt Club",
  description: helpPages["prazos-e-entregas"].description,
};

const PrazosEEntregasPage = () => {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <InstitutionalPage
          eyebrow="Ajuda"
          page={helpPages["prazos-e-entregas"]}
        />
      </main>
      <Footer />
    </div>
  );
};

export default PrazosEEntregasPage;
