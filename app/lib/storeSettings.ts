import { promises as fs } from "fs";
import path from "path";
import {
  defaultStoreSettings,
  type StoreSettings,
} from "@/app/data/storeSettings";

type SupabaseStoreSetting = {
  key: string;
  value: StoreSettings;
};

const localSettingsFile = path.join(process.cwd(), ".data", "store-settings.json");
const storeSettingsKey = "store";

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

type StoreSettingsInput = {
  customizationPricing?: Partial<StoreSettings["customizationPricing"]>;
};

export const normalizeStoreSettings = (
  settings?: StoreSettingsInput | null
): StoreSettings => {
  const customizationPricing = settings?.customizationPricing || {};

  return {
    customizationPricing: {
      phrase: Math.max(
        0,
        Number(customizationPricing.phrase ?? defaultStoreSettings.customizationPricing.phrase)
      ),
      name: Math.max(
        0,
        Number(customizationPricing.name ?? defaultStoreSettings.customizationPricing.name)
      ),
      numberDigit: Math.max(
        0,
        Number(
          customizationPricing.numberDigit ??
            defaultStoreSettings.customizationPricing.numberDigit
        )
      ),
    },
  };
};

const readLocalSettings = async () => {
  try {
    const file = await fs.readFile(localSettingsFile, "utf-8");
    return normalizeStoreSettings(JSON.parse(file) as StoreSettings);
  } catch {
    return defaultStoreSettings;
  }
};

const writeLocalSettings = async (settings: StoreSettings) => {
  await fs.mkdir(path.dirname(localSettingsFile), { recursive: true });
  await fs.writeFile(localSettingsFile, JSON.stringify(settings, null, 2));
};

const readSupabaseSettings = async () => {
  const response = await fetch(
    `${process.env.SUPABASE_URL}/rest/v1/store_settings?key=eq.${storeSettingsKey}&select=value&limit=1`,
    {
      headers: getSupabaseHeaders(),
      cache: "no-store",
    }
  );

  if (response.status === 404) {
    return defaultStoreSettings;
  }

  if (!response.ok) {
    throw new Error("Não foi possível buscar as configurações da loja");
  }

  const settings = (await response.json()) as SupabaseStoreSetting[];

  return settings[0]?.value
    ? normalizeStoreSettings(settings[0].value)
    : defaultStoreSettings;
};

const writeSupabaseSettings = async (settings: StoreSettings) => {
  const response = await fetch(
    `${process.env.SUPABASE_URL}/rest/v1/store_settings?on_conflict=key`,
    {
      method: "POST",
      headers: getSupabaseHeaders(),
      cache: "no-store",
      body: JSON.stringify({
        key: storeSettingsKey,
        value: settings,
      }),
    }
  );

  if (!response.ok) {
    throw new Error("Não foi possível salvar as configurações da loja");
  }
};

export const getStoreSettings = async () => {
  if (hasSupabaseConfig()) {
    return readSupabaseSettings();
  }

  return readLocalSettings();
};

export const updateStoreSettings = async (settings: Partial<StoreSettings>) => {
  const currentSettings = await getStoreSettings();
  const nextSettings = normalizeStoreSettings({
    ...currentSettings,
    ...settings,
    customizationPricing: {
      ...currentSettings.customizationPricing,
      ...settings.customizationPricing,
    },
  });

  if (hasSupabaseConfig()) {
    await writeSupabaseSettings(nextSettings);
  } else {
    await writeLocalSettings(nextSettings);
  }

  return nextSettings;
};
