import { NextResponse } from "next/server";
import { listProducts } from "@/app/lib/productStore";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const GET = async () => {
  const products = await listProducts({ includeInactive: false });

  return NextResponse.json({ products });
};
