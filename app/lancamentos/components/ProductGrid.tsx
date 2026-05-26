import Image from "next/image";
import { Heart } from "lucide-react";

type Product = {
  name: string;
  category: string;
  team: string;
  price: number;
  image: string;
};

type ProductGridProps = {
  products: Product[];
  sortOrder: string;
  setSortOrder: React.Dispatch<React.SetStateAction<string>>;
};

const ProductGrid = ({ products, sortOrder, setSortOrder }: ProductGridProps) => {
  return (
    <div>
      <div className="flex justify-between items-center !mb-6">
        <p className="text-sm text-zinc-500">
          {products.length} produtos encontrados
        </p>

        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
          className="border border-zinc-200 rounded-md !px-4 !py-3 text-xs font-bold cursor-pointer"
        >
          <option value="recentes">ORDENAR: MAIS RECENTES</option>
          <option value="menor-preco">MENOR PREÇO</option>
          <option value="maior-preco">MAIOR PREÇO</option>
        </select>
      </div>

      <div className="grid grid-cols-4 !gap-6">
        {products.map((product) => (
          <div
            key={product.name}
            className="relative rounded-xl bg-white border border-zinc-100 !p-4 hover:shadow-md transition"
          >
            {/* <span className="absolute top-4 left-4 bg-black text-white text-[10px] font-bold !px-2 !py-1 rounded">
              NOVO
            </span> */}

            <button className="absolute top-4 right-4 cursor-pointer">
              <Heart size={20} />
            </button>

            <div className="!h-52 flex items-center justify-center !mb-4">
              <Image
                src={product.image}
                alt={product.name}
                width={180}
                height={220}
                className="object-contain max-h-full"
              />
            </div>

            <div className="text-center">
              <h3 className="font-bold text-sm">{product.name}</h3>
              <p className="text-xs text-zinc-500 !mt-1">{product.category}</p>
              <p className="text-xs text-zinc-500">{product.team}</p>

              <strong className="block !mt-2 text-lg">
                R$ {product.price.toFixed(2).replace(".", ",")}
              </strong>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductGrid;