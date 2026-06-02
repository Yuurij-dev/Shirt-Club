"use client";

import { bestSellerProducts, retroCarouselProducts } from "../data/products";
import ProductCarousel from "./ProductCarousel";

const ProductCarouselSection = () => {
  return (
    <section className="w-full bg-white !px-4 !py-8 sm:!px-6 lg:!px-0">
      <div className="container !mx-auto">
        <div className="grid grid-cols-1 gap-10 xl:grid-cols-2">
          <ProductCarousel title="MAIS VENDIDOS" products={bestSellerProducts} />
          <ProductCarousel title="RETRO" products={retroCarouselProducts} />
        </div>
      </div>
    </section>
  );
};

export default ProductCarouselSection;
