import { engineeringProjects, otherProjects, ProjectCard } from "@/entities/project";
import { pageMetadata } from "@/shared/lib";
import { Breadcrumbs, Container } from "@/shared/ui";
import { HomeFeedback } from "@/widgets/home-feedback";

export const metadata = pageMetadata({ title: "Выполненные проекты", description: "Проекты компании «Техпромстрой»: инженерные сети, технологические системы и другие выполненные работы. Фотографии объектов и монтажа.", path: "/proekty/" });

export function ProjectsPage() {
  return (
    <>
      <section className="detail-hero pb-0" aria-labelledby="projects-page-title">
        <Container>
          <Breadcrumbs items={[{ label: "Главная", href: "/" }, { label: "Проекты" }]} />
          <p className="section-eyebrow">Работы компании</p>
          <h1 id="projects-page-title" className="detail-title max-w-4xl">Выполненные проекты</h1>
          <p className="detail-lead max-w-3xl">Объекты, инженерные сети и технологические системы. Посмотрите фотографии монтажа, ремонта и реконструкции.</p>
          <nav aria-label="Разделы проектов" className="mt-7 flex flex-wrap gap-3">
            <a href="#engineering-projects" className="catalog-anchor">Инженерные системы</a>
            <a href="#other-projects" className="catalog-anchor">Другие выполненные работы</a>
          </nav>
        </Container>
      </section>
      <section id="engineering-projects" className="detail-section" aria-labelledby="engineering-projects-title">
        <Container><h2 id="engineering-projects-title" className="section-title mb-8 sm:mb-10">Инженерные системы</h2><div className="project-grid">{engineeringProjects.map((project) => <ProjectCard key={project.slug} project={project} />)}</div></Container>
      </section>
      <section id="other-projects" className="detail-section border-t border-border" aria-labelledby="other-projects-title">
        <Container><h2 id="other-projects-title" className="section-title mb-8 sm:mb-10">Другие выполненные работы</h2><div className="project-grid">{otherProjects.map((project) => <ProjectCard key={project.slug} project={project} />)}</div></Container>
      </section>
      <HomeFeedback />
    </>
  );
}
