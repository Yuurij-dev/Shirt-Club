"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import { toast } from "sonner";
import type { Product } from "@/app/data/products";
import { useAuth } from "./AuthContext";

export type { Product };

type FavoritesContextType = {
  favorites: Product[];
  totalFavorites: number;
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
  const [hasLoadedFavorites, setHasLoadedFavorites] = useState(false);
  const [hasSyncedCustomerFavorites, setHasSyncedCustomerFavorites] =
    useState(false);
  const { accessToken, authFetch } = useAuth();

  // CARREGAR FAVORITOS
  useEffect(() => {
    const savedFavorites = localStorage.getItem(
      "@shirtclub:favorites"
    );

    setTimeout(() => {
      if (savedFavorites) {
        try {
          const parsedFavorites = JSON.parse(savedFavorites) as Product[];

          setFavorites(
            parsedFavorites.filter((product) => Boolean(product.id))
          );
        } catch {
          setFavorites([]);
        }
      }

      setHasLoadedFavorites(true);
    }, 0);
  }, []);

  // SALVAR FAVORITOS
  useEffect(() => {
    if (!hasLoadedFavorites) return;

    localStorage.setItem(
      "@shirtclub:favorites",
      JSON.stringify(favorites)
    );
  }, [favorites, hasLoadedFavorites]);

  useEffect(() => {
    if (accessToken) return;

    const timeout = window.setTimeout(() => {
      setHasSyncedCustomerFavorites(false);
    }, 0);

    return () => window.clearTimeout(timeout);
  }, [accessToken]);

  useEffect(() => {
    if (!hasLoadedFavorites || !accessToken || hasSyncedCustomerFavorites) return;

    let shouldIgnore = false;

    const syncFavorites = async () => {
      const response = await authFetch("/api/customer/favorites");
      if (!response.ok || shouldIgnore) return;

      const data = (await response.json()) as { products?: Product[] };
      const mergedFavorites = [...(data.products || [])];

      favorites.forEach((favorite) => {
        if (!mergedFavorites.some((product) => product.id === favorite.id)) {
          mergedFavorites.push(favorite);
        }
      });

      setFavorites(mergedFavorites);
      setHasSyncedCustomerFavorites(true);

      await authFetch("/api/customer/favorites", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ products: mergedFavorites }),
      });
    };

    void syncFavorites();

    return () => {
      shouldIgnore = true;
    };
  }, [
    accessToken,
    authFetch,
    favorites,
    hasLoadedFavorites,
    hasSyncedCustomerFavorites,
  ]);

  useEffect(() => {
    if (!hasLoadedFavorites || !accessToken || !hasSyncedCustomerFavorites) return;

    const timeout = window.setTimeout(() => {
      void authFetch("/api/customer/favorites", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ products: favorites }),
      });
    }, 350);

    return () => window.clearTimeout(timeout);
  }, [
    accessToken,
    authFetch,
    favorites,
    hasLoadedFavorites,
    hasSyncedCustomerFavorites,
  ]);

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
        totalFavorites: favorites.length,
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
