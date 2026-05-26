"use client";

import Header from "../components/header";
import Footer from "../components/Footer";
import Image from "next/image";
import { Heart, Trash2 } from "lucide-react";
import { useFavorites } from "../context/FavoritesContext";

const FavoritosPage = () => {
  const { favorites, toggleFavorite } = useFavorites();

  return (
    <div>
      <Header />

      <main className="container !mx-auto !px-4 !py-10">
        <h1 className="font-[family-name:var(--font-bebas)] text-5xl !mb-8">
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
          <div className="grid grid-cols-4 !gap-6">
            {favorites.map((product) => (
              <div
                key={product.name}
                className="relative rounded-xl bg-white border border-zinc-100 !p-4 hover:shadow-md transition"
              >
                <button
                  onClick={() => toggleFavorite(product)}
                  className="absolute top-4 right-4 cursor-pointer"
                >
                  <Trash2 size={20} className="text-red-500" />
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
                  <p className="text-xs text-zinc-500 !mt-1">
                    {product.category}
                  </p>
                  <p className="text-xs text-zinc-500">{product.team}</p>

                  <strong className="block !mt-2 text-lg">
                    R$ {product.price.toFixed(2).replace(".", ",")}
                  </strong>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default FavoritosPage;