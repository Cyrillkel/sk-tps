import Image from "next/image";

import { company, companyAdvantages } from "@/entities/company";
import { BoltIcon, CertificateIcon, ClockIcon, Container, KeyIcon, ShieldCheckIcon, VanIcon } from "@/shared/ui";

const advantageIcons = {
  turnkey: KeyIcon,
  warranty: ShieldCheckIcon,
  "site-visit": VanIcon,
  standards: CertificateIcon,
  "fast-repair": BoltIcon,
  deadlines: ClockIcon,
} satisfies Record<(typeof companyAdvantages)[number]["id"], typeof KeyIcon>;

export function HomeAdvantages() {
  return (
    <section id="advantages" aria-labelledby="advantages-title" className="home-advantages py-16 sm:py-20 lg:py-24">
      <Container className="relative z-10 mx-auto max-w-[1440px]">
        <div className="mb-10 grid gap-4 sm:mb-12 sm:gap-5 lg:mb-14 lg:grid-cols-[1.3fr_1fr] lg:items-end lg:gap-16">
          <div>
            <p className="mb-5 text-xs font-semibold tracking-[0.18em] text-muted uppercase sm:mb-6">Преимущества</p>
            <h2 id="advantages-title" className="text-3xl leading-[1.12] font-semibold tracking-[-0.035em] text-primary sm:text-4xl lg:text-5xl">
              Почему с нами<br className="hidden sm:block" /> <span className="text-accent">удобно работать</span>
            </h2>
          </div>
          <p className="max-w-lg text-sm leading-relaxed text-muted sm:text-base">
            Отвечаем за результат на каждом этапе — от первого выезда до сдачи систем и дальнейшего обслуживания.
          </p>
        </div>

        <div className="grid gap-3 lg:grid-cols-[0.8fr_2fr] lg:gap-5">
          <figure className="advantages-photo relative isolate overflow-hidden rounded-2xl bg-service-card">
            <Image
              src="/images/advantages.webp"
              alt="Специалист на промышленном объекте"
              fill
              sizes="(min-width: 1440px) 400px, (min-width: 1024px) 28vw, 100vw"
              className="object-cover"
            />
            <div className="advantages-photo-shade absolute inset-0" aria-hidden="true" />
            <figcaption className="absolute inset-x-0 bottom-0 p-6 sm:p-8">
              <span className="block text-xs font-semibold tracking-[0.18em] text-service-muted uppercase">Регион работ</span>
              <span className="mt-2 block text-xl leading-snug font-semibold text-service-foreground sm:text-2xl">{company.region}</span>
            </figcaption>
          </figure>

          <ul className="grid gap-3 sm:grid-cols-2 lg:gap-5 xl:grid-cols-3">
            {companyAdvantages.map((advantage) => {
              const Icon = advantageIcons[advantage.id];

              return (
                <li key={advantage.id} className="advantage-card">
                  <span className="advantage-icon" aria-hidden="true">
                    <Icon className="size-6" strokeWidth={1.5} />
                  </span>
                  <h3 className="mt-6 text-lg leading-snug font-semibold tracking-tight text-primary">{advantage.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{advantage.description}</p>
                </li>
              );
            })}
          </ul>
        </div>
      </Container>
    </section>
  );
}
