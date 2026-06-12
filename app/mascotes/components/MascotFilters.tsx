import { SlidersHorizontal } from "lucide-react";

type MascotFiltersProps = {
  continents: string[];
  selectedContinents: string[];
  setSelectedContinents: React.Dispatch<React.SetStateAction<string[]>>;
  selectedCategory: string;
  setSelectedCategory: React.Dispatch<React.SetStateAction<string>>;
  maxPrice: number;
  setMaxPrice: React.Dispatch<React.SetStateAction<number>>;
};

const categories = ["Todas", "Times", "Selecoes"];
const defaultContinents = [
  "America do Sul",
  "America do Norte",
  "Europa",
  "Asia",
  "Africa",
  "Oceania",
];

const uniqueList = (items: string[], fallback: string[]) => {
  const values = items.filter(Boolean);
  const merged = [...fallback, ...values];

  return merged.filter((item, index) => merged.indexOf(item) === index);
};

const MascotFilters = ({
  continents,
  selectedContinents,
  setSelectedContinents,
  selectedCategory,
  setSelectedCategory,
  maxPrice,
  setMaxPrice,
}: MascotFiltersProps) => {
  const availableContinents = uniqueList(continents, defaultContinents);

  const handleContinentChange = (continent: string) => {
    if (selectedContinents.includes(continent)) {
      setSelectedContinents(
        selectedContinents.filter((item) => item !== continent)
      );
    } else {
      setSelectedContinents([...selectedContinents, continent]);
    }
  };

  const clearFilters = () => {
    setSelectedContinents([]);
    setSelectedCategory("Todas");
    setMaxPrice(599.9);
  };

  return (
    <aside className="h-fit rounded-xl border border-zinc-200 bg-white !p-5">
      <div className="flex items-center !gap-2 border-b border-zinc-200 !pb-4">
        <SlidersHorizontal size={18} />
        <h3 className="text-sm font-bold">FILTRAR</h3>
      </div>

      <div className="border-b border-zinc-200 !py-5">
        <h4 className="!mb-4 text-xs font-bold">CATEGORIAS</h4>

        <div className="flex flex-col !gap-3 text-sm text-zinc-600">
          {categories.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => setSelectedCategory(category)}
              className={`cursor-pointer text-left ${
                selectedCategory === category
                  ? "font-bold text-black"
                  : "text-zinc-600"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      <div className="border-b border-zinc-200 !py-5">
        <h4 className="!mb-4 text-xs font-bold">CONTINENTE</h4>

        <div className="flex flex-col !gap-3 text-sm text-zinc-600">
          {availableContinents.map((continent) => (
            <label
              key={continent}
              className="flex cursor-pointer items-center !gap-2"
            >
              <input
                type="checkbox"
                checked={selectedContinents.includes(continent)}
                onChange={() => handleContinentChange(continent)}
                className="accent-black"
              />
              {continent}
            </label>
          ))}
        </div>
      </div>

      <div className="border-b border-zinc-200 !py-5">
        <h4 className="!mb-4 text-xs font-bold">FAIXA DE PRECO</h4>

        <input
          type="range"
          min="49"
          max="599"
          value={maxPrice}
          onChange={(event) => setMaxPrice(Number(event.target.value))}
          className="!w-full accent-black"
        />

        <div className="!mt-2 flex justify-between text-xs text-zinc-600">
          <span>R$ 49,90</span>
          <span>R$ {maxPrice.toFixed(2).replace(".", ",")}</span>
        </div>
      </div>

      <button
        type="button"
        onClick={clearFilters}
        className="!mt-5 !h-10 !w-full cursor-pointer rounded-md border border-zinc-200 text-xs font-bold transition hover:bg-zinc-100"
      >
        LIMPAR FILTROS
      </button>
    </aside>
  );
};

export default MascotFilters;
