import { promises as fs } from "fs";
import path from "path";
import { products as defaultProducts, type Product } from "@/app/data/products";
import { withPersonalizedProductCopy } from "@/app/utils/productCopy";

type SupabaseProduct = {
  id: string;
  name: string;
  price: string;
  image: string;
  images: string[];
  category: string;
  team: string;
  brand?: string | null;
  season?: string | null;
  description: string;
  details: string[];
  badge?: string | null;
  gender?: Product["gender"] | null;
  active: boolean;
  owner_type?: Product["ownerType"] | null;
  country?: string | null;
  created_at?: string;
  updated_at?: string;
};

const localProductsFile = path.join(process.cwd(), ".data", "products.json");

export type ProductPriceGroup = "shirts" | "retro" | "selections";

const getProductPriceNumber = (price: string | number) => {
  if (typeof price === "number") return price;

  const normalizedPrice = price
    .replace(/[^\d,.-]/g, "")
    .replace(/\./g, "")
    .replace(",", ".");

  return Number(normalizedPrice);
};

const hasSupabaseConfig = () => {
  return Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);
};

const getSupabaseHeaders = () => {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

  return {
    apikey: serviceRoleKey,
    Authorization: `Bearer ${serviceRoleKey}`,
    "Content-Type": "application/json",
    Prefer: "resolution=merge-duplicates",
  };
};

const sortProducts = (products: Product[]) => {
  return [...products].sort((first, second) => {
    return first.name.localeCompare(second.name);
  });
};

const toProduct = (product: SupabaseProduct): Product => {
  return withPersonalizedProductCopy({
    id: product.id,
    name: product.name,
    price: String(product.price),
    image: product.image,
    images: product.images || [product.image],
    category: product.category,
    team: product.team,
    brand: product.brand || undefined,
    season: product.season || undefined,
    description: product.description,
    details: product.details || [],
    badge: product.badge || undefined,
    gender: product.gender || "masculino",
    active: product.active,
    ownerType: product.owner_type || "team",
    country: product.country || undefined,
  });
};

const toSupabaseProduct = (product: Product): SupabaseProduct => {
  return {
    id: product.id,
    name: product.name,
    price: String(product.price),
    image: product.image,
    images: product.images || [product.image],
    category: product.category,
    team: product.team,
    brand: product.brand ?? null,
    season: product.season ?? null,
    description: product.description,
    details: product.details || [],
    badge: product.badge ?? null,
    gender: product.gender || "masculino",
    active: product.active !== false,
    owner_type: product.ownerType || "team",
    country: product.country ?? null,
  };
};

const normalizeProduct = (product: Product): Product => {
  const images = product.images?.length ? product.images : [product.image];

  return {
    ...product,
    id: product.id.trim(),
    name: product.name.trim(),
    price: String(product.price).trim(),
    category: product.category.trim(),
    team: product.team.trim(),
    brand: product.brand?.trim() || undefined,
    season: product.season?.trim() || undefined,
    country: product.country?.trim() || undefined,
    ownerType: product.ownerType || "team",
    active: product.active !== false,
    image: product.image.trim(),
    images: images.map((image) => image.trim()).filter(Boolean),
    description: product.description.trim(),
    details: product.details.map((detail) => detail.trim()).filter(Boolean),
    badge: product.badge?.trim() || undefined,
  };
};

const isRetroProduct = (product: Product) => {
  const searchableText = [
    product.id,
    product.name,
    product.category,
    product.season,
  ]
    .filter(Boolean)
    .join(" ")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();

  return searchableText.includes("retro");
};

const matchesPriceGroup = (product: Product, group: ProductPriceGroup) => {
  if (group === "selections") return product.ownerType === "selection";
  if (group === "retro") return isRetroProduct(product);

  return (product.ownerType || "team") === "team" && !isRetroProduct(product);
};

