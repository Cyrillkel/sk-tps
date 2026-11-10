import importedProjects from "./projects.json";

export type ProjectPhoto = {
  src: string;
  preview: string;
  alt: string;
  width: number;
  height: number;
  previewWidth: number;
  previewHeight: number;
  originalUrl: string;
  isGalleryPhoto: boolean;
  isListingCover: boolean;
};

export type Project = {
  slug: string;
  title: string;
  sourceTitle: string;
  sourceUrl: string;
  category: string;
  description: string;
  paragraphs: readonly string[];
  serviceSlugs: readonly string[];
  citySlug: string | null;
  coverSrc: string;
  photos: readonly ProjectPhoto[];
};

export const projects: readonly Project[] = importedProjects;
export const engineeringProjects = projects.filter((project) => project.category === "engineering");
export const otherProjects = projects.filter((project) => project.category !== "engineering");

export const projectCategoryLabels: Readonly<Record<string, string>> = {
  engineering: "Инженерные системы",
  construction: "Монтаж конструкций",
  renovation: "Реконструкция и ремонт",
};

export function findProject(slug: string) {
  return projects.find((project) => project.slug === slug);
}

export function projectsForService(slug: string) {
  return projects.filter((project) => project.serviceSlugs.includes(slug));
}

export function projectCover(project: Project): ProjectPhoto {
  const photo = project.photos.find((item) => item.src === project.coverSrc) ?? project.photos[0];
  if (!photo) throw new Error(`Project has no photos: ${project.slug}`);
  return photo;
}
