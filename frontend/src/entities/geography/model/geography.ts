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
      { slug: "kremenki", name: "Кремёнки", inCity: "Кремёнках" },
      { slug: "yukhnov", name: "Юхнов", inCity: "Юхнове" },
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

/** Editorial content for a future city page. A city name alone never creates a route. */
export type CityLandingContent = {
  citySlug: string;
  status: "draft" | "published";
  description: string;
  introduction: readonly string[];
  workConditions: readonly { title: string; description: string }[];
  projectSlugs: readonly string[];
};

/** Publish only after adding actual local information and reviewing it. */
export const cityLandings: readonly CityLandingContent[] = [];
