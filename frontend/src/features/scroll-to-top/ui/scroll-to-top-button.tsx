"use client";

import { useEffect, useState } from "react";

import { scrollToTop } from "@/shared/lib";
import { ArrowUpIcon } from "@/shared/ui";

const showAfter = 600;

export function ScrollToTopButton() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      setIsVisible(window.scrollY > showAfter);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);

  function handleClick() {
    scrollToTop();
    // The button hides at the top, so hand keyboard focus back to the start of the content.
    document.getElementById("main-content")?.focus({ preventScroll: true });
  }

  return (
    <button
      type="button"
      aria-label="Наверх"
      className="scroll-to-top"
      data-visible={isVisible}
      inert={!isVisible}
      onClick={handleClick}
    >
      <ArrowUpIcon className="size-5" />
    </button>
  );
}
