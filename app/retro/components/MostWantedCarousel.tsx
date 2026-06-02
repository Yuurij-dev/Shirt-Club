"use client";

import ProductCarousel from "@/app/components/ProductCarousel";
import { mostWantedProducts } from "@/app/data/products";

const MostWantedCarousel = () => {
  return (
    <section className="w-full bg-white !px-4 !py-8 sm:!px-6 lg:!px-0">
      <div className="container !mx-auto">
        <ProductCarousel
          title="MAIS PROCURADAS"
          products={mostWantedProducts}
          showViewAll={false}
        />
      </div>
    </section>
  );
};

export default MostWantedCarousel;
