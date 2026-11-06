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
      className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/5 text-muted transition-colors hover:bg-primary/10 hover:text-primary lg:size-10 dark:border dark:border-border dark:bg-surface dark:text-primary dark:hover:bg-background"
    >
      <MoonIcon className="size-4.5 dark:hidden" />
      <SunIcon className="hidden size-4.5 dark:block" />
    </button>
  );
}
