"use client";

import { useEffect, useState } from "react";
import {
  bestSellerProducts,
  retroCarouselProducts,
  type Product,
} from "../data/products";
import ProductCarousel from "./ProductCarousel";

const ProductCarouselSection = () => {
  const [bestSellers, setBestSellers] = useState<Product[]>(bestSellerProducts);
  const [retroProducts, setRetroProducts] =
    useState<Product[]>(retroCarouselProducts);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const response = await fetch("/api/products", { cache: "no-store" });

        if (!response.ok) return;

        const data = (await response.json()) as { products?: Product[] };
        const products = data.products || [];

        setBestSellers(
          bestSellerProducts
            .map((product) =>
              products.find((currentProduct) => currentProduct.id === product.id)
            )
            .filter((product): product is Product => Boolean(product))
        );
        setRetroProducts(
          retroCarouselProducts
            .map((product) =>
              products.find((currentProduct) => currentProduct.id === product.id)
            )
            .filter((product): product is Product => Boolean(product))
        );
      } catch {
        setBestSellers(bestSellerProducts);
        setRetroProducts(retroCarouselProducts);
      }
    };

    void loadProducts();
  }, []);

  return (
    <section className="w-full bg-white !px-4 !py-8 sm:!px-6 lg:!px-0">
      <div className="container !mx-auto">
        <div className="grid grid-cols-1 gap-10 xl:grid-cols-2">
          <ProductCarousel
            title="MAIS VENDIDOS"
            products={bestSellers}
            viewAllHref="/mais-vendidos"
          />
          <ProductCarousel
            title="RETRO"
            products={retroProducts}
            viewAllHref="/retro"
          />
        </div>
      </div>
    </section>
  );
};

export default ProductCarouselSection;
