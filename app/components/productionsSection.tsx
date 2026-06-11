"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import ProductCard from "./productCard";
import { homeSelectionProducts, type Product } from "../data/products";

const ProductsSection = () => {
  const [products, setProducts] = useState<Product[]>(homeSelectionProducts);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const response = await fetch("/api/products", { cache: "no-store" });

        if (!response.ok) return;

        const data = (await response.json()) as { products?: Product[] };
        const activeProducts = data.products || [];

        const selectionProducts = activeProducts
          .filter((product) => product.ownerType === "selection")
          .slice(0, 5);

        setProducts(selectionProducts);
      } catch {
        setProducts(homeSelectionProducts);
      }
    };

    void loadProducts();
  }, []);

  return (
    <section className="w-full bg-white !px-4 !py-8 sm:!px-6 lg:!px-0">
      <div className="container !mx-auto">
        <div className="!mb-6 !mt-6 flex items-center justify-between">
          <h2 className="font-[family-name:var(--font-bebas)] text-3xl text-zinc-950 sm:text-4xl">
            SELEÇÕES
          </h2>

          <Link href="/selecoes" className="text-xs font-medium text-zinc-700 hover:underline sm:text-sm">
            Ver todos ›
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductsSection;
