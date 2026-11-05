import Link from "next/link";

import { company } from "@/entities/company";
import { SiteNavigation } from "@/features/site-navigation";
import { Container } from "@/shared/ui";

export function SiteHeader() {
  return (
    <header className="relative z-20 border-b border-border bg-surface">
      <div className="bg-header-strip text-white">
        <Container className="flex min-h-9 flex-wrap items-center justify-between gap-x-4 gap-y-1 py-2 text-xs sm:text-sm">
          <p>{company.region}</p>
          <a href={`mailto:${company.email}`} className="hidden text-white/80 hover:text-white sm:inline">
            {company.email}
          </a>
        </Container>
      </div>
      <Container className="flex min-h-20 items-center justify-between gap-4 py-4 sm:min-h-24 sm:gap-6">
        <Link href="/" aria-label={`${company.name} — главная`} className="flex shrink-0 flex-col gap-1">
          <span className="text-[clamp(1rem,3.8vw,1.375rem)] leading-none font-bold tracking-tight">
            {company.name.toUpperCase()}
          </span>
          <span className="text-[9px] leading-snug font-medium tracking-[0.14em] text-muted sm:text-[10px]">
            СТРОИТЕЛЬНАЯ КОМПАНИЯ
          </span>
        </Link>
        <div className="flex items-center gap-5 sm:gap-7 xl:gap-8">
          <SiteNavigation />
          <a
            href={company.phoneHref}
            className="hidden shrink-0 rounded-lg bg-accent px-5 py-3 text-sm font-semibold whitespace-nowrap text-white transition-colors hover:bg-accent-hover sm:inline-flex"
          >
            {company.phone}
          </a>
        </div>
      </Container>
    </header>
  );
}
