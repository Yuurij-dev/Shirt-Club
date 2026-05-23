"use client";

import { Heart, Menu, Search, ShoppingCart, X } from "lucide-react";
import { useState } from "react";

const links = ["INÍCIO", "TIMES", "LANÇAMENTOS", "RETRO", "PERSONALIZE", "SALE"];

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="container !mx-auto">
      <header className="relative flex h-20 w-full items-center justify-between">
        <div className="font-[family-name:var(--font-bebas)] text-3xl leading-none">
          LOGO
        </div>

        <nav className="hidden h-full items-center lg:flex">
          <ul className="flex h-full items-center gap-6">
            {links.map((link) => (
              <li key={link} className="flex h-full items-center">
                <a
                  href="#"
                  className="flex h-full items-center border-b-2 border-transparent font-bold transition-all duration-300 hover:border-black"
                >
                  {link}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-4">
          <Search className="cursor-pointer text-black" size={22} />

          <Heart className="hidden cursor-pointer sm:block" size={22} />

          <ShoppingCart className="cursor-pointer" size={22} />

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
                <li key={link}>
                  <a
                    href="#"
                    onClick={() => setMenuOpen(false)}
                    className="block border-b border-zinc-100 !px-4 !py-4 font-bold transition-all duration-300 hover:bg-zinc-50"
                  >
                    {link}
                  </a>
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