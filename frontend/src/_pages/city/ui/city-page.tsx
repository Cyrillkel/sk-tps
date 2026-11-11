import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { company } from "@/entities/company";
import { cityPagePath, findCity, findCityLanding, publishedCityLandings, type CityLandingContent } from "@/entities/geography";
import { findProject, ProjectCard, type Project } from "@/entities/project";
import { pageMetadata } from "@/shared/lib";
import { Breadcrumbs, CardCarousel, ChevronDownIcon, Container, StructuredData } from "@/shared/ui";
import { HomeAbout } from "@/widgets/home-about";
import { HomeAdvantages } from "@/widgets/home-advantages";
import { HomeClients } from "@/widgets/home-clients";
import { HomeCooperation } from "@/widgets/home-cooperation";
import { HomeCredentials } from "@/widgets/home-credentials";
import { HomeFeedback } from "@/widgets/home-feedback";
import { HomeGeography } from "@/widgets/home-geography";
import { HomeHero } from "@/widgets/home-hero";
import { HomeLetters } from "@/widgets/home-letters";
import { HomeProcess } from "@/widgets/home-process";
import { HomeReviews } from "@/widgets/home-reviews";
import { HomeServices } from "@/widgets/home-services";

type CityRouteProps = { params: Promise<{ city: string }> };

function cityContext(content: CityLandingContent) {
  const location = findCity(content.citySlug);
  if (!location) throw new Error(`Unknown city: ${content.citySlug}`);
  const requiredCopy = [content.title, content.heading, content.description, content.servicesHeading, content.servicesDescription, content.conditionsTitle, ...content.introduction];
  if (content.status === "published" && (requiredCopy.some((text) => !text.trim()) || !content.introduction.length || !content.workConditions.length || content.workConditions.some((condition) => !condition.title.trim() || !condition.description.trim()) || !content.questions.length || content.questions.some((item) => !item.question.trim() || !item.answer.trim()))) {
    throw new Error(`Complete the content before publishing ${content.citySlug}`);
  }
  for (const slug of content.projectSlugs) {
    const project = findProject(slug);
    if (!project || project.citySlug !== content.citySlug) throw new Error(`Unverified local project on city page: ${content.citySlug}/${slug}`);
  }
  return location;
}

export function generateCityMetadata(content: CityLandingContent): Metadata {
  cityContext(content);
  return {
    ...pageMetadata({ title: content.title, description: content.description, path: cityPagePath(content.citySlug), image: "/images/hero.webp" }),
    robots: { index: content.status === "published", follow: true },
  };
}

export function generateCityStaticParams() {
  return publishedCityLandings.map(({ citySlug }) => ({ city: citySlug }));
}

function publishedContent(slug: string) {
  const content = findCityLanding(slug);
  if (!content) notFound();
  return content;
}

export async function generateCityRouteMetadata({ params }: CityRouteProps): Promise<Metadata> {
  const { city } = await params;
  return generateCityMetadata(publishedContent(city));
}

export async function CityRoute({ params }: CityRouteProps) {
  const { city } = await params;
  return <CityPage content={publishedContent(city)} />;
}

export function CityPage({ content }: { content: CityLandingContent }) {
  const { city, region } = cityContext(content);
  const localProjects = content.projectSlugs.map(findProject).filter((project): project is Project => Boolean(project));

  return (
    <>
      <HomeHero
        title={content.heading}
        description={content.introduction[0]}
        location={`Работаем с объектами в ${city.inCity}`}
        actionHref="#feedback"
        breadcrumbs={<Breadcrumbs items={[{ label: "Главная", href: "/" }, { label: "География работ", href: "#geography" }, { label: city.name }]} />}
      />
      <HomeServices heading={content.servicesHeading} description={content.servicesDescription} />
      <section id="city-conditions" className="detail-section border-t border-border" aria-labelledby="city-conditions-title">
        <Container>
          <div className="detail-section-heading">
            <h2 id="city-conditions-title" className="section-title">{content.conditionsTitle}</h2>
            <div className="space-y-4 text-sm leading-relaxed text-muted sm:text-base">
              {content.introduction.slice(1).map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
            </div>
          </div>
          <div className="scope-grid">
            {content.workConditions.map((condition) => <article key={condition.title} className="scope-card"><h3 className="text-xl font-semibold text-primary">{condition.title}</h3><p className="mt-4 text-sm leading-relaxed text-muted">{condition.description}</p></article>)}
          </div>
          <p className="detail-note mt-6">{city.slug === "troitsk" ? "Москва" : region.name}. Выезд и порядок работ согласуем по вашему объекту. Адрес компании: {company.address}.</p>
        </Container>
      </section>
      {localProjects.length > 0 && (
        <section id="city-projects" className="detail-section border-t border-border" aria-labelledby="city-projects-title">
          <Container>
            <h2 id="city-projects-title" className="section-title mb-8">Выполненные работы в {city.inCity}</h2>
            <CardCarousel label={`Выполненные работы в ${city.inCity}`} slides={localProjects.map((project) => ({ key: project.slug, content: <ProjectCard project={project} /> }))} />
            <Link href="/proekty" className="mt-7 inline-flex min-h-11 items-center text-sm font-semibold text-accent">Все выполненные работы →</Link>
          </Container>
        </section>
      )}
      <HomeAbout />
      <HomeCredentials />
      <HomeCooperation />
      <HomeProcess />
      <section id="city-questions" className="detail-section border-t border-border" aria-labelledby="city-questions-title">
        <Container>
          <div className="detail-section-heading">
            <h2 id="city-questions-title" className="section-title">Вопросы о работах в {city.inCity}</h2>
            <div className="faq-list">
              {content.questions.map((item) => <details key={item.question} className="faq-item"><summary>{item.question}<ChevronDownIcon className="size-5 shrink-0 text-accent" /></summary><p>{item.answer}</p></details>)}
            </div>
          </div>
        </Container>
      </section>
      <HomeGeography currentCitySlug={city.slug} />
      <HomeFeedback />
      <HomeAdvantages />
      <HomeLetters />
      <HomeClients />
      <HomeReviews />
      <StructuredData data={{ "@context": "https://schema.org", "@type": "Service", name: content.heading, description: content.description, serviceType: "Монтаж, ремонт и обслуживание инженерных систем", provider: { "@type": "Organization", name: company.legalName, address: company.address }, areaServed: { "@type": "City", name: city.name } }} />
    </>
  );
}
