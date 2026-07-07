"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export function LoginForm() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const response = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });

    setLoading(false);

    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      setError(data.error ?? "No se pudo iniciar sesión.");
      return;
    }

    const redirectTo = searchParams.get("from") || "/admin";
    router.replace(redirectTo);
    router.refresh();
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-sm border border-ink/10 bg-white/50 p-8"
    >
      <h1 className="font-serif text-2xl mb-1">DriveClub Panama</h1>
      <p className="font-mono text-xs uppercase tracking-widest text-gold mb-6">
        Panel de administración
      </p>

      <label className="block font-mono text-xs uppercase tracking-widest text-ink/60 mb-2">
        Contraseña
      </label>
      <input
        type="password"
        value={password}
        onChange={(event) => setPassword(event.target.value)}
        autoFocus
        className="w-full border border-ink/20 bg-white px-3 py-2 mb-4 font-sans focus:outline-none focus:border-gold"
      />

      {error && (
        <p className="font-mono text-xs text-red-700 mb-4">{error}</p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-ink text-cream font-mono text-xs uppercase tracking-widest py-3 hover:bg-gold hover:text-ink transition-colors disabled:opacity-50"
      >
        {loading ? "Verificando…" : "Entrar"}
      </button>
    </form>
  );
}
