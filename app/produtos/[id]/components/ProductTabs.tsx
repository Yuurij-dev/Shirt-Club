"use client";

import { CreditCard, Truck } from "lucide-react";
import { useState } from "react";
import type { Product } from "@/app/data/products";

type ProductTabsProps = {
  product: Product;
};

const tabs = ["Descrição", "Detalhes", "Tecnologia", "Avaliações"];

const ProductTabs = ({ product }: ProductTabsProps) => {
  const [activeTab, setActiveTab] = useState("Descrição");

  return (
    <section className="!mt-10">
      <div className="flex gap-8 overflow-x-auto border-b border-zinc-200">
        {tabs.map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={`
              min-w-max border-b-2 !px-1 !py-4 text-sm font-bold transition-all duration-200
              ${
                activeTab === tab
                  ? "border-black text-black"
                  : "border-transparent text-zinc-500 hover:text-black"
              }
            `}
          >
            {tab}
            {tab === "Avaliações" && " (124)"}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 !gap-10 !py-6 lg:grid-cols-[minmax(0,1.08fr)_minmax(420px,0.92fr)] lg:items-start">
        <div className="text-sm leading-7 text-zinc-700">
          {activeTab === "Descrição" && (
            <>
              <p>{product.description}</p>

              <ul className="!mt-4 list-disc !pl-5">
                {product.details.map((detail) => (
                  <li key={detail}>{detail}</li>
                ))}
              </ul>
            </>
          )}

          {activeTab === "Detalhes" && (
            <ul className="list-disc !pl-5">
              <li>Categoria: {product.category}</li>
              <li>Time: {product.team}</li>
              {product.brand && <li>Marca: {product.brand}</li>}
              {product.season && <li>Temporada: {product.season}</li>}
            </ul>
          )}

          {activeTab === "Tecnologia" && (
            <p>
              Tecido leve, toque macio e construção pensada para conforto no uso
              diário. A modelagem regular oferece liberdade de movimento sem
              perder o caimento clássico.
            </p>
          )}

          {activeTab === "Avaliações" && (
            <p>
              Produto muito bem avaliado pelos clientes pela qualidade do tecido,
              acabamento e fidelidade do visual.
            </p>
          )}
        </div>

        <div className="grid min-h-[112px] w-full grid-cols-1 divide-y divide-zinc-200 rounded-xl border border-zinc-200 sm:grid-cols-3 sm:divide-x sm:divide-y-0 lg:min-h-[96px]">
          <div className="flex items-center !gap-4 !p-5">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-zinc-200 text-sm font-bold">
              %
            </div>
            <div>
              <p className="text-sm font-bold">5% OFF</p>
              <span className="text-xs text-zinc-500">no PIX</span>
            </div>
          </div>

          <div className="flex items-center !gap-4 !p-5">
            <CreditCard size={30} className="shrink-0" />
            <div>
              <p className="text-sm font-bold">PARCELE EM ATÉ</p>
              <span className="text-xs text-zinc-500">12x sem juros</span>
            </div>
          </div>

          <div className="flex items-center !gap-4 !p-5">
            <Truck size={32} className="shrink-0" />
            <div>
              <p className="text-sm font-bold">FRETE GRÁTIS</p>
              <span className="text-xs text-zinc-500">acima de R$ 299</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductTabs;
