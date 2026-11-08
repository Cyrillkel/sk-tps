"use client";

import { useState, type ReactNode } from "react";
import type { Swiper as SwiperInstance } from "swiper";
import { A11y, Keyboard } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

type ServicesSliderProps = {
  slides: readonly { key: string; content: ReactNode; className?: string }[];
  label: string;
};

/**
 * Slider below 768px. From `md` Swiper disables itself and CSS lays the same
 * slides out as a grid (see `.services-slider` in globals.css).
 */
export function ServicesSlider({ slides, label }: ServicesSliderProps) {
  const [swiper, setSwiper] = useState<SwiperInstance | null>(null);
  const [snap, setSnap] = useState({ index: 0, count: slides.length });

  const sync = (instance: SwiperInstance) => {
    setSwiper(instance);
    setSnap({ index: instance.snapIndex, count: instance.snapGrid.length });
  };

  return (
    <div>
      <Swiper
        className="services-slider"
        modules={[A11y, Keyboard]}
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
        onSlideChange={sync}
        onSnapGridLengthChange={sync}
        onResize={sync}
      >
        {slides.map(({ key, content, className = "" }) => (
          <SwiperSlide key={key} className={`services-slide ${className}`}>
            <div className="services-slide-inner">{content}</div>
          </SwiperSlide>
        ))}
      </Swiper>

      <div className="services-pagination md:hidden">
        {Array.from({ length: snap.count }, (_, index) => (
          <button
            key={index}
            type="button"
            className="services-bullet"
            aria-label={`Перейти к слайду ${index + 1}`}
            aria-current={index === snap.index ? "true" : undefined}
            onClick={() => swiper?.slideTo(index)}
          />
        ))}
      </div>
    </div>
  );
}
