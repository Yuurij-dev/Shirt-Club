import { NextResponse } from "next/server";
import { reconcilePendingPayments } from "@/app/lib/paymentReconciliation";

const isAuthorizedCronRequest = (request: Request) => {
  const cronSecret = process.env.CRON_SECRET;

  if (!cronSecret) return false;

  const authorization = request.headers.get("authorization");
  const cronSecretHeader = request.headers.get("x-cron-secret");

  return (
    authorization === `Bearer ${cronSecret}` || cronSecretHeader === cronSecret
  );
};

export const GET = async (request: Request) => {
  if (!isAuthorizedCronRequest(request)) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  const result = await reconcilePendingPayments();

  return NextResponse.json({
    ok: true,
    ...result,
  });
};

export const POST = GET;
