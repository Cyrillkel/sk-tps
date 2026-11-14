import portfolioPhotos from "./portfolio-photos.json";

/**
 * Works added from the client's own photos (not migrated from sk-tps.ru).
 * Photos: put originals into `frontend/portfolio-sources/<slug>/`, then run
 * `node scripts/prepare-portfolio-images.mjs` — it fills `portfolio-photos.json`.
 */
export type PortfolioEntry = {
  slug: keyof typeof portfolioPhotos;
  title: string;
  category: "engineering" | "construction" | "renovation";
  /** First line of the client's description: what the job was. */
  description: string;
  /** "Выполнили …" lines from the client's description. */
  works: readonly string[];
  serviceSlugs: readonly string[];
  /** Original file name in `portfolio-sources/<slug>/` used as the card cover. */
  cover: string;
};

/** Newest first: these cards open the project carousels. */
export const portfolioEntries: readonly PortfolioEntry[] = [
  {
    slug: "prokladka-kabelnoj-linii-0-4-kv",
    title: "Прокладка кабельной линии 0,4 кВ от ДГУ до щита АВР",
    category: "engineering",
    description: "Выполнение работ по прокладке кабельной линии 0,4 кВ от ДГУ до щита АВР.",
    works: [
      "Выполнили прокладку ПНД-трубы 225 мм методом ГНБ — 72 м.п.",
      "Выполнили прокладку ПНД-трубы 110 мм методом ГНБ — 36 м.п.",
      "Выполнили протяжку кабеля АПвБбШп(г)-1 4×400 (алюминий, сшитый полиэтилен, броня, гибкий).",
      "Выполнили подключение в щитовой и в ДГУ.",
    ],
    serviceSlugs: ["elektromontazh"],
    cover: "photo_2026-11-13_23-05-56.jpg",
  },
];

export { portfolioPhotos };
