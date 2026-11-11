import Link from "next/link";

import { company } from "@/entities/company";
import { FeedbackForm } from "@/features/feedback-form";
import { pageMetadata } from "@/shared/lib";
import { ArrowUpRightIcon, Breadcrumbs, Container, MailIcon, MaxIcon, PhoneIcon, SiteVisitIcon, TelegramIcon, WhatsAppIcon } from "@/shared/ui";

import styles from "./contacts-page.module.css";

export const metadata = pageMetadata({ title: "Контакты", description: `Контакты компании «${company.name}». ${company.region}. Телефон: ${company.phone}.`, path: "/contacts/" });

const messengers = [
  { href: company.whatsapp, label: "WhatsApp", Icon: WhatsAppIcon },
  { href: company.max, label: "MAX", Icon: MaxIcon },
  { href: company.telegram, label: "Telegram", Icon: TelegramIcon },
] as const;

export function ContactsPage() {
  return (
    <div className={styles.page}>
      <Container>
        <Breadcrumbs items={[{ label: "Главная", href: "/" }, { label: "Контакты" }]} />
        <header className={styles.heading}>
          <div>
            <p className="section-eyebrow">СК Техпромстрой</p>
            <h1 className={styles.title}>Контакты</h1>
          </div>
          <p className={styles.lead}>От первого вопроса до работ на объекте — обсудим вашу задачу, состав работ и условия выезда.</p>
        </header>

        <div className={styles.contactGrid}>
          <section className={styles.contactPanel} aria-labelledby="contact-methods-title">
            <svg className={styles.lines} viewBox="0 0 500 600" fill="none" aria-hidden="true" focusable="false">
              <g stroke="currentColor" strokeWidth="1.5">
                <path d="M180-20v120a48 48 0 0 0 48 48h210a40 40 0 0 1 40 40v432M204-20v120a24 24 0 0 0 24 24h210a64 64 0 0 1 64 64v432" />
                <path d="M-20 520h170a40 40 0 0 0 40-40v-80a40 40 0 0 1 40-40h290" />
                <circle cx="190" cy="450" r="20" />
                <path d="M176 436l28 28m-28 0 28-28" />
              </g>
            </svg>
            <div className={styles.contactContent}>
              <span className={styles.panelIcon}><PhoneIcon className="size-6" /></span>
              <h2 id="contact-methods-title" className={styles.panelTitle}>Начнём с разговора</h2>
              <p className={styles.panelIntro}>Позвоните, напишите на почту или в удобный мессенджер.</p>
              <address className={styles.directContacts}>
                <a href={company.phoneHref} className={styles.phone}>
                  <span className={styles.contactLabel}>Телефон</span>
                  <span>{company.phone}</span>
                </a>
                <a href={`mailto:${company.email}`} className={styles.email}>
                  <span className={styles.contactLabel}>Электронная почта</span>
                  <span className={styles.emailValue}><MailIcon className="size-5 shrink-0" />{company.email}<ArrowUpRightIcon className="ml-auto size-4 shrink-0" /></span>
                </a>
              </address>
              <div className={styles.messengerGroup}>
                <p className={styles.contactLabel}>Написать в мессенджер</p>
                <ul className={styles.messengers}>
                  {messengers.map(({ href, label, Icon }) => (
                    <li key={label}>
                      <a href={href} target="_blank" rel="noopener noreferrer" className={styles.messenger}>
                        <Icon className="size-5 shrink-0" />{label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
              <div className={styles.coverage}>
                <SiteVisitIcon className="mt-0.5 size-5 shrink-0 text-brand" />
                <div>
                  <p>{company.region}</p>
                  <Link href="/#geography">Посмотреть географию работ <ArrowUpRightIcon className="size-4" /></Link>
                </div>
              </div>
            </div>
          </section>

          <section id="feedback" className={styles.formPanel} aria-labelledby="feedback-title">
            <p className="section-eyebrow">Обратная связь</p>
            <h2 id="feedback-title" className={styles.formTitle}>Расскажите о задаче</h2>
            <p className={styles.formIntro}>Укажите контакты и опишите, какие работы нужны на вашем объекте.</p>
            <FeedbackForm />
          </section>
        </div>

        <section className={styles.location} aria-labelledby="location-title">
          <div className={styles.locationDetails}>
            <p className="section-eyebrow">Адрес и реквизиты</p>
            <h2 id="location-title" className="section-title">Где мы находимся</h2>
            <address className={styles.address}>
              <SiteVisitIcon className="mt-1 size-6 shrink-0 text-accent" />
              <p>{company.address}</p>
            </address>
            <p className={styles.visitNote}>Свяжитесь с нами, чтобы согласовать встречу или выезд на объект.</p>
            <a href={company.yandexMaps.orgUrl} target="_blank" rel="noopener noreferrer" className={styles.mapLink}>
              Открыть в Яндекс Картах <ArrowUpRightIcon className="size-4 shrink-0" />
            </a>
            <dl className={styles.legalDetails}>
              <div><dt>Компания</dt><dd>{company.legalName}</dd></div>
              <div><dt>ИНН</dt><dd>{company.inn}</dd></div>
            </dl>
          </div>
          <div className={styles.map}>
            <iframe src={company.yandexMaps.mapWidget} title="СК Техпромстрой на Яндекс Картах" loading="lazy" className={styles.mapFrame} />
          </div>
        </section>
      </Container>
    </div>
  );
}
