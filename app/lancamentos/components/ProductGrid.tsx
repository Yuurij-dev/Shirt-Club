"use client";

import ProductCard from "@/app/components/productCard";
import type { Product } from "@/app/data/products";

type ProductGridProps = {
  products: Product[];
  sortOrder: string;
  setSortOrder: React.Dispatch<React.SetStateAction<string>>;
};

const ProductGrid = ({
  products,
  sortOrder,
  setSortOrder,
}: ProductGridProps) => {
  return (
    <div className="w-full">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between !gap-4 !mb-6">
        <p className="text-sm text-zinc-500">
          {products.length} produtos encontrados
        </p>

        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
          className="w-full sm:w-auto border border-zinc-200 rounded-md !px-4 !py-3 text-xs font-bold cursor-pointer"
        >
          <option value="recentes">ORDENAR: MAIS RECENTES</option>
          <option value="menor-preco">MENOR PREÇO</option>
          <option value="maior-preco">MAIOR PREÇO</option>
        </select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 !gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default ProductGrid;
