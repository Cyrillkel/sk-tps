import Link from "next/link";

import { navigationServices } from "@/entities/service";
import { ArrowUpRightIcon, Container } from "@/shared/ui";

import { ServiceCard } from "./service-card";
import { ServicesSlider } from "./services-slider";

type HomeServicesProps = {
  heading?: string;
  description?: string;
};

export function HomeServices({ heading, description }: HomeServicesProps = {}) {
  return (
    <section id="services" aria-labelledby="services-title" className="home-services py-12 sm:py-16 lg:py-20">
      <Container>
        <div className="mb-6 grid gap-4 sm:mb-8 sm:gap-5 lg:mb-10 lg:grid-cols-[1.3fr_1fr] lg:items-end lg:gap-16">
          <h2 id="services-title" className="text-3xl leading-[1.1] font-semibold tracking-[-0.035em] text-primary sm:text-4xl lg:text-5xl">
            {heading ?? <>Инженерные системы<br className="hidden sm:block" /> для вашего объекта</>}
          </h2>
          <p className="max-w-lg text-sm leading-relaxed text-muted sm:text-base">
            {description ?? "Монтируем новые сети, реконструируем действующие и поддерживаем их в рабочем состоянии. Выберите направление под вашу задачу."}
          </p>
        </div>

        <div className="-mx-5 sm:-mx-8 md:mx-0">
          <ServicesSlider
            label="Направления работ"
            slides={navigationServices.map((service, index) => {
              const featured = index < 2;

              return {
                key: service.slug,
                className: featured
                  ? "xl:col-span-6"
                  : `${index === navigationServices.length - 1 ? "md:col-span-2 " : ""}xl:col-span-4`,
                content: (
                  <ServiceCard
                    service={service}
                    featured={featured}
                    sizes={featured
                      ? "(min-width: 768px) 50vw, 90vw"
                      : `(min-width: 1280px) 33vw, (min-width: 768px) ${index === navigationServices.length - 1 ? "100vw" : "50vw"}, 90vw`}
                  />
                ),
              };
            })}
          />
        </div>

        <div className="mt-6 flex flex-col items-start gap-2 border-t border-border pt-5 sm:mt-8 sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:pt-6 lg:mt-10">
          <p className="text-sm leading-relaxed text-muted">На объекте несколько систем? Обсудим состав работ вместе.</p>
          <Link href="/contacts" className="inline-flex min-h-11 shrink-0 items-center gap-3 text-sm font-semibold text-accent hover:text-accent-hover">
            Обсудить задачу <ArrowUpRightIcon className="size-4" />
          </Link>
        </div>
      </Container>
    </section>
  );
}
