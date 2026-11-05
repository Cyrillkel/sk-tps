import Image from "next/image";
import Link from "next/link";

import { company } from "@/entities/company";
import { SiteNavigation } from "@/features/site-navigation";
import { ThemeToggle } from "@/features/theme-toggle";
import { Container, MaxIcon, PhoneIcon, TelegramIcon } from "@/shared/ui";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-surface">
      <Container className="flex min-h-20 items-center justify-between gap-2 py-4 sm:gap-4 lg:min-h-24 xl:gap-6">
        <Link href="/" aria-label={`${company.name} — главная`} className="block shrink-0">
          <Image
            src="/brand/logo.svg"
            width={1636}
            height={252}
            alt={`СК ${company.name}`}
            loading="eager"
            className="h-auto w-[168px] min-[390px]:w-[195px] sm:w-[240px] lg:w-[200px] xl:w-[260px] dark:hidden"
          />
          <Image src="/brand/logo-dark.svg" width={1636} height={252} alt={`СК ${company.name}`} loading="eager" className="hidden h-auto w-[168px] min-[390px]:w-[195px] sm:w-[240px] lg:w-[200px] xl:w-[260px] dark:block" />
        </Link>
        <SiteNavigation />
        <ThemeToggle />
        <div className="ml-auto hidden shrink-0 flex-col gap-1 text-right text-primary md:flex lg:ml-0">
          <a href={company.phoneHref} className="text-[17px] leading-tight font-bold whitespace-nowrap hover:text-accent">{company.phone}</a>
          <a href={`mailto:${company.email}`} className="text-sm leading-tight hover:text-accent">{company.email}</a>
        </div>
        <div className="hidden items-center gap-3 text-primary xl:flex">
          <a href={company.max} target="_blank" rel="noopener noreferrer" aria-label="Написать в MAX" className="transition-opacity hover:opacity-70"><MaxIcon className="size-7" /></a>
          <a href={company.telegram} target="_blank" rel="noopener noreferrer" aria-label="Написать в Telegram" className="flex size-7 items-center justify-center rounded-full bg-primary text-surface transition-opacity hover:opacity-70"><TelegramIcon className="size-4.5" /></a>
        </div>
        <Link href="/contacts" className="button-brand hidden min-h-12 shrink-0 px-5 text-[11px] tracking-wide uppercase lg:inline-flex">Перезвоните мне</Link>
        <a href={company.phoneHref} aria-label={`Позвонить: ${company.phone}`} className="ml-auto hidden size-10 items-center justify-center text-primary min-[360px]:flex md:hidden"><PhoneIcon className="size-5" /></a>
      </Container>
    </header>
  );
}
