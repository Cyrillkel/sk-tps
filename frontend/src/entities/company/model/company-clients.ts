export type CompanyClient = {
  name: string;
  logo: string;
  width: number;
  height: number;
};

export const companyClients = [
  { name: "Tosaf", logo: "/images/clients/tosaf.webp", width: 185, height: 127 },
  { name: "Inarctica", logo: "/images/clients/inarctica.webp", width: 270, height: 45 },
  { name: "Gabriel-Chemie Group", logo: "/images/clients/gabriel-chemie.webp", width: 250, height: 131 },
  { name: "Росатом", logo: "/images/clients/rosatom.webp", width: 244, height: 64 },
  { name: "Realit", logo: "/images/clients/realit.webp", width: 228, height: 99 },
  { name: "Лукойл", logo: "/images/clients/lukoil.webp", width: 252, height: 76 },
  { name: "Grand Line", logo: "/images/clients/grand-line.webp", width: 245, height: 57 },
  { name: "Трансвок", logo: "/images/clients/transvok.webp", width: 165, height: 105 },
  { name: "ИАТЭ НИЯУ МИФИ", logo: "/images/clients/iate-mephi.webp", width: 208, height: 133 },
  { name: "Федеральная служба охраны Российской Федерации", logo: "/images/clients/fso.webp", width: 214, height: 145 },
  { name: "Группа «ПИК»", logo: "/images/clients/pik.webp", width: 135, height: 139 },
  { name: "РЖД", logo: "/images/clients/rzd.webp", width: 186, height: 91 },
  { name: "Sintec", logo: "/images/clients/sintec.webp", width: 286, height: 155 },
  { name: "Novo Packaging", logo: "/images/clients/novo-packaging.webp", width: 136, height: 143 },
  { name: "Omya", logo: "/images/clients/omya.webp", width: 195, height: 132 },
  { name: "Ниармедик Фарма", logo: "/images/clients/niarmedic.webp", width: 294, height: 50 },
  { name: "Федеральная налоговая служба", logo: "/images/clients/fns.webp", width: 147, height: 152 },
  { name: "Aditim", logo: "/images/clients/aditim.webp", width: 300, height: 74 },
  { name: "Huntsman", logo: "/images/clients/huntsman.webp", width: 260, height: 84 },
  { name: "Элинар", logo: "/images/clients/elinar.webp", width: 288, height: 125 },
] as const satisfies readonly CompanyClient[];
