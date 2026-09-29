import { NextRequest, NextResponse } from "next/server";
import { AUTH_COOKIE, createAuthToken } from "@/lib/auth";

export async function POST(request: NextRequest) {
  const senhaEsperada = process.env.APP_PASSWORD;
  const secret = process.env.AUTH_SECRET;

  if (!senhaEsperada || !secret) {
    return NextResponse.json(
      { error: "Autenticação não configurada no servidor." },
      { status: 500 }
    );
  }

  const body = await request.json().catch(() => null);
  const senha = typeof body?.senha === "string" ? body.senha : "";

  if (senha !== senhaEsperada) {
    return NextResponse.json({ error: "Senha incorreta." }, { status: 401 });
  }

  const token = await createAuthToken(secret);
  const response = NextResponse.json({ ok: true });
  response.cookies.set(AUTH_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
  return response;
}
