"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, type ReactNode } from "react";

import { serviceDirections, services, type ServiceDirectionSlug } from "@/entities/service";
import { ChevronDownIcon } from "@/shared/ui";

import { MobileNavigation } from "./mobile-navigation";
import { DirectionLinks } from "./direction-links";

type SiteNavigationProps = {
  mobileControls: ReactNode;
  mobileLogo: ReactNode;
};

export function SiteNavigation({ mobileControls, mobileLogo }: SiteNavigationProps) {
  const pathname = usePathname().replace(/\/$/, "") || "/";
  const [openDirection, setOpenDirection] = useState<ServiceDirectionSlug | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonsRef = useRef<Partial<Record<ServiceDirectionSlug, HTMLButtonElement | null>>>({});
  const activeDirection = serviceDirections.find((direction) => pathname === `/${direction.slug}`)?.slug
    ?? (services.some((service) => pathname === `/${service.slug}`) ? "seti" : null);

  function closeDirection() {
    setOpenDirection(null);
  }

  function focusSubmenu(slug: ServiceDirectionSlug) {
    setOpenDirection(slug);
    requestAnimationFrame(() => menuRef.current?.querySelector<HTMLAnchorElement>(`#desktop-${slug} a`)?.focus());
  }

  useEffect(() => {
    if (!openDirection) return;
    const desktop = window.matchMedia("(min-width: 1280px)");
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpenDirection(null);
        if (openDirection) buttonsRef.current[openDirection]?.focus();
      }
    }
    function onPointerDown(event: PointerEvent) {
      if (event.target instanceof Node && !menuRef.current?.contains(event.target)) setOpenDirection(null);
    }
    function onBreakpointChange() {
      if (!desktop.matches) setOpenDirection(null);
    }
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);
    desktop.addEventListener("change", onBreakpointChange);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
      desktop.removeEventListener("change", onBreakpointChange);
    };
  }, [openDirection]);

  return (
    <div className="ml-auto xl:mx-auto">
      <div
        ref={menuRef}
        onBlur={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) closeDirection(); }}
        onMouseLeave={(event) => {
          if (!event.currentTarget.contains(document.activeElement)) closeDirection();
        }}
        className="hidden xl:block"
      >
        <nav aria-label="Основная навигация">
          <ul className="grid grid-cols-[repeat(3,auto)] items-center gap-x-4 text-xs font-semibold tracking-[0.025em] text-primary uppercase 2xl:gap-x-5 min-[1920px]:flex">
            <li className="hidden min-[1920px]:block"><Link href="/" aria-current={pathname === "/" ? "page" : undefined} className="block py-4 hover:text-accent">Главная</Link></li>
            {serviceDirections.map((direction) => (
              <li
                key={direction.slug}
                className="relative"
                onPointerEnter={(event) => {
                  if (event.pointerType === "mouse") setOpenDirection(direction.slug);
                }}
                onBlur={(event) => {
                  if (!event.currentTarget.contains(event.relatedTarget)) closeDirection();
                }}
              >
                <div className={`flex items-center gap-1 ${activeDirection === direction.slug ? "text-accent" : ""}`}>
                  <Link
                    href={`/${direction.slug}`}
                    aria-current={pathname === `/${direction.slug}` ? "page" : undefined}
                    onClick={closeDirection}
                    onKeyDown={(event) => {
                      if (event.key === "ArrowDown") {
                        event.preventDefault();
                        focusSubmenu(direction.slug);
                      }
                    }}
                    className="max-w-36 py-1.5 leading-snug hover:text-accent min-[1920px]:py-4"
                  >
                    {direction.navigationLabel}
                  </Link>
                  <button
                    ref={(element) => { buttonsRef.current[direction.slug] = element; }}
                    type="button"
                    aria-label={`Подменю: ${direction.navigationLabel}`}
                    aria-expanded={openDirection === direction.slug}
                    aria-controls={`desktop-${direction.slug}`}
                    onClick={() => setOpenDirection((current) => current === direction.slug ? null : direction.slug)}
                    onKeyDown={(event) => {
                      if (event.key === "ArrowDown") {
                        event.preventDefault();
                        focusSubmenu(direction.slug);
                      }
                    }}
                    className="flex min-h-11 w-6 shrink-0 items-center justify-center hover:text-accent"
                  >
                    <ChevronDownIcon className={`size-3.5 transition-transform ${openDirection === direction.slug ? "rotate-180" : ""}`} />
                  </button>
                </div>
                <div id={`desktop-${direction.slug}`} hidden={openDirection !== direction.slug} className={`absolute top-[calc(100%+1.75rem)] left-1/2 -translate-x-1/2 pt-4 text-left font-normal tracking-normal normal-case min-[1920px]:top-full min-[1920px]:pt-7 ${direction.slug === "seti" ? "w-[680px]" : "w-[400px]"}`}>
                  <div className="max-h-[calc(100dvh-8rem)] overflow-y-auto overscroll-contain rounded-xl border border-border bg-surface p-4 shadow-[0_18px_60px_-15px_#17365040] sm:p-5">
                    <DirectionLinks direction={direction} onNavigate={closeDirection} />
                  </div>
                </div>
              </li>
            ))}
            <li><Link href="/#about" onClick={closeDirection} className="block py-1.5 hover:text-accent min-[1920px]:py-4">О компании</Link></li>
            <li><Link href="/#documents" onClick={closeDirection} className="block py-1.5 hover:text-accent min-[1920px]:py-4">Документы</Link></li>
            <li><Link href="/contacts" aria-current={pathname === "/contacts" ? "page" : undefined} className="block py-1.5 hover:text-accent min-[1920px]:py-4">Контакты</Link></li>
          </ul>
        </nav>
      </div>
      <MobileNavigation controls={mobileControls} logo={mobileLogo} />
    </div>
  );
}
