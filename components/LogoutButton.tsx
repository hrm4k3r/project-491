"use client";

import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();

  async function sair() {
    await fetch("/api/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  return (
    <button
      onClick={sair}
      className="text-sm font-medium text-slate-400 hover:text-slate-600"
    >
      Sair
    </button>
  );
}
