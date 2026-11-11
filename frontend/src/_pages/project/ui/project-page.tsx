import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { findProject, projectCover, projects } from "@/entities/project";
import { pageMetadata } from "@/shared/lib";
import { HomeAdvantages } from "@/widgets/home-advantages";
import { HomeClients } from "@/widgets/home-clients";
import { HomeCooperation } from "@/widgets/home-cooperation";
import { HomeCredentials } from "@/widgets/home-credentials";
import { HomeFeedback } from "@/widgets/home-feedback";
import { HomeGeography } from "@/widgets/home-geography";
import { HomeLetters } from "@/widgets/home-letters";
import { HomeProcess } from "@/widgets/home-process";
import { HomeReviews } from "@/widgets/home-reviews";
import { HomeServices } from "@/widgets/home-services";
import { ProjectDetails } from "@/widgets/project-details";

type ProjectPageProps = { params: Promise<{ slug: string }> };

export function generateProjectStaticParams() {
  return projects.map(({ slug }) => ({ slug }));
}

export async function generateProjectMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = findProject(slug);
  if (!project) notFound();
  return pageMetadata({ title: project.title, description: `${project.title}. Фотографии выполненных работ компании «Техпромстрой».`, path: `/${project.slug}/`, image: projectCover(project).src });
}

export async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = findProject(slug);
  if (!project) notFound();
  return (
    <>
      <ProjectDetails project={project} />
      <HomeServices />
      <HomeCredentials />
      <HomeCooperation />
      <HomeProcess />
      <HomeGeography />
      <HomeFeedback />
      <HomeAdvantages />
      <HomeLetters />
      <HomeClients />
      <HomeReviews />
    </>
  );
}
