import type { HTMLAttributes } from "react";

export function Badge({ className = "", ...props }: HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={`inline-flex items-center rounded-full border border-lime-400/40 bg-lime-400/10 px-2.5 py-1 text-xs font-medium text-lime-300 ${className}`}
      {...props}
    />
  );
}
