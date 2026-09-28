export type Lancamento = {
  id: string;
  empresa: string;
  tipo: string;
  motivo: string;
  valor: number;
  data: string;
};

export const TIPOS_SUGERIDOS = [
  "Farmácia",
  "Variedades",
  "Supermercado",
  "Hospedagem",
  "Transporte",
  "Alimentação",
  "Passeio",
  "Outros",
] as const;
