"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import { toast } from "sonner";
import type { Product } from "@/app/data/products";

export type { Product };

type FavoritesContextType = {
  favorites: Product[];
  toggleFavorite: (product: Product) => void;
  isFavorite: (productId: string) => boolean;
};

const FavoritesContext = createContext({} as FavoritesContextType);

export const FavoritesProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [favorites, setFavorites] = useState<Product[]>([]);

  // CARREGAR FAVORITOS
  useEffect(() => {
    const savedFavorites = localStorage.getItem(
      "@shirtclub:favorites"
    );

    if (savedFavorites) {
      setTimeout(() => {
        try {
          const parsedFavorites = JSON.parse(savedFavorites) as Product[];

          setFavorites(
            parsedFavorites.filter((product) => Boolean(product.id))
          );
        } catch {
          setFavorites([]);
        }
      }, 0);
    }
  }, []);

  // SALVAR FAVORITOS
  useEffect(() => {
    localStorage.setItem(
      "@shirtclub:favorites",
      JSON.stringify(favorites)
    );
  }, [favorites]);

  // VERIFICAR FAVORITO
  const isFavorite = (productId: string) => {
    return favorites.some(
      (product) => product.id === productId
    );
  };

  // ADICIONAR / REMOVER FAVORITO
  const toggleFavorite = (product: Product) => {
    const alreadyFavorite = isFavorite(product.id);

    if (alreadyFavorite) {
      setFavorites((prev) =>
        prev.filter(
          (item) => item.id !== product.id
        )
      );

      toast.info("Removido dos favoritos");
    } else {
      setFavorites((prev) => [...prev, product]);

      toast.success("Adicionado aos favoritos");
    }
  };

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        toggleFavorite,
        isFavorite,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => {
  return useContext(FavoritesContext);
};
