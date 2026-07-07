"use client";

import { useRouter } from "next/navigation";

export function LogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.replace("/admin/login");
    router.refresh();
  }

  return (
    <button
      onClick={handleLogout}
      className="font-mono text-xs uppercase tracking-widest text-ink/60 hover:text-gold transition-colors"
    >
      Cerrar sesión
    </button>
  );
}
