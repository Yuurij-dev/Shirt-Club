"use client";

import Image from "next/image";

import {
  SlidersHorizontal,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

import { useMemo, useState } from "react";

type Country =
  | "Todos"
  | "Brasil"
  | "Espanha"
  | "Inglaterra"
  | "França"
  | "Itália"
  | "Alemanha";

type Team = {
  name: string;
  country: Exclude<Country, "Todos">;
  products: number;
  image: string;
};

const countries: Country[] = [
  "Todos",
  "Brasil",
  "Espanha",
  "Inglaterra",
  "França",
  "Itália",
  "Alemanha",
];

const teams: Team[] = [
  {
    name: "Flamengo",
    country: "Brasil",
    products: 45,
    image: "/teams/flamengo.svg",
  },
  {
    name: "Corinthians",
    country: "Brasil",
    products: 42,
    image: "/teams/corinthians.svg",
  },
  {
    name: "Palmeiras",
    country: "Brasil",
    products: 40,
    image: "/teams/palmeiras.svg",
  },
  {
    name: "São Paulo",
    country: "Brasil",
    products: 38,
    image: "/teams/sao-paulo.svg",
  },
  {
    name: "Santos",
    country: "Brasil",
    products: 35,
    image: "/teams/santos.svg",
  },
  {
    name: "Real Madrid",
    country: "Espanha",
    products: 50,
    image: "/teams/real-madrid.svg",
  },
  {
    name: "Barcelona",
    country: "Espanha",
    products: 48,
    image: "/teams/barcelona.svg",
  },
  {
    name: "Liverpool",
    country: "Inglaterra",
    products: 46,
    image: "/teams/liverpool.svg",
  },
  {
    name: "Paris Saint-Germain",
    country: "França",
    products: 44,
    image: "/teams/psg.svg",
  },
  {
    name: "Manchester City",
    country: "Inglaterra",
    products: 40,
    image: "/teams/manchester-city.svg",
  },
  {
    name: "Bayern de Munique",
    country: "Alemanha",
    products: 38,
    image: "/teams/bayern.svg",
  },
  {
    name: "Chelsea",
    country: "Inglaterra",
    products: 36,
    image: "/teams/chelsea.svg",
  },
  {
    name: "Arsenal",
    country: "Inglaterra",
    products: 35,
    image: "/teams/arsenal.svg",
  },
  {
    name: "AC Milan",
    country: "Itália",
    products: 34,
    image: "/teams/milan.svg",
  },
  {
    name: "Juventus",
    country: "Itália",
    products: 32,
    image: "/teams/juventus.svg",
  },
  {
    name: "Internacional",
    country: "Brasil",
    products: 30,
    image: "/teams/internacional.svg",
  },
  {
    name: "Grêmio",
    country: "Brasil",
    products: 28,
    image: "/teams/gremio.svg",
  },
  {
    name: "Atlético-MG",
    country: "Brasil",
    products: 28,
    image: "/teams/atletico-mg.svg",
  },
  {
    name: "Cruzeiro",
    country: "Brasil",
    products: 26,
    image: "/teams/cruzeiro.svg",
  },
];

const TeamsGrid = () => {
  const [selectedCountry, setSelectedCountry] =
    useState<Country>("Todos");

  const [sortBy, setSortBy] =
    useState("mais-vendidos");

  const [showFilters, setShowFilters] =
    useState(false);

  const filteredTeams = useMemo(() => {
    let filtered =
      selectedCountry === "Todos"
        ? teams
        : teams.filter(
            (team) =>
              team.country === selectedCountry
          );

    if (sortBy === "mais-vendidos") {
      filtered = [...filtered].sort(
        (a, b) => b.products - a.products
      );
    }

    if (sortBy === "menos-vendidos") {
      filtered = [...filtered].sort(
        (a, b) => a.products - b.products
      );
    }

    if (sortBy === "az") {
      filtered = [...filtered].sort((a, b) =>
        a.name.localeCompare(b.name)
      );
    }

    return filtered;
  }, [selectedCountry, sortBy]);

  return (
    <section className="w-full bg-white !px-4 !py-8 sm:!px-6 lg:!px-0">
      
      <div className="container !mx-auto">

        {/* TOP BAR */}
        <div className="!mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

          <div className="flex flex-wrap items-center gap-3">

            {/* FILTRO BUTTON */}
            <button
              onClick={() =>
                setShowFilters(!showFilters)
              }
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

              <span>FILTRAR</span>

              {showFilters ? (
                <ChevronUp size={18} />
              ) : (
                <ChevronDown size={18} />
              )}
            </button>

            {/* FILTERS */}
            {showFilters && (
              <div className="flex flex-wrap items-center gap-2">
                
                {countries.map((country) => (
                  <button
                    key={country}
                    onClick={() =>
                      setSelectedCountry(country)
                    }
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
                            selectedCountry === country
                            ? "border-black bg-black text-white"
                            : "border-zinc-200 bg-white text-zinc-700 hover:border-black"
                        }
                        `}
                  >
                    {country}
                  </button>
                ))}

              </div>
            )}

          </div>

          {/* SORT */}
          <select
            value={sortBy}
            onChange={(e) =>
              setSortBy(e.target.value)
            }
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
            <option value="mais-vendidos">
              ORDENAR: MAIS VENDIDOS
            </option>

            <option value="menos-vendidos">
              ORDENAR: MENOS VENDIDOS
            </option>

            <option value="az">
              ORDENAR: A-Z
            </option>
          </select>

        </div>

        {/* GRID */}
        <div
          className="
            grid
            grid-cols-2
            gap-4

            sm:grid-cols-3
            md:grid-cols-4
            xl:grid-cols-5
          "
        >

          {filteredTeams.map((team) => (
            <a
              href="#"
              key={team.name}
              className="
                group
                flex
                min-h-[210px]
                flex-col
                items-center
                justify-center
                rounded-2xl
                border
                border-zinc-200
                bg-white
                !p-5
                text-center
                transition-all
                duration-300
                hover:-translate-y-1
                hover:shadow-xl
              "
            >

              <div className="relative h-[90px] w-[90px]">
                <Image
                  src={team.image}
                  alt={team.name}
                  fill
                  className="
                    object-contain
                    transition-all
                    duration-300
                    group-hover:scale-110
                  "
                />
              </div>

              <h3 className="!mt-4 text-base font-bold text-zinc-950">
                {team.name}
              </h3>

              <p className="!mt-1 text-sm text-zinc-500">
                {team.products} produtos
              </p>

            </a>
          ))}

        </div>

      </div>

    </section>
  );
};

export default TeamsGrid;