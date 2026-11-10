import type { Metadata } from "next";
import Link from "next/link";

import { findCity, type CityLandingContent } from "@/entities/geography";
import { findProject, ProjectCard, type Project } from "@/entities/project";
import { pageMetadata } from "@/shared/lib";
import { ArrowUpRightIcon, Breadcrumbs, CardCarousel, Container } from "@/shared/ui";
import { HomeFeedback } from "@/widgets/home-feedback";
import { HomeServices } from "@/widgets/home-services";

function cityContext(content: CityLandingContent) {
  const location = findCity(content.citySlug);
  if (!location) throw new Error(`Unknown city: ${content.citySlug}`);
  if (content.status === "published" && (!content.description.trim() || !content.introduction.some((paragraph) => paragraph.trim()) || !content.workConditions.length || content.workConditions.some((condition) => !condition.title.trim() || !condition.description.trim()))) {
    throw new Error(`Add actual local content before publishing ${content.citySlug}`);
  }
  if (content.projectSlugs.some((slug) => !findProject(slug))) throw new Error(`Unknown project on city page: ${content.citySlug}`);
  return location;
}

/** Ready for a future route adapter; no draft city routes are emitted today. */
export function generateCityMetadata(content: CityLandingContent): Metadata {
  const { city } = cityContext(content);
  return {
    ...pageMetadata({ title: `Инженерные системы в ${city.inCity}`, description: content.description, path: `/goroda/${city.slug}/` }),
    robots: { index: content.status === "published", follow: true },
  };
}

export function CityPage({ content }: { content: CityLandingContent }) {
  const { city, region } = cityContext(content);
  const localProjects = content.projectSlugs.map(findProject).filter((project): project is Project => Boolean(project));

  return (
    <>
      <section className="detail-hero" aria-labelledby="city-title">
        <Container>
          <Breadcrumbs items={[{ label: "Главная", href: "/" }, { label: region.name }, { label: city.name }]} />
          <p className="section-eyebrow">{region.name}</p>
          <h1 id="city-title" className="detail-title max-w-4xl">Инженерные и технологические системы <span className="text-accent">в {city.inCity}</span></h1>
          <div className="mt-6 max-w-3xl space-y-4 text-base leading-relaxed text-muted sm:text-lg">{content.introduction.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div>
          <a href="#feedback" className="button-brand mt-7 min-h-14 gap-7 px-7 text-sm">Обсудить объект <ArrowUpRightIcon className="size-5" /></a>
        </Container>
      </section>
      <HomeServices />
      <section className="detail-section border-t border-border" aria-labelledby="city-conditions-title">
        <Container>
          <h2 id="city-conditions-title" className="section-title mb-8">Работа на вашем объекте</h2>
          <div className="scope-grid">{content.workConditions.map((condition) => <article key={condition.title} className="scope-card"><h3 className="text-xl font-semibold text-primary">{condition.title}</h3><p className="mt-4 text-sm leading-relaxed text-muted">{condition.description}</p></article>)}</div>
        </Container>
      </section>
      {localProjects.length > 0 && (
        <section className="detail-section border-t border-border" aria-labelledby="city-projects-title">
          <Container><h2 id="city-projects-title" className="section-title mb-8">Выполненные работы в регионе</h2><CardCarousel label={`Выполненные работы: ${region.name}`} slides={localProjects.map((project) => ({ key: project.slug, content: <ProjectCard project={project} /> }))} /><Link href="/proekty" className="mt-7 inline-flex min-h-11 items-center text-sm font-semibold text-accent">Все выполненные работы →</Link></Container>
        </section>
      )}
      <HomeFeedback />
    </>
  );
}
