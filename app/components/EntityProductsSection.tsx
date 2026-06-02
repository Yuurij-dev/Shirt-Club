import Link from "next/link";
import ProductCard from "./productCard";
import type { Product } from "../data/products";

type EntityProductsSectionProps = {
  title: string;
  description: string;
  products: Product[];
  backHref: string;
  backLabel: string;
};

const EntityProductsSection = ({
  title,
  description,
  products,
  backHref,
  backLabel,
}: EntityProductsSectionProps) => {
  return (
    <section>
      <div className="flex flex-col !gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-[family-name:var(--font-bebas)] text-5xl leading-none text-zinc-950">
            {title}
          </h1>

          <p className="!mt-3 max-w-[520px] text-sm leading-6 text-zinc-600">
            {description}
          </p>

          <p className="!mt-2 text-sm text-zinc-500">
            {products.length} {products.length === 1 ? "produto" : "produtos"}
          </p>
        </div>

        <Link
          href={backHref}
          className="text-sm font-bold transition-all duration-200 hover:text-zinc-600"
        >
          {backLabel}
        </Link>
      </div>

      {products.length > 0 ? (
        <div className="!mt-8 grid grid-cols-1 !gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="!mt-8 rounded-xl border border-zinc-200 bg-white !p-10 text-center">
          <h2 className="font-[family-name:var(--font-bebas)] text-3xl text-zinc-950">
            EM BREVE
          </h2>

          <p className="!mt-2 text-sm text-zinc-500">
            Ainda não temos produtos cadastrados para essa categoria.
          </p>
        </div>
      )}
    </section>
  );
};

export default EntityProductsSection;
