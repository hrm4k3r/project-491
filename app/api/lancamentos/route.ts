import { NextRequest, NextResponse } from "next/server";
import { ensureSchema, getPool } from "@/lib/db";
import { Lancamento } from "@/lib/types";

type Row = {
  id: string;
  empresa: string;
  tipo: string;
  motivo: string;
  valor: string;
  data: Date;
};

function toLancamento(row: Row): Lancamento {
  return {
    id: row.id,
    empresa: row.empresa,
    tipo: row.tipo,
    motivo: row.motivo,
    valor: Number(row.valor),
    data: row.data.toISOString(),
  };
}

export async function GET() {
  await ensureSchema();
  const { rows } = await getPool().query<Row>(
    "SELECT id, empresa, tipo, motivo, valor, data FROM lancamentos ORDER BY data ASC"
  );
  return NextResponse.json(rows.map(toLancamento));
}

export async function POST(request: NextRequest) {
  await ensureSchema();
  const body = await request.json();
  const empresa = String(body.empresa ?? "").trim();
  const tipo = String(body.tipo ?? "").trim();
  const motivo = String(body.motivo ?? "").trim();
  const valor = Number(body.valor);

  if (!empresa || !tipo || !Number.isFinite(valor) || valor <= 0) {
    return NextResponse.json(
      { error: "Dados inválidos. Informe empresa, tipo e valor." },
      { status: 400 }
    );
  }

  const { rows } = await getPool().query<Row>(
    `INSERT INTO lancamentos (empresa, tipo, motivo, valor)
     VALUES ($1, $2, $3, $4)
     RETURNING id, empresa, tipo, motivo, valor, data`,
    [empresa, tipo, motivo, valor]
  );

  return NextResponse.json(toLancamento(rows[0]), { status: 201 });
}
