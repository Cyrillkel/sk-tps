"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

import { loadYandexMetrika, sendYandexMetrikaHit } from "../model/yandex-metrika";

export function YandexMetrika({ id }: { id: number }) {
  const pathname = usePathname();
  const previousUrl = useRef<string | null>(null);

  useEffect(() => {
    const url = window.location.href;
    if (url === previousUrl.current) return;
    if (previousUrl.current === null) loadYandexMetrika(id);
    else sendYandexMetrikaHit(id, url, previousUrl.current);
    previousUrl.current = url;
  }, [id, pathname]);

  return null;
}
