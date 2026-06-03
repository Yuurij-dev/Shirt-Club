"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronDown, ChevronUp, SlidersHorizontal } from "lucide-react";
import { useMemo, useState } from "react";
import { countries, teams, type Country } from "@/app/data/teams";
import { getProductCountByOwner } from "@/app/utils/inventory";

const getInitials = (name: string) => {
  return name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
};

const TeamsGrid = () => {
  const [selectedCountry, setSelectedCountry] = useState<Country>("Todos");
  const [sortBy, setSortBy] = useState("mais-vendidos");
  const [showFilters, setShowFilters] = useState(false);

  const filteredTeams = useMemo(() => {
    let filtered =
      selectedCountry === "Todos"
        ? teams
        : teams.filter((team) => team.country === selectedCountry);

    if (sortBy === "mais-vendidos") {
      filtered = [...filtered].sort(
        (a, b) => getProductCountByOwner(b) - getProductCountByOwner(a)
      );
    }

    if (sortBy === "menos-vendidos") {
      filtered = [...filtered].sort(
        (a, b) => getProductCountByOwner(a) - getProductCountByOwner(b)
      );
    }

    if (sortBy === "az") {
      filtered = [...filtered].sort((a, b) => a.name.localeCompare(b.name));
    }

    return filtered;
  }, [selectedCountry, sortBy]);

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
                {countries.map((country) => (
                  <button
                    key={country}
                    onClick={() => setSelectedCountry(country)}
                    className={`
                      h-11 rounded-lg border !px-4 text-sm font-medium transition-all duration-200
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
          {filteredTeams.map((team) => (
            <Link
              href={`/times/${team.slug}`}
              key={team.slug}
              className="group flex min-h-[210px] flex-col items-center justify-center rounded-2xl border border-zinc-200 bg-white !p-5 text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="relative flex h-[90px] w-[90px] items-center justify-center rounded-full border border-zinc-200 bg-zinc-50 font-[family-name:var(--font-bebas)] text-4xl text-zinc-950 transition-all duration-300 group-hover:scale-110">
                {team.image ? (
                  <Image
                    src={team.image}
                    alt={team.name}
                    fill
                    sizes="90px"
                    className="object-contain !p-3"
                  />
                ) : (
                  getInitials(team.name)
                )}
              </div>

              <h3 className="!mt-4 text-base font-bold text-zinc-950">
                {team.name}
              </h3>

              <p className="!mt-1 text-sm text-zinc-500">
                {getProductCountByOwner(team)} produtos
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TeamsGrid;
