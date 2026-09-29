import Link from "next/link";
import LogoutButton from "@/components/LogoutButton";

export default function Home() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center px-6 py-16">
      <div className="w-full max-w-sm text-center">
        <div className="mb-2 flex justify-end">
          <LogoutButton />
        </div>
        <p className="text-sm font-semibold uppercase tracking-widest text-sky-600">
          Controle Pessoal
        </p>
        <h1 className="mt-2 text-3xl font-bold text-slate-900">
          Planilha de Viagem
        </h1>
        <p className="mt-3 text-slate-500">
          Registre seus gastos e acompanhe o total da viagem.
        </p>

        <div className="mt-10 flex flex-col gap-4">
          <Link
            href="/lancamentos"
            className="flex items-center justify-center gap-3 rounded-2xl bg-sky-600 px-6 py-5 text-lg font-semibold text-white shadow-lg shadow-sky-600/20 transition hover:-translate-y-0.5 hover:bg-sky-700 active:scale-95"
          >
            <PlusIcon />
            Lançamentos
          </Link>

          <Link
            href="/relatorio"
            className="flex items-center justify-center gap-3 rounded-2xl bg-white px-6 py-5 text-lg font-semibold text-slate-800 shadow-lg shadow-slate-900/5 ring-1 ring-slate-200 transition hover:-translate-y-0.5 hover:ring-sky-300 active:scale-95"
          >
            <ReportIcon />
            Relatório
          </Link>
        </div>
      </div>
    </main>
  );
}

function PlusIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" strokeWidth={2.2} stroke="currentColor" className="h-6 w-6">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 5v14M5 12h14" />
    </svg>
  );
}

function ReportIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" strokeWidth={2.2} stroke="currentColor" className="h-6 w-6 text-sky-600">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 17V9m6 8V5M5 21h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2Z" />
    </svg>
  );
}
