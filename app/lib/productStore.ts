import { promises as fs } from "fs";
import path from "path";
import { products as defaultProducts, type Product } from "@/app/data/products";

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
  return {
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
  };
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

const readLocalProducts = async () => {
  try {
    const file = await fs.readFile(localProductsFile, "utf-8");
    const localProducts = JSON.parse(file) as Product[];

    return localProducts.length > 0 ? localProducts : defaultProducts;
  } catch {
    return defaultProducts;
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
    return defaultProducts;
  }

  if (!response.ok) {
    throw new Error("NÃ£o foi possÃ­vel buscar produtos no Supabase");
  }

  const products = (await response.json()) as SupabaseProduct[];

  return products.length > 0 ? products.map(toProduct) : defaultProducts;
};

const upsertSupabaseProduct = async (product: Product) => {
  const response = await fetch(`${process.env.SUPABASE_URL}/rest/v1/products`, {
    method: "POST",
    headers: getSupabaseHeaders(),
    cache: "no-store",
    body: JSON.stringify(toSupabaseProduct(product)),
  });

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

export const upsertProduct = async (product: Product) => {
  const products = await listProducts();
  const payload = normalizeProduct(product);

  if (!payload.id) {
    throw new Error("Informe o ID do produto");
  }

  if (!payload.name) {
    throw new Error("Informe o nome do produto");
  }

  if (!payload.image) {
    throw new Error("Informe a imagem principal do produto");
  }

  const exists = products.some((currentProduct) => currentProduct.id === payload.id);
  const nextProducts = exists
    ? products.map((currentProduct) =>
        currentProduct.id === payload.id ? payload : currentProduct
      )
    : [payload, ...products];

  if (hasSupabaseConfig()) {
    if (await isSupabaseProductsEmpty()) {
      await upsertSupabaseProducts(nextProducts);
    } else {
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
