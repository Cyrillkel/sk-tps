import { portfolioEntries, portfolioPhotos } from "./portfolio";
import importedProjects from "./projects.json";

export type ProjectPhoto = {
  src: string;
  preview: string;
  alt: string;
  width: number;
  height: number;
  previewWidth: number;
  previewHeight: number;
  /** Migration fields: set only for photos imported from sk-tps.ru. */
  originalUrl?: string;
  isGalleryPhoto?: boolean;
  isListingCover?: boolean;
};

export type Project = {
  slug: string;
  title: string;
  /** Migration fields: set only for projects imported from sk-tps.ru. */
  sourceTitle?: string;
  sourceUrl?: string;
  category: string;
  description: string;
  paragraphs: readonly string[];
  /** Completed works listed on the project page. */
  works?: readonly string[];
  serviceSlugs: readonly string[];
  citySlug: string | null;
  coverSrc: string;
  photos: readonly ProjectPhoto[];
};

const portfolioProjects: readonly Project[] = portfolioEntries.map((entry) => {
  const photos = portfolioPhotos[entry.slug];
  const cover = photos.find((photo) => photo.file === entry.cover);
  if (!cover) throw new Error(`Portfolio cover not found: ${entry.slug}/${entry.cover}`);
  return {
    slug: entry.slug,
    title: entry.title,
    category: entry.category,
    description: entry.description,
    paragraphs: [],
    works: entry.works,
    serviceSlugs: entry.serviceSlugs,
    citySlug: null,
    coverSrc: cover.src,
    photos: photos.map(({ src, preview, width, height, previewWidth, previewHeight }, index) => ({ src, preview, width, height, previewWidth, previewHeight, alt: `${entry.title} — фото ${index + 1}` })),
  };
});

export const projects: readonly Project[] = [...portfolioProjects, ...importedProjects];
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
