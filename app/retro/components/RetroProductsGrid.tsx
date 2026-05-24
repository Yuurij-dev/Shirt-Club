"use client";

import Image from "next/image";
import { SlidersHorizontal, ChevronDown, ChevronUp } from "lucide-react";
import { useMemo, useState } from "react";

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

type RetroProduct = {
  name: string;
  competition: string;
  price: string;
  image: string;
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
    price: "R$ 219,90",
    image: "/products/retro/flamengo-1981.png",
    filters: ["1980", "Clubes", "Libertadores"],
    sales: 65,
  },
  {
    name: "Camisa Brasil Retrô 1994",
    competition: "Copa do Mundo",
    price: "R$ 239,90",
    image: "/products/retro/brasil-1994.png",
    filters: ["1990", "Seleções", "Copa do Mundo"],
    sales: 82,
  },
  {
    name: "Camisa Milan Retrô 2007",
    competition: "Champions League",
    price: "R$ 229,90",
    image: "/products/retro/milan-2007.png",
    filters: ["2000", "Clubes", "Champions"],
    sales: 74,
  },
  {
    name: "Camisa Barcelona Retrô 2015",
    competition: "Champions League",
    price: "R$ 229,90",
    image: "/products/retro/barcelona-2015.png",
    filters: ["2000", "Clubes", "Champions"],
    sales: 70,
  },
  {
    name: "Camisa Vasco Retrô 1998",
    competition: "Campeonato Brasileiro",
    price: "R$ 209,90",
    image: "/products/retro/vasco-1998.png",
    filters: ["1990", "Clubes"],
    sales: 58,
  },
  {
    name: "Camisa Argentina Retrô 1986",
    competition: "Copa do Mundo",
    price: "R$ 229,90",
    image: "/products/retro/argentina-1986.png",
    filters: ["1980", "Seleções", "Copa do Mundo"],
    sales: 61,
  },
  {
    name: "Camisa Inter Retrô 1998",
    competition: "UEFA Cup",
    price: "R$ 209,90",
    image: "/products/retro/inter-1998.png",
    filters: ["1990", "Clubes"],
    sales: 46,
  },
  {
    name: "Camisa Manchester Utd 1999",
    competition: "Champions League",
    price: "R$ 229,90",
    image: "/products/retro/manchester-1999.png",
    filters: ["1990", "Clubes", "Champions"],
    sales: 69,
  },
  {
    name: "Camisa Real Madrid 2002",
    competition: "Champions League",
    price: "R$ 229,90",
    image: "/products/retro/real-madrid-2002.png",
    filters: ["2000", "Clubes", "Champions"],
    sales: 55,
  },
  {
    name: "Camisa Liverpool Retrô 2005",
    competition: "Champions League",
    price: "R$ 219,90",
    image: "/products/retro/liverpool-2005.png",
    filters: ["2000", "Clubes", "Champions"],
    sales: 63,
  },
];

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
        (a, b) =>
          Number(b.price.replace("R$ ", "").replace(",", ".")) -
          Number(a.price.replace("R$ ", "").replace(",", "."))
      );
    }

    if (sortBy === "menor-preco") {
      filtered = [...filtered].sort(
        (a, b) =>
          Number(a.price.replace("R$ ", "").replace(",", ".")) -
          Number(b.price.replace("R$ ", "").replace(",", "."))
      );
    }

    return filtered;
  }, [selectedFilter, sortBy]);

  return (
    <section className="w-full bg-white !px-4 !py-8 sm:!px-6 lg:!px-0">
      <div className="container !mx-auto">
        <div className="!mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="
                flex
                h-11
                items-center
                gap-2
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
              <div className="flex flex-wrap items-center gap-2">
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
              rounded-lg
              border
              border-zinc-200
              bg-white
              !px-4
              text-sm
              font-bold
              outline-none
            "
          >
            <option value="mais-vendidos">ORDENAR: MAIS VENDIDOS</option>
            <option value="menos-vendidos">ORDENAR: MENOS VENDIDOS</option>
            <option value="menor-preco">ORDENAR: MENOR PREÇO</option>
            <option value="maior-preco">ORDENAR: MAIOR PREÇO</option>
          </select>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {filteredProducts.map((product) => (
            <a
              href="#"
              key={product.name}
              className="
                group
                overflow-hidden
                rounded-2xl
                border
                border-zinc-200
                bg-white
                shadow-sm
                transition-all
                duration-300
                hover:-translate-y-1
                hover:shadow-xl
              "
            >
              <div className="relative h-[280px] overflow-hidden rounded-2xl bg-zinc-100 sm:h-[320px]">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="
                    object-contain
                    !p-4
                    transition-all
                    duration-500
                    group-hover:scale-105
                  "
                />
              </div>

              <div className="!p-4 text-center">
                <h3 className="text-sm font-bold text-zinc-950 sm:text-base">
                  {product.name}
                </h3>

                <p className="!mt-1 text-xs text-zinc-500 sm:text-sm">
                  {product.competition}
                </p>

                <p className="!mt-2 text-xl font-bold text-zinc-950">
                  {product.price}
                </p>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default RetroProductsGrid;