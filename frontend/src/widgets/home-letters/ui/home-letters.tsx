import { companyLetters } from "@/entities/company";
import { DocumentGallery } from "@/features/document-gallery";
import { Container } from "@/shared/ui";

export function HomeLetters() {
  return (
    <section id="letters" aria-labelledby="letters-title" className="home-letters py-16 sm:py-20 lg:py-24">
      <Container className="relative z-10 mx-auto max-w-[1440px]">
        <div className="mb-10 grid gap-4 sm:mb-12 sm:gap-5 lg:mb-14 lg:grid-cols-[1.3fr_1fr] lg:items-end lg:gap-16">
          <div>
            <p className="mb-5 text-xs font-semibold tracking-[0.18em] text-muted uppercase sm:mb-6">Отзывы заказчиков</p>
            <h2 id="letters-title" className="text-3xl leading-[1.12] font-semibold tracking-[-0.035em] text-primary sm:text-4xl lg:text-5xl">
              Благодарственные письма
            </h2>
          </div>
          <p className="max-w-lg text-sm leading-relaxed text-muted sm:text-base">
            Нам доверяют государственные учреждения, муниципальные службы и промышленные предприятия.
          </p>
        </div>

        <DocumentGallery title="Благодарственные письма" documents={companyLetters} itemLabel="Письмо" />
      </Container>
    </section>
  );
}
