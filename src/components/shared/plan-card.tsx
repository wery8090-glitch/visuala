import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PLAN_DISPLAY } from "@/lib/constants";
import type { Plan } from "@/lib/types";

export function PlanCard({
  plan,
  description,
  features,
  status,
  onAction,
  actionLabel,
}: {
  plan: Plan;
  description: string;
  features: string[];
  status: string;
  actionLabel: string;
  onAction?: () => void;
}) {
  return (
    <Card className="flex h-full flex-col">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-zinc-100">{PLAN_DISPLAY[plan]}</h3>
        <Badge>{status}</Badge>
      </div>
      <p className="mt-2 text-sm text-zinc-400">{description}</p>
      <ul className="mt-4 space-y-1 text-sm text-zinc-300">
        {features.map((feature) => (
          <li key={feature}>• {feature}</li>
        ))}
      </ul>
      <div className="mt-auto pt-5">
        <Button className="w-full" onClick={onAction}>
          {actionLabel}
        </Button>
      </div>
    </Card>
  );
}
