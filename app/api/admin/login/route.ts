import { NextResponse } from "next/server";
import { createAdminToken, getAdminCookieName } from "@/app/lib/adminAuth";

type LoginBody = {
  username?: string;
  password?: string;
};

export const POST = async (request: Request) => {
  const body = (await request.json()) as LoginBody;
  const adminUsername = process.env.ADMIN_USERNAME || "admin";
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminPassword) {
    return NextResponse.json(
      { error: "ADMIN_PASSWORD nao configurado" },
      { status: 500 }
    );
  }

  if (body.username !== adminUsername || body.password !== adminPassword) {
    return NextResponse.json(
      { error: "Credenciais invalidas" },
      { status: 401 }
    );
  }

  const response = NextResponse.json({ authenticated: true });

  response.cookies.set({
    name: getAdminCookieName(),
    value: createAdminToken(),
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 8,
  });

  return response;
};
