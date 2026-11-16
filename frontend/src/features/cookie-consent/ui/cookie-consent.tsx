"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";

import { company } from "@/entities/company";
import { yandexMetrikaId } from "@/shared/config";

import { getConsent, getServerConsent, setConsent, subscribeConsent } from "../model/consent-store";
import { YandexMetrika } from "./yandex-metrika";

export function CookieConsent() {
  const consent = useSyncExternalStore(subscribeConsent, getConsent, getServerConsent);

  if (consent === "all") return yandexMetrikaId ? <YandexMetrika id={yandexMetrikaId} /> : null;
  if (consent !== "unset") return null;

  return (
    <section aria-label="Использование файлов cookie" className="cookie-consent">
      <p className="text-sm leading-relaxed text-muted">
        Сайт использует файлы cookie: необходимые — для работы сайта и сервисов Яндекса, аналитические (Яндекс Метрика) — только с
        вашего согласия. Подробнее — в{" "}
        <Link href={company.privacyPolicyUrl} className="font-medium text-accent underline underline-offset-2 hover:text-accent-hover">
          политике обработки персональных данных
        </Link>
        .
      </p>
      <div className="flex flex-wrap gap-3">
        <button type="button" onClick={() => setConsent("all")} className="button-brand min-h-11 px-6 text-sm">
          Принять
        </button>
        <button
          type="button"
          onClick={() => setConsent("necessary")}
          className="inline-flex min-h-11 items-center justify-center rounded-[1.1rem] border border-border px-5 text-sm font-semibold text-primary transition-colors hover:border-accent hover:text-accent"
        >
          Только необходимые
        </button>
      </div>
    </section>
  );
}
