"use client";

import type { ButtonHTMLAttributes } from "react";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost";
};

export function Button({ variant = "primary", className = "", ...props }: Props) {
  const variantClasses =
    variant === "primary"
      ? "bg-lime-400 text-zinc-950 hover:bg-lime-300"
      : variant === "secondary"
        ? "bg-zinc-800 text-zinc-100 hover:bg-zinc-700 border border-zinc-700"
        : "bg-transparent text-zinc-300 hover:bg-zinc-800";

  return (
    <button
      className={`inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-semibold transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-60 ${variantClasses} ${className}`}
      {...props}
    />
  );
}
