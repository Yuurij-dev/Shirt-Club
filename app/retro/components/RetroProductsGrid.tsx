"use client";

import { SlidersHorizontal, ChevronDown, ChevronUp } from "lucide-react";
import { useMemo, useState } from "react";
import ProductCard from "@/app/components/productCard";
import { Product } from "@/app/context/FavoritesContext";

type Filter =
  | "Todos"
  | "1980"
  | "1990"
  | "2000"
  | "Seleções"
  | "Clubes"
  | "Libertadores"
  | "Champions"
  | "Copa do Mundo";

type RetroProduct = Product & {
  competition: string;
  filters: Exclude<Filter, "Todos">[];
  sales: number;
};

const filters: Filter[] = [
  "Todos",
  "1980",
  "1990",
  "2000",
  "Seleções",
  "Clubes",
  "Libertadores",
  "Champions",
  "Copa do Mundo",
];

const retroProducts: RetroProduct[] = [
  {
    name: "Camisa Flamengo Retrô 1981",
    competition: "Libertadores",
    category: "Retrô",
    team: "Flamengo",
    price: "R$ 219,90",
    image: "/products/retro/flamengo-1981.png",
    filters: ["1980", "Clubes", "Libertadores"],
    sales: 65,
  },
  {
    name: "Camisa Brasil Retrô 1994",
    competition: "Copa do Mundo",
    category: "Retrô",
    team: "Brasil",
    price: "R$ 239,90",
    image: "/products/retro/brasil-1994.png",
    filters: ["1990", "Seleções", "Copa do Mundo"],
    sales: 82,
  },
  {
    name: "Camisa Milan Retrô 2007",
    competition: "Champions League",
    category: "Retrô",
    team: "Milan",
    price: "R$ 229,90",
    image: "/products/retro/milan-2007.png",
    filters: ["2000", "Clubes", "Champions"],
    sales: 74,
  },
  {
    name: "Camisa Barcelona Retrô 2015",
    competition: "Champions League",
    category: "Retrô",
    team: "Barcelona",
    price: "R$ 229,90",
    image: "/products/retro/barcelona-2015.png",
    filters: ["2000", "Clubes", "Champions"],
    sales: 70,
  },
];

const getPriceNumber = (price: string | number) => {
  if (typeof price === "number") return price;

  return Number(
    price
      .replace("R$ ", "")
      .replace(".", "")
      .replace(",", ".")
  );
};

const RetroProductsGrid = () => {
  const [selectedFilter, setSelectedFilter] = useState<Filter>("Todos");
  const [sortBy, setSortBy] = useState("mais-vendidos");
  const [showFilters, setShowFilters] = useState(false);

  const filteredProducts = useMemo(() => {
    let filtered =
      selectedFilter === "Todos"
        ? retroProducts
        : retroProducts.filter((product) =>
            product.filters.includes(selectedFilter)
          );

    if (sortBy === "mais-vendidos") {
      filtered = [...filtered].sort((a, b) => b.sales - a.sales);
    }

    if (sortBy === "menos-vendidos") {
      filtered = [...filtered].sort((a, b) => a.sales - b.sales);
    }

    if (sortBy === "maior-preco") {
      filtered = [...filtered].sort(
        (a, b) => getPriceNumber(b.price) - getPriceNumber(a.price)
      );
    }

    if (sortBy === "menor-preco") {
      filtered = [...filtered].sort(
        (a, b) => getPriceNumber(a.price) - getPriceNumber(b.price)
      );
    }

    return filtered;
  }, [selectedFilter, sortBy]);

  return (
    <section className="w-full bg-white !px-4 !py-8 sm:!px-6 lg:!px-0">
      <div className="container !mx-auto">
        <div className="!mb-6 flex flex-col !gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap items-center !gap-3">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="
                flex
                h-11
                items-center
                !gap-2
                rounded-lg
                border
                border-zinc-200
                bg-white
                !px-4
                text-sm
                font-bold
                transition-all
                duration-200
                hover:border-black
              "
            >
              <SlidersHorizontal size={18} />
              FILTRAR
              {showFilters ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </button>

            {showFilters && (
              <div className="flex flex-wrap items-center !gap-2">
                {filters.map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setSelectedFilter(filter)}
                    className={`
                      h-11
                      rounded-lg
                      border
                      !px-4
                      text-sm
                      font-medium
                      transition-all
                      duration-200
                      ${
                        selectedFilter === filter
                          ? "border-black bg-black text-white"
                          : "border-zinc-200 bg-white text-zinc-700 hover:border-black"
                      }
                    `}
                  >
                    {filter}
                  </button>
                ))}
              </div>
            )}
          </div>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="
              h-11
              w-full
              rounded-lg
              border
              border-zinc-200
              bg-white
              !px-4
              text-sm
              font-bold
              outline-none
              sm:w-auto
            "
          >
            <option value="mais-vendidos">ORDENAR: MAIS VENDIDOS</option>
            <option value="menos-vendidos">ORDENAR: MENOS VENDIDOS</option>
            <option value="menor-preco">ORDENAR: MENOR PREÇO</option>
            <option value="maior-preco">ORDENAR: MAIOR PREÇO</option>
          </select>
        </div>

        <div className="grid grid-cols-1 !gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {filteredProducts.map((product) => (
            <ProductCard key={product.name} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default RetroProductsGrid;