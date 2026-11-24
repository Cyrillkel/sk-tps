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
    slug: "remont-vodoprovoda-kb-8-fmba-rossii",
    title: "Ремонт водопровода в ФГБУЗ КБ № 8 ФМБА России",
    category: "engineering",
    description: "Выполнили ремонт системы холодного водоснабжения: горизонтально расположенного трубопровода («лежака») и вводного узла хирургического корпуса.",
    works: [
      "Выполнили замену, покраску и изоляцию трубопровода Ду 76 мм — 180 м.",
      "Выполнили замену запорной арматуры и врезку в действующие стояки от Ду 15 мм до Ду 50 мм — 42 шт.",
      "Выполнили замену узла учёта.",
    ],
    serviceSlugs: ["promyshlennye-sistemy", "vodosnabzhenie"],
    cover: "photo_2026-11-15_08-56-55.jpg",
  },
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
