"use client";

import ProductCarousel from "@/app/components/ProductCarousel";
import type { Product } from "@/app/context/FavoritesContext";

const products: Product[] = [
  {
    name: "Brasil Retrô 1994",
    price: "R$ 239,90",
    image: "/products/retro/brasil-1994.png",
  },
  {
    name: "Milan Retrô 2007",
    price: "R$ 229,90",
    image: "/products/retro/milan-2007.png",
  },
  {
    name: "Barcelona Retrô 2015",
    price: "R$ 229,90",
    image: "/products/retro/barcelona-2015.png",
  },
  {
    name: "Flamengo Retrô 1981",
    price: "R$ 219,90",
    image: "/products/retro/flamengo-1981.png",
  },
  {
    name: "Vasco Retrô 1998",
    price: "R$ 209,90",
    image: "/products/retro/vasco-1998.png",
  },
  {
    name: "Inter Retrô 1998",
    price: "R$ 209,90",
    image: "/products/retro/inter-1998.png",
  },
];

const MostWantedCarousel = () => {
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
