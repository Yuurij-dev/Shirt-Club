import Link from "next/link";
import { notFound } from "next/navigation";
import Footer from "@/app/components/Footer";
import Header from "@/app/components/header";
import OfertaHeader from "@/app/components/ofertaHeader";
import { getProductById, products } from "@/app/data/products";
import ProductBuyBox from "./components/ProductBuyBox";
import ProductGallery from "./components/ProductGallery";
import ProductTabs from "./components/ProductTabs";

type ProductPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export const generateStaticParams = () => {
  return products.map((product) => ({
    id: product.id,
  }));
};

export const generateMetadata = async ({ params }: ProductPageProps) => {
  const { id } = await params;
  const product = getProductById(id);

  if (!product) {
    return {
      title: "Produto não encontrado | Shirt Club",
    };
  }

  return {
    title: `${product.name} | Shirt Club`,
    description: product.description,
  };
};

const ProductPage = async ({ params }: ProductPageProps) => {
  const { id } = await params;
  const product = getProductById(id);

  if (!product) {
    notFound();
  }

  return (
    <div>
      <OfertaHeader />
      <Header />

      <main className="container !mx-auto !px-4 !py-8 sm:!px-6 lg:!px-0">
        <nav className="!mb-6 flex flex-wrap items-center !gap-2 text-sm text-zinc-500">
          <Link href="/" className="transition-all duration-200 hover:text-black">
            Início
          </Link>
          <span>›</span>
          <Link
            href={product.category === "Retrô" ? "/retro" : "/lancamentos"}
            className="transition-all duration-200 hover:text-black"
          >
            {product.category}
          </Link>
          <span>›</span>
          <span className="text-zinc-900">{product.name}</span>
        </nav>

        <section className="grid grid-cols-1 !gap-10 lg:grid-cols-[minmax(0,1.08fr)_minmax(420px,0.92fr)]">
          <ProductGallery product={product} />
          <ProductBuyBox product={product} />
        </section>

        <ProductTabs product={product} />
      </main>

      <Footer />
    </div>
  );
};

export default ProductPage;
