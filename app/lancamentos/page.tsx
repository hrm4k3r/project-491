"use client";

import Link from "next/link";
import { useState } from "react";
import { Lancamento, TIPOS_SUGERIDOS } from "@/lib/types";
import { useLancamentos, setLancamentos } from "@/lib/store";
import { formatBRL } from "@/lib/format";

function emptyForm() {
  return { empresa: "", tipo: "", motivo: "", valor: "" };
}

export default function LancamentosPage() {
  const itens = useLancamentos();
  const [form, setForm] = useState(emptyForm());
  const [editId, setEditId] = useState<string | null>(null);

  const total = itens.reduce((soma, item) => soma + item.valor, 0);

  function atualizarCampo(campo: keyof typeof form, valor: string) {
    setForm((atual) => ({ ...atual, [campo]: valor }));
  }

  function submeter(e: React.FormEvent) {
    e.preventDefault();
    const valorNumerico = Number(form.valor.replace(",", "."));
    if (!form.empresa.trim() || !form.tipo.trim() || !valorNumerico) return;

    if (editId) {
      setLancamentos(
        itens.map((item) =>
          item.id === editId
            ? {
                ...item,
                empresa: form.empresa.trim(),
                tipo: form.tipo.trim(),
                motivo: form.motivo.trim(),
                valor: valorNumerico,
              }
            : item
        )
      );
      setEditId(null);
    } else {
      const novo: Lancamento = {
        id: crypto.randomUUID(),
        empresa: form.empresa.trim(),
        tipo: form.tipo.trim(),
        motivo: form.motivo.trim(),
        valor: valorNumerico,
        data: new Date().toISOString(),
      };
      setLancamentos([...itens, novo]);
    }
    setForm(emptyForm());
  }

  function editar(item: Lancamento) {
    setEditId(item.id);
    setForm({
      empresa: item.empresa,
      tipo: item.tipo,
      motivo: item.motivo,
      valor: String(item.valor),
    });
  }

  function excluir(id: string) {
    setLancamentos(itens.filter((item) => item.id !== id));
    if (editId === id) {
      setEditId(null);
      setForm(emptyForm());
    }
  }

  return (
    <main className="flex flex-1 flex-col px-4 py-8 sm:px-6">
      <div className="mx-auto w-full max-w-2xl">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <Link href="/" className="text-sm font-medium text-sky-600 hover:underline">
              ← Início
            </Link>
            <h1 className="mt-1 text-2xl font-bold text-slate-900">Lançamentos</h1>
          </div>
          <div className="text-right">
            <p className="text-xs uppercase tracking-wide text-slate-400">Total</p>
            <p className="text-xl font-bold text-slate-900">{formatBRL(total)}</p>
          </div>
        </div>

        <form
          onSubmit={submeter}
          className="mb-8 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200"
        >
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-600">
                Empresa
              </label>
              <input
                value={form.empresa}
                onChange={(e) => atualizarCampo("empresa", e.target.value)}
                placeholder="Ex: Drogasil"
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                required
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-600">
                Tipo
              </label>
              <input
                value={form.tipo}
                onChange={(e) => atualizarCampo("tipo", e.target.value)}
                placeholder="Ex: Farmácia"
                list="tipos-sugeridos"
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                required
              />
              <datalist id="tipos-sugeridos">
                {TIPOS_SUGERIDOS.map((tipo) => (
                  <option key={tipo} value={tipo} />
                ))}
              </datalist>
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1 block text-sm font-medium text-slate-600">
                Motivo
              </label>
              <input
                value={form.motivo}
                onChange={(e) => atualizarCampo("motivo", e.target.value)}
                placeholder="Ex: Medicamentos e Filtro Solar"
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-600">
                Valor (R$)
              </label>
              <input
                value={form.valor}
                onChange={(e) => atualizarCampo("valor", e.target.value)}
                placeholder="0,00"
                inputMode="decimal"
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                required
              />
            </div>
          </div>

          <div className="mt-4 flex gap-3">
            <button
              type="submit"
              className="rounded-lg bg-sky-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-sky-700"
            >
              {editId ? "Salvar alteração" : "Adicionar lançamento"}
            </button>
            {editId && (
              <button
                type="button"
                onClick={() => {
                  setEditId(null);
                  setForm(emptyForm());
                }}
                className="rounded-lg px-4 py-2 text-sm font-semibold text-slate-500 hover:bg-slate-100"
              >
                Cancelar
              </button>
            )}
          </div>
        </form>

        <ul className="space-y-3">
          {itens.length === 0 && (
            <li className="rounded-xl bg-white p-6 text-center text-sm text-slate-400 ring-1 ring-slate-200">
              Nenhum lançamento ainda.
            </li>
          )}
          {itens.map((item) => (
            <li
              key={item.id}
              className="flex items-center justify-between rounded-xl bg-white p-4 shadow-sm ring-1 ring-slate-200"
            >
              <div className="min-w-0">
                <p className="truncate font-semibold text-slate-900">{item.empresa}</p>
                <p className="truncate text-sm text-slate-500">
                  {item.tipo}
                  {item.motivo ? ` · ${item.motivo}` : ""}
                </p>
              </div>
              <div className="ml-4 flex shrink-0 items-center gap-3">
                <span className="font-semibold text-slate-900">{formatBRL(item.valor)}</span>
                <button
                  onClick={() => editar(item)}
                  className="rounded-md p-1.5 text-slate-400 hover:bg-slate-100 hover:text-sky-600"
                  aria-label="Editar"
                >
                  <EditIcon />
                </button>
                <button
                  onClick={() => excluir(item.id)}
                  className="rounded-md p-1.5 text-slate-400 hover:bg-slate-100 hover:text-red-600"
                  aria-label="Excluir"
                >
                  <TrashIcon />
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}

function EditIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" strokeWidth={2} stroke="currentColor" className="h-4 w-4">
      <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487a2.06 2.06 0 1 1 2.915 2.914L7.5 19.674l-4 1 1-4Z" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" strokeWidth={2} stroke="currentColor" className="h-4 w-4">
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 7h12M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2m2 0-1 13a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1L6 7Z" />
    </svg>
  );
}
