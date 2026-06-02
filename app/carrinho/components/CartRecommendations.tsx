import ProductCard from "@/app/components/productCard";
import { bestSellerProducts } from "@/app/data/products";

const CartRecommendations = () => {
  return (
    <section className="!mt-8">
      <h2 className="font-[family-name:var(--font-bebas)] text-3xl text-zinc-950">
        VOCÊ TAMBÉM PODE GOSTAR
      </h2>

      <div className="!mt-5 grid grid-cols-1 !gap-5 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-6">
        {bestSellerProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
};

export default CartRecommendations;
