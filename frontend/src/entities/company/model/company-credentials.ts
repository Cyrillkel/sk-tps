export type CompanyDocument = {
  src: string;
  preview: string;
  alt: string;
  width: number;
  height: number;
  caption?: string;
};

export const companyCredentials = [
  {
    id: "sro",
    label: "СРО",
    title: "Мы являемся членами СРО",
    details: "Ассоциация СРО «ОСКО» · Выписка от 10.07.2025",
    paragraphs: [
      "Членство в саморегулируемой организации подтверждает профессиональную ответственность компании и выполнение работ с соблюдением технических норм.",
      "Выполняем монтаж и ремонт отопления, вентиляции, электроснабжения, водоснабжения и канализации. Несём ответственность перед заказчиками за качество строительно-монтажных работ.",
    ],
    documents: [
      { src: "/documents/sro-1.jpg", preview: "/documents/sro-1-preview.webp", alt: "Выписка из реестра членов СРО, лист 1", width: 1680, height: 2384 },
      { src: "/documents/sro-2.jpg", preview: "/documents/sro-2-preview.webp", alt: "Выписка из реестра членов СРО, лист 2", width: 1680, height: 2384 },
      { src: "/documents/sro-3.jpg", preview: "/documents/sro-3-preview.webp", alt: "Выписка из реестра членов СРО, лист 3", width: 1680, height: 2384 },
      { src: "/documents/sro-4.jpg", preview: "/documents/sro-4-preview.webp", alt: "Выписка из реестра членов СРО, лист 4", width: 1680, height: 2384 },
    ] satisfies readonly CompanyDocument[],
  },
  {
    id: "mchs",
    label: "МЧС",
    title: "Лицензия МЧС",
    details: "№ Л014-00101-40/04600549 от 26.03.2026",
    paragraphs: [
      "Позволяет нам вести деятельность по монтажу, ремонту и обслуживанию систем безопасности.",
      "В лицензии перечислены системы пожаротушения и сигнализации, противопожарного водоснабжения, противодымной вентиляции и другие виды работ.",
    ],
    documents: [
      { src: "/documents/mchs-license-1.jpg", preview: "/documents/mchs-license-1-preview.webp", alt: "Лицензия МЧС, лист 1", width: 1181, height: 1671 },
      { src: "/documents/mchs-license-2.jpg", preview: "/documents/mchs-license-2-preview.webp", alt: "Лицензия МЧС, лист 2", width: 1181, height: 1671 },
    ] satisfies readonly CompanyDocument[],
  },
] as const;
