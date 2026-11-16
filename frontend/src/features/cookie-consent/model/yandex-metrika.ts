type YandexMetrikaTag = ((id: number, method: string, ...args: unknown[]) => void) & {
  a?: unknown[][];
  l?: number;
};

declare global {
  interface Window {
    ym?: YandexMetrikaTag;
  }
}

/** Same as the official snippet: calls are queued until tag.js loads and replays them. */
export function loadYandexMetrika(id: number) {
  if (window.ym) return;

  const ym: YandexMetrikaTag = (...args) => {
    (ym.a ??= []).push(args);
  };
  ym.l = Date.now();
  window.ym = ym;

  const script = document.createElement("script");
  script.async = true;
  script.src = `https://mc.yandex.ru/metrika/tag.js?id=${id}`;
  document.head.append(script);

  // "init" also records the first page view.
  ym(id, "init", { clickmap: true, trackLinks: true, accurateTrackBounce: true });
}

/** Client-side navigation does not reload the page, so each route change is sent as a hit. */
export function sendYandexMetrikaHit(id: number, url: string, referer: string) {
  window.ym?.(id, "hit", url, { referer });
}
