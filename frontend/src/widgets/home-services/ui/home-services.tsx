import Image from "next/image";
import Link from "next/link";

import { navigationServices } from "@/entities/service";
import {
  ArrowUpRightIcon,
  Container,
  DrainageIcon,
  ElectricalIcon,
  HeatingIcon,
  InsulationIcon,
  MaintenanceIcon,
  PipelineIcon,
} from "@/shared/ui";

const serviceIcons = {
  "promyshlennye-sistemy": HeatingIcon,
  "tekhnologicheskie-truboprovody": PipelineIcon,
  elektromontazh: ElectricalIcon,
  teploizolyaciya: InsulationIcon,
  "servisnoe-obsluzhivanie": MaintenanceIcon,
  "prochistka-kanalizacii": DrainageIcon,
} satisfies Record<(typeof navigationServices)[number]["slug"], typeof HeatingIcon>;

export function HomeServices() {
  return (
    <section id="services" aria-labelledby="services-title" className="home-services py-16 sm:py-20 lg:py-28">
      <Container>
        <div className="mb-8 flex items-center justify-between gap-4 sm:mb-10">
          <p className="flex items-center gap-3 text-[11px] font-semibold tracking-[0.12em] text-muted uppercase">
            <span className="h-px w-8 bg-accent" aria-hidden="true" /> Наши направления
          </p>
          <span className="font-mono text-xs text-muted" aria-hidden="true">01 — 06</span>
        </div>

        <div className="mb-9 grid gap-5 lg:mb-12 lg:grid-cols-[1.3fr_1fr] lg:items-end lg:gap-16">
          <h2 id="services-title" className="text-3xl leading-[1.1] font-semibold tracking-[-0.035em] text-primary sm:text-4xl lg:text-5xl">
            Инженерные системы<br className="hidden sm:block" /> для вашего объекта
          </h2>
          <p className="max-w-lg text-sm leading-relaxed text-muted sm:text-base">
            Монтируем новые сети, реконструируем действующие и поддерживаем их в рабочем состоянии. Выберите направление под вашу задачу.
          </p>
        </div>

        <ul className="grid gap-3 md:grid-cols-2 lg:gap-4 xl:grid-cols-12">
          {navigationServices.map((service, index) => {
            const Icon = serviceIcons[service.slug];
            const featured = index < 2;

            return (
              <li key={service.slug} className={featured ? "xl:col-span-6" : "xl:col-span-3"}>
                <Link href={`/${service.slug}`} className={`service-card ${featured ? "service-card-featured" : ""}`}>
                  <Image
                    src={service.image}
                    alt=""
                    fill
                    sizes={featured ? "(min-width: 768px) 50vw, 100vw" : "(min-width: 1280px) 25vw, (min-width: 768px) 50vw, 100vw"}
                    className="service-card-image object-cover"
                  />
                  <span className="service-card-shade" aria-hidden="true" />
                  <div className="relative z-10 flex items-start justify-between gap-4">
                    <span className="font-mono text-xs text-service-muted">/ {String(index + 1).padStart(2, "0")}</span>
                    <span className="service-card-symbol" aria-hidden="true"><Icon className="size-9" strokeWidth={1.2} /></span>
                  </div>

                  <div className="service-card-copy relative z-10 mt-auto pt-8">
                    <h3 className={`font-semibold tracking-tight text-service-foreground ${featured ? "text-[22px] leading-tight sm:text-[28px]" : "text-xl leading-snug"}`}>
                      {service.navigationLabel}
                    </h3>
                    <p className="mt-3 max-w-md text-sm leading-relaxed text-service-muted">{service.description}</p>
                  </div>

                  <div className="relative z-10 mt-6 flex items-center justify-between gap-4 border-t border-service-border pt-4">
                    <span className="text-xs font-semibold text-service-foreground">Подробнее об услуге</span>
                    <span className="service-card-arrow"><ArrowUpRightIcon className="size-4" /></span>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="mt-8 flex flex-col items-start gap-4 border-t border-border pt-6 sm:flex-row sm:items-center sm:justify-between lg:mt-10">
          <p className="text-sm leading-relaxed text-muted">На объекте несколько систем? Обсудим состав работ вместе.</p>
          <Link href="/contacts" className="inline-flex min-h-11 shrink-0 items-center gap-3 text-sm font-semibold text-accent hover:text-accent-hover">
            Обсудить задачу <ArrowUpRightIcon className="size-4" />
          </Link>
        </div>
      </Container>
    </section>
  );
}
