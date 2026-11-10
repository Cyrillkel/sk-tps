import Link from "next/link";

import { ProjectCard, projectCategoryLabels, projectCover, projects, type Project } from "@/entities/project";
import { services } from "@/entities/service";
import { PhotoGallery } from "@/features/document-gallery";
import { siteUrl } from "@/shared/config";
import { ArrowUpRightIcon, Breadcrumbs, Container, ImageWithSkeleton, StructuredData } from "@/shared/ui";

export function ProjectDetails({ project }: { project: Project }) {
  const cover = projectCover(project);
  const relatedServices = services.filter((service) => project.serviceSlugs.includes(service.slug));
  const moreProjects = projects.filter((item) => item.category === project.category && item.slug !== project.slug).slice(0, 3);

  return (
    <>
      <StructuredData data={{ "@context": "https://schema.org", "@type": "ImageGallery", name: project.title, url: `${siteUrl}/${project.slug}/`, image: project.photos.map((photo) => ({ "@type": "ImageObject", contentUrl: `${siteUrl}${photo.src}`, thumbnailUrl: `${siteUrl}${photo.preview}`, caption: photo.alt, width: photo.width, height: photo.height })) }} />
      <section className="detail-hero" aria-labelledby="project-title">
        <Container>
          <Breadcrumbs items={[{ label: "Главная", href: "/" }, { label: "Проекты", href: "/proekty" }, { label: project.title }]} />
          <div className="detail-hero-grid">
            <div>
              <p className="section-eyebrow">{projectCategoryLabels[project.category]}</p>
              <h1 id="project-title" className="detail-title">{project.title}</h1>
              <p className="detail-lead">{project.description || "Выполненный проект компании «Техпромстрой». Фотографии объекта и проведённых работ."}</p>
              {project.paragraphs.map((paragraph) => <p key={paragraph} className="mt-4 text-sm leading-relaxed text-muted">{paragraph}</p>)}
              <a href="#project-photos" className="button-brand mt-7 min-h-14 gap-7 px-7 text-sm">Фотографии объекта <ArrowUpRightIcon className="size-5" /></a>
              {relatedServices.length > 0 && <ul className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-sm text-accent">{relatedServices.map((service) => <li key={service.slug}><Link href={`/${service.slug}`} className="underline underline-offset-4 hover:text-accent-hover">{service.navigationLabel}</Link></li>)}</ul>}
            </div>
            <div className="detail-hero-photo relative overflow-hidden rounded-2xl bg-service-card">
              <ImageWithSkeleton src={cover.src} alt={project.title} fill sizes="(min-width: 1024px) 45vw, 100vw" loading="eager" fetchPriority="high" className="object-cover" skeletonClassName="skeleton-on-dark" />
            </div>
          </div>
        </Container>
      </section>
      <section id="project-photos" className="detail-section border-t border-border" aria-labelledby="project-photos-title">
        <Container>
          <h2 id="project-photos-title" className="section-title mb-8 sm:mb-10">Фотографии объекта</h2>
          <PhotoGallery images={project.photos.map(({ src, preview, alt, width, height }) => ({ src, preview, alt, width, height }))} title={project.title} />
        </Container>
      </section>
      {moreProjects.length > 0 && (
        <section className="detail-section border-t border-border" aria-labelledby="more-projects-title">
          <Container>
            <div className="mb-8 flex flex-wrap items-end justify-between gap-5 sm:mb-10">
              <h2 id="more-projects-title" className="section-title">Другие проекты</h2>
              <Link href="/proekty" className="text-sm font-semibold text-accent hover:text-accent-hover">Все выполненные работы →</Link>
            </div>
            <div className="project-grid">{moreProjects.map((item) => <ProjectCard key={item.slug} project={item} />)}</div>
          </Container>
        </section>
      )}
    </>
  );
}
