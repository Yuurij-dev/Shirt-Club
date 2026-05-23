import { Heart, Search, ShoppingCart } from "lucide-react";

const Header = () => {
  return (
    <div className="container">
      <header className="w-full h-20 flex justify-between items-center">

        <div>
          LOGO
        </div>

        <div className="flex items-center gap-10 justify-between h-full">

          <ul className="flex gap-6 h-full items-center">

            <li className="h-full flex items-center">
              <a
                href="#"
                className="
                  h-full
                  flex
                  items-center
                  font-bold
                  border-b-2
                  border-transparent
                  hover:border-black
                  transition-all
                  duration-400
                "
              >
                INÍCIO
              </a>
            </li>

            <li className="h-full flex items-center">
              <a
                href="#"
                className="
                  h-full
                  flex
                  items-center
                  font-bold
                  border-b-2
                  border-transparent
                  hover:border-black
                  transition-all
                  duration-400
                "
              >
                TIMES
              </a>
            </li>

            <li className="h-full flex items-center">
              <a
                href="#"
                className="
                  h-full
                  flex
                  items-center
                  font-bold
                  border-b-2
                  border-transparent
                  hover:border-black
                  transition-all
                  duration-400
                "
              >
                LANÇAMENTOS
              </a>
            </li>

            <li className="h-full flex items-center">
              <a
                href="#"
                className="
                  h-full
                  flex
                  items-center
                  font-bold
                  border-b-2
                  border-transparent
                  hover:border-black
                  transition-all
                  duration-400
                "
              >
                RETRO
              </a>
            </li>

            <li className="h-full flex items-center">
              <a
                href="#"
                className="
                  h-full
                  flex
                  items-center
                  font-bold
                  border-b-2
                  border-transparent
                  hover:border-black
                  transition-all
                  duration-400
                "
              >
                PERSONALIZE
              </a>
            </li>

            <li className="h-full flex items-center">
              <a
                href="#"
                className="
                  h-full
                  flex
                  items-center
                  font-bold
                  border-b-2
                  border-transparent
                  hover:border-black
                  transition-all
                  duration-400
                "
              >
                SALE
              </a>
            </li>

          </ul>
        </div>

        <div className="flex gap-5 items-center justify-end">
          <div className="flex gap-5">

            <div className="cursor-pointer">
              <Search className="text-black" />
            </div>

            <div className="cursor-pointer">
              <Heart />
            </div>

            <div className="cursor-pointer">
              <ShoppingCart />
            </div>

          </div>
        </div>

      </header>
    </div>
  );
};

export default Header;