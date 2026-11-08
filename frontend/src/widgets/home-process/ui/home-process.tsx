import Link from "next/link";

import { workProcess } from "@/entities/company";
import {
  ArrowUpRightIcon,
  CalculatorIcon,
  ChatIcon,
  ClipboardCheckIcon,
  Container,
  ContractIcon,
  HelmetIcon,
  SiteVisitIcon,
} from "@/shared/ui";

const stepIcons = {
  request: ChatIcon,
  "site-visit": SiteVisitIcon,
  estimate: CalculatorIcon,
  contract: ContractIcon,
  works: HelmetIcon,
  handover: ClipboardCheckIcon,
} satisfies Record<(typeof workProcess)[number]["id"], typeof ChatIcon>;

export function HomeProcess() {
  return (
    <section id="process" aria-labelledby="process-title" className="home-process py-16 sm:py-20 lg:py-24">
      <svg className="process-lines" viewBox="0 0 1200 600" fill="none" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false">
        <g stroke="currentColor" strokeWidth="1">
          <path d="M-20 120h380a40 40 0 0 1 40 40v120a40 40 0 0 0 40 40h780" />
          <path d="M-20 140h368a32 32 0 0 1 32 32v116a52 52 0 0 0 52 52h768" />
          <path d="M860 -20v140a40 40 0 0 0 40 40h320M880 -20v128a32 32 0 0 0 32 32h308" />
          <circle cx="400" cy="230" r="26" />
          <circle cx="400" cy="230" r="16" />
          <path d="M120 600V480a30 30 0 0 1 30-30h200M600 312v-16m20 16v-16M1040 340v-16m20 16v-16" />
        </g>
      </svg>

      <Container className="relative z-10 mx-auto max-w-[1440px]">
        <div className="mb-10 grid gap-4 sm:mb-12 sm:gap-5 lg:mb-16 lg:grid-cols-[1.3fr_1fr] lg:items-end lg:gap-16">
          <div>
            <p className="mb-5 text-xs font-semibold tracking-[0.18em] text-service-muted uppercase sm:mb-6">Этапы работы</p>
            <h2 id="process-title" className="text-3xl leading-[1.12] font-semibold tracking-[-0.035em] text-service-foreground sm:text-4xl lg:text-5xl">
              От заявки<br className="hidden sm:block" /> <span className="text-brand">до сдачи объекта</span>
            </h2>
          </div>
          <p className="max-w-lg text-sm leading-relaxed text-service-muted sm:text-base">
            Каждый шаг согласуем с заказчиком заранее — вы знаете, что происходит на объекте и сколько это стоит.
          </p>
        </div>

        <ol className="process-steps">
          {workProcess.map((step, index) => {
            const Icon = stepIcons[step.id];

            return (
              <li key={step.id} className="process-step">
                <span className="process-node" aria-hidden="true">
                  <Icon className="size-7" strokeWidth={1.4} />
                  <span className="process-index">0{index + 1}</span>
                </span>
                <div>
                  <h3 className="text-lg leading-snug font-semibold tracking-tight text-service-foreground">{step.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-service-muted">{step.description}</p>
                </div>
              </li>
            );
          })}
        </ol>

        <div className="mt-10 flex flex-col items-start gap-4 border-t border-service-border pt-6 sm:mt-12 sm:flex-row sm:items-center sm:justify-between sm:pt-8">
          <p className="text-sm leading-relaxed text-service-muted sm:text-base">Первый шаг — заявка. Ответим и проконсультируем.</p>
          <Link href="#feedback" className="button-brand min-h-12 shrink-0 gap-7 px-6 text-sm sm:min-h-14 sm:px-7">
            Оставить заявку
            <ArrowUpRightIcon className="size-5" />
          </Link>
        </div>
      </Container>
    </section>
  );
}
