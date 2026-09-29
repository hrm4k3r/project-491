"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);

  async function entrar(e: React.FormEvent) {
    e.preventDefault();
    setEnviando(true);
    setErro(null);
    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ senha }),
      });
      if (!res.ok) {
        const corpo = await res.json().catch(() => null);
        throw new Error(corpo?.error ?? "Erro ao entrar.");
      }
      const destino = params.get("from") || "/";
      router.push(destino);
      router.refresh();
    } catch (e) {
      setErro(e instanceof Error ? e.message : "Erro ao entrar.");
    } finally {
      setEnviando(false);
    }
  }

  return (
    <form
      onSubmit={entrar}
      className="w-full max-w-xs rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200"
    >
      <h1 className="text-xl font-bold text-slate-900">Controle de Viagem</h1>
      <p className="mt-1 text-sm text-slate-500">Digite a senha para continuar.</p>

      {erro && (
        <div className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 ring-1 ring-red-200">
          {erro}
        </div>
      )}

      <input
        type="password"
        value={senha}
        onChange={(e) => setSenha(e.target.value)}
        placeholder="Senha"
        autoFocus
        className="mt-4 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
        required
      />

      <button
        type="submit"
        disabled={enviando}
        className="mt-4 w-full rounded-lg bg-sky-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-sky-700 disabled:opacity-60"
      >
        {enviando ? "Entrando..." : "Entrar"}
      </button>
    </form>
  );
}

export default function LoginPage() {
  return (
    <main className="flex flex-1 items-center justify-center px-6 py-16">
      <Suspense>
        <LoginForm />
      </Suspense>
    </main>
  );
}
