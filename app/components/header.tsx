import { InputGroup, InputGroupInput } from "@/components/ui/input-group";
import { InputGroupAddon } from "@/components/ui/input-group";
import { Heart, Search, ShoppingCart } from "lucide-react";
import Image from "next/image";

const Header = () => {
    return ( 
        <header className="w-full flex justify-between !p-5 items-center">
            <div className="w-1/3">
                <Image
                    src="/assets/logo4.png"
                    alt="Logo"
                    width={150}
                    height={150}
                />
            </div>

            <div className="w-1/3 flex items-center gap-10 justify-between ">
                <ul className="flex gap-5 ">
                    <li><a className="font-semibold" href="#">Ofertas</a></li>
                    <li><a className="font-semibold" href="#">Lançamentos</a></li>
                    <li><a className="font-semibold" href="#">Masculino</a></li>
                    <li><a className="font-semibold" href="#">Feminino</a></li>
                    <li><a className="font-semibold" href="#">Infantil</a></li>
                    <li><a className="font-semibold" href="#">SNKRS</a></li>
                </ul>
            </div>

            <div className="w-1/3 flex gap-5 items-center justify-end">
                    <div className="w-[200px]">
                        <InputGroup className="!pl-2 flex gap-2 bg-neutral-100 text-black rounded-xl ">
                            <InputGroupInput className="bg-neutral-100 outline-none text-black rounded-xl" placeholder="Search..." />
                            <InputGroupAddon>
                            <Search className="bg-neutral-100 text-black"/>
                            </InputGroupAddon>
                        </InputGroup>
                    </div>

                    <div className="flex gap-5">
                        <div>
                            <Heart />
                        </div>

                        <div>
                            <ShoppingCart />
                        </div>
                    </div>
                </div>
        </header>
     );
}
 
export default Header;