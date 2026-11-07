import { companyCredentials } from "@/entities/company";
import { DocumentGallery } from "@/features/document-gallery";
import { Container } from "@/shared/ui";

export function HomeCredentials() {
  return (
    <section
      id="documents"
      aria-labelledby="documents-title"
      className="home-credentials border-t border-border py-16 sm:py-20 lg:py-24"
    >
      <Container className="mx-auto max-w-[1440px]">
        <div className="mb-10 sm:mb-12 lg:mb-14">
          <h2 id="documents-title" className="text-3xl leading-[1.12] font-semibold tracking-[-0.035em] text-primary sm:text-4xl lg:text-5xl">
            Допуски и лицензии
          </h2>
        </div>

        <div className="divide-y divide-border border-t border-border">
          {companyCredentials.map((credential) => (
            <article key={credential.id} aria-labelledby={`${credential.id}-title`} className="grid gap-7 py-8 sm:gap-8 sm:py-10 lg:grid-cols-[0.85fr_1.65fr] lg:gap-14 lg:py-12">
              <div>
                <span className="mb-4 inline-flex min-h-8 items-center rounded-md border border-border bg-surface px-3 text-[11px] font-bold tracking-widest text-accent">
                  {credential.label}
                </span>
                <h3 id={`${credential.id}-title`} className="max-w-sm text-2xl leading-tight font-semibold tracking-tight text-primary sm:text-[28px]">
                  {credential.title}
                </h3>
                <div className="mt-4 space-y-3 text-sm leading-[1.8] text-muted">
                  {credential.paragraphs.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>
                <p className="mt-5 border-l-2 border-accent pl-3 text-xs leading-relaxed text-muted [overflow-wrap:anywhere]">
                  {credential.details}
                </p>
              </div>
              <DocumentGallery title={credential.title} documents={credential.documents} />
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
