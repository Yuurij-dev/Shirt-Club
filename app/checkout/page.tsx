import Link from "next/link";
import Footer from "../components/Footer";
import Header from "../components/header";
import CheckoutContent from "./components/CheckoutContent";

export const metadata = {
  title: "Checkout | Shirt Club",
  description: "Preencha seus dados para finalizar o pedido.",
};

const CheckoutPage = () => {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="container !mx-auto flex-1 !px-4 !py-8 sm:!px-6 lg:!px-0">
        <nav className="!mb-6 flex flex-wrap items-center !gap-2 text-sm text-zinc-500">
          <Link href="/" className="transition-all duration-200 hover:text-black">
            Início
          </Link>
          <span>›</span>
          <Link
            href="/carrinho"
            className="transition-all duration-200 hover:text-black"
          >
            Carrinho
          </Link>
          <span>›</span>
          <span className="text-zinc-900">Checkout</span>
        </nav>

        <CheckoutContent />
      </main>

      <Footer />
    </div>
  );
};

export default CheckoutPage;
