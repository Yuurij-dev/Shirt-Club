import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";

const adminCookieName = "shirtclub_admin";

const getAdminSecret = () => {
  return process.env.ADMIN_SESSION_SECRET || process.env.ADMIN_PASSWORD || "dev-secret";
};

export const createAdminToken = () => {
  return createHmac("sha256", getAdminSecret()).update("admin").digest("hex");
};

export const isValidAdminToken = (token?: string) => {
  if (!token) return false;

  const expectedToken = createAdminToken();
  const tokenBuffer = Buffer.from(token);
  const expectedTokenBuffer = Buffer.from(expectedToken);

  if (tokenBuffer.length !== expectedTokenBuffer.length) return false;

  return timingSafeEqual(tokenBuffer, expectedTokenBuffer);
};

export const isAdminAuthenticated = async () => {
  const cookieStore = await cookies();
  const token = cookieStore.get(adminCookieName)?.value;

  return isValidAdminToken(token);
};

export const getAdminCookieName = () => adminCookieName;