const readLocalProducts = async () => {
  try {
    const file = await fs.readFile(localProductsFile, "utf-8");
    const localProducts = JSON.parse(file) as Product[];

    return localProducts.length > 0
      ? localProducts.map(withPersonalizedProductCopy)
      : defaultProducts.map(withPersonalizedProductCopy);
  } catch {
    return defaultProducts.map(withPersonalizedProductCopy);
  }
};

const writeLocalProducts = async (products: Product[]) => {
  await fs.mkdir(path.dirname(localProductsFile), { recursive: true });
  await fs.writeFile(localProductsFile, JSON.stringify(sortProducts(products), null, 2));
};

const listSupabaseProducts = async () => {
  const response = await fetch(
    `${process.env.SUPABASE_URL}/rest/v1/products?select=*&order=name.asc`,
    {
      headers: getSupabaseHeaders(),
      cache: "no-store",
    }
  );

  if (response.status === 404) {
    return defaultProducts.map(withPersonalizedProductCopy);
  }

  if (!response.ok) {
    throw new Error("NÃ£o foi possÃ­vel buscar produtos no Supabase");
  }

  const products = (await response.json()) as SupabaseProduct[];

  return products.length > 0
    ? products.map(toProduct)
    : defaultProducts.map(withPersonalizedProductCopy);
};

const upsertSupabaseProduct = async (product: Product) => {
  const response = await fetch(
    `${process.env.SUPABASE_URL}/rest/v1/products?on_conflict=id`,
    {
      method: "POST",
      headers: getSupabaseHeaders(),
      cache: "no-store",
      body: JSON.stringify(toSupabaseProduct(product)),
    }
  );

  if (!response.ok) {
    throw new Error("NÃ£o foi possÃ­vel salvar o produto no Supabase");
  }
};

const upsertSupabaseProducts = async (products: Product[]) => {
  const response = await fetch(`${process.env.SUPABASE_URL}/rest/v1/products`, {
    method: "POST",
    headers: getSupabaseHeaders(),
    cache: "no-store",
    body: JSON.stringify(products.map(toSupabaseProduct)),
  });

  if (!response.ok) {
    throw new Error("NÃ£o foi possÃ­vel salvar os produtos no Supabase");
  }
};

const isSupabaseProductsEmpty = async () => {
  const response = await fetch(
    `${process.env.SUPABASE_URL}/rest/v1/products?select=id&limit=1`,
    {
      headers: getSupabaseHeaders(),
      cache: "no-store",
    }
  );

  if (!response.ok) return false;

  const products = (await response.json()) as Array<{ id: string }>;

  return products.length === 0;
};

const patchSupabaseProduct = async (product: Product) => {
  const response = await fetch(
    `${process.env.SUPABASE_URL}/rest/v1/products?id=eq.${encodeURIComponent(product.id)}`,
    {
      method: "PATCH",
      headers: getSupabaseHeaders(),
      cache: "no-store",
      body: JSON.stringify({
        ...toSupabaseProduct(product),
        updated_at: new Date().toISOString(),
      }),
    }
  );

  if (!response.ok) {
    throw new Error("NÃ£o foi possÃ­vel atualizar o produto no Supabase");
  }
};

const deleteSupabaseProduct = async (id: string) => {
  const response = await fetch(
    `${process.env.SUPABASE_URL}/rest/v1/products?id=eq.${encodeURIComponent(id)}`,
    {
      method: "DELETE",
      headers: getSupabaseHeaders(),
      cache: "no-store",
    }
  );

  if (!response.ok) {
    throw new Error("NÃƒÂ£o foi possÃƒÂ­vel excluir o produto no Supabase");
  }
};

export const listProducts = async ({ includeInactive = true } = {}) => {
  const products = sortProducts(
    hasSupabaseConfig() ? await listSupabaseProducts() : await readLocalProducts()
  );

  return includeInactive
    ? products
    : products.filter((product) => product.active !== false);
};

export const getStoredProductById = async (id: string) => {
  const products = await listProducts();

  return products.find((product) => product.id === id);
};

