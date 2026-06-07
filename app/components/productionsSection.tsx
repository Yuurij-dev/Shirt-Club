import Link from "next/link";
import ProductCard from "./productCard";
import { homeProducts } from "../data/products";

const ProductsSection = () => {
  return (
    <section className="w-full bg-white !px-4 !py-8 sm:!px-6 lg:!px-0">
      <div className="container !mx-auto">
        <div className="!mb-6 !mt-6 flex items-center justify-between">
          <h2 className="font-[family-name:var(--font-bebas)] text-3xl text-zinc-950 sm:text-4xl">
            MASCULINO
          </h2>

          <Link href="/masculino" className="text-xs font-medium text-zinc-700 hover:underline sm:text-sm">
            Ver todos ›
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {homeProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductsSection;
