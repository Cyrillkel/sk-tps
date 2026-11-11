"use client";

import { useEffect, useId, useRef, useSyncExternalStore, type KeyboardEvent, type ReactNode } from "react";
import type { Swiper as SwiperInstance } from "swiper";
import { A11y, Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

import { ArrowRightIcon } from "./icons";

type CardCarouselProps = {
  slides: readonly { key: string; content: ReactNode }[];
  label: string;
};

const motionQuery = "(prefers-reduced-motion: reduce)";
const desktopSlidesPerView = 3.3;
const minimumLoopSlides = Math.ceil(desktopSlidesPerView) + 1;

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

/** Cards stay server-rendered; only navigation and dragging run in the client. */
export function CardCarousel({ slides, label }: CardCarouselProps) {
  const id = useId();
  const swiperRef = useRef<SwiperInstance | null>(null);
  const reducedMotion = useSyncExternalStore(subscribeMotion, prefersReducedMotion, serverMotion);
  const canSlide = slides.length > 1;
  const autoplayEnabled = canSlide && !reducedMotion;
  // Swiper needs at least ceil(slidesPerView) + slidesPerGroup items for a seamless loop.
  const cycles = canSlide ? Math.max(1, Math.ceil(minimumLoopSlides / slides.length)) : 1;
  const speed = reducedMotion ? 0 : 1800;

  useEffect(() => {
    const swiper = swiperRef.current;
    if (!swiper || swiper.destroyed) return;
    // Updating Swiper React's autoplay options does not start or stop its timer.
    if (autoplayEnabled) {
      if (!swiper.autoplay.running) swiper.autoplay.start();
    } else {
      swiper.autoplay.stop();
    }
    swiper.wrapperEl.setAttribute("aria-live", autoplayEnabled ? "off" : "polite");
  }, [autoplayEnabled]);

  function move(direction: "previous" | "next") {
    const swiper = swiperRef.current;
    if (!swiper || swiper.destroyed || !canSlide) return;
    const navigationSpeed = reducedMotion ? 0 : 450;
    if (direction === "previous") swiper.slidePrev(navigationSpeed);
    else swiper.slideNext(navigationSpeed);
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
        modules={[A11y, Autoplay]}
        enabled={canSlide}
        loop={canSlide}
        autoplay={{
          enabled: autoplayEnabled,
          delay: 3000,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
          stopOnLastSlide: false,
        }}
        slidesPerView={1.3}
        spaceBetween={12}
        speed={speed}
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
