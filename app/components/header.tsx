"use client";

import Link from "next/link";
import Image from "next/image";
import { Heart, Menu, Search, ShoppingCart, User, X } from "lucide-react";
import { useState } from "react";
import { useCart } from "../context/CartContext";
import { useFavorites } from "../context/FavoritesContext";
import { useAuth } from "../context/AuthContext";
import SearchDialog from "./SearchDialog";

const links = [
  { name: "INÍCIO", href: "/" },
  { name: "TIMES", href: "/times" },
  { name: "COPA DO MUNDO", href: "/selecoes" },
  { name: "MASCULINO", href: "/masculino" },
  { name: "FEMININO", href: "/feminino" },
  { name: "RETRO", href: "/retro" },
  { name: "MASCOTES", href: "/mascotes" },
];

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const { totalItems } = useCart();
  const { totalFavorites } = useFavorites();
  const { isAuthenticated, loginWithGoogle } = useAuth();

  return (
    <>
      <header className="w-full border-y border-zinc-200 bg-white">
        <div className="container !mx-auto !px-4 sm:!px-6 lg:!px-0">
          <div className="relative flex h-20 w-full items-center justify-between">
            <Link
              href="/"
              aria-label="Ir para a página inicial"
              className="relative block h-16 w-[118px] shrink-0 sm:h-[72px] sm:w-[132px] lg:h-[76px] lg:w-[150px]"
            >
              <Image
                src="/assets/logo2.png"
                alt="Shirt Club"
                fill
                priority
                sizes="(min-width: 1024px) 150px, (min-width: 640px) 132px, 118px"
                className="object-contain object-left"
              />
            </Link>

            <nav className="hidden h-full items-center lg:flex">
              <ul className="flex h-full items-center !gap-6">
                {links.map((link) => (
                  <li key={link.name} className="flex h-full items-center">
                    <Link
                      href={link.href}
                      className="flex h-full items-center border-b-2 border-transparent font-bold transition-all duration-300 hover:border-black"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <div className="flex items-center !gap-4">
              <button
                type="button"
                aria-label="Abrir busca"
                onClick={() => setSearchOpen(true)}
              >
                <Search className="cursor-pointer text-black" size={22} />
              </button>

              {isAuthenticated ? (
                <Link href="/minha-conta" aria-label="Minha conta">
                  <User className="cursor-pointer" size={22} />
                </Link>
              ) : (
                <button
                  type="button"
                  onClick={loginWithGoogle}
                  aria-label="Entrar com Google"
                >
                  <User className="cursor-pointer" size={22} />
                </button>
              )}

              <Link href="/favoritos" className="relative">
                <Heart className="cursor-pointer" size={22} />
                {totalFavorites > 0 && (
                  <span className="absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-black !px-1 text-[10px] font-bold leading-none text-white">
                    {totalFavorites}
                  </span>
                )}
              </Link>

              <Link href="/carrinho" className="relative">
                <ShoppingCart className="cursor-pointer" size={22} />
                {totalItems > 0 && (
                  <span className="absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-black !px-1 text-[10px] font-bold leading-none text-white">
                    {totalItems}
                  </span>
                )}
              </Link>

              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="block lg:hidden"
              >
                {menuOpen ? <X size={28} /> : <Menu size={28} />}
              </button>
            </div>

            {menuOpen && (
              <div className="absolute left-0 top-20 z-50 w-full rounded-b-xl bg-white shadow-lg lg:hidden">
                <ul className="flex flex-col">
                  {links.map((link) => (
                    <li key={link.name}>
                      <Link
                        href={link.href}
                        onClick={() => setMenuOpen(false)}
                        className="block border-b border-zinc-100 !px-4 !py-4 font-bold transition-all duration-300 hover:bg-zinc-50"
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </header>

      <SearchDialog open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
};

export default Header;
