import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { services } from "@/entities/service";
import { Container } from "@/shared/ui";

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

  return { title: service.title };
}

export async function ServicePage({ params }: ServicePageProps) {
  const { slug } = await params;
  const service = services.find((item) => item.slug === slug);

  if (!service) notFound();

  return (
    <Container className="py-12 sm:py-20">
      <h1 className="max-w-4xl text-3xl font-semibold tracking-tight text-balance sm:text-5xl">
        {service.title}
      </h1>
      {service.slug === "servisnoe-obsluzhivanie" && (
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted">{service.description}</p>
      )}
    </Container>
  );
}
