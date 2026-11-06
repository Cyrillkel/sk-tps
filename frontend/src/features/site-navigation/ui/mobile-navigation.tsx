"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type ReactNode } from "react";

import { company } from "@/entities/company";
import { ChevronDownIcon, CloseIcon, Container, MaxIcon, MenuIcon, TelegramIcon, WhatsAppIcon } from "@/shared/ui";

import { ServiceLinks } from "./service-links";

export function MobileNavigation({ controls, logo }: { controls: ReactNode; logo: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const servicesRef = useRef<HTMLButtonElement>(null);

  function closeMenu() {
    dialogRef.current?.close();
  }

  function openMenu() {
    dialogRef.current?.showModal();
    setServicesOpen(false);
    setIsOpen(true);
    requestAnimationFrame(() => closeRef.current?.focus());
  }

  useEffect(() => {
    if (!isOpen) return;

    const bodyOverflow = document.body.style.overflow;
    const rootOverflow = document.documentElement.style.overflow;
    const desktop = window.matchMedia("(min-width: 1280px)");
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";

    function handleBreakpoint() {
      if (desktop.matches) dialogRef.current?.close();
    }

    desktop.addEventListener("change", handleBreakpoint);
    return () => {
      document.body.style.overflow = bodyOverflow;
      document.documentElement.style.overflow = rootOverflow;
      desktop.removeEventListener("change", handleBreakpoint);
    };
  }, [isOpen]);

  return (
    <>
      <div className="mobile-header-actions flex items-center gap-2 xl:hidden">
        {controls}
        <button
          ref={buttonRef}
          type="button"
          aria-expanded={isOpen}
          aria-controls="mobile-navigation"
          aria-label="Открыть меню"
          onClick={openMenu}
          className="header-icon-button"
        >
          <MenuIcon />
        </button>
      </div>

      <dialog
        ref={dialogRef}
        id="mobile-navigation"
        aria-label="Мобильное меню"
        className="mobile-menu"
        onClose={() => {
          setIsOpen(false);
          setServicesOpen(false);
          if (!window.matchMedia("(min-width: 1280px)").matches) buttonRef.current?.focus();
        }}
        onCancel={(event) => {
          if (servicesOpen) {
            event.preventDefault();
            setServicesOpen(false);
            servicesRef.current?.focus();
          }
        }}
      >
        <Container className="mobile-menu-toolbar flex shrink-0 items-center justify-between gap-2 border-b border-border">
          <Link href="/" aria-label={`${company.name} — главная`} onClick={closeMenu} className="block shrink-0">{logo}</Link>
          <div className="mobile-header-actions ml-auto flex items-center gap-2">
            {controls}
            <button ref={closeRef} type="button" aria-label="Закрыть меню" onClick={closeMenu} className="header-icon-button"><CloseIcon /></button>
          </div>
        </Container>

        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
          <Container className="flex min-h-full flex-col py-7 sm:py-10">
            <nav aria-label="Мобильная навигация">
              <ul className="space-y-2 text-primary">
                <li><Link href="/" onClick={closeMenu} className="block rounded-lg py-4 text-2xl font-semibold hover:text-accent">Главная</Link></li>
                <li>
                  <button ref={servicesRef} type="button" aria-expanded={servicesOpen} aria-controls="mobile-services" onClick={() => setServicesOpen((open) => !open)} className="flex w-full items-center justify-between rounded-lg py-4 text-2xl font-semibold hover:text-accent">
                    Услуги <ChevronDownIcon className={`size-5 transition-transform ${servicesOpen ? "rotate-180" : ""}`} />
                  </button>
                  <div id="mobile-services" hidden={!servicesOpen} className="mb-4 rounded-lg border border-border bg-background p-2">
                    <ServiceLinks mobile onNavigate={closeMenu} />
                    <Link href="/seti" onClick={closeMenu} className="block border-t border-border px-3 pt-4 pb-3 text-sm font-semibold">Все услуги</Link>
                  </div>
                </li>
                <li><Link href="/contacts" onClick={closeMenu} className="block rounded-lg py-4 text-2xl font-semibold hover:text-accent">Контакты</Link></li>
              </ul>
            </nav>
            <div className="mt-auto pt-10">
              <div className="flex flex-col items-start gap-3 border-t border-border pt-6">
                <a href={company.phoneHref} className="text-xl font-semibold text-primary">{company.phone}</a>
                <a href={`mailto:${company.email}`} className="text-sm text-muted">{company.email}</a>
                <a href={company.whatsapp} target="_blank" rel="noopener noreferrer" className="flex min-h-11 items-center gap-2 text-sm font-semibold text-primary hover:text-accent">
                  <WhatsAppIcon className="size-6" /> Написать в WhatsApp
                </a>
                <a href={company.max} target="_blank" rel="noopener noreferrer" className="flex min-h-11 items-center gap-2 text-sm font-semibold text-primary hover:text-accent">
                  <MaxIcon className="size-6" /> Написать в MAX
                </a>
                <a href={company.telegram} target="_blank" rel="noopener noreferrer" className="flex min-h-11 items-center gap-2 text-sm font-semibold text-primary hover:text-accent">
                  <TelegramIcon className="size-6" /> Написать в Telegram
                </a>
                <p className="mt-2 text-xs text-muted">{company.region}</p>
              </div>
            </div>
          </Container>
        </div>
      </dialog>
    </>
  );
}
