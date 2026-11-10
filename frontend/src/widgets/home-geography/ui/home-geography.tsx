import { workRegions } from "@/entities/geography";
import { ArrowUpRightIcon, Container, SiteVisitIcon } from "@/shared/ui";

export function HomeGeography() {
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
                {region.cities.map((city) => <li key={city.slug}>{city.name}</li>)}
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
