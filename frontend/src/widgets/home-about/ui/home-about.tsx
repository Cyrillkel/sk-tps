import Image from "next/image";
import Link from "next/link";

import { company, companyAbout } from "@/entities/company";
import { ArrowUpRightIcon, Container } from "@/shared/ui";

export function HomeAbout() {
  return (
    <section
      id="about"
      aria-labelledby="about-title"
      className="home-about py-16 sm:py-20 lg:py-28"
    >
      <div className="about-blueprint" aria-hidden="true">
        <svg viewBox="0 0 600 560" fill="none">
          <g stroke="currentColor" strokeWidth="1">
            <path d="M600 72H320a48 48 0 0 0-48 48v112a48 48 0 0 1-48 48H0" />
            <path d="M600 96H328a32 32 0 0 0-32 32v112a64 64 0 0 1-64 64H0" />
            <path d="M600 352H432a48 48 0 0 0-48 48v160M600 376H440a32 32 0 0 0-32 32v152" />
            <circle cx="284" cy="168" r="38" />
            <circle cx="284" cy="168" r="27" />
            <path d="M238 168h92m-46-46v92M180 268v48m16-48v48M396 452h24m-24 12h24" />
          </g>
        </svg>
      </div>

      <Container className="relative z-10 mx-auto max-w-[1440px]">
        <div className="grid items-center gap-10 sm:gap-12 lg:grid-cols-[0.9fr_1fr] lg:gap-16 xl:gap-24">
          <div className="order-2 relative pl-3 pb-3 sm:pl-5 sm:pb-5 lg:order-1">
            <div className="about-photo-frame" aria-hidden="true" />
            <figure className="about-photo relative isolate overflow-hidden rounded-2xl bg-service-card">
              <Image
                src="/images/services/pipelines.webp"
                alt="Технологические трубопроводы и насосное оборудование"
                fill
                sizes="(min-width: 1440px) 580px, (min-width: 1024px) 42vw, (min-width: 640px) calc(100vw - 84px), calc(100vw - 52px)"
                className="object-cover object-[42%_center]"
              />
              <div className="about-photo-shade absolute inset-0" aria-hidden="true" />
              <figcaption className="absolute inset-x-0 bottom-0 flex items-end gap-4 p-5 sm:p-8">
                <span className="shrink-0 text-[64px] leading-none font-semibold tracking-[-0.06em] text-service-foreground sm:text-[96px]">
                  {companyAbout.experience.value}
                </span>
                <span className="max-w-28 flex-1 pb-1 text-xs leading-relaxed text-service-muted sm:max-w-40 sm:pb-2 sm:text-sm">
                  {companyAbout.experience.label}
                </span>
              </figcaption>
            </figure>
          </div>

          <div className="order-1 lg:order-2">
            <p className="mb-5 text-xs font-semibold tracking-[0.18em] text-muted uppercase sm:mb-6">
              О компании
            </p>
            <h2
              id="about-title"
              className="text-3xl leading-[1.12] font-semibold tracking-[-0.035em] text-primary sm:text-4xl lg:text-[46px] xl:text-[50px]"
            >
              Инженерные системы
              <br />
              <span className="text-accent">с опорой на опыт</span>
            </h2>
            <p className="mt-5 text-lg font-semibold tracking-tight text-primary sm:mt-6">
              {company.name}
            </p>
            <div className="mt-3 space-y-4 text-sm leading-[1.8] text-muted sm:text-base">
              {companyAbout.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>

            <ul className="mt-7 grid gap-5 border-t border-border pt-6 sm:mt-8 sm:grid-cols-2 sm:gap-6">
              {companyAbout.principles.map((principle) => (
                <li key={principle.title}>
                  <h3 className="flex items-center gap-2.5 text-sm font-semibold text-primary">
                    <span className="size-1.5 shrink-0 bg-accent" aria-hidden="true" />
                    {principle.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">
                    {principle.description}
                  </p>
                </li>
              ))}
            </ul>

            <Link
              href="/contacts"
              className="button-brand mt-7 min-h-12 gap-7 px-6 text-sm sm:mt-8 sm:min-h-14 sm:px-7"
            >
              Обсудить ваш проект
              <ArrowUpRightIcon className="size-5" />
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}
