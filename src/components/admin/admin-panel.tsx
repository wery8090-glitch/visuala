"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { Select } from "@/components/ui/select";
import { DURATIONS, PLAN_DISPLAY, PLAN_ORDER } from "@/lib/constants";
import { useI18n } from "@/lib/i18n/provider";
import { useToast } from "@/components/ui/toast";
import type { AuthUser, Duration, Plan } from "@/lib/types";

type AdminUser = {
  id: string;
  username: string;
  email: string;
  role: string;
  plan: string | null;
  expiresAt: string | null;
};

type AdminKey = {
  id: string;
  code: string;
  plan: string;
  durationMonths: number;
  activationCount: number;
  activationLimit: number;
  expiresAt: string | null;
  createdAt: string;
};

export default function AdminPanel({ user }: { user: AuthUser }) {
  const { t } = useI18n();
  const { push } = useToast();
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [keys, setKeys] = useState<AdminKey[]>([]);
  const [stats, setStats] = useState<Record<string, number>>({});
  const [showModal, setShowModal] = useState(false);
  const [generatedKey, setGeneratedKey] = useState("");
  const [form, setForm] = useState({
    plan: "BASE" as Plan,
    durationMonths: 1 as Duration,
    activationLimit: 1,
    expiresAt: "",
  });

  const load = async () => {
    const [u, k, s] = await Promise.all([
      fetch(`/api/admin/users?search=${encodeURIComponent(search)}`).then((r) => r.json()),
      fetch("/api/admin/keys").then((r) => r.json()),
      fetch("/api/admin/stats").then((r) => r.json()),
    ]);
    setUsers(u.users ?? []);
    setKeys(k.keys ?? []);
    setStats(s.stats ?? {});
  };

  useEffect(() => {
    void load();
  }, []);

  const generate = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/admin/keys", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        plan: form.plan,
        durationMonths: form.durationMonths,
        activationLimit: Number(form.activationLimit),
        expiresAt: form.expiresAt || null,
      }),
    });
    const data = (await res.json()) as { ok: boolean; code?: string; error?: string };
    if (!data.ok) {
      push(t(`messages.${data.error ?? "unknown"}`));
      return;
    }
    setGeneratedKey(data.code ?? "");
    setShowModal(true);
    push(t("messages.keyGenerated"));
    await load();
  };

  const filteredUsers = useMemo(
    () => users.filter((u) => u.username.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase())),
    [users, search],
  );

  return (
    <div className="space-y-5">
      <Card>
        <h1 className="text-2xl font-semibold">{t("admin.title")}</h1>
        <p className="mt-2 text-sm text-zinc-400">{user.username}</p>

        <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-7">
          {["users", "subscriptions", "plans", "keys", "versions", "downloads", "settings"].map((key) => (
            <Card key={key}>
              <p className="text-xs uppercase text-zinc-500">{t(`admin.${key}`)}</p>
              <p className="mt-1 text-lg font-semibold text-lime-300">{stats[key] ?? (key === "settings" ? 1 : 0)}</p>
            </Card>
          ))}
        </div>
      </Card>

      <Card>
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold">{t("admin.users")}</h2>
          </div>
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t("admin.searchUsers")}
            className="max-w-sm"
          />
          <Button variant="secondary" onClick={() => void load()}>
            {t("common.refresh")}
          </Button>
        </div>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[680px] text-left text-sm">
            <thead className="text-zinc-400">
              <tr>
                <th className="py-2">{t("admin.id")}</th>
                <th>{t("profile.username")}</th>
                <th>{t("profile.email")}</th>
                <th>{t("common.role")}</th>
                <th>{t("common.subscription")}</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((u) => (
                <tr key={u.id} className="border-t border-zinc-800 text-zinc-200">
                  <td className="py-2 pr-2 text-xs text-zinc-500">{u.id.slice(0, 8)}...</td>
                  <td>{u.username}</td>
                  <td>{u.email}</td>
                  <td>{u.role}</td>
                  <td>{(u.plan ?? "FREE").replace("_", "+")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Card>
        <h2 className="text-lg font-semibold">{t("admin.generateKey")}</h2>
        <form className="mt-4 grid gap-3 md:grid-cols-4" onSubmit={generate}>
          <Select value={form.plan} onChange={(e) => setForm((p) => ({ ...p, plan: e.target.value as Plan }))}>
            {PLAN_ORDER.map((plan) => (
              <option key={plan} value={plan}>
                {PLAN_DISPLAY[plan]}
              </option>
            ))}
          </Select>

          <Select
            value={form.durationMonths}
            onChange={(e) => setForm((p) => ({ ...p, durationMonths: Number(e.target.value) as Duration }))}
          >
            {DURATIONS.map((duration) => (
              <option key={duration} value={duration}>
                {duration}
              </option>
            ))}
          </Select>

          <Input
            type="number"
            min={1}
            value={form.activationLimit}
            onChange={(e) => setForm((p) => ({ ...p, activationLimit: Number(e.target.value) }))}
            placeholder={t("admin.activationCount")}
          />

          <Input
            type="date"
            value={form.expiresAt}
            onChange={(e) => setForm((p) => ({ ...p, expiresAt: e.target.value }))}
          />

          <Button className="md:col-span-4">{t("common.generate")}</Button>
        </form>
      </Card>

      <Card>
        <h2 className="text-lg font-semibold">{t("admin.keys")}</h2>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[680px] text-left text-sm">
            <thead className="text-zinc-400">
              <tr>
                <th className="py-2">Key</th>
                <th>Plan</th>
                <th>Duration</th>
                <th>{t("common.status")}</th>
                <th>{t("admin.activationCount")}</th>
              </tr>
            </thead>
            <tbody>
              {keys.map((k) => (
                <tr key={k.id} className="border-t border-zinc-800 text-zinc-200">
                  <td className="py-2">{k.code}</td>
                  <td>{k.plan.replace("_", "+")}</td>
                  <td>{k.durationMonths}</td>
                  <td>{k.activationCount < k.activationLimit ? t("common.active") : t("common.expired")}</td>
                  <td>
                    {k.activationCount}/{k.activationLimit}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Modal open={showModal} title={t("admin.generatedKey")} onClose={() => setShowModal(false)}>
        <p className="break-all rounded-xl border border-zinc-700 bg-zinc-950 px-3 py-2 font-mono">{generatedKey}</p>
        <Button
          className="mt-4"
          onClick={() => {
            navigator.clipboard.writeText(generatedKey).catch(() => undefined);
            push(t("common.copy"));
          }}
        >
          {t("common.copy")}
        </Button>
      </Modal>
    </div>
  );
}
