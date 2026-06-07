"use client";

import { useState } from "react";
import Link from "next/link";
import Footer from "../components/Footer";
import Header from "../components/header";
import PromoBannerFeminino from "./components/PromoBannerFeminino";
import ProductFilters from "./components/ProductFilters";
import ProductGrid from "./components/ProductGrid";
import StoreHighlights from "../components/StoreHighlights";
import NewsletterSection from "../components/NewsletterSection";
import { feminineProducts } from "../data/products";

const getPriceNumber = (price: string | number) => {
  if (typeof price === "number") return price;

  return Number(price.replace("R$ ", "").replace(".", "").replace(",", "."));
};

const FemininoPage = () => {
  const [selectedTeams, setSelectedTeams] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("Todas");
  const [maxPrice, setMaxPrice] = useState(599.9);
  const [sortOrder, setSortOrder] = useState("recentes");

  const filteredProducts = feminineProducts
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
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1">
        <section className="container !mx-auto !px-4 !py-8 sm:!px-6 lg:!px-0">
          <div className="!mb-4 flex items-center !gap-2 text-sm text-zinc-500">
            <Link href="/" className="transition-all duration-200 hover:text-black">
              Início
            </Link>

            <span>›</span>

            <Link
              href="/feminino"
              className="transition-all duration-200 hover:text-black"
            >
              Feminino
            </Link>
          </div>

          <PromoBannerFeminino />

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

          <div className="!mt-2">
            <StoreHighlights />
          </div>

          <div className="!mt-2">
            <NewsletterSection />
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default FemininoPage;
