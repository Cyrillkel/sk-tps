import Link from "next/link";

import { company } from "@/entities/company";
import { navigationServices, services } from "@/entities/service";
import { pageMetadata } from "@/shared/lib";
import { ArrowUpRightIcon, Breadcrumbs, Container } from "@/shared/ui";
import { HomeFeedback } from "@/widgets/home-feedback";
import { HomeServices } from "@/widgets/home-services";

export const metadata = pageMetadata({ title: "Инженерные и технологические системы", description: "Монтаж, ремонт и обслуживание промышленных систем, технологических трубопроводов, электроснабжения и теплоизоляции в Калужской, Тульской и Московской областях.", path: "/seti/" });

export function ServicesPage() {
  return (
    <>
      <section className="detail-hero pb-0" aria-labelledby="services-page-title">
        <Container>
          <Breadcrumbs items={[{ label: "Главная", href: "/" }, { label: "Услуги" }]} />
          <p className="section-eyebrow">Направления работы</p>
          <h1 id="services-page-title" className="detail-title max-w-4xl">Инженерные и технологические системы</h1>
          <p className="detail-lead max-w-3xl">Монтаж, ремонт и реконструкция систем предприятий и коммерческих объектов. {company.region}.</p>
        </Container>
      </section>
      <HomeServices />
      <section className="detail-section border-t border-border" aria-labelledby="service-types-title">
        <Container>
          <h2 id="service-types-title" className="section-title mb-8">Отдельные виды работ</h2>
          <ul className="related-services">{services.filter((service) => !navigationServices.some((item) => item.slug === service.slug)).map((service) => <li key={service.slug}><Link href={`/${service.slug}`}>{service.navigationLabel}<ArrowUpRightIcon className="size-4 shrink-0" /></Link></li>)}</ul>
        </Container>
      </section>
      <HomeFeedback />
    </>
  );
}
