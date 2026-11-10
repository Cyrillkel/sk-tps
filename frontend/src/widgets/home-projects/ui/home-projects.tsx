import Link from "next/link";

import { engineeringProjects, ProjectCard } from "@/entities/project";
import { ArrowUpRightIcon, Container } from "@/shared/ui";

export function HomeProjects() {
  return (
    <section id="projects" aria-labelledby="projects-title" className="home-projects detail-section">
      <Container>
        <div className="detail-section-heading">
          <div><p className="section-eyebrow">Практика и результат</p><h2 id="projects-title" className="section-title">Выполненные работы</h2></div>
          <div>
            <p className="max-w-lg text-sm leading-relaxed text-muted sm:text-base">Реальные объекты: наружные сети, водоснабжение, отопление и технологические системы. Посмотрите фотографии выполненных работ.</p>
            <Link href="/proekty" className="mt-4 inline-flex min-h-11 items-center gap-3 text-sm font-semibold text-accent hover:text-accent-hover">Все работы компании <ArrowUpRightIcon className="size-4" /></Link>
          </div>
        </div>
        <div className="project-grid">{engineeringProjects.map((project) => <ProjectCard key={project.slug} project={project} />)}</div>
      </Container>
    </section>
  );
}
