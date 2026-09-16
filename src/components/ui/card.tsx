import type { HTMLAttributes } from "react";

export function Card({ className = "", ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`rounded-2xl border border-zinc-800 bg-zinc-900/70 p-5 shadow-[0_12px_40px_rgba(0,0,0,0.3)] backdrop-blur-sm transition duration-300 hover:border-lime-400/30 ${className}`}
      {...props}
    />
  );
}
