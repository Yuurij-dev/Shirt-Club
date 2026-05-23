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

const retroProducts = [
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

type Product = {
  name: string;
  price: string;
  image: string;
};

const ProductCard = ({ product }: { product: Product }) => {
  return (
    <div
      className="
        min-w-[190px]

        sm:min-w-[210px]

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
          h-[230px]

          sm:h-[260px]

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
        <h3
          className="
            text-sm
            font-medium
            text-zinc-800

            sm:text-base
          "
        >
          {product.name}
        </h3>

        <p
          className="
            !mt-2
            text-lg
            font-bold
            text-zinc-950

            sm:text-xl
          "
        >
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
      left: -260,
      behavior: "smooth",
    });
  };

  const scrollRight = () => {
    carouselRef.current?.scrollBy({
      left: 260,
      behavior: "smooth",
    });
  };

  return (
    <div className="w-full overflow-hidden">
      
      <div className="!mb-5 flex items-center justify-between">
        
        <h2
          className="
            font-[family-name:var(--font-bebas)]
            text-3xl
            text-zinc-950

            sm:text-4xl
          "
        >
          {title}
        </h2>

        <a
          href="#"
          className="
            text-xs
            font-medium
            text-zinc-700
            hover:underline

            sm:text-sm
          "
        >
          Ver todos ›
        </a>

      </div>

      <div className="relative">

        <button
          onClick={scrollLeft}
          className="
            absolute
            -left-2
            top-1/2
            z-10
            flex
            h-8
            w-8
            -translate-y-1/2
            items-center
            justify-center
            rounded-full
            bg-white
            shadow-md
            transition-all
            duration-200
            hover:scale-110

            sm:h-9
            sm:w-9
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
            -right-2
            top-1/2
            z-10
            flex
            h-8
            w-8
            -translate-y-1/2
            items-center
            justify-center
            rounded-full
            bg-white
            shadow-md
            transition-all
            duration-200
            hover:scale-110

            sm:h-9
            sm:w-9
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
    <section className="w-full bg-white !px-4 !py-8 sm:!px-6 lg:!px-0">
      <div className="container !mx-auto">

        <div
          className="
            grid
            grid-cols-1
            gap-10

            xl:grid-cols-2
          "
        >
          <ProductCarousel
            title="MAIS VENDIDOS"
            products={bestSellers}
          />

          <ProductCarousel
            title="RETRO"
            products={retroProducts}
          />
        </div>

      </div>
    </section>
  );
};

export default ProductCarouselSection;