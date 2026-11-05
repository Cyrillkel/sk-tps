"use client";

import { useSyncExternalStore } from "react";

import { MoonIcon, SunIcon } from "@/shared/ui";

import { getServerTheme, getTheme, setTheme, subscribeTheme } from "../model/theme-store";

export function ThemeToggle() {
  const theme = useSyncExternalStore(subscribeTheme, getTheme, getServerTheme);
  const label = theme === "dark" ? "Включить светлую тему" : "Включить тёмную тему";

  return (
    <button
      type="button"
      aria-label={label}
      aria-pressed={theme === "dark"}
      title={label}
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-border bg-surface text-primary transition-colors hover:bg-background lg:size-10"
    >
      <MoonIcon className="size-4.5 dark:hidden" />
      <SunIcon className="hidden size-4.5 dark:block" />
    </button>
  );
}
