import Link from "next/link";

import { ArrowUpRightIcon, ImageWithSkeleton } from "@/shared/ui";

import { projectCategoryLabels, projectCover, type Project } from "../model/projects";

export function ProjectCard({ project }: { project: Project }) {
  const cover = projectCover(project);
  return (
    <article className="project-card">
      <Link href={`/${project.slug}`} className="group block h-full">
        <span className="project-card-photo relative block overflow-hidden">
          <ImageWithSkeleton src={cover.preview} alt={project.title} fill sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw" className="object-cover transition-transform duration-500 group-hover:scale-105" />
          <span className="project-card-open" aria-hidden="true"><ArrowUpRightIcon className="size-5" /></span>
        </span>
        <div className="p-5 sm:p-6">
          <p className="text-[11px] font-semibold tracking-[0.1em] text-accent uppercase">{projectCategoryLabels[project.category]}</p>
          <h3 className="mt-3 text-lg leading-snug font-semibold tracking-tight text-primary group-hover:text-accent sm:text-xl">{project.title}</h3>
          <p className="mt-5 text-xs font-medium text-muted">Смотреть фотографии</p>
        </div>
      </Link>
    </article>
  );
}
