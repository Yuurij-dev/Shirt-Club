import { NextResponse } from "next/server";
import { defaultStoreSettings } from "@/app/data/storeSettings";
import { getStoreSettings } from "@/app/lib/storeSettings";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const GET = async () => {
  try {
    const settings = await getStoreSettings();

    return NextResponse.json({ settings });
  } catch {
    return NextResponse.json({ settings: defaultStoreSettings });
  }
};
