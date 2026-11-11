"use client";

import { useEffect, useId, useRef, useState, type CSSProperties, type KeyboardEvent, type TouchEvent } from "react";

import { ArrowRightIcon, ArrowUpRightIcon, CloseIcon, ImageWithSkeleton, ZoomInIcon, ZoomOutIcon } from "@/shared/ui";

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
  const [zoomWidth, setZoomWidth] = useState<number | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const mediaRef = useRef<HTMLDivElement>(null);
  const touchStartRef = useRef<{ id: number; x: number; y: number } | null>(null);
  const titleId = useId();
  const isOpen = activeIndex !== null;
  const isZoomed = zoomWidth !== null;
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
    setZoomWidth(null);
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
        className={`document-dialog ${isPhoto ? "photo-dialog" : "document-fullscreen"}`}
        onKeyDown={handleKeyDown}
        onClick={(event) => {
          if (event.target === event.currentTarget) dialogRef.current?.close();
        }}
        onClose={() => {
          setActiveIndex(null);
          setZoomWidth(null);
          touchStartRef.current = null;
          triggerRef.current?.focus();
        }}
      >
        <div className="document-dialog-panel">
          <div className={isPhoto ? "flex shrink-0 flex-wrap items-center gap-x-4 gap-y-3 border-b border-border p-4 sm:px-6" : "document-fullscreen-toolbar"}>
            <h2 id={titleId} title={activeDocument?.caption ?? title} className={isPhoto ? "order-1 line-clamp-2 min-w-0 flex-1 text-sm font-semibold text-primary sm:text-base" : "sr-only"}>
              {activeDocument?.caption ?? title}
            </h2>
            <div className={isPhoto ? "order-3 flex basis-full items-center gap-3 sm:order-2 sm:basis-auto" : "flex items-center gap-2"}>
              <button
                type="button"
                aria-pressed={isZoomed}
                aria-label={isZoomed ? "Уменьшить" : "Увеличить"}
                title={isZoomed ? "Уменьшить" : "Увеличить"}
                className={isPhoto ? "document-toolbar-button px-3 text-xs font-semibold" : "document-toolbar-button document-fullscreen-button"}
                onClick={() => {
                  touchStartRef.current = null;
                  if (isZoomed) {
                    setZoomWidth(null);
                  } else if (activeDocument) {
                    const fittedWidth = mediaRef.current?.getBoundingClientRect().width ?? 0;
                    setZoomWidth(Math.max(activeDocument.width, fittedWidth * 1.5));
                  }
                }}
              >
                {isPhoto ? (isZoomed ? "Уменьшить" : "Увеличить") : isZoomed ? <ZoomOutIcon className="size-5" /> : <ZoomInIcon className="size-5" />}
              </button>
              {activeDocument && (
                <a href={activeDocument.src} target="_blank" rel="noopener noreferrer" aria-label={isPhoto ? "Открыть фото" : "Открыть оригинал документа"} title={isPhoto ? "Открыть фото" : "Открыть оригинал документа"} className={isPhoto ? "document-toolbar-button gap-2 px-3 text-xs font-semibold" : "document-toolbar-button document-fullscreen-button"}>
                  {isPhoto && "Открыть фото"} <ArrowUpRightIcon className={isPhoto ? "size-4" : "size-5"} />
                </a>
              )}
            </div>
            <button ref={closeRef} type="button" aria-label="Закрыть просмотр" title="Закрыть просмотр" onClick={() => dialogRef.current?.close()} className={isPhoto ? "document-toolbar-button order-2 ml-auto w-11 sm:order-3" : "document-toolbar-button document-fullscreen-button"}>
              <CloseIcon className="size-5" />
            </button>
          </div>

          <div
            ref={scrollRef}
            tabIndex={0}
            aria-label={isPhoto ? "Просмотр фотографии объекта" : "Просмотр скана документа"}
            className={`document-viewport min-h-0 overflow-auto overscroll-contain ${isPhoto ? "bg-background p-2 sm:p-3" : "bg-surface"}`}
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
                ref={mediaRef}
                className="document-paper document-media relative mx-auto overflow-hidden"
                style={{
                  "--document-aspect-ratio": activeDocument.width / activeDocument.height,
                  ...(zoomWidth !== null ? { width: zoomWidth } : {}),
                } as CSSProperties}
              >
                <ImageWithSkeleton
                  src={activeDocument.src}
                  alt={activeDocument.alt}
                  width={activeDocument.width}
                  height={activeDocument.height}
                  unoptimized
                  loading="eager"
                  className="document-media-image block h-auto w-full object-contain"
                />
              </div>
            )}
          </div>

          <div className={isPhoto ? "flex shrink-0 items-center justify-between gap-3 border-t border-border px-4 py-3 sm:px-6" : "document-fullscreen-navigation"}>
            <button type="button" disabled={activeIndex === null || documents.length < 2} aria-label={previousLabel} onClick={() => activeIndex !== null && selectDocument(activeIndex - 1)} className={isPhoto ? "document-toolbar-button w-11" : "document-toolbar-button document-fullscreen-button document-fullscreen-previous"}>
              <ArrowRightIcon className="size-5 rotate-180" />
            </button>
            <p aria-live="polite" className={isPhoto ? "text-sm text-muted" : "sr-only"}>
              {itemLabel} {(activeIndex ?? 0) + 1} из {documents.length}
            </p>
            <button type="button" disabled={activeIndex === null || documents.length < 2} aria-label={nextLabel} onClick={() => activeIndex !== null && selectDocument(activeIndex + 1)} className={isPhoto ? "document-toolbar-button w-11" : "document-toolbar-button document-fullscreen-button document-fullscreen-next"}>
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
