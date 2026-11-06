export const navigationServices = [
  {
    slug: "promyshlennye-sistemy",
    navigationLabel: "Промышленные системы",
    title: "Монтаж, ремонт и реконструкция промышленных систем",
  },
  {
    slug: "tekhnologicheskie-truboprovody",
    navigationLabel: "Технологические трубопроводы и паропроводы",
    title: "Монтаж, ремонт и реконструкция технологических трубопроводов и паропроводов",
  },
  {
    slug: "elektromontazh",
    navigationLabel: "Электромонтажные работы",
    title: "Электромонтажные работы",
  },
  {
    slug: "teploizolyaciya",
    navigationLabel: "Теплоизоляционные работы",
    title: "Теплоизоляционные работы",
  },
  {
    slug: "servisnoe-obsluzhivanie",
    navigationLabel: "Комплексное сервисное обслуживание",
    title: "Обслуживание инженерных систем",
  },
  {
    slug: "prochistka-kanalizacii",
    navigationLabel: "Обслуживание инженерных систем канализации",
    title: "Прочистка и обслуживание канализации",
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
