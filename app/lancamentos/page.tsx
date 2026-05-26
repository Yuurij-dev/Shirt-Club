"use client";

import { useState } from "react";
import Link from "next/link";
import Footer from "../components/Footer";
import Header from "../components/header";
import PromoBannerLancamentos from "./components/promoBannerLancamentos";
import ProductFilters from "./components/ProductFilters";
import ProductGrid from "./components/ProductGrid";
import StoreHighlights from "../components/StoreHighlights";
import NewsletterSection from "../components/NewsletterSection";

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

const LancamentosPage = () => {
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
      if (sortOrder === "menor-preco") {
        return a.price - b.price;
      }

      if (sortOrder === "maior-preco") {
        return b.price - a.price;
      }

      return 0;
    });

  return (
    <div>
      <Header />

      <main>
        <section className="container !mx-auto !px-4 !py-8 sm:!px-6 lg:!px-0">
          <div className="!mb-4 flex items-center !gap-2 text-sm text-zinc-500">
            <Link href="/" className="transition-all duration-200 hover:text-black">
              Início
            </Link>

            <span>›</span>

            <Link
              href="/lancamentos"
              className="transition-all duration-200 hover:text-black"
            >
              Lançamentos
            </Link>
          </div>

          <PromoBannerLancamentos />

          <div className="grid grid-cols-[260px_1fr] !gap-8">
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
          <StoreHighlights/>
          <NewsletterSection/>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default LancamentosPage;