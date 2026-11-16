import Image from "next/image";
import Link from "next/link";

import { company } from "@/entities/company";
import { navigationServices } from "@/entities/service";
import { CookieSettingsButton } from "@/features/cookie-consent";
import { Container, MailIcon, MaxIcon, PhoneIcon, TelegramIcon, WhatsAppIcon } from "@/shared/ui";

const navigationLinks = [
  { href: "/", label: "Главная" },
  { href: "/seti", label: "Услуги" },
  { href: "/proekty", label: "Наши работы" },
  { href: "/#geography", label: "География работ" },
  { href: "/#about", label: "О компании" },
  { href: "/#documents", label: "Документы" },
  { href: "/#reviews", label: "Отзывы" },
  { href: "/contacts", label: "Контакты" },
] as const;

const messengers = [
  { href: company.whatsapp, label: "WhatsApp", Icon: WhatsAppIcon },
  { href: company.max, label: "MAX", Icon: MaxIcon },
  { href: company.telegram, label: "Telegram", Icon: TelegramIcon },
] as const;

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <Container className="mx-auto max-w-[1440px] py-14 sm:py-16 lg:py-20">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-[1.3fr_0.8fr_1.2fr_1.2fr] lg:gap-10">
          <div className="flex flex-col items-start gap-6">
            <Link href="/" aria-label={`${company.name} — главная`} className="block">
              <Image src="/brand/logo-dark.svg" width={1636} height={252} alt={`СК ${company.name}`} className="h-9 w-auto" />
            </Link>
            <p className="max-w-xs text-sm leading-relaxed text-service-muted">
              Монтаж, ремонт и обслуживание инженерных и технологических систем. {company.region}.
            </p>
            <ul className="flex items-center gap-3">
              {messengers.map(({ href, label, Icon }) => (
                <li key={label}>
                  <a href={href} target="_blank" rel="noopener noreferrer" aria-label={`Написать в ${label}`} className="footer-social">
                    <Icon className="size-5" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <nav aria-labelledby="footer-nav-title">
            <h2 id="footer-nav-title" className="footer-heading">Навигация</h2>
            <ul className="grid gap-1">
              {navigationLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="footer-link">{link.label}</Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-labelledby="footer-services-title">
            <h2 id="footer-services-title" className="footer-heading">Услуги</h2>
            <ul className="grid gap-1">
              {navigationServices.map((service) => (
                <li key={service.slug}>
                  <Link href={`/${service.slug}`} className="footer-link">{service.navigationLabel}</Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h2 className="footer-heading">Контакты</h2>
            <address className="grid gap-4 text-sm not-italic">
              <a href={company.phoneHref} className="footer-contact text-lg font-semibold text-service-foreground">
                <PhoneIcon className="size-5 shrink-0 text-brand" />
                {company.phone}
              </a>
              <a href={`mailto:${company.email}`} className="footer-contact">
                <MailIcon className="size-5 shrink-0 text-brand" />
                {company.email}
              </a>
              <p className="leading-relaxed text-service-muted">{company.address}</p>
            </address>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-service-border pt-6 text-xs text-service-muted sm:flex-row sm:flex-wrap sm:items-center sm:justify-between lg:mt-16">
          <p>© {company.legalName} {company.foundedYear}–{year}</p>
          <p>ИНН {company.inn}</p>
          <div className="flex flex-wrap gap-x-6 gap-y-3">
            <Link href={company.privacyPolicyUrl} className="hover:text-service-foreground">
              Политика обработки персональных данных
            </Link>
            <CookieSettingsButton className="text-left hover:text-service-foreground" />
          </div>
        </div>
      </Container>
    </footer>
  );
}
