"use client";

import Image from "next/image";
import { useEffect, useId, useRef, useState, type KeyboardEvent } from "react";

import type { CompanyDocument } from "@/entities/company";
import { ArrowRightIcon, ArrowUpRightIcon, CloseIcon } from "@/shared/ui";

type DocumentGalleryProps = {
  documents: readonly CompanyDocument[];
  title: string;
};

export function DocumentGallery({ documents, title }: DocumentGalleryProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [isZoomed, setIsZoomed] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const titleId = useId();
  const isOpen = activeIndex !== null;
  const activeDocument = activeIndex === null ? undefined : documents[activeIndex];

  useEffect(() => {
    if (!isOpen) return;

    const bodyOverflow = document.body.style.overflow;
    const rootOverflow = document.documentElement.style.overflow;
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = bodyOverflow;
      document.documentElement.style.overflow = rootOverflow;
    };
  }, [isOpen]);

  function selectDocument(index: number) {
    if (!documents[index]) return;
    setActiveIndex(index);
    setIsZoomed(false);
    scrollRef.current?.scrollTo({ top: 0, left: 0 });
  }

  function handleKeyDown(event: KeyboardEvent<HTMLDialogElement>) {
    if (activeIndex === null || isZoomed) return;
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      selectDocument(activeIndex - 1);
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      selectDocument(activeIndex + 1);
    }
  }

  return (
    <>
      <ul className={`grid grid-cols-2 gap-3 sm:gap-4 ${documents.length > 2 ? "sm:grid-cols-4" : "sm:max-w-[360px]"}`}>
        {documents.map((document, index) => (
          <li key={document.src}>
            <button
              type="button"
              aria-label={`Открыть: ${document.alt}`}
              aria-haspopup="dialog"
              className="document-thumbnail group w-full text-left"
              onClick={(event) => {
                triggerRef.current = event.currentTarget;
                selectDocument(index);
                dialogRef.current?.showModal();
                requestAnimationFrame(() => closeRef.current?.focus());
              }}
            >
              <span className="document-paper relative block overflow-hidden rounded-lg border border-border">
                <Image
                  src={document.preview}
                  alt={document.alt}
                  width={document.width}
                  height={document.height}
                  sizes="(min-width: 1024px) 180px, (min-width: 640px) 25vw, 50vw"
                  className="aspect-[1680/2384] h-auto w-full object-contain"
                />
                <span className="document-open absolute right-2 bottom-2 flex size-8 items-center justify-center rounded-full bg-primary text-surface shadow-sm" aria-hidden="true">
                  <ArrowUpRightIcon className="size-4" />
                </span>
              </span>
              <span className="mt-3 flex min-h-6 items-center gap-2 text-xs font-medium text-muted group-hover:text-accent group-focus-visible:text-accent">
                Лист {index + 1}
                <span className="h-px flex-1 bg-border" aria-hidden="true" />
              </span>
            </button>
          </li>
        ))}
      </ul>

      <dialog
        ref={dialogRef}
        aria-labelledby={titleId}
        className="document-dialog"
        onKeyDown={handleKeyDown}
        onClick={(event) => {
          if (event.target === event.currentTarget) dialogRef.current?.close();
        }}
        onClose={() => {
          setActiveIndex(null);
          setIsZoomed(false);
          triggerRef.current?.focus();
        }}
      >
        <div className="flex max-h-[calc(100dvh-24px)] flex-col">
          <div className="flex shrink-0 flex-wrap items-center gap-x-4 gap-y-3 border-b border-border p-4 sm:px-6">
            <h2 id={titleId} className="order-1 min-w-0 flex-1 text-sm font-semibold text-primary sm:text-base">
              {title}
            </h2>
            <div className="order-3 flex basis-full items-center gap-3 sm:order-2 sm:basis-auto">
              <button
                type="button"
                aria-pressed={isZoomed}
                className="document-toolbar-button px-3 text-xs font-semibold"
                onClick={() => setIsZoomed((zoomed) => !zoomed)}
              >
                {isZoomed ? "Уменьшить" : "Увеличить"}
              </button>
              {activeDocument && (
                <a href={activeDocument.src} target="_blank" rel="noopener noreferrer" className="document-toolbar-button gap-2 px-3 text-xs font-semibold">
                  Оригинал <ArrowUpRightIcon className="size-4" />
                </a>
              )}
            </div>
            <button ref={closeRef} type="button" aria-label="Закрыть просмотр" onClick={() => dialogRef.current?.close()} className="document-toolbar-button order-2 ml-auto w-11 sm:order-3">
              <CloseIcon className="size-5" />
            </button>
          </div>

          <div ref={scrollRef} tabIndex={0} aria-label="Просмотр скана документа" className="min-h-0 overflow-auto overscroll-contain bg-background p-3 sm:p-6">
            {activeDocument && (
              <Image
                key={activeDocument.src}
                src={activeDocument.src}
                alt={activeDocument.alt}
                width={activeDocument.width}
                height={activeDocument.height}
                unoptimized
                loading="eager"
                className={`document-paper mx-auto block h-auto ${isZoomed ? "max-w-none" : "w-full"}`}
                style={isZoomed ? { width: activeDocument.width } : undefined}
              />
            )}
          </div>

          <div className="flex shrink-0 items-center justify-between gap-3 border-t border-border px-4 py-3 sm:px-6">
            <button type="button" disabled={activeIndex === null || activeIndex === 0} aria-label="Предыдущий лист" onClick={() => activeIndex !== null && selectDocument(activeIndex - 1)} className="document-toolbar-button w-11">
              <ArrowRightIcon className="size-5 rotate-180" />
            </button>
            <p aria-live="polite" className="text-sm text-muted">
              Лист {(activeIndex ?? 0) + 1} из {documents.length}
            </p>
            <button type="button" disabled={activeIndex === null || activeIndex === documents.length - 1} aria-label="Следующий лист" onClick={() => activeIndex !== null && selectDocument(activeIndex + 1)} className="document-toolbar-button w-11">
              <ArrowRightIcon className="size-5" />
            </button>
          </div>
        </div>
      </dialog>
    </>
  );
}
