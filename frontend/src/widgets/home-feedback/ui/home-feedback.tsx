import { company } from "@/entities/company";
import { FeedbackForm } from "@/features/feedback-form";
import { Container, MailIcon, MaxIcon, PhoneIcon, TelegramIcon, WhatsAppIcon } from "@/shared/ui";

const messengers = [
  { href: company.whatsapp, label: "WhatsApp", Icon: WhatsAppIcon, iconClass: "size-5" },
  { href: company.max, label: "Max", Icon: MaxIcon, iconClass: "size-7" },
  { href: company.telegram, label: "Telegram", Icon: TelegramIcon, iconClass: "size-5" },
] as const;

export function HomeFeedback() {
  return (
    <section id="feedback" aria-labelledby="feedback-title" className="home-feedback py-16 sm:py-20 lg:py-24">
      <Container className="mx-auto max-w-[1440px]">
        <div className="feedback-card grid lg:grid-cols-[0.85fr_1.15fr]">
          <div className="feedback-aside relative isolate overflow-hidden p-6 sm:p-10 lg:p-12">
            <svg className="feedback-lines" viewBox="0 0 400 400" fill="none" aria-hidden="true" focusable="false">
              <g stroke="currentColor" strokeWidth="1">
                <path d="M-10 300h150a40 40 0 0 0 40-40V80a40 40 0 0 1 40-40h190" />
                <path d="M-10 320h162a48 48 0 0 0 48-48V92a32 32 0 0 1 32-32h178" />
                <circle cx="180" cy="170" r="20" />
                <circle cx="180" cy="170" r="12" />
                <path d="M300 410V300a30 30 0 0 1 30-30h80" />
              </g>
            </svg>

            <p className="mb-5 text-xs font-semibold tracking-[0.18em] text-service-muted uppercase sm:mb-6">Форма обратной связи</p>
            <h2 id="feedback-title" className="text-3xl leading-[1.12] font-semibold tracking-[-0.035em] text-service-foreground sm:text-4xl lg:text-[44px]">
              Задайте вопрос <span className="text-brand">или оставьте заявку</span>
            </h2>
            <p className="mt-5 max-w-md text-sm leading-relaxed text-service-muted sm:text-base">
              Мы свяжемся с вами, ответим на вопросы и проконсультируем по вашему объекту.
            </p>

            <ul className="mt-8 grid gap-3 sm:mt-10">
              <li>
                <a href={company.phoneHref} className="feedback-contact">
                  <span className="feedback-contact-icon"><PhoneIcon className="size-5" /></span>
                  <span>
                    <span className="block text-xs text-service-muted">Телефон</span>
                    <span className="block text-base font-semibold text-service-foreground sm:text-lg">{company.phone}</span>
                  </span>
                </a>
              </li>
              <li>
                <a href={`mailto:${company.email}`} className="feedback-contact">
                  <span className="feedback-contact-icon"><MailIcon className="size-5" /></span>
                  <span>
                    <span className="block text-xs text-service-muted">Email</span>
                    <span className="block text-base font-semibold text-service-foreground sm:text-lg">{company.email}</span>
                  </span>
                </a>
              </li>
            </ul>

            <div className="mt-6 flex items-center gap-3 border-t border-service-border pt-6">
              <span className="mr-1 text-xs text-service-muted">Мессенджеры</span>
              {messengers.map(({ href, label, Icon, iconClass }) => (
                <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label} className="feedback-messenger">
                  <Icon className={iconClass} />
                </a>
              ))}
            </div>
          </div>

          <div className="feedback-form-panel p-6 sm:p-10 lg:p-12">
            <FeedbackForm />
          </div>
        </div>
      </Container>
    </section>
  );
}
