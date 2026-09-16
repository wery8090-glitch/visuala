"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useI18n } from "@/lib/i18n/provider";
import { useToast } from "@/components/ui/toast";

export default function RegisterPage() {
  const { t, lang } = useI18n();
  const { push } = useToast();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    remember: true,
  });

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await fetch("/api/auth/register", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, lang }),
    });
    const data = (await res.json()) as { ok: boolean; error?: string };
    setLoading(false);

    if (!data.ok) {
      push(t(`messages.${data.error ?? "unknown"}`));
      return;
    }

    window.location.assign("/loader");
  };

  return (
    <div className="mx-auto flex min-h-[75vh] w-full max-w-lg items-center px-4 py-10">
      <Card className="w-full">
        <h1 className="text-2xl font-semibold">{t("auth.registerTitle")}</h1>
        <form className="mt-6 space-y-4" onSubmit={onSubmit}>
          <Input
            placeholder={t("auth.username")}
            value={form.username}
            onChange={(e) => setForm((p) => ({ ...p, username: e.target.value }))}
          />
          <Input
            placeholder={t("auth.email")}
            type="email"
            value={form.email}
            onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
          />
          <Input
            placeholder={t("auth.password")}
            type="password"
            value={form.password}
            onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
          />
          <Input
            placeholder={t("auth.confirmPassword")}
            type="password"
            value={form.confirmPassword}
            onChange={(e) => setForm((p) => ({ ...p, confirmPassword: e.target.value }))}
          />
          <Button className="w-full" disabled={loading}>
            {t("auth.register")}
          </Button>
        </form>

        <p className="mt-5 text-sm text-zinc-400">
          {t("auth.hasAccount")} <Link href="/login" className="text-lime-300">{t("auth.login")}</Link>
        </p>
      </Card>
    </div>
  );
}
