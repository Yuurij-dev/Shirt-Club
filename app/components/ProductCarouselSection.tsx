"use client";

import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef } from "react";

const bestSellers = [
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
];

const retroProducts = [
  {
    name: "Camisa Brasil Retrô 1994",
    price: "R$ 179,90",
    image: "/products/flamengo-home.png",
  },
  {
    name: "Camisa Corinthians Retrô 2012",
    price: "R$ 179,90",
    image: "/products/corinthians-retro.png",
  },
  {
    name: "Camisa Milan Retrô 96/99",
    price: "R$ 189,90",
    image: "/products/milan-retro.png",
  },
  {
    name: "Camisa Vasco Retrô 1997",
    price: "R$ 179,90",
    image: "/products/vasco-retro.png",
  },
];

type Product = {
  name: string;
  price: string;
  image: string;
};

const ProductCard = ({ product }: { product: Product }) => {
  return (
    <div
      className="
        min-w-[210px]
        overflow-hidden
        rounded-2xl
        bg-white
        shadow-sm
        transition-all
        duration-300
        hover:-translate-y-1
        hover:shadow-xl
      "
    >
      <div
        className="
          relative
          h-[260px]
          overflow-hidden
          rounded-2xl
          bg-zinc-100
        "
      >
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="
            object-cover
            transition-all
            duration-500
            hover:scale-105
          "
        />
      </div>

      <div className="!p-4">
        <h3 className="text-sm font-medium text-zinc-800">
          {product.name}
        </h3>

        <p className="!mt-2 text-xl font-bold text-zinc-950">
          {product.price}
        </p>
      </div>
    </div>
  );
};

const ProductCarousel = ({
  title,
  products,
}: {
  title: string;
  products: Product[];
}) => {
  const carouselRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    carouselRef.current?.scrollBy({
      left: -240,
      behavior: "smooth",
    });
  };

  const scrollRight = () => {
    carouselRef.current?.scrollBy({
      left: 240,
      behavior: "smooth",
    });
  };

  return (
    <div className="w-full overflow-hidden">
      <div className="!mb-5 flex items-center justify-between">
        <h2 className="font-[family-name:var(--font-bebas)] text-4xl text-zinc-950">
          {title}
        </h2>

        <a href="#" className="text-sm font-medium text-zinc-700 hover:underline">
          Ver todos ›
        </a>
      </div>

      <div className="relative">
        <button
          onClick={scrollLeft}
          className="
            absolute
            -left-3
            top-1/2
            z-10
            flex
            h-9
            w-9
            -translate-y-1/2
            items-center
            justify-center
            rounded-full
            bg-white
            shadow-md
            transition-all
            duration-200
            hover:scale-110
          "
        >
          <ChevronLeft size={20} />
        </button>

        <div
          ref={carouselRef}
          className="
            flex
            gap-4
            overflow-x-hidden
            scroll-smooth
          "
        >
          {products.map((product) => (
            <ProductCard key={product.name} product={product} />
          ))}
        </div>

        <button
          onClick={scrollRight}
          className="
            absolute
            -right-3
            top-1/2
            z-10
            flex
            h-9
            w-9
            -translate-y-1/2
            items-center
            justify-center
            rounded-full
            bg-white
            shadow-md
            transition-all
            duration-200
            hover:scale-110
          "
        >
          <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );
};

const ProductCarouselSection = () => {
  return (
    <section className="w-full bg-white !py-8">
      <div className="container !mx-auto">
        <div className="grid grid-cols-2 gap-8">
          <ProductCarousel title="MAIS VENDIDOS" products={bestSellers} />
          <ProductCarousel title="RETRO" products={retroProducts} />
        </div>
      </div>
    </section>
  );
};

export default ProductCarouselSection;