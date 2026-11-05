import type { Metadata } from "next";
import type { ReactNode } from "react";

import { company } from "@/entities/company";
import { SiteHeader } from "@/widgets/site-header";

import { themeScript } from "../model/theme-script";

import "../styles/globals.css";

export const metadata: Metadata = {
  title: {
    default: `Инженерные системы под ключ — ${company.name}`,
    template: `%s — ${company.name}`,
  },
  description:
    "Монтаж, ремонт и обслуживание инженерных и технологических систем в Калужской и Московской областях. Техпромстрой.",
};

export function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="ru" suppressHydrationWarning>
      <head><script dangerouslySetInnerHTML={{ __html: themeScript }} /></head>
      <body className="flex min-h-dvh flex-col bg-background font-sans text-foreground antialiased">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:rounded-lg focus:bg-accent focus:px-5 focus:py-3 focus:font-medium focus:text-white"
        >
          Перейти к содержимому
        </a>
        <SiteHeader />
        <main id="main-content" tabIndex={-1} className="flex-1 focus:outline-none">
          {children}
        </main>
      </body>
    </html>
  );
}
