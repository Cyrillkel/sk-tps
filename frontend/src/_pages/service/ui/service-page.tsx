import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { serviceContent, services } from "@/entities/service";
import { pageMetadata } from "@/shared/lib";
import { HomeAbout } from "@/widgets/home-about";
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
import { ServiceDetails } from "@/widgets/service-details";

type ServicePageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return services.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: ServicePageProps): Promise<Metadata> {
  const { slug } = await params;
  const service = services.find((item) => item.slug === slug);

  if (!service) notFound();

  const content = serviceContent[service.slug];
  return pageMetadata({ title: service.title, description: content.lead, path: `/${service.slug}/`, image: content.image });
}

export async function ServicePage({ params }: ServicePageProps) {
  const { slug } = await params;
  const service = services.find((item) => item.slug === slug);

  if (!service) notFound();

  return (
    <>
      <ServiceDetails service={service} />
      <HomeServices />
      <HomeAbout />
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
