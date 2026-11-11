import type { Metadata } from "next";
import Link from "next/link";

import { ArrowRightIcon, ArrowUpRightIcon, Container } from "@/shared/ui";

import styles from "./not-found-page.module.css";

export const metadata: Metadata = {
  title: "Страница не найдена",
  description: "Перейдите на главную, выберите услугу или свяжитесь с компанией «Техпромстрой».",
};

function RouteDiagram() {
  return (
    <div className={styles.diagram} aria-hidden="true">
      <div className={styles.diagramLabel}>
        <span className={styles.diagramMark} />
        СК ТЕХПРОМСТРОЙ
      </div>
      <svg viewBox="0 0 640 400" fill="none" focusable="false" className={styles.drawing}>
        <g className={styles.guides} strokeWidth="1" strokeDasharray="4 7">
          <path d="M46 105h550M46 299h550M164 56v288M315 56v288M512 56v288" />
          <circle cx="315" cy="202" r="133" />
        </g>
        <g className={styles.route} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          <path d="M28 248v73a24 24 0 0 0 24 24h154a24 24 0 0 0 24-24v-7M412 83V55a24 24 0 0 1 24-24h151a24 24 0 0 1 24 24v74" />
          <circle cx="28" cy="238" r="7" />
          <circle cx="611" cy="139" r="7" />
          <path d="m21 290 7 7 7-7m569-200 7-7 7 7" />
        </g>
        <g className={styles.pipeShadow} strokeWidth="34" strokeLinecap="round" strokeLinejoin="round">
          <path d="m154 105-76 127h124m-38-127v194" />
          <rect x="254" y="105" width="122" height="194" rx="59" />
          <path d="m502 105-76 127h124m-38-127v194" />
        </g>
        <g className={styles.pipes} strokeWidth="23" strokeLinecap="round" strokeLinejoin="round">
          <path d="m154 105-76 127h124m-38-127v194" />
          <path d="m502 105-76 127h124m-38-127v194" />
        </g>
        <rect className={styles.loop} x="254" y="105" width="122" height="194" rx="59" strokeWidth="23" />
        <g className={styles.flanges} strokeWidth="6" strokeLinecap="round">
          <path d="M147 278h34M147 126h34M495 278h34M495 126h34M246 179h16M246 225h16M368 179h16M368 225h16" />
        </g>
        <g className={styles.valve} strokeWidth="3">
          <circle cx="315" cy="202" r="23" />
          <path d="m299 186 32 32m0-32-32 32" />
          <circle cx="315" cy="202" r="5" />
        </g>
      </svg>
      <div className={styles.diagramFooter}>
        <span>ИНЖЕНЕРНЫЕ СИСТЕМЫ</span>
        <span className={styles.diagramRule} />
      </div>
    </div>
  );
}

export function NotFoundPage() {
  return (
    <section className={styles.section} aria-labelledby="not-found-title">
      <Container>
        <div className={styles.layout}>
          <div className={styles.content}>
            <p className={styles.eyebrow}>Ошибка 404</p>
            <h1 id="not-found-title" className={styles.title}>Страница не найдена</h1>
            <p className={styles.description}>
              Возможно, ссылка устарела или в адресе есть опечатка. Вернитесь на главную или выберите услугу для вашего объекта.
            </p>
            <div className={styles.actions}>
              <Link href="/" className={styles.primaryAction}>
                На главную <ArrowRightIcon className="size-5" />
              </Link>
              <Link href="/seti/" className={styles.secondaryAction}>
                Посмотреть услуги <ArrowUpRightIcon className="size-5" />
              </Link>
            </div>
            <nav className={styles.helpfulLinks} aria-label="Полезные разделы">
              <Link href="/proekty/">Наши работы <ArrowUpRightIcon className="size-4" /></Link>
              <Link href="/contacts/">Контакты <ArrowUpRightIcon className="size-4" /></Link>
            </nav>
          </div>
          <RouteDiagram />
        </div>
      </Container>
    </section>
  );
}
