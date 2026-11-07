import Image from "next/image";
import Link from "next/link";

import { company } from "@/entities/company";
import { WorkStages } from "@/features/work-stages";
import { ArrowRightIcon, Container } from "@/shared/ui";

export function HomeHero() {
  return (
    <section className="home-hero" aria-labelledby="hero-title">
      <div className="hero-photo" aria-hidden="true">
        <Image
          src="/images/hero.webp"
          alt=""
          fill
          sizes="100vw"
          loading="eager"
          fetchPriority="high"
          className="object-cover object-[52%_center]"
        />
      </div>
      <div className="hero-shade" aria-hidden="true" />
      <div className="hero-grid" aria-hidden="true">
        <span />
        <span />
        <span />
      </div>
      <Container className="hero-content relative z-10 flex min-h-[inherit] flex-col pb-8 sm:pb-10 lg:pb-8">
        <div className="grid items-start gap-8 sm:gap-10 lg:grid-cols-[1.8fr_1fr] lg:gap-12">
          <div className="lg:pt-2">
            <h1 id="hero-title" className="hero-title">
              <span>Монтаж и обслуживание</span>
              <span>инженерных и технологических</span>
              <span>
                систем под ключ
                <span
                  className="ml-3 inline-block size-2 bg-brand align-middle sm:size-2.5"
                  aria-hidden="true"
                />
              </span>
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-hero-muted sm:mt-6 sm:text-lg">
              Инженерные сети предприятий и коммерческих объектов. От нового
              монтажа до ремонта и сервисного обслуживания.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-4 sm:mt-8 sm:gap-y-5">
              <Link
                href="/contacts"
                className="button-brand min-h-14 gap-6 px-7 text-sm sm:px-8"
              >
                Запросить КП <ArrowRightIcon className="size-5" />
              </Link>
              <p className="border-l border-hero-border pl-4 text-xs leading-relaxed text-hero-muted">
                Работаем в Калужской, Тульской
                <br />и Московской областях
              </p>
            </div>
          </div>
          <WorkStages />
        </div>
        <div className="mt-8 border-t border-hero-border pt-5 sm:mt-10 sm:pt-6 lg:mt-auto lg:w-[64%]">
          <dl className="grid grid-cols-3 gap-4 sm:gap-7">
            <div className="border-r border-hero-border pr-3">
              <dt className="text-lg font-bold text-hero-foreground sm:text-[27px]">
                Под ключ
              </dt>
              <dd className="mt-1 text-[10px] leading-relaxed text-hero-muted sm:text-xs">
                Монтаж, ремонт
                <br />и обслуживание
              </dd>
            </div>
            <div className="border-r border-hero-border pr-3">
              <dt className="text-lg font-bold text-hero-foreground sm:text-[27px]">
                От 1 года
              </dt>
              <dd className="mt-1 text-[10px] leading-relaxed text-hero-muted sm:text-xs">
                Гарантия
                <br />
                на выполненные работы
              </dd>
            </div>
            <div>
              <dt className="text-lg font-bold text-hero-foreground sm:text-[27px]">
                По договору
              </dt>
              <dd className="mt-1 text-[10px] leading-relaxed text-hero-muted sm:text-xs">
                Согласуем смету
                <br />
                до начала работ
              </dd>
            </div>
          </dl>
        </div>
        <p className="sr-only">
          {company.name}. {company.region}.
        </p>
      </Container>
    </section>
  );
}
