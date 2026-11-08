import type { CompanyDocument } from "./company-credentials";

export const companyLetters = [
  { src: "/documents/letters/letter-1.jpg", preview: "/documents/letters/letter-1-preview.webp", alt: "Благодарственное письмо УМВД России по Калужской области", caption: "УМВД России по Калужской области", width: 591, height: 828 },
  { src: "/documents/letters/letter-2.jpg", preview: "/documents/letters/letter-2-preview.webp", alt: "Благодарственное письмо ООО «Инарктика Северо-Запад»", caption: "ООО «Инарктика Северо-Запад»", width: 591, height: 826 },
  { src: "/documents/letters/letter-3.jpg", preview: "/documents/letters/letter-3-preview.webp", alt: "Благодарность ГБУЗ КО «ЦРБ Малоярославецкого района»", caption: "ЦРБ Малоярославецкого района", width: 591, height: 827 },
  { src: "/documents/letters/letter-4.jpg", preview: "/documents/letters/letter-4-preview.webp", alt: "Благодарственное письмо администрации муниципального района «Жуковский район»", caption: "Администрация Жуковского района", width: 591, height: 835 },
  { src: "/documents/letters/letter-5.jpg", preview: "/documents/letters/letter-5-preview.webp", alt: "Благодарственное письмо ООО «ТОСАФ РУС»", caption: "ООО «ТОСАФ РУС»", width: 684, height: 915 },
  { src: "/documents/letters/letter-6.jpg", preview: "/documents/letters/letter-6-preview.webp", alt: "Благодарственное письмо МП «Горэлектросети», г. Обнинск", caption: "МП «Горэлектросети», Обнинск", width: 591, height: 834 },
] as const satisfies readonly CompanyDocument[];
