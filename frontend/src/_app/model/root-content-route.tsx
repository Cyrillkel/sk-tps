import type { Metadata } from "next";

import { ProjectPage, generateProjectMetadata, generateProjectStaticParams } from "@/_pages/project";
import { ServicePage, generateMetadata as generateServiceMetadata, generateStaticParams as generateServiceStaticParams } from "@/_pages/service";
import { findProject } from "@/entities/project";

type ContentPageProps = { params: Promise<{ slug: string }> };

/** Retain the original project URLs alongside the existing service routes. */
export async function RootContentPage(props: ContentPageProps) {
  const { slug } = await props.params;
  return findProject(slug) ? <ProjectPage {...props} /> : <ServicePage {...props} />;
}

export function generateRootContentStaticParams() {
  return [...generateServiceStaticParams(), ...generateProjectStaticParams()];
}

export async function generateRootContentMetadata(props: ContentPageProps): Promise<Metadata> {
  const { slug } = await props.params;
  return findProject(slug) ? generateProjectMetadata(props) : generateServiceMetadata(props);
}
