import Image from "next/image";

const products = [
 {
    name: "Camisa Flamengo Home 24/25",
    price: "R$ 189,90",
    image: "/products/flamengo-home.png",
  },
  {
    name: "Camisa Real Madrid Home 24/25",
    price: "R$ 189,90",
    image: "/products/real-madrid-home.png",
  },
  {
    name: "Camisa Palmeiras Home 24/25",
    price: "R$ 189,90",
    image: "/products/palmeiras-home.png",
  },
  {
    name: "Camisa Vasco Home 24/25",
    price: "R$ 189,90",
    image: "/products/vasco-home.png",
  },
  {
    name: "Camisa Corinthians Home 24/25",
    price: "R$ 189,90",
    image: "/products/Corinthians-home.png",
  },
];

const ProductsSection = () => {
  return (
    <section className="w-full bg-white !py-8">
      <div className="container !mx-auto">
        <div className="!mb-6 !mt-6 flex items-center justify-between">
          <h2 className="font-[family-name:var(--font-bebas)] text-4xl text-zinc-950">
            LANÇAMENTOS
          </h2>

          <a
            href="#"
            className="text-sm font-medium text-zinc-700 hover:underline"
          >
            Ver todos ›
          </a>
        </div>

        <div className="grid grid-cols-5 gap-6">
          {products.map((product) => (
            <div
              key={product.name}
              className="
                overflow-hidden
                rounded-2xl
                bg-white
                shadow-sm
                transition-all
                duration-300
                hover:-translate-y-1
                hover:shadow-xl
              "
            >
              <div
                className="
                  relative
                  h-[360px]
                  overflow-hidden
                  rounded-2xl
                  bg-zinc-100
                "
              >
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="
                    object-cover
                    transition-all
                    duration-500
                    hover:scale-105
                  "
                />
              </div>

              <div className="!p-4">
                <h3 className="text-base font-medium text-zinc-800">
                  {product.name}
                </h3>

                <p className="!mt-2 text-2xl font-bold text-zinc-950">
                  {product.price}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductsSection;