"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useI18n } from "@/lib/i18n/provider";
import { useToast } from "@/components/ui/toast";

export default function LoginPage() {
  const { t } = useI18n();
  const { push } = useToast();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ email: "", password: "", remember: true });

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await fetch("/api/auth/login", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = (await res.json()) as { ok: boolean; error?: string; redirectTo?: string };
    setLoading(false);

    if (!data.ok) {
      push(t(`messages.${data.error ?? "unknown"}`));
      return;
    }

    window.location.assign(data.redirectTo ?? "/loader");
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-8">
      <div className="w-full max-w-4xl overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950/85 shadow-2xl">
        <div className="grid md:grid-cols-2">
          <div className="p-6 md:p-8">
            <h1 className="text-3xl font-semibold text-zinc-100">Chroma</h1>
            <p className="mt-1 text-sm text-zinc-400">{t("loader.welcome")}</p>

            <form className="mt-6 space-y-4" onSubmit={onSubmit}>
              <div>
                <p className="mb-1 text-xs text-zinc-500">{t("auth.email")}</p>
                <Input
                  placeholder="you@example.com"
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                />
              </div>

              <div>
                <p className="mb-1 text-xs text-zinc-500">{t("auth.password")}</p>
                <Input
                  placeholder="••••••••"
                  type="password"
                  value={form.password}
                  onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
                />
              </div>

              <label className="flex items-center gap-2 text-sm text-zinc-300">
                <input
                  type="checkbox"
                  checked={form.remember}
                  onChange={(e) => setForm((p) => ({ ...p, remember: e.target.checked }))}
                />
                {t("auth.rememberMe")}
              </label>

              <Button className="w-full py-2.5" disabled={loading}>
                {t("auth.login")}
              </Button>
            </form>

            <div className="mt-5 space-y-2 text-sm text-zinc-400">
              <p>
                {t("auth.noAccount")} <Link href="/register" className="text-lime-300">{t("auth.register")}</Link>
              </p>
              <p>
                <Link href="/forgot-password" className="text-zinc-500 hover:text-zinc-300">
                  {t("auth.forgotTitle")}
                </Link>
              </p>
            </div>
          </div>

          <div className="relative hidden min-h-[420px] md:block">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,rgba(132,204,22,0.25),transparent_45%),linear-gradient(120deg,#0b0f16,#17110f)]" />
            <div className="absolute inset-0 bg-black/45" />
            <div className="relative z-10 flex h-full items-center justify-center p-8 text-center">
              <div>
                <p className="text-2xl font-semibold text-zinc-100">CHROMA LOADER</p>
                <p className="mt-3 text-zinc-300">Minecraft launcher web prototype</p>
                <p className="mt-2 text-sm text-zinc-400">Speed • Visuals • Stability</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
