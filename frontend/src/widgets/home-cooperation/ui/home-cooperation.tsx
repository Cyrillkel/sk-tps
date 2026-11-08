import { cooperationGuarantee, cooperationOptions } from "@/entities/company";
import { BlueprintIcon, CompassIcon, Container, ProjectEditIcon, ShieldCheckIcon } from "@/shared/ui";

const optionIcons = {
  "client-project": BlueprintIcon,
  "project-adaptation": ProjectEditIcon,
  "custom-project": CompassIcon,
} satisfies Record<(typeof cooperationOptions)[number]["id"], typeof BlueprintIcon>;

export function HomeCooperation() {
  return (
    <section id="cooperation" aria-labelledby="cooperation-title" className="home-cooperation py-16 sm:py-20 lg:py-24">
      <svg className="cooperation-lines" viewBox="0 0 800 400" fill="none" aria-hidden="true" focusable="false">
        <g stroke="currentColor" strokeWidth="1">
          <path d="M0 300h220a40 40 0 0 0 40-40V120a40 40 0 0 1 40-40h500" />
          <path d="M0 324h232a52 52 0 0 0 52-52V132a28 28 0 0 1 28-28h488" />
          <circle cx="260" cy="190" r="22" />
          <circle cx="260" cy="190" r="14" />
          <path d="M520 80v-40m16 40v-40M640 104v60a24 24 0 0 0 24 24h136" />
        </g>
      </svg>

      <Container className="relative z-10 mx-auto max-w-[1440px]">
        <div className="mb-10 grid gap-4 sm:mb-12 sm:gap-5 lg:mb-14 lg:grid-cols-[1.3fr_1fr] lg:items-end lg:gap-16">
          <div>
            <p className="mb-5 text-xs font-semibold tracking-[0.18em] text-muted uppercase sm:mb-6">Варианты сотрудничества</p>
            <h2 id="cooperation-title" className="text-3xl leading-[1.12] font-semibold tracking-[-0.035em] text-primary sm:text-4xl lg:text-5xl">
              Подберём формат<br className="hidden sm:block" /> <span className="text-accent">под вашу задачу</span>
            </h2>
          </div>
          <p className="max-w-lg text-sm leading-relaxed text-muted sm:text-base">
            Работаем по готовой документации, дорабатываем существующий проект или разрабатываем решение с нуля.
          </p>
        </div>

        <ol className="grid gap-3 md:grid-cols-3 lg:gap-5">
          {cooperationOptions.map((option, index) => {
            const Icon = optionIcons[option.id];

            return (
              <li key={option.id} className="cooperation-card">
                <div className="flex items-start justify-between gap-4">
                  <span className="cooperation-icon" aria-hidden="true">
                    <Icon className="size-7" strokeWidth={1.4} />
                  </span>
                  <span className="cooperation-number" aria-hidden="true">0{index + 1}</span>
                </div>
                <h3 className="mt-8 text-xl leading-snug font-semibold tracking-tight text-primary sm:mt-10 sm:text-[22px]">
                  {option.title}
                </h3>
                <p className="mt-3 text-sm leading-[1.75] text-muted">{option.description}</p>
              </li>
            );
          })}
        </ol>

        <p className="cooperation-guarantee mt-3 lg:mt-5">
          <ShieldCheckIcon className="size-6 shrink-0 text-accent" strokeWidth={1.6} />
          <span>{cooperationGuarantee}</span>
        </p>
      </Container>
    </section>
  );
}
