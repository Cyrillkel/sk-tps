"use client";

import { resetConsent } from "../model/consent-store";

export function CookieSettingsButton({ className }: { className?: string }) {
  return (
    <button type="button" onClick={resetConsent} className={className}>
      Настройки cookie
    </button>
  );
}
