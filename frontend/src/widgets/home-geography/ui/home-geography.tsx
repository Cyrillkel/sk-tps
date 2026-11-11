import Link from "next/link";

import { cityPagePath, publishedCityLandings, workRegions } from "@/entities/geography";
import { ArrowUpRightIcon, Container, SiteVisitIcon } from "@/shared/ui";

const publishedCities = new Set(publishedCityLandings.map((content) => content.citySlug));

export function HomeGeography({ currentCitySlug }: { currentCitySlug?: string } = {}) {
  return (
    <section id="geography" aria-labelledby="geography-title" className="home-geography py-16 sm:py-20 lg:py-24">
      <Container>
        <div className="geography-heading">
          <div>
            <p className="section-eyebrow">География работ</p>
            <h2 id="geography-title" className="section-title">Инженерные системы<br /><span className="text-accent">в вашем городе</span></h2>
          </div>
          <p className="max-w-lg text-sm leading-relaxed text-muted sm:text-base">Работаем на промышленных и коммерческих объектах Калужской, Тульской и Московской областей. Обсудим задачу и согласуем выезд специалиста.</p>
        </div>
        <div className="geography-regions">
          {workRegions.map((region) => (
            <article key={region.slug} aria-labelledby={`region-${region.slug}`} className="geography-region">
              <div className="flex items-start justify-between gap-4">
                <h3 id={`region-${region.slug}`} className="text-2xl font-semibold tracking-tight text-primary sm:text-[28px]">{region.label}<span className="mt-1 block text-sm font-normal tracking-normal text-muted">область</span></h3>
                <SiteVisitIcon className="size-7 shrink-0 text-accent" strokeWidth={1.4} />
              </div>
              <ul className="geography-cities" aria-label={`Города: ${region.name}`}>
                {region.cities.map((city) => (
                  <li key={city.slug}>
                    {publishedCities.has(city.slug) ? (
                      <Link href={cityPagePath(city.slug)} aria-current={city.slug === currentCitySlug ? "page" : undefined} className="inline-flex min-h-11 items-center underline decoration-border underline-offset-4 hover:text-accent hover:decoration-accent aria-[current=page]:font-semibold aria-[current=page]:text-accent">
                        {city.name}
                      </Link>
                    ) : city.name}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
        <div className="mt-7 flex flex-col items-start gap-3 border-t border-border pt-5 sm:flex-row sm:items-center sm:justify-between sm:pr-20">
          <p className="max-w-xl text-sm leading-relaxed text-muted">Вашего города нет в списке? Расскажите об объекте — уточним возможность и условия выезда.</p>
          <a href="#feedback" className="inline-flex min-h-11 shrink-0 items-center gap-3 text-sm font-semibold text-accent hover:text-accent-hover">Обсудить объект <ArrowUpRightIcon className="size-4" /></a>
        </div>
      </Container>
    </section>
  );
}
