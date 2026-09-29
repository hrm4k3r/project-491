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

export async function PUT(
  request: NextRequest,
  ctx: RouteContext<"/api/lancamentos/[id]">
) {
  await ensureSchema();
  const { id } = await ctx.params;
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
    `UPDATE lancamentos
     SET empresa = $1, tipo = $2, motivo = $3, valor = $4
     WHERE id = $5
     RETURNING id, empresa, tipo, motivo, valor, data`,
    [empresa, tipo, motivo, valor, id]
  );

  if (rows.length === 0) {
    return NextResponse.json({ error: "Lançamento não encontrado." }, { status: 404 });
  }

  return NextResponse.json(toLancamento(rows[0]));
}

export async function DELETE(
  _request: NextRequest,
  ctx: RouteContext<"/api/lancamentos/[id]">
) {
  await ensureSchema();
  const { id } = await ctx.params;
  const { rowCount } = await getPool().query("DELETE FROM lancamentos WHERE id = $1", [id]);

  if (rowCount === 0) {
    return NextResponse.json({ error: "Lançamento não encontrado." }, { status: 404 });
  }

  return NextResponse.json({ ok: true });
}
