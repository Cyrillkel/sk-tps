import type { Metadata } from "next";
import type { ReactNode } from "react";

import { company } from "@/entities/company";
import { ContactMessengers } from "@/features/contact-messengers";
import { ScrollToTopButton } from "@/features/scroll-to-top";
import { SiteFooter } from "@/widgets/site-footer";
import { SiteHeader } from "@/widgets/site-header";

import { themeScript } from "../model/theme-script";

import "../styles/globals.css";

export const metadata: Metadata = {
  title: {
    default: `Инженерные системы под ключ — ${company.name}`,
    template: `%s — ${company.name}`,
  },
  description:
    "Монтаж, ремонт и обслуживание инженерных и технологических систем в Калужской, Тульской и Московской областях. Техпромстрой.",
};

export function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="ru" data-scroll-behavior="smooth" suppressHydrationWarning>
      <head><script dangerouslySetInnerHTML={{ __html: themeScript }} /></head>
      <body className="flex min-h-dvh flex-col bg-background font-sans text-foreground antialiased">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:rounded-lg focus:bg-accent focus:px-5 focus:py-3 focus:font-medium focus:text-white"
        >
          Перейти к содержимому
        </a>
        <SiteHeader />
        <main id="main-content" tabIndex={-1} className="site-main flex-1 focus:outline-none">
          {children}
        </main>
        <SiteFooter />
        <div className="floating-controls">
          <ScrollToTopButton />
          <ContactMessengers />
        </div>
      </body>
    </html>
  );
}
