import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { serviceDirections, services } from "@/entities/service";
import { Container } from "@/shared/ui";

type ServicePageProps = {
  params: Promise<{ slug: string }>;
};

const servicePages = [
  ...services,
  ...serviceDirections.filter((direction) => direction.slug !== "seti"),
];

export function generateStaticParams() {
  return servicePages.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: ServicePageProps): Promise<Metadata> {
  const { slug } = await params;
  const service = servicePages.find((item) => item.slug === slug);

  if (!service) notFound();

  return { title: service.title };
}

export async function ServicePage({ params }: ServicePageProps) {
  const { slug } = await params;
  const service = servicePages.find((item) => item.slug === slug);

  if (!service) notFound();

  return (
    <Container className="py-12 sm:py-20">
      <h1 className="max-w-4xl text-3xl font-semibold tracking-tight text-balance sm:text-5xl">
        {service.title}
      </h1>
    </Container>
  );
}
