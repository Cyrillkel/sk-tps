"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, type ReactNode } from "react";

import { serviceDirections, services } from "@/entities/service";
import { ChevronDownIcon } from "@/shared/ui";

import { MobileNavigation } from "./mobile-navigation";
import { DirectionLinks } from "./direction-links";

type SiteNavigationProps = {
  mobileControls: ReactNode;
  mobileLogo: ReactNode;
};

export function SiteNavigation({ mobileControls, mobileLogo }: SiteNavigationProps) {
  const pathname = usePathname().replace(/\/$/, "") || "/";
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const menuRef = useRef<HTMLLIElement>(null);
  const servicesButtonRef = useRef<HTMLButtonElement>(null);
  const isServicePage = serviceDirections.some((direction) => pathname === `/${direction.slug}`)
    || services.some((service) => pathname === `/${service.slug}`);

  function closeServices() {
    setIsServicesOpen(false);
  }

  function focusSubmenu() {
    setIsServicesOpen(true);
    requestAnimationFrame(() => menuRef.current?.querySelector<HTMLAnchorElement>("#desktop-services a")?.focus());
  }

  useEffect(() => {
    if (!isServicesOpen) return;
    const desktop = window.matchMedia("(min-width: 1280px)");
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsServicesOpen(false);
        servicesButtonRef.current?.focus();
      }
    }
    function onPointerDown(event: PointerEvent) {
      if (event.target instanceof Node && !menuRef.current?.contains(event.target)) setIsServicesOpen(false);
    }
    function onBreakpointChange() {
      if (!desktop.matches) setIsServicesOpen(false);
    }
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);
    desktop.addEventListener("change", onBreakpointChange);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
      desktop.removeEventListener("change", onBreakpointChange);
    };
  }, [isServicesOpen]);

  return (
    <div className="ml-auto xl:mx-auto">
      <div className="hidden xl:block">
        <nav aria-label="Основная навигация">
          <ul className="flex items-center gap-4 text-xs font-semibold tracking-[0.025em] text-primary uppercase 2xl:gap-5">
            <li><Link href="/" aria-current={pathname === "/" ? "page" : undefined} className="block py-4 hover:text-accent">Главная</Link></li>
            <li
              ref={menuRef}
              className="relative"
              onPointerEnter={(event) => {
                if (event.pointerType === "mouse") setIsServicesOpen(true);
              }}
              onMouseLeave={(event) => {
                if (!event.currentTarget.contains(document.activeElement)) closeServices();
              }}
              onBlur={(event) => {
                if (!event.currentTarget.contains(event.relatedTarget)) closeServices();
              }}
            >
              <button
                ref={servicesButtonRef}
                type="button"
                aria-expanded={isServicesOpen}
                aria-controls="desktop-services"
                onClick={() => setIsServicesOpen((current) => !current)}
                onKeyDown={(event) => {
                  if (event.key === "ArrowDown") {
                    event.preventDefault();
                    focusSubmenu();
                  }
                }}
                className={`flex min-h-12 items-center gap-2 py-4 font-semibold tracking-[inherit] uppercase hover:text-accent ${isServicePage || isServicesOpen ? "text-accent" : ""}`}
              >
                Услуги
                <ChevronDownIcon className={`size-3.5 transition-transform ${isServicesOpen ? "rotate-180" : ""}`} />
              </button>
              <div id="desktop-services" hidden={!isServicesOpen} className="absolute top-full left-1/2 w-80 -translate-x-1/2 pt-7 text-left tracking-normal normal-case">
                <div className="max-h-[calc(100dvh-8rem)] overflow-y-auto overscroll-contain rounded-xl border border-border bg-surface p-2 shadow-[0_18px_60px_-15px_#17365040]">
                  <DirectionLinks pathname={pathname} onNavigate={closeServices} />
                </div>
              </div>
            </li>
            <li><Link href="/#about" className="block py-4 hover:text-accent">О компании</Link></li>
            <li><Link href="/#documents" className="block py-4 hover:text-accent">Документы</Link></li>
            <li><Link href="/contacts" aria-current={pathname === "/contacts" ? "page" : undefined} className="block py-4 hover:text-accent">Контакты</Link></li>
          </ul>
        </nav>
      </div>
      <MobileNavigation controls={mobileControls} logo={mobileLogo} />
    </div>
  );
}
