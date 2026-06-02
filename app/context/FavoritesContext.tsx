"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import { toast } from "sonner";

export type Product = {
  name: string;
  category?: string;
  team?: string;
  price: number | string;
  image: string;
};

type FavoritesContextType = {
  favorites: Product[];
  toggleFavorite: (product: Product) => void;
  isFavorite: (productName: string) => boolean;
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
        setFavorites(JSON.parse(savedFavorites));
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
  const isFavorite = (productName: string) => {
    return favorites.some(
      (product) => product.name === productName
    );
  };

  // ADICIONAR / REMOVER FAVORITO
  const toggleFavorite = (product: Product) => {
    const alreadyFavorite = isFavorite(product.name);

    if (alreadyFavorite) {
      setFavorites((prev) =>
        prev.filter(
          (item) => item.name !== product.name
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