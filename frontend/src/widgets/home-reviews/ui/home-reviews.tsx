import { company } from "@/entities/company";
import { ArrowUpRightIcon, Container } from "@/shared/ui";

export function HomeReviews() {
  const { orgUrl, reviewsWidget, mapWidget } = company.yandexMaps;

  return (
    <section id="reviews" aria-labelledby="reviews-title" className="home-reviews py-16 sm:py-20 lg:py-24">
      <Container className="mx-auto max-w-[1440px]">
        <div className="mb-10 flex flex-col gap-6 sm:mb-12 lg:mb-14 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="mb-5 text-xs font-semibold tracking-[0.18em] text-muted uppercase sm:mb-6">Яндекс Карты</p>
            <h2 id="reviews-title" className="text-3xl leading-[1.12] font-semibold tracking-[-0.035em] text-primary sm:text-4xl lg:text-5xl">
              Отзывы
            </h2>
          </div>
          <a
            href={orgUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-12 items-center gap-2 self-start rounded-full border border-border px-5 text-sm font-semibold text-primary transition-colors hover:border-accent hover:text-accent lg:self-auto"
          >
            Все отзывы на Яндекс Картах
            <ArrowUpRightIcon className="size-4" />
          </a>
        </div>

        <div className="grid gap-4 lg:grid-cols-2 lg:gap-5">
          <div className="reviews-frame h-[520px] sm:h-[600px]">
            <iframe
              src={reviewsWidget}
              title={`Отзывы о СК ${company.name} на Яндекс Картах`}
              loading="lazy"
              className="size-full"
            />
          </div>
          <div className="reviews-frame h-[360px] sm:h-[440px] lg:h-[600px]">
            <iframe
              src={mapWidget}
              title={`СК ${company.name} на карте`}
              loading="lazy"
              allowFullScreen
              className="size-full"
            />
          </div>
        </div>
      </Container>
    </section>
  );
}