export const upsertProduct = async (product: Product, originalId?: string) => {
  const products = await listProducts();
  const payload = normalizeProduct(product);
  const normalizedOriginalId = originalId?.trim();
  const lookupId = normalizedOriginalId || payload.id;

  if (!payload.id) {
    throw new Error("Informe o ID do produto");
  }

  if (!payload.name) {
    throw new Error("Informe o nome do produto");
  }

  const priceNumber = getProductPriceNumber(payload.price);

  if (!Number.isFinite(priceNumber) || priceNumber <= 0) {
    throw new Error("Informe um preÃ§o vÃ¡lido em reais");
  }

  if (!payload.image) {
    throw new Error("Informe a imagem principal do produto");
  }

  const exists = products.some((currentProduct) => currentProduct.id === lookupId);
  const hasIdConflict = products.some((currentProduct) => {
    return currentProduct.id === payload.id && currentProduct.id !== lookupId;
  });

  if (hasIdConflict) {
    throw new Error("JÃ¡ existe outro produto usando esse ID");
  }

  const nextProducts = exists
    ? products.map((currentProduct) =>
        currentProduct.id === lookupId ? payload : currentProduct
      )
    : [payload, ...products];

  if (hasSupabaseConfig()) {
    if (await isSupabaseProductsEmpty()) {
      await upsertSupabaseProducts(nextProducts);
    } else {
      if (normalizedOriginalId && normalizedOriginalId !== payload.id) {
        await deleteSupabaseProduct(normalizedOriginalId);
      }

      await upsertSupabaseProduct(payload);
    }
  } else {
    await writeLocalProducts(nextProducts);
  }

  return payload;
};

export const toggleProductStatus = async (id: string, active: boolean) => {
  const products = await listProducts();
  const product = products.find((currentProduct) => currentProduct.id === id);

  if (!product) {
    throw new Error("Produto não encontrado");
  }

  const updatedProduct = { ...product, active };

  if (hasSupabaseConfig()) {
    if (await isSupabaseProductsEmpty()) {
      await upsertSupabaseProducts(
        products.map((currentProduct) =>
          currentProduct.id === id ? updatedProduct : currentProduct
        )
      );
    } else {
      await patchSupabaseProduct(updatedProduct);
    }
  } else {
    await writeLocalProducts(
      products.map((currentProduct) =>
        currentProduct.id === id ? updatedProduct : currentProduct
      )
    );
  }

  return updatedProduct;
};

export const deleteProduct = async (id: string) => {
  const products = await listProducts();
  const product = products.find((currentProduct) => currentProduct.id === id);

  if (!product) {
    throw new Error("Produto nÃ£o encontrado");
  }

  const nextProducts = products.filter((currentProduct) => {
    return currentProduct.id !== id;
  });

  if (hasSupabaseConfig()) {
    if (await isSupabaseProductsEmpty()) {
      await upsertSupabaseProducts(nextProducts);
    } else {
      await deleteSupabaseProduct(id);
    }
  } else {
    await writeLocalProducts(nextProducts);
  }

  return {
    product,
    products: sortProducts(nextProducts),
  };
};

export const updateProductPricesByGroup = async ({
  group,
  price,
}: {
  group: ProductPriceGroup;
  price: string;
}) => {
  const priceNumber = getProductPriceNumber(price);

  if (!Number.isFinite(priceNumber) || priceNumber <= 0) {
    throw new Error("Informe um preÃƒÂ§o vÃƒÂ¡lido em reais");
  }

  const products = await listProducts();
  const matchingProducts = products.filter((product) => {
    return matchesPriceGroup(product, group);
  });

  if (matchingProducts.length === 0) {
    throw new Error("Nenhum produto encontrado para esse grupo");
  }

  const normalizedPrice = price.trim();
  const nextProducts = products.map((product) => {
    return matchesPriceGroup(product, group)
      ? { ...product, price: normalizedPrice }
      : product;
  });

  if (hasSupabaseConfig()) {
    await upsertSupabaseProducts(nextProducts);
  } else {
    await writeLocalProducts(nextProducts);
  }

  return {
    products: sortProducts(nextProducts),
    updatedCount: matchingProducts.length,
  };
};
