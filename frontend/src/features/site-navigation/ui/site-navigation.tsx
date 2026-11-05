"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { company } from "@/entities/company";
import { services } from "@/entities/service";
import { ArrowRightIcon, ChevronDownIcon, CloseIcon, Container, MenuIcon } from "@/shared/ui";

import { ServiceLinks } from "./service-links";

export function SiteNavigation() {
  const pathname = usePathname().replace(/\/$/, "") || "/";
  const [isOpen, setIsOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const desktopServicesRef = useRef<HTMLButtonElement>(null);
  const mobileServicesRef = useRef<HTMLButtonElement>(null);
  const mobileNavRef = useRef<HTMLElement>(null);
  const isServicePage = pathname === "/seti" || services.some((service) => pathname === `/${service.slug}`);

  function closeMenus() {
    setIsOpen(false);
    setServicesOpen(false);
  }

  useEffect(() => {
    if (!isOpen && !servicesOpen) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        if (servicesOpen) {
          setServicesOpen(false);
          const activeRef = mobileNavRef.current?.contains(document.activeElement) ? mobileServicesRef : desktopServicesRef;
          activeRef.current?.focus();
        } else {
          setIsOpen(false);
          buttonRef.current?.focus();
        }
      }
    }

    function handlePointerDown(event: PointerEvent) {
      if (event.target instanceof Node && !menuRef.current?.contains(event.target)) {
        setIsOpen(false);
        setServicesOpen(false);
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("pointerdown", handlePointerDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("pointerdown", handlePointerDown);
    };
  }, [isOpen, servicesOpen]);

  return (
    <div ref={menuRef} onBlur={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) closeMenus(); }} className="order-last lg:order-none lg:mx-auto">
      <nav aria-label="Основная навигация" className="hidden lg:block">
        <ul className="flex items-center gap-6 text-[13px] font-semibold tracking-[0.045em] text-primary xl:gap-8">
          <li><Link href="/" aria-current={pathname === "/" ? "page" : undefined} className="py-4 hover:text-accent">ГЛАВНАЯ</Link></li>
          <li
            className="relative"
            onMouseLeave={(event) => {
              if (!event.currentTarget.contains(document.activeElement)) setServicesOpen(false);
            }}
            onBlur={(event) => {
              if (!event.currentTarget.contains(event.relatedTarget)) setServicesOpen(false);
            }}
          >
            <button
              ref={desktopServicesRef}
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
            <div id="desktop-services" hidden={!servicesOpen} className="absolute top-full left-1/2 w-[620px] -translate-x-1/2 pt-4 font-normal tracking-normal">
              <div className="max-h-[70dvh] overflow-y-auto rounded-xl border border-border bg-surface p-5 shadow-[0_18px_60px_-15px_#17365040]">
                <p className="mb-3 px-3 text-[10px] font-semibold tracking-[0.12em] text-muted uppercase">Инженерные и технологические системы</p>
                <ServiceLinks onNavigate={closeMenus} />
                <Link href="/seti" onClick={closeMenus} className="mt-3 flex items-center justify-between border-t border-border px-3 pt-4 text-sm font-semibold text-primary hover:text-accent">
                  Все услуги <ArrowRightIcon className="size-4" />
                </Link>
              </div>
            </div>
          </li>
          <li><Link href="/contacts" aria-current={pathname === "/contacts" ? "page" : undefined} className="py-4 hover:text-accent">КОНТАКТЫ</Link></li>
        </ul>
      </nav>

      <button
        ref={buttonRef}
        type="button"
        aria-expanded={isOpen}
        aria-controls="mobile-navigation"
        aria-label={isOpen ? "Закрыть меню" : "Открыть меню"}
        onClick={() => {
          setIsOpen((open) => !open);
          setServicesOpen(false);
        }}
        className="flex size-11 items-center justify-center rounded-lg border border-border text-primary transition-colors hover:bg-background lg:hidden"
      >
        {isOpen ? <CloseIcon /> : <MenuIcon />}
      </button>

      <nav
        ref={mobileNavRef}
        id="mobile-navigation"
        aria-label="Мобильная навигация"
        hidden={!isOpen}
        className="absolute top-full left-0 max-h-[calc(100dvh-80px)] w-full overflow-y-auto overscroll-contain border-b border-border bg-surface py-5 shadow-lg lg:hidden"
      >
        <Container>
          <ul className="flex flex-col gap-1 text-primary">
            <li><Link href="/" onClick={closeMenus} className="block rounded-lg px-3 py-3 font-semibold hover:bg-background">Главная</Link></li>
            <li>
              <button ref={mobileServicesRef} type="button" aria-expanded={servicesOpen} aria-controls="mobile-services" onClick={() => setServicesOpen((open) => !open)} className="flex w-full items-center justify-between rounded-lg px-3 py-3 font-semibold hover:bg-background">
                Услуги <ChevronDownIcon className={`size-4 transition-transform ${servicesOpen ? "rotate-180" : ""}`} />
              </button>
              <div id="mobile-services" hidden={!servicesOpen} className="mb-3 rounded-lg bg-background p-2">
                <ServiceLinks mobile onNavigate={closeMenus} />
                <Link href="/seti" onClick={closeMenus} className="block border-t border-border px-3 pt-3 pb-2 text-sm font-semibold">Все услуги</Link>
              </div>
            </li>
            <li><Link href="/contacts" onClick={closeMenus} className="block rounded-lg px-3 py-3 font-semibold hover:bg-background">Контакты</Link></li>
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
