import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import { AppProviders } from "@/components/providers/app-providers";
import { AppChrome } from "@/components/layout/app-chrome";
import { getLangFromCookies } from "@/lib/lang";
import { getCurrentUserFromCookies } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Chroma Client",
  description: "Premium Minecraft visual client website",
};

export default async function RootLayout({ children }: { children: ReactNode }) {
  const lang = await getLangFromCookies();
  const user = await getCurrentUserFromCookies();

  return (
    <html lang={lang}>
      <body className="min-h-screen bg-zinc-950 text-zinc-100 antialiased">
        <AppProviders initialLang={lang}>
          <div className="relative min-h-screen overflow-x-hidden">
            <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(circle_at_20%_10%,rgba(132,204,22,0.1),transparent_45%),radial-gradient(circle_at_80%_20%,rgba(34,197,94,0.07),transparent_40%),linear-gradient(to_bottom,#09090b,#0f0f14)]" />
            <AppChrome user={user} lang={lang}>
              {children}
            </AppChrome>
          </div>
        </AppProviders>
      </body>
    </html>
  );
}
