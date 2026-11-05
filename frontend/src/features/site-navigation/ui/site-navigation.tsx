"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { company } from "@/entities/company";
import { services } from "@/entities/service";
import { Container } from "@/shared/ui";

const navigation = [
  { href: "/", label: "Главная" },
  ...services.map(({ slug, navigationLabel }) => ({ href: `/${slug}`, label: navigationLabel })),
  { href: "/contacts", label: "Контакты" },
];

export function SiteNavigation() {
  const pathname = usePathname().replace(/\/$/, "") || "/";
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
        buttonRef.current?.focus();
      }
    }

    function handlePointerDown(event: PointerEvent) {
      if (event.target instanceof Node && !menuRef.current?.contains(event.target)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("pointerdown", handlePointerDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("pointerdown", handlePointerDown);
    };
  }, [isOpen]);

  return (
    <div ref={menuRef}>
      <nav aria-label="Основная навигация" className="hidden xl:block">
        <ul className="flex items-center gap-5 2xl:gap-7">
          {navigation.map(({ href, label }) => (
            <li key={href}>
              <Link
                href={href}
                aria-current={pathname === href ? "page" : undefined}
                className={`py-2 text-sm font-medium transition-colors hover:text-accent ${pathname === href ? "text-accent" : "text-foreground"}`}
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <button
        ref={buttonRef}
        type="button"
        aria-expanded={isOpen}
        aria-controls="mobile-navigation"
        aria-label={isOpen ? "Закрыть меню" : "Открыть меню"}
        onClick={() => setIsOpen((open) => !open)}
        className="flex size-11 items-center justify-center rounded-lg border border-border text-foreground transition-colors hover:bg-background xl:hidden"
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
          {isOpen ? <path d="m6 6 12 12M6 18 18 6" /> : <path d="M4 6h16M4 12h16M4 18h16" />}
        </svg>
      </button>

      <nav
        id="mobile-navigation"
        aria-label="Мобильная навигация"
        hidden={!isOpen}
        className="absolute top-full left-0 w-full border-b border-border bg-surface py-5 shadow-lg xl:hidden"
      >
        <Container>
          <ul className="flex flex-col gap-1">
            {navigation.map(({ href, label }) => (
              <li key={href}>
                <Link
                  href={href}
                  aria-current={pathname === href ? "page" : undefined}
                  onClick={() => setIsOpen(false)}
                  className={`block rounded-lg px-3 py-3 text-base font-medium hover:bg-background ${pathname === href ? "bg-background text-accent" : "text-foreground"}`}
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-5 flex flex-col items-start gap-3 border-t border-border px-3 pt-5">
            <a href={company.phoneHref} className="text-lg font-semibold text-accent">{company.phone}</a>
            <a href={`mailto:${company.email}`} className="text-sm text-muted">{company.email}</a>
          </div>
        </Container>
      </nav>
    </div>
  );
}
