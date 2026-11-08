import Image from "next/image";
import Link from "next/link";

import { navigationServices } from "@/entities/service";
import {
  ArrowUpRightIcon,
  DrainageIcon,
  ElectricalIcon,
  HeatingIcon,
  InsulationIcon,
  MaintenanceIcon,
  PipelineIcon,
} from "@/shared/ui";

type NavigationService = (typeof navigationServices)[number];

const serviceIcons = {
  "promyshlennye-sistemy": HeatingIcon,
  "tekhnologicheskie-truboprovody": PipelineIcon,
  elektromontazh: ElectricalIcon,
  teploizolyaciya: InsulationIcon,
  "servisnoe-obsluzhivanie": MaintenanceIcon,
  "prochistka-kanalizacii": DrainageIcon,
} satisfies Record<NavigationService["slug"], typeof HeatingIcon>;

type ServiceCardProps = {
  service: NavigationService;
  featured?: boolean;
  sizes: string;
};

export function ServiceCard({ service, featured = false, sizes }: ServiceCardProps) {
  const Icon = serviceIcons[service.slug];

  return (
    <Link href={`/${service.slug}`} className={`service-card ${featured ? "service-card-featured" : ""}`}>
      <Image src={service.image} alt="" fill sizes={sizes} className="service-card-image object-cover" />
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
