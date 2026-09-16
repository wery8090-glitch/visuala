"use client";

import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n/provider";

export function Modal({
  open,
  title,
  children,
  onClose,
}: {
  open: boolean;
  title: string;
  children: React.ReactNode;
  onClose: () => void;
}) {
  const { t } = useI18n();
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <div className="w-full max-w-lg animate-[fadeIn_.2s_ease] rounded-2xl border border-zinc-700 bg-zinc-900 p-6">
        <h3 className="text-lg font-semibold text-zinc-100">{title}</h3>
        <div className="mt-3 text-zinc-300">{children}</div>
        <div className="mt-5 flex justify-end">
          <Button variant="secondary" onClick={onClose}>
            {t("common.close")}
          </Button>
        </div>
      </div>
    </div>
  );
}
