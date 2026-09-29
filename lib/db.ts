import { Pool } from "pg";

declare global {
  var _pgPool: Pool | undefined;
}

function createPool(): Pool {
  const connectionString =
    process.env.DATABASE_URL ??
    process.env.POSTGRES_URL ??
    process.env.POSTGRES_URL_NON_POOLING;

  if (!connectionString) {
    throw new Error(
      "Nenhuma variável de ambiente de banco encontrada (DATABASE_URL / POSTGRES_URL)."
    );
  }

  return new Pool({
    connectionString,
    ssl:
      connectionString.includes("localhost") || connectionString.includes("127.0.0.1")
        ? false
        : { rejectUnauthorized: false },
  });
}

export function getPool(): Pool {
  if (!global._pgPool) {
    global._pgPool = createPool();
  }
  return global._pgPool;
}

let schemaReady: Promise<void> | null = null;

export function ensureSchema(): Promise<void> {
  if (!schemaReady) {
    schemaReady = getPool()
      .query(
        `
      CREATE TABLE IF NOT EXISTS lancamentos (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        empresa TEXT NOT NULL,
        tipo TEXT NOT NULL,
        motivo TEXT NOT NULL DEFAULT '',
        valor NUMERIC(12, 2) NOT NULL,
        data TIMESTAMPTZ NOT NULL DEFAULT now()
      );
    `
      )
      .then(() => undefined);
  }
  return schemaReady;
}
