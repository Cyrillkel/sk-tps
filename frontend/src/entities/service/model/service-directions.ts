export type ServiceDirection = {
  slug: string;
  navigationLabel: string;
  title: string;
  overviewLabel: string;
  projectsHref: string;
  projects: readonly { title: string; href: string }[];
};

export const serviceDirections = [
  {
    slug: "stroitelstvo",
    navigationLabel: "Строительство",
    title: "Строительство зданий и сооружений",
    overviewLabel: "О строительстве",
    projectsHref: "https://sk-tps.ru/stroitelstvo",
    projects: [
      { title: "Изготовление и монтаж арочного навеса", href: "https://sk-tps.ru/izgotovlenie_montazh_arochnovo_navesa" },
      { title: "Изготовление и монтаж входной группы", href: "https://sk-tps.ru/izgotovlenie_i_montazh_vhodnoj_gruppy" },
      { title: "Изготовление и монтаж лестницы", href: "https://sk-tps.ru/izgotovlenie_i_montazh_lestnicy" },
      { title: "Изготовление и монтаж навеса 6 × 12 м", href: "https://sk-tps.ru/izgotovlenie_i_montazh_navesa_6_12" },
    ],
  },
  {
    slug: "seti",
    navigationLabel: "Инженерные системы",
    title: "Инженерные и технологические системы",
    overviewLabel: "Об инженерных системах",
    projectsHref: "https://sk-tps.ru/seti",
    projects: [
      { title: "Реконструкция канализации «Ново Пакаджинг ББ»", href: "https://sk-tps.ru/rekonstrukciya_naruzhnoj_kanalizacii" },
      { title: "Реконструкция водопровода КДЦ «Мир»", href: "https://sk-tps.ru/rekonstrukciya_pozharnogo_i_bytovogo_vodoprovoda" },
      { title: "Монтаж тепловой сети «Адитим»", href: "https://sk-tps.ru/montazh_teplovoj_seti" },
      { title: "Реконструкция паропровода Юхнов-1", href: "https://sk-tps.ru/rekonstrukciya_paroprovoda" },
    ],
  },
  {
    slug: "remont",
    navigationLabel: "Реконструкция и ремонт",
    title: "Реконструкция и капитальный ремонт",
    overviewLabel: "О реконструкции и ремонте",
    projectsHref: "https://sk-tps.ru/remont",
    projects: [
      { title: "Устройство фасада УФНС в Малоярославце", href: "https://sk-tps.ru/ustrojstvo_fasada" },
      { title: "Ремонт помещения Боровской администрации", href: "https://sk-tps.ru/remont_pomeshcheniya" },
      { title: "Ремонт АБК «Тосафф Рус»", href: "https://sk-tps.ru/remont_abk" },
      { title: "Ремонт склада после пожара", href: "https://sk-tps.ru/remont_sklada_posle_pozhara" },
    ],
  },
] as const satisfies readonly ServiceDirection[];

export type ServiceDirectionSlug = (typeof serviceDirections)[number]["slug"];
