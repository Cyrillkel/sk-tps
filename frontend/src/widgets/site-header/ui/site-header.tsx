import Image from "next/image";
import Link from "next/link";

import { company } from "@/entities/company";
import { SiteNavigation } from "@/features/site-navigation";
import { Container, MailIcon, PhoneIcon } from "@/shared/ui";

export function SiteHeader() {
  return (
    <header className="relative z-20 border-b border-border bg-surface">
      <div className="bg-header-strip text-white">
        <Container className="flex min-h-9 flex-wrap items-center justify-between gap-x-4 gap-y-1 py-2 text-xs sm:text-sm">
          <p>{company.region}</p>
          <a href={`mailto:${company.email}`} className="hidden items-center gap-2 text-white/80 hover:text-white sm:inline-flex">
            <MailIcon className="size-4" />
            {company.email}
          </a>
        </Container>
      </div>
      <Container className="flex min-h-20 items-center justify-between gap-4 py-4 sm:min-h-24 sm:gap-6">
        <Link href="/" aria-label={`${company.name} — главная`} className="block shrink-0">
          <Image
            src="/brand/logo.svg"
            width={1636}
            height={252}
            alt={`СК ${company.name}`}
            loading="eager"
            className="h-auto w-[200px] sm:w-[250px] 2xl:w-[280px]"
          />
        </Link>
        <div className="flex items-center gap-5 sm:gap-7 xl:gap-8">
          <SiteNavigation />
          <a
            href={company.phoneHref}
            className="hidden shrink-0 items-center gap-2 rounded-lg bg-accent px-5 py-3 text-sm font-semibold whitespace-nowrap text-white transition-colors hover:bg-accent-hover sm:inline-flex"
          >
            <PhoneIcon className="size-4" />
            {company.phone}
          </a>
        </div>
      </Container>
    </header>
  );
}
