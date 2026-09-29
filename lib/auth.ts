const encoder = new TextEncoder();

function bufToHex(buf: ArrayBuffer): string {
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

async function getKey(secret: string): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
}

export async function createAuthToken(secret: string): Promise<string> {
  const key = await getKey(secret);
  const sig = await crypto.subtle.sign("HMAC", key, encoder.encode("sessao-viagem"));
  return bufToHex(sig);
}

export async function isValidAuthToken(token: string | undefined, secret: string): Promise<boolean> {
  if (!token) return false;
  const esperado = await createAuthToken(secret);
  if (token.length !== esperado.length) return false;
  let diff = 0;
  for (let i = 0; i < token.length; i++) {
    diff |= token.charCodeAt(i) ^ esperado.charCodeAt(i);
  }
  return diff === 0;
}

export const AUTH_COOKIE = "viagem_auth";
