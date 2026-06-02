"use client";

import Image from "next/image";
import { ChevronDown, ChevronUp, SlidersHorizontal } from "lucide-react";
import { useMemo, useState } from "react";

type Continent =
  | "Todos"
  | "América do Sul"
  | "Europa"
  | "América do Norte"
  | "África"
  | "Ásia";

type Selection = {
  name: string;
  continent: Exclude<Continent, "Todos">;
  products: number;
  image?: string;
};

const continents: Continent[] = [
  "Todos",
  "América do Sul",
  "Europa",
  "América do Norte",
  "África",
  "Ásia",
];

const selections: Selection[] = [
  {
    name: "Brasil",
    continent: "América do Sul",
    products: 36,
    image: "/selecoes/brasil.svg",
  },
  {
    name: "Argentina",
    continent: "América do Sul",
    products: 32,
    image: "/selecoes/argentina.svg",
  },
  {
    name: "França",
    continent: "Europa",
    products: 30,
    image: "/selecoes/franca.svg",
  },
  {
    name: "Portugal",
    continent: "Europa",
    products: 28,
    image: "/selecoes/portugal.svg",
  },
  {
    name: "Espanha",
    continent: "Europa",
    products: 27,
    image: "/selecoes/espanha.svg",
  },
  {
    name: "Alemanha",
    continent: "Europa",
    products: 25,
    image: "/selecoes/alemanha.svg",
  },
  {
    name: "Itália",
    continent: "Europa",
    products: 24,
    image: "/selecoes/italia.svg",
  },
  {
    name: "Inglaterra",
    continent: "Europa",
    products: 24,
    image: "/selecoes/inglaterra.svg",
  },
  {
    name: "Uruguai",
    continent: "América do Sul",
    products: 20,
    image: "/selecoes/uruguai.svg",
  },
  {
    name: "México",
    continent: "América do Norte",
    products: 18,
    image: "/selecoes/mexico.svg",
  },
  {
    name: "Japão",
    continent: "Ásia",
    products: 16,
    image: "/selecoes/japao.svg",
  },
  {
    name: "Nigéria",
    continent: "África",
    products: 14,
    image: "/selecoes/nigeria.svg",
  },
];

const getInitials = (name: string) => {
  return name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
};

const SelectionsGrid = () => {
  const [selectedContinent, setSelectedContinent] =
    useState<Continent>("Todos");
  const [sortBy, setSortBy] = useState("mais-vendidos");
  const [showFilters, setShowFilters] = useState(false);

  const filteredSelections = useMemo(() => {
    let filtered =
      selectedContinent === "Todos"
        ? selections
        : selections.filter(
            (selection) => selection.continent === selectedContinent
          );

    if (sortBy === "mais-vendidos") {
      filtered = [...filtered].sort((a, b) => b.products - a.products);
    }

    if (sortBy === "menos-vendidos") {
      filtered = [...filtered].sort((a, b) => a.products - b.products);
    }

    if (sortBy === "az") {
      filtered = [...filtered].sort((a, b) => a.name.localeCompare(b.name));
    }

    return filtered;
  }, [selectedContinent, sortBy]);

  return (
    <section className="w-full bg-white !px-4 !py-8 sm:!px-6 lg:!px-0">
      <div className="container !mx-auto">
        <div className="!mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex h-11 items-center gap-2 rounded-lg border border-zinc-200 bg-white !px-4 text-sm font-bold transition-all duration-200 hover:border-black"
            >
              <SlidersHorizontal size={18} />
              <span>FILTRAR</span>
              {showFilters ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </button>

            {showFilters && (
              <div className="flex flex-wrap items-center gap-2">
                {continents.map((continent) => (
                  <button
                    key={continent}
                    onClick={() => setSelectedContinent(continent)}
                    className={`
                      h-11 rounded-lg border !px-4 text-sm font-medium transition-all duration-200
                      ${
                        selectedContinent === continent
                          ? "border-black bg-black text-white"
                          : "border-zinc-200 bg-white text-zinc-700 hover:border-black"
                      }
                    `}
                  >
                    {continent}
                  </button>
                ))}
              </div>
            )}
          </div>

          <select
            value={sortBy}
            onChange={(event) => setSortBy(event.target.value)}
            className="h-11 rounded-lg border border-zinc-200 bg-white !px-4 text-sm font-bold outline-none"
          >
            <option value="mais-vendidos">ORDENAR: MAIS VENDIDOS</option>
            <option value="menos-vendidos">ORDENAR: MENOS VENDIDOS</option>
            <option value="az">ORDENAR: A-Z</option>
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5">
          {filteredSelections.map((selection) => (
            <a
              href="#"
              key={selection.name}
              className="group flex min-h-[210px] flex-col items-center justify-center rounded-2xl border border-zinc-200 bg-white !p-5 text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="relative flex h-[90px] w-[90px] items-center justify-center rounded-full border border-zinc-200 bg-zinc-50 font-[family-name:var(--font-bebas)] text-4xl text-zinc-950 transition-all duration-300 group-hover:scale-110">
                {selection.image ? (
                  <Image
                    src={selection.image}
                    alt={selection.name}
                    fill
                    sizes="90px"
                    className="object-contain !p-3"
                  />
                ) : (
                  getInitials(selection.name)
                )}
              </div>

              <h3 className="!mt-4 text-base font-bold text-zinc-950">
                {selection.name}
              </h3>

              <p className="!mt-1 text-sm text-zinc-500">
                {selection.products} produtos
              </p>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SelectionsGrid;
