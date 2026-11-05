import type { Metadata } from "next";
import type { ReactNode } from "react";

import { company } from "@/entities/company";
import { SiteHeader } from "@/widgets/site-header";

import "../styles/globals.css";

export const metadata: Metadata = {
  title: {
    default: `Строительная компания «${company.name}»`,
    template: `%s — ${company.name}`,
  },
  description:
    "Строительство, инженерные системы, реконструкция и капитальный ремонт в Калужской и Московской областях.",
};

export function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="ru">
      <body className="flex min-h-dvh flex-col bg-background font-sans text-foreground antialiased">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:rounded-lg focus:bg-accent focus:px-5 focus:py-3 focus:font-medium focus:text-white"
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
