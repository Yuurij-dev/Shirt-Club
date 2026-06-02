"use client";

import { useState } from "react";
import ProductFilters from "./ProductFilters";
import ProductGrid from "./ProductGrid";

const products = [
  {
    name: "Camisa Real Madrid 24/25 Home",
    category: "Camisas",
    team: "Real Madrid",
    price: 349.9,
    image: "/products/real-madrid.png",
  },
  {
    name: "Camisa Flamengo 24/25 Home",
    category: "Camisas",
    team: "Flamengo",
    price: 329.9,
    image: "/products/flamengo.png",
  },
  {
    name: "Camisa Corinthians 24/25 Home",
    category: "Camisas",
    team: "Corinthians",
    price: 329.9,
    image: "/products/corinthians.png",
  },
  {
    name: "Camisa Palmeiras 24/25 Home",
    category: "Camisas",
    team: "Palmeiras",
    price: 329.9,
    image: "/products/palmeiras.png",
  },
];

const ProductSection = () => {
  const [selectedTeams, setSelectedTeams] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("Todas");
  const [maxPrice, setMaxPrice] = useState(599.9);
  const [sortOrder, setSortOrder] = useState("recentes");

  const filteredProducts = products
    .filter((product) => {
      const matchCategory =
        selectedCategory === "Todas" || product.category === selectedCategory;

      const matchTeam =
        selectedTeams.length === 0 || selectedTeams.includes(product.team);

      const matchPrice = product.price <= maxPrice;

      return matchCategory && matchTeam && matchPrice;
    })
    .sort((a, b) => {
      if (sortOrder === "menor-preco") return a.price - b.price;
      if (sortOrder === "maior-preco") return b.price - a.price;

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