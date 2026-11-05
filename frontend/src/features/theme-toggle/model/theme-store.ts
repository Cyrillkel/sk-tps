import { themeChangeEvent, themeStorageKey } from "@/shared/config";

type Theme = "light" | "dark";

function storedTheme(): Theme | null {
  try {
    const value = localStorage.getItem(themeStorageKey);
    return value === "light" || value === "dark" ? value : null;
  } catch {
    return null;
  }
}

function applyTheme(theme: Theme) {
  document.documentElement.classList.toggle("dark", theme === "dark");
  document.documentElement.style.colorScheme = theme;
  window.dispatchEvent(new Event(themeChangeEvent));
}

export function setTheme(theme: Theme) {
  try {
    localStorage.setItem(themeStorageKey, theme);
  } catch {
    // The switch still works when browser storage is unavailable.
  }
  applyTheme(theme);
}

export function getTheme(): Theme {
  return document.documentElement.classList.contains("dark") ? "dark" : "light";
}

export function getServerTheme(): Theme {
  return "light";
}

export function subscribeTheme(listener: () => void) {
  const system = window.matchMedia("(prefers-color-scheme: dark)");

  function syncTheme() {
    applyTheme(storedTheme() ?? (system.matches ? "dark" : "light"));
  }

  function onStorage(event: StorageEvent) {
    if (event.key === themeStorageKey || event.key === null) syncTheme();
  }

  window.addEventListener(themeChangeEvent, listener);
  window.addEventListener("storage", onStorage);
  system.addEventListener("change", syncTheme);

  return () => {
    window.removeEventListener(themeChangeEvent, listener);
    window.removeEventListener("storage", onStorage);
    system.removeEventListener("change", syncTheme);
  };
}
