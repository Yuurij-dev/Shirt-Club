"use client";

import Link from "next/link";
import Button from "../components/button";

import Countdown from "../components/countDown";
import Image from "next/image";

import { useScrollReveal } from "../config/scrollRevealConfig";


import Wave from "../components/wave/wave";
const DropPage = () => {

    useScrollReveal(".logo", { origin: "top", delay: 500 });
    useScrollReveal("h2", { origin: "right", delay: 700 });
    useScrollReveal(".countdown", { origin: "left", delay: 900 });
    useScrollReveal(".btn-one", { origin: "right", delay: 1100 });
    useScrollReveal(".btn-two", { origin: "left", delay: 1300 });
    useScrollReveal(".footer-message", { origin: "bottom", delay: 1500 });


    return (
        <div className=" relative  w-full h-screen flex gap-5 flex-col items-center justify-center bg-cover bg-center bg-no-repeat "
            style={{padding:"0 2%"}}
        >

            <Wave />
            <div className="logo">

                <Image
                    src="/assets/logo4.png"
                    alt="Logo"
                    width={450}
                    height={450}
                />
            </div>
        

            <div className=" w-full max-w-112.5 text-center flex flex-col gap-5">
                <h2 className="font-bold text-[18px] uppercase">DROP DE ANO NOVO DESCONTO EM BREVE!</h2>

                <div className="countdown flex items-center justify-center">
                    <Countdown targetDate="2026-01-01T12:30:59" />
                </div>

                <div className="text-[15px] font-medium flex flex-col gap-4">

                    <div className="btn-one">
                        <Link href={"/"}>
                            <Button >shop basics</Button>
                        </Link>
                    </div>

                    <div className="btn-two">
                        <Link href={"/vip"}>
                            <Button className="btn-two">grupo vip</Button>
                        </Link>
                    </div>

                </div>

            </div>

            <p className="footer-message z-5">Resgate seu acesso antecipado!</p>
        </div>
     );
}
 
export default DropPage;