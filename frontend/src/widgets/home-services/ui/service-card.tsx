import Link from "next/link";

import { navigationServices } from "@/entities/service";
import {
  ArrowUpRightIcon,
  ElectricalIcon,
  HeatingIcon,
  InsulationIcon,
  MaintenanceIcon,
  PipelineIcon,
  ResponsiveImage,
} from "@/shared/ui";

type NavigationService = (typeof navigationServices)[number];

const serviceIcons = {
  "promyshlennye-sistemy": HeatingIcon,
  "tekhnologicheskie-truboprovody": PipelineIcon,
  elektromontazh: ElectricalIcon,
  teploizolyaciya: InsulationIcon,
  "servisnoe-obsluzhivanie": MaintenanceIcon,
} satisfies Record<NavigationService["slug"], typeof HeatingIcon>;

// Largest prepared source, capped at the original width to avoid upscaling.
const serviceImageMaxWidths = {
  "promyshlennye-sistemy": 1280,
  "tekhnologicheskie-truboprovody": 1280,
  elektromontazh: 1200,
  teploizolyaciya: 1250,
  "servisnoe-obsluzhivanie": 1280,
} satisfies Record<NavigationService["slug"], number>;

type ServiceCardProps = {
  service: NavigationService;
  featured?: boolean;
  sizes: string;
};

export function ServiceCard({ service, featured = false, sizes }: ServiceCardProps) {
  const Icon = serviceIcons[service.slug];
  const variants = [480, 768, serviceImageMaxWidths[service.slug]].map((width) => ({
    src: service.image.replace(/\.webp$/, `-variants-${width}.webp`),
    width,
  }));

  return (
    <Link href={`/${service.slug}`} className={`service-card ${featured ? "service-card-featured" : ""}`}>
      <ResponsiveImage src={service.image} alt="" variants={variants} fill sizes={sizes} className="service-card-image object-cover" />
      <div className="relative z-10 flex items-start justify-end gap-4">
        <span className="service-card-symbol" aria-hidden="true"><Icon className="size-9" strokeWidth={1.2} /></span>
      </div>

      <div className="service-card-copy relative z-10 mt-auto pt-6 sm:pt-8">
        <h3 className={`text-xl leading-snug font-semibold tracking-tight text-service-foreground ${featured ? "md:text-[28px] md:leading-tight" : ""}`}>
          {service.navigationLabel}
        </h3>
        <p className="mt-2 max-w-md text-sm leading-relaxed text-service-muted sm:mt-3">{service.description}</p>
      </div>

      <div className="relative z-10 mt-5 flex items-center justify-between gap-4 border-t border-service-border pt-4 sm:mt-6">
        <span className="text-xs font-semibold text-service-foreground">Подробнее об услуге</span>
        <span className="service-card-arrow"><ArrowUpRightIcon className="size-4" /></span>
      </div>
    </Link>
  );
}
