import { kalugaCityLandings } from "./city-content-kaluga";
import { moscowCityLandings } from "./city-content-moscow";
import { tulaCityLandings } from "./city-content-tula";

export const workRegions = [
  {
    slug: "kaluzhskaya-oblast",
    name: "Калужская область",
    label: "Калужская",
    cities: [
      { slug: "kaluga", name: "Калуга", inCity: "Калуге" },
      { slug: "obninsk", name: "Обнинск", inCity: "Обнинске" },
      { slug: "maloyaroslavets", name: "Малоярославец", inCity: "Малоярославце" },
      { slug: "borovsk", name: "Боровск", inCity: "Боровске" },
      { slug: "balabanovo", name: "Балабаново", inCity: "Балабанове" },
      { slug: "zhukov", name: "Жуков", inCity: "Жукове" },
      { slug: "kondrovo", name: "Кондрово", inCity: "Кондрове" },
      { slug: "tarusa", name: "Таруса", inCity: "Тарусе" },
    ],
  },
  {
    slug: "tulskaya-oblast",
    name: "Тульская область",
    label: "Тульская",
    cities: [
      { slug: "tula", name: "Тула", inCity: "Туле" },
      { slug: "aleksin", name: "Алексин", inCity: "Алексине" },
      { slug: "novomoskovsk", name: "Новомосковск", inCity: "Новомосковске" },
      { slug: "yasnogorsk", name: "Ясногорск", inCity: "Ясногорске" },
      { slug: "shchekino", name: "Щёкино", inCity: "Щёкине" },
      { slug: "suvorov", name: "Суворов", inCity: "Суворове" },
      { slug: "donskoy", name: "Донской", inCity: "Донском" },
      { slug: "uzlovaya", name: "Узловая", inCity: "Узловой" },
      { slug: "efremov", name: "Ефремов", inCity: "Ефремове" },
    ],
  },
  {
    slug: "moskovskaya-oblast",
    name: "Московская область",
    label: "Московская",
    cities: [
      { slug: "serpukhov", name: "Серпухов", inCity: "Серпухове" },
      { slug: "naro-fominsk", name: "Наро-Фоминск", inCity: "Наро-Фоминске" },
      { slug: "podolsk", name: "Подольск", inCity: "Подольске" },
      { slug: "chekhov", name: "Чехов", inCity: "Чехове" },
      { slug: "protvino", name: "Протвино", inCity: "Протвине" },
      { slug: "pushchino", name: "Пущино", inCity: "Пущине" },
      { slug: "odintsovo", name: "Одинцово", inCity: "Одинцове" },
      { slug: "mozhaysk", name: "Можайск", inCity: "Можайске" },
      { slug: "aprelevka", name: "Апрелевка", inCity: "Апрелевке" },
      { slug: "troitsk", name: "Троицк", inCity: "Троицке" },
      { slug: "kubinka", name: "Кубинка", inCity: "Кубинке" },
    ],
  },
] as const;

export type WorkRegion = (typeof workRegions)[number];
export type WorkCity = WorkRegion["cities"][number];

export function findCity(slug: string) {
  for (const region of workRegions) {
    const city = region.cities.find((item) => item.slug === slug);
    if (city) return { city, region };
  }
  return undefined;
}

/** City-specific copy and optional, verified local projects. */
export type CityLandingContent = {
  citySlug: string;
  status: "draft" | "published";
  title: string;
  heading: string;
  description: string;
  introduction: readonly string[];
  servicesHeading: string;
  servicesDescription: string;
  conditionsTitle: string;
  workConditions: readonly { title: string; description: string }[];
  questions: readonly { question: string; answer: string }[];
  projectSlugs: readonly string[];
};

export const cityLandings: readonly CityLandingContent[] = [
  ...kalugaCityLandings,
  ...tulaCityLandings,
  ...moscowCityLandings,
];

export const publishedCityLandings = cityLandings.filter((content) => content.status === "published");

export function cityPagePath(slug: string) {
  return `/goroda/${slug}/`;
}

export function findCityLanding(slug: string) {
  return publishedCityLandings.find((content) => content.citySlug === slug);
}
