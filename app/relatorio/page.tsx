"use client";

import Link from "next/link";
import { useLancamentos } from "@/lib/store";
import { formatBRL } from "@/lib/format";

export default function RelatorioPage() {
  const itens = useLancamentos();

  const total = itens.reduce((soma, item) => soma + item.valor, 0);

  const porTipo = itens.reduce<Record<string, number>>((acc, item) => {
    acc[item.tipo] = (acc[item.tipo] ?? 0) + item.valor;
    return acc;
  }, {});

  return (
    <main className="flex flex-1 flex-col px-4 py-8 sm:px-6">
      <div className="mx-auto w-full max-w-4xl">
        <div className="mb-6 flex items-center justify-between no-print">
          <div>
            <Link href="/" className="text-sm font-medium text-sky-600 hover:underline">
              ← Início
            </Link>
            <h1 className="mt-1 text-2xl font-bold text-slate-900">Relatório</h1>
          </div>
          <button
            onClick={() => window.print()}
            className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-700"
          >
            Imprimir / Exportar PDF
          </button>
        </div>

        <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">
          <div className="border-b border-slate-200 px-6 py-5">
            <h2 className="text-center text-lg font-bold text-slate-900">
              Planilha de Viagem
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  <th className="px-6 py-3">Empresa</th>
                  <th className="px-6 py-3">Tipo</th>
                  <th className="px-6 py-3">Motivo</th>
                  <th className="px-6 py-3 text-right">Valor</th>
                </tr>
              </thead>
              <tbody>
                {itens.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-6 py-10 text-center text-slate-400">
                      Nenhum lançamento registrado.
                    </td>
                  </tr>
                )}
                {itens.map((item) => (
                  <tr key={item.id} className="border-b border-slate-100 last:border-0">
                    <td className="px-6 py-3 font-medium text-slate-800">{item.empresa}</td>
                    <td className="px-6 py-3 text-slate-600">{item.tipo}</td>
                    <td className="px-6 py-3 text-sky-700">{item.motivo || "—"}</td>
                    <td className="px-6 py-3 text-right font-semibold text-slate-900">
                      {formatBRL(item.valor)}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="bg-slate-50">
                  <td colSpan={3} className="px-6 py-4 text-right font-bold text-slate-700">
                    Total
                  </td>
                  <td className="px-6 py-4 text-right text-lg font-bold text-sky-700">
                    {formatBRL(total)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        {Object.keys(porTipo).length > 0 && (
          <div className="mt-6 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-500">
              Total por Tipo
            </h3>
            <ul className="space-y-2">
              {Object.entries(porTipo).map(([tipo, valor]) => (
                <li key={tipo} className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">{tipo}</span>
                  <span className="font-semibold text-slate-900">{formatBRL(valor)}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </main>
  );
}
