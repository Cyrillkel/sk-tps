"use client";

import { useEffect, useId, useRef, useState } from "react";

import { company } from "@/entities/company";
import { ChatIcon, CloseIcon, MaxIcon, TelegramIcon, WhatsAppIcon } from "@/shared/ui";

const messengers = [
  { href: company.telegram, label: "Telegram", Icon: TelegramIcon, className: "contact-telegram" },
  { href: company.whatsapp, label: "WhatsApp", Icon: WhatsAppIcon, className: "contact-whatsapp" },
  { href: company.max, label: "MAX", Icon: MaxIcon, className: "contact-max" },
] as const;

export function ContactMessengers() {
  const [isOpen, setIsOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const listId = useId();

  useEffect(() => {
    if (!isOpen) return;

    function onPointerDown(event: PointerEvent) {
      if (event.target instanceof Node && !rootRef.current?.contains(event.target)) setIsOpen(false);
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key !== "Escape") return;
      setIsOpen(false);
      buttonRef.current?.focus();
    }

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [isOpen]);

  return (
    <div
      ref={rootRef}
      className="contact-messengers"
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setIsOpen(false);
      }}
    >
      <ul ref={listRef} id={listId} hidden={!isOpen} aria-label="Мессенджеры" className="contact-messengers-list">
        {messengers.map(({ href, label, Icon, className }) => (
          <li key={label}>
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Написать в ${label}`}
              className={`contact-messenger ${className}`}
            >
              <span className="contact-messenger-label">{label}</span>
              <Icon className="size-7" />
            </a>
          </li>
        ))}
      </ul>
      <button
        ref={buttonRef}
        type="button"
        aria-label={isOpen ? "Закрыть мессенджеры" : "Связаться с нами"}
        aria-expanded={isOpen}
        aria-controls={listId}
        className="contact-toggle"
        onClick={() => setIsOpen((open) => !open)}
        onKeyDown={(event) => {
          if (event.key !== "ArrowUp" && event.key !== "ArrowDown") return;
          event.preventDefault();
          setIsOpen(true);
          requestAnimationFrame(() => {
            const links = listRef.current?.querySelectorAll<HTMLAnchorElement>("a");
            (event.key === "ArrowUp" ? links?.[links.length - 1] : links?.[0])?.focus();
          });
        }}
      >
        {isOpen ? <CloseIcon className="size-7" /> : <ChatIcon className="size-7" />}
      </button>
    </div>
  );
}
