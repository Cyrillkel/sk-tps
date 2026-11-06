export const navigationServices = [
  {
    slug: "promyshlennye-sistemy",
    navigationLabel: "Промышленные системы",
    title: "Монтаж, ремонт и реконструкция промышленных систем",
    description: "Отопление, водоснабжение и канализация для предприятий и коммерческих объектов.",
    image: "/images/services/industrial.webp",
  },
  {
    slug: "tekhnologicheskie-truboprovody",
    navigationLabel: "Технологические трубопроводы и паропроводы",
    title: "Монтаж, ремонт и реконструкция технологических трубопроводов и паропроводов",
    description: "Паропроводы, пищевые и нержавеющие трубопроводы. От монтажа до ремонта и реконструкции.",
    image: "/images/services/pipelines.webp",
  },
  {
    slug: "elektromontazh",
    navigationLabel: "Электромонтажные работы",
    title: "Электромонтажные работы",
    description: "Электропроводка, линии электропередач, распределительные щиты и освещение.",
    image: "/images/services/electrical.webp",
  },
  {
    slug: "teploizolyaciya",
    navigationLabel: "Теплоизоляционные работы",
    title: "Теплоизоляционные работы",
    description: "Теплоизоляция оборудования и ёмкостей, в том числе с высотным монтажом.",
    image: "/images/services/insulation.webp",
  },
  {
    slug: "servisnoe-obsluzhivanie",
    navigationLabel: "Комплексное сервисное обслуживание",
    title: "Обслуживание инженерных систем",
    description: "Ремонт инженерных сетей и коммуникаций. Техническая поддержка производства.",
    image: "/images/services/maintenance.webp",
  },
  {
    slug: "prochistka-kanalizacii",
    navigationLabel: "Обслуживание инженерных систем канализации",
    title: "Прочистка и обслуживание канализации",
    description: "Прочистка, промывка и устранение засоров. Телеинспекция трубопроводов.",
    image: "/images/services/drainage.webp",
  },
] as const;

export const services = [
  ...navigationServices,
  {
    slug: "otoplenie",
    navigationLabel: "Отопление",
    title: "Монтаж и обслуживание отопления",
  },
  {
    slug: "vodosnabzhenie",
    navigationLabel: "Водоснабжение",
    title: "Монтаж и ремонт водоснабжения",
  },
  {
    slug: "kanalizaciya",
    navigationLabel: "Канализация",
    title: "Монтаж и реконструкция канализации",
  },
  {
    slug: "paroprovody",
    navigationLabel: "Паропроводы",
    title: "Монтаж и реконструкция паропроводов",
  },
  {
    slug: "pishchevye-truboprovody",
    navigationLabel: "Пищевые трубопроводы",
    title: "Монтаж пищевых трубопроводов",
  },
  {
    slug: "nerzhaveyushchie-truboprovody",
    navigationLabel: "Нержавеющие трубопроводы",
    title: "Монтаж нержавеющих трубопроводов",
  },
] as const;
