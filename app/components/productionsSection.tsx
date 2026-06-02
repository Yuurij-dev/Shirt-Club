import ProductCard from "./productCard";

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
    <section className="w-full bg-white !px-4 !py-8 sm:!px-6 lg:!px-0">
      <div className="container !mx-auto">
        <div className="!mb-6 !mt-6 flex items-center justify-between">
          <h2 className="font-[family-name:var(--font-bebas)] text-3xl text-zinc-950 sm:text-4xl">
            LANÇAMENTOS
          </h2>

          <a href="#" className="text-xs font-medium text-zinc-700 hover:underline sm:text-sm">
            Ver todos ›
          </a>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {products.map((product) => (
            <ProductCard key={product.name} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductsSection;