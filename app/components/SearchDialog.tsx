"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, X } from "lucide-react";
import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import type { Product } from "../data/products";
import { searchProducts } from "../utils/searchProducts";
import { formatPrice } from "../utils/price";

type SearchDialogProps = {
  open: boolean;
  onClose: () => void;
};

type SearchResultImageProps = {
  product: Product;
};

const SearchResultImage = ({ product }: SearchResultImageProps) => {
  const [image, setImage] = useState(product.image);

  return (
    <Image
      src={image}
      alt={product.name}
      width={72}
      height={72}
      onError={() => setImage("/assets/bg.png")}
      className="h-[72px] w-[72px] rounded-xl object-cover"
    />
  );
};

const SearchDialog = ({ open, onClose }: SearchDialogProps) => {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");

  const results = useMemo(() => {
    return searchProducts(query).slice(0, 6);
  }, [query]);

  useEffect(() => {
    if (!open) return;

    const timeoutId = window.setTimeout(() => inputRef.current?.focus(), 80);

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.clearTimeout(timeoutId);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, onClose]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedQuery = query.trim();
    if (!trimmedQuery) return;

    onClose();
    router.push(`/busca?q=${encodeURIComponent(trimmedQuery)}`);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-black/45 !px-4 !py-5 backdrop-blur-sm sm:!py-8">
      <button
        type="button"
        aria-label="Fechar busca"
        onClick={onClose}
        className="absolute inset-0 h-full w-full cursor-default"
      />

      <section className="relative !mx-auto w-full max-w-2xl rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-zinc-100 !px-4 !py-4 sm:!px-6">
          <h2 className="font-[family-name:var(--font-bebas)] text-3xl leading-none text-zinc-950">
            BUSCAR PRODUTOS
          </h2>

          <button
            type="button"
            aria-label="Fechar busca"
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-zinc-200 transition-all duration-200 hover:bg-zinc-50"
          >
            <X size={20} />
          </button>
        </div>

        <div className="!p-4 sm:!p-6">
          <form onSubmit={handleSubmit} className="relative">
            <Search
              size={20}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500"
            />

            <input
              ref={inputRef}
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Busque por time, seleção, retrô..."
              className="h-14 w-full rounded-xl border border-zinc-200 !pl-12 !pr-4 text-sm outline-none transition-all duration-200 focus:border-black"
            />
          </form>

          <div className="!mt-5">
            {!query.trim() && (
              <p className="rounded-xl bg-zinc-50 !p-5 text-sm text-zinc-500">
                Digite o nome do produto, time, seleção ou categoria.
              </p>
            )}

            {query.trim() && results.length === 0 && (
              <p className="rounded-xl bg-zinc-50 !p-5 text-sm text-zinc-500">
                Nenhum produto encontrado para essa busca.
              </p>
            )}

            {results.length > 0 && (
              <div className="flex flex-col !gap-3">
                {results.map((product) => (
                  <Link
                    key={product.id}
                    href={`/produtos/${product.id}`}
                    onClick={onClose}
                    className="flex items-center !gap-4 rounded-xl border border-zinc-100 !p-3 transition-all duration-200 hover:border-black hover:bg-zinc-50"
                  >
                    <SearchResultImage product={product} />

                    <div className="min-w-0 flex-1">
                      <h3 className="truncate text-sm font-bold text-zinc-950">
                        {product.name}
                      </h3>
                      <p className="!mt-1 text-xs text-zinc-500">
                        {[product.team, product.brand, product.season]
                          .filter(Boolean)
                          .join(" • ")}
                      </p>
                    </div>

                    <strong className="text-sm text-zinc-950">
                      {formatPrice(product.price)}
                    </strong>
                  </Link>
                ))}
              </div>
            )}

            {query.trim() && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  router.push(`/busca?q=${encodeURIComponent(query.trim())}`);
                }}
                className="!mt-4 h-12 w-full rounded-xl bg-black text-sm font-bold text-white transition-all duration-200 hover:bg-zinc-800"
              >
                VER TODOS OS RESULTADOS
              </button>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default SearchDialog;
