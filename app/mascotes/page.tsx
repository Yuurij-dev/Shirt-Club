"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import CategoryBannerCarousel from "../components/CategoryBannerCarousel";
import Footer from "../components/Footer";
import Header from "../components/header";
import NewsletterSection from "../components/NewsletterSection";
import StoreHighlights from "../components/StoreHighlights";
import { StoreBanner } from "../data/banners";
import {
  isMascotProduct,
  mascotProducts,
  type Product,
} from "../data/products";
import MascotFilters from "./components/MascotFilters";
import ProductGrid from "../masculino/components/ProductGrid";

const getPriceNumber = (price: string | number) => {
  if (typeof price === "number") return price;

  return Number(price.replace("R$ ", "").replace(".", "").replace(",", "."));
};

const countryContinentMap: Record<string, string> = {
  Argentina: "America do Sul",
  Brasil: "America do Sul",
  Chile: "America do Sul",
  Colombia: "America do Sul",
  Equador: "America do Sul",
  Paraguai: "America do Sul",
  Peru: "America do Sul",
  Uruguai: "America do Sul",
  Canada: "America do Norte",
  "Estados Unidos": "America do Norte",
  Mexico: "America do Norte",
  Alemanha: "Europa",
  Espanha: "Europa",
  Franca: "Europa",
  Holanda: "Europa",
  Inglaterra: "Europa",
  Italia: "Europa",
  Portugal: "Europa",
  Belgica: "Europa",
  Croacia: "Europa",
  Japao: "Asia",
  Coreia: "Asia",
  Marrocos: "Africa",
  Senegal: "Africa",
  Australia: "Oceania",
};

const normalizeText = (value?: string) => {
  return (value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
};

const getProductContinent = (product: Product) => {
  const normalizedCountry = normalizeText(product.country);
  const countryEntry = Object.entries(countryContinentMap).find(([country]) => {
    return normalizeText(country) === normalizedCountry;
  });

  return countryEntry?.[1] || "Outros";
};

const fallbackMascotesBanner: StoreBanner = {
  id: "mascotes-hero-default",
  name: "Banner padrao mascotes",
  page: "mascotes",
  position: "hero",
  desktopImageUrl: "/assets/banner/BannerHome.png",
  title: "MASCOTES",
  linkUrl: "/mascotes",
  isActive: true,
  sortOrder: 1,
};

const MascotesPage = () => {
  const [selectedContinents, setSelectedContinents] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("Todas");
  const [maxPrice, setMaxPrice] = useState(599.9);
  const [sortOrder, setSortOrder] = useState("recentes");
  const [pageProducts, setPageProducts] = useState<Product[]>(mascotProducts);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const response = await fetch("/api/products", { cache: "no-store" });

        if (!response.ok) return;

        const data = (await response.json()) as { products?: Product[] };
        const products = data.products || [];

        setPageProducts(products.filter(isMascotProduct));
      } catch {
        setPageProducts(mascotProducts);
      }
    };

    void loadProducts();
  }, []);

  const availableContinents = useMemo(() => {
    return pageProducts
      .map(getProductContinent)
      .filter((continent, index, continents) => {
        return Boolean(continent) && continents.indexOf(continent) === index;
      });
  }, [pageProducts]);

  const filteredProducts = pageProducts
    .filter((product) => {
      const matchCategory =
        selectedCategory === "Todas" ||
        (selectedCategory === "Times" && product.ownerType !== "selection") ||
        (selectedCategory === "Selecoes" && product.ownerType === "selection");

      const matchContinent =
        selectedContinents.length === 0 ||
        selectedContinents.includes(getProductContinent(product));

      const matchPrice = getPriceNumber(product.price) <= maxPrice;

      return matchCategory && matchContinent && matchPrice;
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
              Inicio
            </Link>

            <span>&gt;</span>

            <Link
              href="/mascotes"
              className="transition-all duration-200 hover:text-black"
            >
              Mascotes
            </Link>
          </div>

          <CategoryBannerCarousel
            page="mascotes"
            fallbackBanner={fallbackMascotesBanner}
            heading="MASCOTES"
          />

          <div className="grid grid-cols-1 !gap-8 lg:grid-cols-[260px_1fr]">
            <MascotFilters
              continents={availableContinents}
              selectedContinents={selectedContinents}
              setSelectedContinents={setSelectedContinents}
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

export default MascotesPage;
