import { NextResponse } from "next/server";
import { getAdminCookieName } from "@/app/lib/adminAuth";

export const POST = async () => {
  const response = NextResponse.json({ authenticated: false });

  response.cookies.set({
    name: getAdminCookieName(),
    value: "",
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });

  return response;
};
