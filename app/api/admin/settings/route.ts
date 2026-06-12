import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/app/lib/adminAuth";
import {
  getStoreSettings,
  updateStoreSettings,
} from "@/app/lib/storeSettings";
import type { StoreSettings } from "@/app/data/storeSettings";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const GET = async () => {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  const settings = await getStoreSettings();

  return NextResponse.json({ settings });
};

export const PATCH = async (request: Request) => {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  try {
    const body = (await request.json()) as Partial<StoreSettings>;
    const pricing = body.customizationPricing;

    if (pricing) {
      const values = [pricing.phrase, pricing.name, pricing.numberDigit];
      const hasInvalidValue = values.some((value) => {
        return value !== undefined && (!Number.isFinite(Number(value)) || Number(value) < 0);
      });

      if (hasInvalidValue) {
        return NextResponse.json(
          { error: "Informe valores válidos para a personalização" },
          { status: 400 }
        );
      }
    }

    const settings = await updateStoreSettings(body);

    return NextResponse.json({ settings });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Não foi possível salvar as configurações";

    return NextResponse.json({ error: message }, { status: 400 });
  }
};
