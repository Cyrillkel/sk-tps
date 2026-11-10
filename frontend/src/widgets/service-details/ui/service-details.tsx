import Link from "next/link";

import { company } from "@/entities/company";
import { workRegions } from "@/entities/geography";
import { ProjectCard, projectCover, projectsForService } from "@/entities/project";
import { serviceContent, services, type Service } from "@/entities/service";
import { siteUrl } from "@/shared/config";
import { ArrowUpRightIcon, Breadcrumbs, CardCarousel, ChevronDownIcon, Container, ImageWithSkeleton, StructuredData } from "@/shared/ui";

export function ServiceDetails({ service }: { service: Service }) {
  const content = serviceContent[service.slug];
  const completed = projectsForService(service.slug);
  const cover = completed[0] ? projectCover(completed[0]) : undefined;
  const parent = content.parentSlug ? services.find((item) => item.slug === content.parentSlug) : undefined;
  const related = services.filter((item) => content.relatedSlugs.some((slug) => slug === item.slug));

  return (
    <>
      <StructuredData data={{ "@context": "https://schema.org", "@type": "Service", name: service.title, description: content.lead, url: `${siteUrl}/${service.slug}/`, serviceType: service.navigationLabel, provider: { "@type": "Organization", name: company.legalName, url: siteUrl }, areaServed: workRegions.map((region) => ({ "@type": "AdministrativeArea", name: region.name })) }} />
      <section className="detail-hero" aria-labelledby="service-title">
        <Container>
          <Breadcrumbs items={[{ label: "Главная", href: "/" }, { label: "Услуги", href: "/seti" }, ...(parent ? [{ label: parent.navigationLabel, href: `/${parent.slug}` }] : []), { label: service.navigationLabel }]} />
          <div className="detail-hero-grid">
            <div>
              <p className="section-eyebrow">Инженерные и технологические системы</p>
              <h1 id="service-title" className="detail-title">{service.title}</h1>
              <p className="detail-lead">{content.lead}</p>
              <a href="#feedback" className="button-brand mt-7 min-h-14 gap-7 px-7 text-sm">Обсудить задачу <ArrowUpRightIcon className="size-5" /></a>
              <p className="mt-5 max-w-lg text-xs leading-relaxed text-muted">{company.region}. Работаем по готовой проектной документации заказчика.</p>
            </div>
            <div className="detail-hero-photo relative overflow-hidden rounded-2xl bg-service-card">
              <ImageWithSkeleton src={cover?.src ?? content.image} alt={cover?.alt ?? content.imageAlt} fill sizes="(min-width: 1024px) 45vw, 100vw" loading="eager" fetchPriority="high" className="object-cover" skeletonClassName="skeleton-on-dark" />
              <div className="detail-photo-shade" aria-hidden="true" />
              <p className="absolute right-5 bottom-5 left-5 text-sm leading-relaxed font-medium text-service-foreground">{cover ? completed[0]?.title : service.navigationLabel}</p>
            </div>
          </div>
        </Container>
      </section>

      <section className="detail-section" aria-labelledby="service-scope-title">
        <Container>
          <div className="detail-section-heading">
            <h2 id="service-scope-title" className="section-title">Состав работ</h2>
            <div className="max-w-2xl space-y-4 text-sm leading-[1.8] text-muted sm:text-base">{content.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div>
          </div>
          <div className="scope-grid">
            {content.scope.map((section) => (
              <article key={section.title} className="scope-card">
                <h3 className="text-xl font-semibold tracking-tight text-primary">{section.title}</h3>
                <ul className="detail-list mt-5">{section.items.map((item) => <li key={item}>{item}</li>)}</ul>
              </article>
            ))}
          </div>
          <div className="detail-note mt-6">
            <p>Согласуем смету до начала работ. Выполненные работы сдаём по акту.</p>
            <Link href="/#documents" className="inline-flex min-h-11 items-center gap-2 font-semibold text-accent">Допуски и лицензии <ArrowUpRightIcon className="size-4" /></Link>
          </div>
        </Container>
      </section>

      {completed.length > 0 && (
        <section className="detail-section border-t border-border" aria-labelledby="service-projects-title">
          <Container>
            <div className="mb-8 flex flex-wrap items-end justify-between gap-5 sm:mb-10">
              <h2 id="service-projects-title" className="section-title">Выполненные работы</h2>
              <Link href="/proekty" className="text-sm font-semibold text-accent hover:text-accent-hover">Все работы компании →</Link>
            </div>
            <CardCarousel label={`Выполненные работы: ${service.navigationLabel}`} slides={completed.map((project) => ({ key: project.slug, content: <ProjectCard project={project} /> }))} />
          </Container>
        </section>
      )}

      <section className="detail-section border-t border-border" aria-labelledby="service-questions-title">
        <Container>
          <div className="detail-section-heading">
            <h2 id="service-questions-title" className="section-title">Перед началом работ</h2>
            <div className="faq-list">
              {content.questions.map((item) => (
                <details key={item.question} className="faq-item">
                  <summary>{item.question}<ChevronDownIcon className="size-5 shrink-0 text-accent" /></summary>
                  <p>{item.answer}</p>
                </details>
              ))}
            </div>
          </div>
          {related.length > 0 && (
            <div className="mt-10 border-t border-border pt-7">
              <h3 className="mb-4 text-sm font-semibold text-primary">Другие направления и виды работ</h3>
              <ul className="related-services">{related.map((item) => <li key={item.slug}><Link href={`/${item.slug}`}>{item.navigationLabel}<ArrowUpRightIcon className="size-4 shrink-0" /></Link></li>)}</ul>
            </div>
          )}
        </Container>
      </section>
    </>
  );
}
