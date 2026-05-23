import Image from "next/image";
import promoBanner from "../../public/assets/promo-banner.png";

const PromoBanner = () => {
  return (
    <section className="container mx-auto !py-8">
      <div className="relative h-[290px] w-full overflow-hidden rounded-lg bg-black">
        <Image
          src={promoBanner}
          alt="Nova coleção 24/25"
          fill
          priority
          className="object-cover object-center"
        />

        <div className="absolute inset-0 flex items-center !pl-20">
          <div className="max-w-[420px] text-white flex flex-col gap-5">
            <h2 className="font-[family-name:var(--font-bebas)] text-5xl leading-none tracking-wide">
              NOVA COLEÇÃO 25/26
            </h2>

            <div className="mt-6 flex gap-10">
              <div>
                <p className="text-sm font-bold uppercase">FRETE GRÁTIS</p>
                <span className="text-xs text-zinc-300">Para todo Brasil</span>
              </div>

              <div>
                <p className="text-sm font-bold uppercase">10% OFF NO PIX</p>
                <span className="text-xs text-zinc-300">
                  Desconto exclusivo
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PromoBanner;