"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useI18n } from "@/lib/i18n/provider";
import { useToast } from "@/components/ui/toast";

export default function ForgotPasswordPage() {
  const { t } = useI18n();
  const { push } = useToast();
  const [email, setEmail] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch("/api/auth/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    push(t("messages.saveSuccess"));
  };

  return (
    <div className="mx-auto flex min-h-[75vh] w-full max-w-lg items-center px-4 py-10">
      <Card className="w-full">
        <h1 className="text-2xl font-semibold">{t("auth.forgotTitle")}</h1>
        <p className="mt-2 text-sm text-zinc-400">{t("auth.forgotText")}</p>
        <form className="mt-6 space-y-4" onSubmit={submit}>
          <Input type="email" placeholder={t("auth.email")} value={email} onChange={(e) => setEmail(e.target.value)} />
          <Button className="w-full">{t("auth.sendReset")}</Button>
        </form>
        <p className="mt-5 text-sm text-zinc-400">
          <Link href="/login" className="text-lime-300">
            {t("auth.backLogin")}
          </Link>
        </p>
      </Card>
    </div>
  );
}
