import Link from "next/link";
import Footer from "../components/Footer";
import Header from "../components/header";
import NewsletterSection from "../components/NewsletterSection";
import OfertaHeader from "../components/ofertaHeader";
import StoreHighlights from "../components/StoreHighlights";
import CartContent from "./components/CartContent";

export const metadata = {
  title: "Carrinho | Shirt Club",
  description: "Confira os produtos adicionados ao carrinho.",
};

const CartPage = () => {
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
          <span className="text-zinc-900">Carrinho</span>
        </nav>

        <CartContent />

        <div className="!mt-8">
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

export default CartPage;
