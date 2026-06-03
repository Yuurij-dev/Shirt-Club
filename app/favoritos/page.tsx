"use client";

import Header from "../components/header";
import Footer from "../components/Footer";
import { Heart } from "lucide-react";
import { useFavorites } from "../context/FavoritesContext";
import ProductCard from "../components/productCard";

const FavoritosPage = () => {
  const { favorites } = useFavorites();

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="container !mx-auto flex-1 !px-4 !py-10 sm:!px-6 lg:!px-0">
        <h1 className="font-[family-name:var(--font-bebas)] text-4xl sm:text-5xl !mb-8">
          MEUS FAVORITOS
        </h1>

        {favorites.length === 0 ? (
          <div className="rounded-xl border border-zinc-200 !p-10 text-center">
            <Heart className="mx-auto !mb-4 text-zinc-400" size={40} />

            <h2 className="font-bold text-xl">Nenhum favorito ainda</h2>

            <p className="text-zinc-500 !mt-2">
              Clique no coração dos produtos para salvar aqui.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 !gap-6">
            {favorites.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default FavoritosPage;
