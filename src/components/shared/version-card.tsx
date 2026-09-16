import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

export function VersionCard({
  name,
  tag,
  description,
  latest,
}: {
  name: string;
  tag: string;
  description: string;
  latest: boolean;
}) {
  return (
    <Card>
      <div className="flex items-center justify-between">
        <h3 className="text-base font-semibold text-zinc-100">{name}</h3>
        {latest && <Badge>Latest</Badge>}
      </div>
      <p className="mt-2 text-sm text-zinc-400">{tag}</p>
      <p className="mt-3 text-sm text-zinc-300">{description}</p>
    </Card>
  );
}
