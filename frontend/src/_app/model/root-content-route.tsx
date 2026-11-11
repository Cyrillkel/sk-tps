import type { Metadata } from "next";

import { CityPage, generateCityMetadata } from "@/_pages/city";
import { ProjectPage, generateProjectMetadata, generateProjectStaticParams } from "@/_pages/project";
import { ServicePage, generateMetadata as generateServiceMetadata, generateStaticParams as generateServiceStaticParams } from "@/_pages/service";
import { cityPageSlug, findCityLandingByPageSlug, publishedCityLandings } from "@/entities/geography";
import { findProject } from "@/entities/project";

type ContentPageProps = { params: Promise<{ slug: string }> };

/** Export services, original project URLs and city landing pages at the root. */
export async function RootContentPage(props: ContentPageProps) {
  const { slug } = await props.params;
  const city = findCityLandingByPageSlug(slug);
  if (city) return <CityPage content={city} />;
  return findProject(slug) ? <ProjectPage {...props} /> : <ServicePage {...props} />;
}

export function generateRootContentStaticParams() {
  return [
    ...generateServiceStaticParams(),
    ...generateProjectStaticParams(),
    ...publishedCityLandings.map(({ citySlug }) => ({ slug: cityPageSlug(citySlug) })),
  ];
}

export async function generateRootContentMetadata(props: ContentPageProps): Promise<Metadata> {
  const { slug } = await props.params;
  const city = findCityLandingByPageSlug(slug);
  if (city) return generateCityMetadata(city);
  return findProject(slug) ? generateProjectMetadata(props) : generateServiceMetadata(props);
}
