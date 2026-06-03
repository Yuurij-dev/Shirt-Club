import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/app/lib/adminAuth";

export const GET = async () => {
  return NextResponse.json({
    authenticated: await isAdminAuthenticated(),
  });
};
