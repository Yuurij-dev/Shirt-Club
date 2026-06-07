import { SlidersHorizontal } from "lucide-react";

type ProductFiltersProps = {
  selectedTeams: string[];
  setSelectedTeams: React.Dispatch<React.SetStateAction<string[]>>;
  selectedCategory: string;
  setSelectedCategory: React.Dispatch<React.SetStateAction<string>>;
  maxPrice: number;
  setMaxPrice: React.Dispatch<React.SetStateAction<number>>;
};

const categories = [
  "Todas",
  "Camisas",
  "Casacos e Jaquetas",
  "Treino",
  "Bonés e Acessórios",
];

const teams = [
  "Real Madrid",
  "Flamengo",
  "Corinthians",
  "Palmeiras",
  "Barcelona",
  "Liverpool",
  "Manchester United",
];

const ProductFilters = ({
  selectedTeams,
  setSelectedTeams,
  selectedCategory,
  setSelectedCategory,
  maxPrice,
  setMaxPrice,
}: ProductFiltersProps) => {
  const handleTeamChange = (team: string) => {
    if (selectedTeams.includes(team)) {
      setSelectedTeams(selectedTeams.filter((item) => item !== team));
    } else {
      setSelectedTeams([...selectedTeams, team]);
    }
  };

  const clearFilters = () => {
    setSelectedTeams([]);
    setSelectedCategory("Todas");
    setMaxPrice(599.9);
  };

  return (
    <aside className="rounded-xl border border-zinc-200 bg-white !p-5 h-fit">
      <div className="flex items-center !gap-2 border-b border-zinc-200 !pb-4">
        <SlidersHorizontal size={18} />
        <h3 className="font-bold text-sm">FILTRAR</h3>
      </div>

      <div className="!py-5 border-b border-zinc-200">
        <h4 className="font-bold text-xs !mb-4">CATEGORIAS</h4>

        <div className="flex flex-col !gap-3 text-sm text-zinc-600">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`text-left ${
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

      <div className="!py-5 border-b border-zinc-200">
        <h4 className="font-bold text-xs !mb-4">TIMES</h4>

        <div className="flex flex-col !gap-3 text-sm text-zinc-600">
          {teams.map((team) => (
            <label key={team} className="flex items-center !gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={selectedTeams.includes(team)}
                onChange={() => handleTeamChange(team)}
                className="accent-black"
              />
              {team}
            </label>
          ))}
        </div>
      </div>

      <div className="!py-5 border-b border-zinc-200">
        <h4 className="font-bold text-xs !mb-4">PREÇO</h4>

        <input
          type="range"
          min="129"
          max="599"
          value={maxPrice}
          onChange={(e) => setMaxPrice(Number(e.target.value))}
          className="!w-full accent-black"
        />

        <div className="flex justify-between text-xs !mt-2 text-zinc-600">
          <span>R$ 129,90</span>
          <span>R$ {maxPrice.toFixed(2).replace(".", ",")}</span>
        </div>
      </div>

      <button
        onClick={clearFilters}
        className="!mt-5 !w-full !h-10 rounded-md border border-zinc-200 text-xs font-bold hover:bg-zinc-100 transition"
      >
        LIMPAR FILTROS
      </button>
    </aside>
  );
};

export default ProductFilters;