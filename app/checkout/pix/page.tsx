import Link from "next/link";
import Footer from "@/app/components/Footer";
import Header from "@/app/components/header";
import PixPaymentContent from "./PixPaymentContent";

export const metadata = {
  title: "Pagamento Pix | Shirt Club",
  description: "Escaneie o QR Code ou copie o codigo Pix para pagar o pedido.",
};

const CheckoutPixPage = () => {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="container !mx-auto flex-1 !px-4 !py-8 sm:!px-6 lg:!px-0">
        <nav className="!mb-6 flex flex-wrap items-center !gap-2 text-sm text-zinc-500">
          <Link href="/" className="transition-all duration-200 hover:text-black">
            Inicio
          </Link>
          <span>›</span>
          <Link
            href="/checkout"
            className="transition-all duration-200 hover:text-black"
          >
            Checkout
          </Link>
          <span>›</span>
          <span className="text-zinc-900">Pix</span>
        </nav>

        <PixPaymentContent />
      </main>

      <Footer />
    </div>
  );
};

export default CheckoutPixPage;
