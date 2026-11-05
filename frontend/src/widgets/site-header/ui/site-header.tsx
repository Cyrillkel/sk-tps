import Image from "next/image";
import Link from "next/link";

import { company } from "@/entities/company";
import { SiteNavigation } from "@/features/site-navigation";
import { ThemeToggle } from "@/features/theme-toggle";
import { Container, MaxIcon, PhoneIcon, TelegramIcon, WhatsAppIcon } from "@/shared/ui";

export function SiteHeader() {
  return (
    <header className="site-header">
      <Container className="flex h-full items-center justify-between gap-2 sm:gap-4 xl:gap-6">
        <Link
          href="/"
          aria-label={`${company.name} — главная`}
          className="block shrink-0"
        >
          <BrandImage />
        </Link>
        <SiteNavigation
          mobileLogo={<BrandImage />}
          mobileControls={
            <>
              <ThemeToggle />
              <a href={company.phoneHref} aria-label={`Позвонить: ${company.phone}`} className="header-icon-button">
                <PhoneIcon className="size-5" />
              </a>
            </>
          }
        />
        <div className="desktop-theme-control hidden xl:block"><ThemeToggle /></div>
        <div className="hidden shrink-0 flex-col gap-1 text-right text-primary xl:flex">
          <a
            href={company.phoneHref}
            className="text-[17px] leading-tight font-bold whitespace-nowrap hover:text-accent"
          >
            {company.phone}
          </a>
          <a
            href={`mailto:${company.email}`}
            className="text-sm leading-tight hover:text-accent"
          >
            {company.email}
          </a>
        </div>
        <div className="hidden items-center gap-3 text-primary xl:flex">
          <a
            href={company.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Написать в WhatsApp"
            className="transition-opacity hover:opacity-70"
          >
            <WhatsAppIcon className="size-7" />
          </a>
          <a
            href={company.max}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Написать в MAX"
            className="transition-opacity hover:opacity-70"
          >
            <MaxIcon className="size-7" />
          </a>
          <a
            href={company.telegram}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Написать в Telegram"
            className="flex size-7 items-center justify-center rounded-full bg-primary text-surface transition-opacity hover:opacity-70"
          >
            <TelegramIcon className="size-4.5" />
          </a>
        </div>
        <Link
          href="/contacts"
          className="button-brand hidden min-h-12 shrink-0 px-5 text-[11px] tracking-wide uppercase xl:inline-flex"
        >
          Заказать звонок
        </Link>
      </Container>
    </header>
  );
}

function BrandImage() {
  return (
    <>
      <Image src="/brand/logo.svg" width={1636} height={252} alt={`СК ${company.name}`} loading="eager" className="header-logo dark:hidden" />
      <Image src="/brand/logo-dark.svg" width={1636} height={252} alt={`СК ${company.name}`} loading="eager" className="header-logo hidden dark:block" />
    </>
  );
}
