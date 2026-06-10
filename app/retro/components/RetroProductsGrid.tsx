"use client";

import { ChevronDown, ChevronUp, SlidersHorizontal } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import ProductCard from "@/app/components/productCard";
import { getProductById, type Product } from "@/app/data/products";

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

const retroProducts = [
  {
    id: "camisa-flamengo-retro-1981",
    competition: "Libertadores",
    filters: ["1980", "Clubes", "Libertadores"],
    sales: 65,
  },
  {
    id: "camisa-brasil-retro-1994",
    competition: "Copa do Mundo",
    filters: ["1990", "Seleções", "Copa do Mundo"],
    sales: 82,
  },
  {
    id: "camisa-milan-retro-2007",
    competition: "Champions League",
    filters: ["2000", "Clubes", "Champions"],
    sales: 74,
  },
  {
    id: "camisa-barcelona-retro-2015",
    competition: "Champions League",
    filters: ["2000", "Clubes", "Champions"],
    sales: 70,
  },
]
  .map((item) => {
    const product = getProductById(item.id);

    if (!product) return null;

    return {
      ...product,
      competition: item.competition,
      filters: item.filters as Exclude<Filter, "Todos">[],
      sales: item.sales,
    };
  })
  .filter((product): product is RetroProduct => Boolean(product));

const getPriceNumber = (price: string | number) => {
  if (typeof price === "number") return price;

  return Number(price.replace("R$ ", "").replace(".", "").replace(",", "."));
};

const RetroProductsGrid = () => {
  const [selectedFilter, setSelectedFilter] = useState<Filter>("Todos");
  const [sortBy, setSortBy] = useState("mais-vendidos");
  const [showFilters, setShowFilters] = useState(false);
  const [products, setProducts] = useState<RetroProduct[]>(retroProducts);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const response = await fetch("/api/products", { cache: "no-store" });

        if (!response.ok) return;

        const data = (await response.json()) as { products?: Product[] };
        const activeProducts = data.products || [];

        setProducts(
          retroProducts
            .map((retroProduct) => {
              const product = activeProducts.find((currentProduct) => {
                return currentProduct.id === retroProduct.id;
              });

              if (!product) return null;

              return {
                ...product,
                competition: retroProduct.competition,
                filters: retroProduct.filters,
                sales: retroProduct.sales,
              };
            })
            .filter((product): product is RetroProduct => Boolean(product))
        );
      } catch {
        setProducts(retroProducts);
      }
    };

    void loadProducts();
  }, []);

  const filteredProducts = useMemo(() => {
    let filtered =
      selectedFilter === "Todos"
        ? products
        : products.filter((product) =>
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
  }, [products, selectedFilter, sortBy]);

  return (
    <section className="w-full bg-white !px-4 !py-8 sm:!px-6 lg:!px-0">
      <div className="container !mx-auto">
        <div className="!mb-6 flex flex-col !gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap items-center !gap-3">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex h-11 items-center !gap-2 rounded-lg border border-zinc-200 bg-white !px-4 text-sm font-bold transition-all duration-200 hover:border-black"
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
                      h-11 rounded-lg border !px-4 text-sm font-medium transition-all duration-200
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
            onChange={(event) => setSortBy(event.target.value)}
            className="h-11 w-full rounded-lg border border-zinc-200 bg-white !px-4 text-sm font-bold outline-none sm:w-auto"
          >
            <option value="mais-vendidos">ORDENAR: MAIS VENDIDOS</option>
            <option value="menos-vendidos">ORDENAR: MENOS VENDIDOS</option>
            <option value="menor-preco">ORDENAR: MENOR PREÇO</option>
            <option value="maior-preco">ORDENAR: MAIOR PREÇO</option>
          </select>
        </div>

        <div className="grid grid-cols-1 !gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default RetroProductsGrid;
