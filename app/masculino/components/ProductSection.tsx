"use client";

import { useState } from "react";
import { masculineProducts } from "@/app/data/products";
import ProductFilters from "./ProductFilters";
import ProductGrid from "./ProductGrid";

const getPriceNumber = (price: string | number) => {
  if (typeof price === "number") return price;

  return Number(price.replace("R$ ", "").replace(".", "").replace(",", "."));
};

const ProductSection = () => {
  const [selectedTeams, setSelectedTeams] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("Todas");
  const [maxPrice, setMaxPrice] = useState(599.9);
  const [sortOrder, setSortOrder] = useState("recentes");

  const filteredProducts = masculineProducts
    .filter((product) => {
      const matchCategory =
        selectedCategory === "Todas" || product.category === selectedCategory;

      const matchTeam =
        selectedTeams.length === 0 || selectedTeams.includes(product.team);

      const matchPrice = getPriceNumber(product.price) <= maxPrice;

      return matchCategory && matchTeam && matchPrice;
    })
    .sort((a, b) => {
      if (sortOrder === "menor-preco") {
        return getPriceNumber(a.price) - getPriceNumber(b.price);
      }

      if (sortOrder === "maior-preco") {
        return getPriceNumber(b.price) - getPriceNumber(a.price);
      }

      return 0;
    });

  return (
    <section className="container !mx-auto !px-4 !py-10 sm:!px-6 lg:!px-0">
      <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] !gap-8">
        <ProductFilters
          selectedTeams={selectedTeams}
          setSelectedTeams={setSelectedTeams}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          maxPrice={maxPrice}
          setMaxPrice={setMaxPrice}
        />

        <ProductGrid
          products={filteredProducts}
          sortOrder={sortOrder}
          setSortOrder={setSortOrder}
        />
      </div>
    </section>
  );
};

export default ProductSection;
