"use client";

import ProductCarousel from "./ProductCarousel";
import type { Product } from "../context/FavoritesContext";

const bestSellers: Product[] = [
  {
    name: "Camisa Flamengo Home 24/25",
    price: "R$ 189,90",
    image: "/products/flamengo-home.png",
  },
  {
    name: "Camisa Real Madrid Home 24/25",
    price: "R$ 189,90",
    image: "/products/real-madrid-home.png",
  },
  {
    name: "Camisa Palmeiras Home 24/25",
    price: "R$ 189,90",
    image: "/products/palmeiras-home.png",
  },
  {
    name: "Camisa Barcelona Home 24/25",
    price: "R$ 189,90",
    image: "/products/barcelona-home.png",
  },
  {
    name: "Camisa Vasco Home 24/25",
    price: "R$ 189,90",
    image: "/products/vasco-home.png",
  },
  {
    name: "Camisa Corinthians Home 24/25",
    price: "R$ 189,90",
    image: "/products/Corinthians-home.png",
  },
];

const retroProducts: Product[] = [
  {
    name: "Camisa Flamengo Retrô",
    price: "R$ 179,90",
    image: "/products/retro/flamengo-retro.png",
  },
  {
    name: "Camisa Barcelona Retrô 2015",
    price: "R$ 179,90",
    image: "/products/retro/barcelona-2015.png",
  },
  {
    name: "Camisa Milan Retrô 96/99",
    price: "R$ 189,90",
    image: "/products/retro/milan-retro.png",
  },
  {
    name: "Camisa Vasco Retrô 1997",
    price: "R$ 179,90",
    image: "/products/retro/vasco-retro.png",
  },
];

const ProductCarouselSection = () => {
  return (
    <section className="w-full bg-white !px-4 !py-8 sm:!px-6 lg:!px-0">
      <div className="container !mx-auto">
        <div className="grid grid-cols-1 gap-10 xl:grid-cols-2">
          <ProductCarousel title="MAIS VENDIDOS" products={bestSellers} />
          <ProductCarousel title="RETRO" products={retroProducts} />
        </div>
      </div>
    </section>
  );
};

export default ProductCarouselSection;
