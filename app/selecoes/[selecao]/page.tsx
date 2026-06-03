import Link from "next/link";
import { notFound } from "next/navigation";
import EntityProductsSection from "@/app/components/EntityProductsSection";
import Footer from "@/app/components/Footer";
import Header from "@/app/components/header";
import NewsletterSection from "@/app/components/NewsletterSection";
import OfertaHeader from "@/app/components/ofertaHeader";
import StoreHighlights from "@/app/components/StoreHighlights";
import {
  getSelectionBySlug,
  selections,
} from "@/app/data/selections";
import { getProductsByOwner } from "@/app/utils/inventory";

type SelectionPageProps = {
  params: Promise<{
    selecao: string;
  }>;
};

export const generateStaticParams = () => {
  return selections.map((selection) => ({
    selecao: selection.slug,
  }));
};

export const generateMetadata = async ({ params }: SelectionPageProps) => {
  const { selecao: selectionSlug } = await params;
  const selection = getSelectionBySlug(selectionSlug);

  if (!selection) {
    return {
      title: "Seleção não encontrada | Shirt Club",
    };
  }

  return {
    title: `${selection.name} | Shirt Club`,
    description: `Camisas da seleção ${selection.name} na Shirt Club.`,
  };
};

const SelectionPage = async ({ params }: SelectionPageProps) => {
  const { selecao: selectionSlug } = await params;
  const selection = getSelectionBySlug(selectionSlug);

  if (!selection) {
    notFound();
  }

  const selectionProducts = getProductsByOwner(selection);

  return (
    <div className="flex min-h-screen flex-col">
      <OfertaHeader />
      <Header />

      <main className="container !mx-auto flex-1 !px-4 !py-8 sm:!px-6 lg:!px-0">
        <nav className="!mb-6 flex flex-wrap items-center !gap-2 text-sm text-zinc-500">
          <Link href="/" className="transition-all duration-200 hover:text-black">
            Início
          </Link>
          <span>›</span>
          <Link
            href="/selecoes"
            className="transition-all duration-200 hover:text-black"
          >
            Seleções
          </Link>
          <span>›</span>
          <span className="text-zinc-900">{selection.name}</span>
        </nav>

        <EntityProductsSection
          title={selection.name.toUpperCase()}
          description={`Confira as camisas disponíveis da seleção ${selection.name}.`}
          products={selectionProducts}
          backHref="/selecoes"
          backLabel="VOLTAR PARA SELEÇÕES"
        />

        <div className="!mt-10">
          <StoreHighlights />
        </div>

        <div className="!mt-4">
          <NewsletterSection />
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default SelectionPage;
