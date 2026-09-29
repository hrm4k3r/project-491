import { Lancamento } from "./types";

export type NovoLancamento = {
  empresa: string;
  tipo: string;
  motivo: string;
  valor: number;
};

async function tratarResposta<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const corpo = await res.json().catch(() => null);
    throw new Error(corpo?.error ?? "Erro ao comunicar com o servidor.");
  }
  return res.json();
}

export function listarLancamentos(): Promise<Lancamento[]> {
  return fetch("/api/lancamentos", { cache: "no-store" }).then((res) =>
    tratarResposta<Lancamento[]>(res)
  );
}

export function criarLancamento(dados: NovoLancamento): Promise<Lancamento> {
  return fetch("/api/lancamentos", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dados),
  }).then((res) => tratarResposta<Lancamento>(res));
}

export function atualizarLancamento(
  id: string,
  dados: NovoLancamento
): Promise<Lancamento> {
  return fetch(`/api/lancamentos/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dados),
  }).then((res) => tratarResposta<Lancamento>(res));
}

export function excluirLancamento(id: string): Promise<void> {
  return fetch(`/api/lancamentos/${id}`, { method: "DELETE" }).then((res) =>
    tratarResposta<{ ok: true }>(res).then(() => undefined)
  );
}
