"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { saveAuthSession } from "@/app/context/AuthContext";

const AuthCallbackPage = () => {
  const [status, setStatus] = useState("Conectando sua conta...");

  useEffect(() => {
    const hash = new URLSearchParams(window.location.hash.replace(/^#/, ""));
    const accessToken = hash.get("access_token");
    const refreshToken = hash.get("refresh_token") || undefined;
    const expiresIn = Number(hash.get("expires_in") || 0);

    if (!accessToken) {
      setStatus("Não foi possível concluir o login.");
      return;
    }

    saveAuthSession({
      accessToken,
      refreshToken,
      expiresAt: expiresIn ? Date.now() + expiresIn * 1000 : undefined,
    });

    setStatus("Login concluído. Redirecionando...");
    window.location.replace("/minha-conta");
  }, []);

  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-50 !p-6">
      <section className="w-full max-w-md rounded-xl border border-zinc-200 bg-white !p-8 text-center shadow-sm">
        <Loader2 className="mx-auto animate-spin" size={32} />
        <h1 className="!mt-5 font-[family-name:var(--font-bebas)] text-4xl">
          Login Google
        </h1>
        <p className="!mt-2 text-sm text-zinc-500">{status}</p>
        {status.includes("Não foi possível") && (
          <Link
            href="/"
            className="!mt-5 inline-flex h-11 items-center justify-center rounded-lg bg-black !px-5 text-sm font-bold text-white"
          >
            VOLTAR PARA INÍCIO
          </Link>
        )}
      </section>
    </main>
  );
};

export default AuthCallbackPage;
