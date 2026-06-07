import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/app/lib/adminAuth";
import { reconcilePendingPayments } from "@/app/lib/paymentReconciliation";

export const POST = async () => {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  const result = await reconcilePendingPayments();

  return NextResponse.json({
    ok: true,
    ...result,
  });
};
