"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, type ReactNode } from "react";

import { services } from "@/entities/service";
import { ChevronDownIcon } from "@/shared/ui";

import { MobileNavigation } from "./mobile-navigation";
import { ServiceLinks } from "./service-links";

type SiteNavigationProps = {
  mobileControls: ReactNode;
  mobileLogo: ReactNode;
};

export function SiteNavigation({ mobileControls, mobileLogo }: SiteNavigationProps) {
  const pathname = usePathname().replace(/\/$/, "") || "/";
  const [servicesOpen, setServicesOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const servicesRef = useRef<HTMLButtonElement>(null);
  const isServicePage = pathname === "/seti" || services.some((service) => pathname === `/${service.slug}`);

  function closeServices() {
    setServicesOpen(false);
  }

  useEffect(() => {
    if (!servicesOpen) return;
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setServicesOpen(false);
        servicesRef.current?.focus();
      }
    }
    function onPointerDown(event: PointerEvent) {
      if (event.target instanceof Node && !menuRef.current?.contains(event.target)) setServicesOpen(false);
    }
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [servicesOpen]);

  return (
    <div className="ml-auto xl:mx-auto">
      <div ref={menuRef} onBlur={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) closeServices(); }} className="hidden xl:block">
        <nav aria-label="Основная навигация">
          <ul className="flex items-center gap-8 text-[13px] font-semibold tracking-[0.045em] text-primary">
            <li><Link href="/" aria-current={pathname === "/" ? "page" : undefined} className="py-4 hover:text-accent">ГЛАВНАЯ</Link></li>
            <li
              className="relative"
              onMouseLeave={(event) => {
                if (!event.currentTarget.contains(document.activeElement)) closeServices();
              }}
              onBlur={(event) => {
                if (!event.currentTarget.contains(event.relatedTarget)) closeServices();
              }}
            >
              <button
                ref={servicesRef}
                type="button"
                aria-expanded={servicesOpen}
                aria-controls="desktop-services"
                onClick={() => setServicesOpen((open) => !open)}
                onKeyDown={(event) => {
                  if (event.key === "ArrowDown") {
                    event.preventDefault();
                    setServicesOpen(true);
                    requestAnimationFrame(() => menuRef.current?.querySelector<HTMLAnchorElement>("#desktop-services a")?.focus());
                  }
                }}
                className={`flex items-center gap-1.5 py-4 hover:text-accent ${isServicePage ? "text-accent" : ""}`}
              >
                УСЛУГИ <ChevronDownIcon className={`size-3.5 transition-transform ${servicesOpen ? "rotate-180" : ""}`} />
              </button>
              <div id="desktop-services" hidden={!servicesOpen} className="absolute top-full left-1/2 w-[620px] -translate-x-1/2 pt-5 font-normal tracking-normal">
                <div className="max-h-[70dvh] overflow-y-auto rounded-xl border border-border bg-surface p-5 shadow-[0_18px_60px_-15px_#17365040]">
                  <p className="mb-3 px-3 text-[10px] font-semibold tracking-[0.12em] text-muted uppercase">Инженерные и технологические системы</p>
                  <ServiceLinks onNavigate={closeServices} />
                </div>
              </div>
            </li>
            <li><Link href="/contacts" aria-current={pathname === "/contacts" ? "page" : undefined} className="py-4 hover:text-accent">КОНТАКТЫ</Link></li>
          </ul>
        </nav>
      </div>
      <MobileNavigation controls={mobileControls} logo={mobileLogo} />
    </div>
  );
}
