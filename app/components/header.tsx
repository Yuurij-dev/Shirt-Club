"use client";

import Link from "next/link";

import {
  Heart,
  Menu,
  Search,
  ShoppingCart,
  X,
} from "lucide-react";

import { useState } from "react";

const links = [
  {
    name: "INÍCIO",
    href: "/",
  },
  {
    name: "TIMES",
    href: "/times",
  },
  {
    name: "LANÇAMENTOS",
    href: "/lancamentos",
  },
  {
    name: "RETRO",
    href: "/retro",
  },
  {
    name: "PERSONALIZE",
    href: "/personalize",
  },
  {
    name: "SALE",
    href: "/sale",
  },
];

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="container !mx-auto">
      
      <header className="relative flex h-20 w-full items-center justify-between">

        {/* LOGO */}
        <Link
          href="/"
          className="
            font-[family-name:var(--font-bebas)]
            text-3xl
            leading-none
          "
        >
          LOGO
        </Link>

        {/* MENU DESKTOP */}
        <nav className="hidden h-full items-center lg:flex">
          
          <ul className="flex h-full items-center gap-6">

            {links.map((link) => (
              <li
                key={link.name}
                className="flex h-full items-center"
              >
                <Link
                  href={link.href}
                  className="
                    flex
                    h-full
                    items-center
                    border-b-2
                    border-transparent
                    font-bold
                    transition-all
                    duration-300
                    hover:border-black
                  "
                >
                  {link.name}
                </Link>
              </li>
            ))}

          </ul>

        </nav>

        {/* ICONS */}
        <div className="flex items-center gap-4">

          <button>
            <Search
              className="cursor-pointer text-black"
              size={22}
            />
          </button>

          <button className="hidden sm:block">
            <Heart
              className="cursor-pointer"
              size={22}
            />
          </button>

          <button>
            <ShoppingCart
              className="cursor-pointer"
              size={22}
            />
          </button>

          {/* MENU MOBILE BUTTON */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="block lg:hidden"
          >
            {menuOpen ? (
              <X size={28} />
            ) : (
              <Menu size={28} />
            )}
          </button>

        </div>

        {/* MOBILE MENU */}
        {menuOpen && (
          <div
            className="
              absolute
              left-0
              top-20
              z-50
              w-full
              rounded-b-xl
              bg-white
              shadow-lg
              lg:hidden
            "
          >
            <ul className="flex flex-col">

              {links.map((link) => (
                <li key={link.name}>
                  
                  <Link
                    href={link.href}
                    onClick={() => setMenuOpen(false)}
                    className="
                      block
                      border-b
                      border-zinc-100
                      !px-4
                      !py-4
                      font-bold
                      transition-all
                      duration-300
                      hover:bg-zinc-50
                    "
                  >
                    {link.name}
                  </Link>

                </li>
              ))}

            </ul>
          </div>
        )}

      </header>

    </div>
  );
};

export default Header;