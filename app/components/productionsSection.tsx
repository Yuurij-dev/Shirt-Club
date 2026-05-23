import Image from "next/image";

const products = [
  {
    name: "Camisa Milan Home 24/25",
    price: "R$ 189,90",
    image: "/products/milan-home12.png",
  },
  {
    name: "Camisa Milan Away 24/25",
    price: "R$ 189,90",
    image: "/products/milan-away.png",
  },
  {
    name: "Camisa Milan Third 24/25",
    price: "R$ 189,90",
    image: "/products/milan-third.png",
  },
  {
    name: "Camisa Milan Fourth 24/25",
    price: "R$ 189,90",
    image: "/products/milan-fourth.png",
  },
  {
    name: "Camisa Milan Retrô 99/00",
    price: "R$ 189,90",
    image: "/products/milan-retro.png",
  },
];

const ProductsSection = () => {
  return (
    <section className="w-full bg-white py-8">
      <div className="container mx-auto">

        <div className="mb-6 mt-6 flex items-center justify-between">
          
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

        <div className="grid grid-cols-5 gap-5">

          {products.map((product) => (
            <div
              key={product.name}
              className="
                rounded-xl
                bg-zinc-50
                p-4
                transition-all
                duration-200
                hover:shadow-md
              "
            >

              <div
                className="
                  mb-4
                  flex
                  h-[280px]
                  items-center
                  justify-center
                  overflow-hidden
                  rounded-lg
                  bg-white
                "
              >

                <Image
                  src={product.image}
                  alt={product.name}
                  width={300}
                  height={300}
                  className="
                    h-[240px]
                    w-auto
                    object-contain
                    transition-all
                    duration-300
                    hover:scale-105
                  "
                />

              </div>

              <h3 className="text-sm font-medium text-zinc-800">
                {product.name}
              </h3>

              <p className="mt-1 text-xl font-bold text-zinc-950">
                {product.price}
              </p>

            </div>
          ))}

        </div>
      </div>
    </section>
  );
};

export default ProductsSection;