"use client";

import { useEffect, useId, useRef, useState, type KeyboardEvent, type TouchEvent } from "react";

import { ArrowRightIcon, ArrowUpRightIcon, CloseIcon, ImageWithSkeleton } from "@/shared/ui";

export type GalleryImage = {
  src: string;
  preview: string;
  alt: string;
  width: number;
  height: number;
  caption?: string;
};

type DocumentGalleryProps = {
  documents: readonly GalleryImage[];
  title: string;
  itemLabel?: string;
  variant?: "document" | "photo";
};

function gridColumns(count: number) {
  if (count > 4) return "sm:grid-cols-3 lg:grid-cols-6";
  if (count > 2) return "sm:grid-cols-4";
  return "sm:max-w-[360px]";
}

export function DocumentGallery({ documents, title, itemLabel = "Лист", variant = "document" }: DocumentGalleryProps) {
  const isPhoto = variant === "photo";
  const previousLabel = isPhoto ? "Предыдущее фото" : "Предыдущий документ";
  const nextLabel = isPhoto ? "Следующее фото" : "Следующий документ";
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [isZoomed, setIsZoomed] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const touchStartRef = useRef<{ id: number; x: number; y: number } | null>(null);
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
    if (!documents.length) return;
    setActiveIndex((index + documents.length) % documents.length);
    setIsZoomed(false);
    touchStartRef.current = null;
    scrollRef.current?.scrollTo({ top: 0, left: 0 });
  }

  function handleTouchStart(event: TouchEvent<HTMLDivElement>) {
    const touch = event.touches[0];
    touchStartRef.current = !isZoomed && event.touches.length === 1 && touch
      ? { id: touch.identifier, x: touch.clientX, y: touch.clientY }
      : null;
  }

  function handleTouchEnd(event: TouchEvent<HTMLDivElement>) {
    const start = touchStartRef.current;
    touchStartRef.current = null;
    if (!start || isZoomed || activeIndex === null || event.touches.length) return;

    const touch = Array.from(event.changedTouches).find((item) => item.identifier === start.id);
    if (!touch) return;
    const deltaX = touch.clientX - start.x;
    const deltaY = touch.clientY - start.y;
    if (Math.abs(deltaX) < 50 || Math.abs(deltaX) < Math.abs(deltaY) * 1.5) return;
    selectDocument(activeIndex + (deltaX < 0 ? 1 : -1));
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
      <ul className={`grid gap-3 sm:gap-4 ${isPhoto ? "project-photo-grid grid-cols-2 lg:grid-cols-3" : `grid-cols-2 ${gridColumns(documents.length)}`}`}>
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
                <ImageWithSkeleton
                  src={document.preview}
                  alt={document.alt}
                  width={document.width}
                  height={document.height}
                  sizes={isPhoto ? "(min-width: 1024px) 33vw, 50vw" : "(min-width: 1024px) 180px, (min-width: 640px) 25vw, 50vw"}
                  className={isPhoto ? "aspect-[4/3] h-auto w-full object-cover" : "aspect-[1680/2384] h-auto w-full object-contain"}
                />
                <span className="document-open absolute right-2 bottom-2 flex size-8 items-center justify-center rounded-full bg-primary text-surface shadow-sm" aria-hidden="true">
                  <ArrowUpRightIcon className="size-4" />
                </span>
              </span>
              {document.caption ? (
                <span className="mt-3 block border-l-2 border-border pl-2.5 text-xs leading-snug font-medium text-muted group-hover:border-accent group-hover:text-accent group-focus-visible:border-accent group-focus-visible:text-accent">
                  {document.caption}
                </span>
              ) : !isPhoto && (
                <span className="mt-3 flex min-h-6 items-center gap-2 text-xs font-medium text-muted group-hover:text-accent group-focus-visible:text-accent">
                  {itemLabel} {index + 1}
                  <span className="h-px flex-1 bg-border" aria-hidden="true" />
                </span>
              )}
            </button>
          </li>
        ))}
      </ul>

      <dialog
        ref={dialogRef}
        aria-labelledby={titleId}
        className={`document-dialog ${isPhoto ? "photo-dialog" : ""}`}
        onKeyDown={handleKeyDown}
        onClick={(event) => {
          if (event.target === event.currentTarget) dialogRef.current?.close();
        }}
        onClose={() => {
          setActiveIndex(null);
          setIsZoomed(false);
          touchStartRef.current = null;
          triggerRef.current?.focus();
        }}
      >
        <div className="flex max-h-[calc(100dvh-24px)] flex-col">
          <div className="flex shrink-0 flex-wrap items-center gap-x-4 gap-y-3 border-b border-border p-4 sm:px-6">
            <h2 id={titleId} className="order-1 min-w-0 flex-1 text-sm font-semibold text-primary sm:text-base">
              {activeDocument?.caption ?? title}
            </h2>
            <div className="order-3 flex basis-full items-center gap-3 sm:order-2 sm:basis-auto">
              <button
                type="button"
                aria-pressed={isZoomed}
                className="document-toolbar-button px-3 text-xs font-semibold"
                onClick={() => {
                  touchStartRef.current = null;
                  setIsZoomed((zoomed) => !zoomed);
                }}
              >
                {isZoomed ? "Уменьшить" : "Увеличить"}
              </button>
              {activeDocument && (
                <a href={activeDocument.src} target="_blank" rel="noopener noreferrer" className="document-toolbar-button gap-2 px-3 text-xs font-semibold">
                  {isPhoto ? "Открыть фото" : "Оригинал"} <ArrowUpRightIcon className="size-4" />
                </a>
              )}
            </div>
            <button ref={closeRef} type="button" aria-label="Закрыть просмотр" onClick={() => dialogRef.current?.close()} className="document-toolbar-button order-2 ml-auto w-11 sm:order-3">
              <CloseIcon className="size-5" />
            </button>
          </div>

          <div
            ref={scrollRef}
            tabIndex={0}
            aria-label={isPhoto ? "Просмотр фотографии проекта" : "Просмотр скана документа"}
            className="document-viewport min-h-0 overflow-auto overscroll-contain bg-background p-3 sm:p-6"
            data-zoomed={isZoomed}
            onTouchStart={handleTouchStart}
            onTouchMove={(event) => {
              if (event.touches.length !== 1) touchStartRef.current = null;
            }}
            onTouchEnd={handleTouchEnd}
            onTouchCancel={() => { touchStartRef.current = null; }}
          >
            {activeDocument && (
              <div
                key={activeDocument.src}
                className={`document-paper ${isPhoto ? "photo-media" : ""} relative mx-auto overflow-hidden ${isZoomed ? "max-w-none" : "w-full"}`}
                style={isZoomed ? { width: activeDocument.width } : undefined}
              >
                <ImageWithSkeleton
                  src={activeDocument.src}
                  alt={activeDocument.alt}
                  width={activeDocument.width}
                  height={activeDocument.height}
                  unoptimized
                  loading="eager"
                  className="block h-auto w-full"
                />
              </div>
            )}
          </div>

          <div className="flex shrink-0 items-center justify-between gap-3 border-t border-border px-4 py-3 sm:px-6">
            <button type="button" disabled={activeIndex === null || documents.length < 2} aria-label={previousLabel} onClick={() => activeIndex !== null && selectDocument(activeIndex - 1)} className="document-toolbar-button w-11">
              <ArrowRightIcon className="size-5 rotate-180" />
            </button>
            <p aria-live="polite" className="text-sm text-muted">
              {itemLabel} {(activeIndex ?? 0) + 1} из {documents.length}
            </p>
            <button type="button" disabled={activeIndex === null || documents.length < 2} aria-label={nextLabel} onClick={() => activeIndex !== null && selectDocument(activeIndex + 1)} className="document-toolbar-button w-11">
              <ArrowRightIcon className="size-5" />
            </button>
          </div>
        </div>
      </dialog>
    </>
  );
}

export function PhotoGallery({ images, title }: { images: readonly GalleryImage[]; title: string }) {
  return <DocumentGallery documents={images} title={title} itemLabel="Фото" variant="photo" />;
}
