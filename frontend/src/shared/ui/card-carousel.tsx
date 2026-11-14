"use client";

import { useEffect, useId, useRef, useSyncExternalStore, type KeyboardEvent, type ReactNode } from "react";
import type { Swiper as SwiperInstance } from "swiper";
import { A11y } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

import { ArrowRightIcon } from "./icons";

type CardCarouselProps = {
  slides: readonly { key: string; content: ReactNode }[];
  label: string;
};

const motionQuery = "(prefers-reduced-motion: reduce)";
const desktopSlidesPerView = 3.3;
const minimumLoopSlides = Math.ceil(desktopSlidesPerView) + 1;
/** Swipes and arrows: a short ease-out settle, so the card follows the finger. */
const interactionSpeed = 350;
/** Autoplay: a slow ease-in-out glide between pauses. */
const autoplaySpeed = 1800;
const autoplayDelay = 3000;
const autoplayClass = "is-autoplaying";

function subscribeMotion(listener: () => void) {
  const media = window.matchMedia(motionQuery);
  media.addEventListener("change", listener);
  return () => media.removeEventListener("change", listener);
}

function prefersReducedMotion() {
  return window.matchMedia(motionQuery).matches;
}

function serverMotion() {
  return false;
}

/**
 * Autoplay runs here rather than in Swiper's module: the module reuses `speed`
 * for touch release, which made swipes settle as slowly as the autoplay glide.
 * It pauses while the card is touched or hovered, off screen and in hidden tabs.
 */
function startAutoplay(swiper: SwiperInstance) {
  const root = swiper.el;
  let timer: number | undefined;
  let touching = false;
  let hovered = false;
  let visible = false;

  const stopGlide = () => root.classList.remove(autoplayClass);
  const clear = () => window.clearTimeout(timer);
  const schedule = () => {
    clear();
    if (touching || hovered || !visible || document.hidden) return;
    timer = window.setTimeout(() => {
      if (swiper.destroyed || swiper.animating) return schedule();
      root.classList.add(autoplayClass);
      swiper.slideNext(autoplaySpeed);
    }, autoplayDelay);
  };
  const onTouchStart = () => { touching = true; stopGlide(); clear(); };
  const onTouchEnd = () => { touching = false; schedule(); };
  const onTransitionEnd = () => { stopGlide(); schedule(); };
  const onPointerEnter = (event: PointerEvent) => { if (event.pointerType === "mouse") { hovered = true; clear(); } };
  const onPointerLeave = (event: PointerEvent) => { if (event.pointerType === "mouse") { hovered = false; schedule(); } };
  const observer = new IntersectionObserver(([entry]) => { visible = Boolean(entry?.isIntersecting); schedule(); });

  swiper.on("touchStart", onTouchStart);
  swiper.on("touchEnd", onTouchEnd);
  swiper.on("transitionEnd", onTransitionEnd);
  root.addEventListener("pointerenter", onPointerEnter);
  root.addEventListener("pointerleave", onPointerLeave);
  document.addEventListener("visibilitychange", schedule);
  observer.observe(root);

  return () => {
    clear();
    stopGlide();
    observer.disconnect();
    document.removeEventListener("visibilitychange", schedule);
    root.removeEventListener("pointerenter", onPointerEnter);
    root.removeEventListener("pointerleave", onPointerLeave);
    if (swiper.destroyed) return;
    swiper.off("touchStart", onTouchStart);
    swiper.off("touchEnd", onTouchEnd);
    swiper.off("transitionEnd", onTransitionEnd);
  };
}

/** Cards stay server-rendered; only navigation and dragging run in the client. */
export function CardCarousel({ slides, label }: CardCarouselProps) {
  const id = useId();
  const swiperRef = useRef<SwiperInstance | null>(null);
  const reducedMotion = useSyncExternalStore(subscribeMotion, prefersReducedMotion, serverMotion);
  const canSlide = slides.length > 1;
  const autoplayEnabled = canSlide && !reducedMotion;
  // Swiper needs at least ceil(slidesPerView) + slidesPerGroup items for a seamless loop.
  const cycles = canSlide ? Math.max(1, Math.ceil(minimumLoopSlides / slides.length)) : 1;
  const speed = reducedMotion ? 0 : interactionSpeed;

  useEffect(() => {
    const swiper = swiperRef.current;
    if (!swiper || swiper.destroyed) return;
    swiper.wrapperEl.setAttribute("aria-live", autoplayEnabled ? "off" : "polite");
    if (!autoplayEnabled) return;
    return startAutoplay(swiper);
  }, [autoplayEnabled]);

  function move(direction: "previous" | "next") {
    const swiper = swiperRef.current;
    if (!swiper || swiper.destroyed || !canSlide) return;
    swiper.el.classList.remove(autoplayClass);
    if (direction === "previous") swiper.slidePrev(speed);
    else swiper.slideNext(speed);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (!canSlide || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
    if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
      event.preventDefault();
      event.stopPropagation();
      move(event.key === "ArrowLeft" ? "previous" : "next");
    }
  }

  if (!slides.length) return null;

  return (
    <div className="card-carousel" onKeyDown={handleKeyDown}>
      <Swiper
        key={canSlide ? "multiple" : "single"}
        id={id}
        className="card-carousel-track"
        modules={[A11y]}
        enabled={canSlide}
        loop={canSlide}
        slidesPerView={1.3}
        spaceBetween={12}
        speed={speed}
        // A short flick or a quarter-card drag is enough to change the card.
        longSwipesRatio={0.25}
        grabCursor={canSlide}
        watchSlidesProgress
        breakpoints={{
          768: { slidesPerView: 2.3, spaceBetween: 20 },
          1024: { slidesPerView: desktopSlidesPerView, spaceBetween: 20 },
        }}
        a11y={{
          containerMessage: label,
          containerRole: "region",
          containerRoleDescriptionMessage: "карусель",
          itemRoleDescriptionMessage: "карточка",
          slideLabelMessage: "",
        }}
        onSwiper={(swiper) => { swiperRef.current = swiper; }}
      >
        {Array.from({ length: cycles }, (_, cycle) => slides.map(({ key, content }, index) => (
          <SwiperSlide key={`${key}-${cycle}`} aria-label={`${index + 1} из ${slides.length}`}>
            {content}
          </SwiperSlide>
        )))}
        {canSlide && (
          <div slot="container-end" className="card-carousel-controls">
            <button type="button" className="card-carousel-button card-carousel-previous" aria-label="Предыдущая карточка" aria-controls={id} onClick={() => move("previous")}>
              <ArrowRightIcon className="size-5 rotate-180" />
            </button>
            <button type="button" className="card-carousel-button card-carousel-next" aria-label="Следующая карточка" aria-controls={id} onClick={() => move("next")}>
              <ArrowRightIcon className="size-5" />
            </button>
          </div>
        )}
      </Swiper>
    </div>
  );
}
