"use client";

import { useState, useSyncExternalStore, type ReactNode } from "react";
import type { Swiper as SwiperInstance } from "swiper";
import { A11y, Keyboard } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

type ServicesSliderProps = {
  slides: readonly { key: string; content: ReactNode; className?: string }[];
  label: string;
};

const mobileQuery = "(max-width: 767px)";

function subscribeViewport(listener: () => void) {
  const viewport = window.matchMedia(mobileQuery);
  viewport.addEventListener("change", listener);
  return () => viewport.removeEventListener("change", listener);
}

function isMobileViewport() {
  return window.matchMedia(mobileQuery).matches;
}

function serverViewport() {
  return false;
}

/** Recreate Swiper at the breakpoint so loop's DOM order never reaches the desktop grid. */
export function ServicesSlider({ slides, label }: ServicesSliderProps) {
  const isMobile = useSyncExternalStore(subscribeViewport, isMobileViewport, serverViewport);
  const [swiper, setSwiper] = useState<SwiperInstance | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const sync = (instance: SwiperInstance) => {
    setSwiper(instance);
    setActiveIndex(instance.realIndex);
  };

  return (
    <div>
      <Swiper
        key={isMobile ? "mobile" : "desktop"}
        className="services-slider"
        modules={[A11y, Keyboard]}
        enabled={isMobile}
        loop={isMobile && slides.length > 1}
        slidesPerView="auto"
        spaceBetween={12}
        slidesOffsetBefore={20}
        slidesOffsetAfter={20}
        speed={450}
        grabCursor
        watchSlidesProgress
        keyboard={{ enabled: true, onlyInViewport: true }}
        breakpoints={{
          640: { spaceBetween: 16, slidesOffsetBefore: 32, slidesOffsetAfter: 32 },
          768: { enabled: false },
        }}
        a11y={{
          containerMessage: label,
          containerRoleDescriptionMessage: "карусель",
          itemRoleDescriptionMessage: "слайд",
          slideLabelMessage: "{{index}} из {{slidesLength}}",
          firstSlideMessage: "Это первый слайд",
          lastSlideMessage: "Это последний слайд",
        }}
        onAfterInit={sync}
        onRealIndexChange={sync}
        onResize={sync}
      >
        {slides.map(({ key, content, className = "" }) => (
          <SwiperSlide key={key} className={`services-slide ${className}`}>
            <div className="services-slide-inner">{content}</div>
          </SwiperSlide>
        ))}
      </Swiper>

      <div className="services-pagination md:hidden">
        {slides.map(({ key }, index) => (
          <button
            key={key}
            type="button"
            className="services-bullet"
            aria-label={`Перейти к слайду ${index + 1}`}
            aria-current={index === activeIndex ? "true" : undefined}
            onClick={() => swiper?.slideToLoop(index)}
          />
        ))}
      </div>
    </div>
  );
}
