"use client";

import { useEffect, useState } from "react";
import ProductCarousel from "@/app/components/ProductCarousel";
import { mostWantedProducts, type Product } from "@/app/data/products";

const MostWantedCarousel = () => {
  const [products, setProducts] = useState<Product[]>(mostWantedProducts);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const response = await fetch("/api/products", { cache: "no-store" });

        if (!response.ok) return;

        const data = (await response.json()) as { products?: Product[] };
        const activeProducts = data.products || [];

        setProducts(
          mostWantedProducts
            .map((product) =>
              activeProducts.find((currentProduct) => currentProduct.id === product.id)
            )
            .filter((product): product is Product => Boolean(product))
        );
      } catch {
        setProducts(mostWantedProducts);
      }
    };

    void loadProducts();
  }, []);

  return (
    <section className="w-full bg-white !px-4 !py-8 sm:!px-6 lg:!px-0">
      <div className="container !mx-auto">
        <ProductCarousel
          title="MAIS PROCURADAS"
          products={products}
          showViewAll={false}
        />
      </div>
    </section>
  );
};

export default MostWantedCarousel;
