import type { Metadata } from "next";

import { privacyPolicy, type PolicyInline } from "@/entities/company";
import { Container } from "@/shared/ui";

export const metadata: Metadata = { title: "Политика обработки персональных данных" };

function InlineContent({ content }: { content: readonly PolicyInline[] }) {
  return content.map((part, index) => {
    if (typeof part === "string") return <span key={index}>{index > 0 ? " " : ""}{part}</span>;
    const external = part.href.startsWith("http");

    return (
      <span key={index}>
        {index > 0 ? " " : ""}
        <a
          href={part.href}
          {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
          className="font-medium text-accent underline underline-offset-2 hover:text-accent-hover"
        >
          {part.text}
        </a>
      </span>
    );
  });
}

export function PrivacyPolicyPage() {
  return (
    <section className="policy-page py-12 sm:py-16 lg:py-20">
      <Container className="mx-auto max-w-[1440px]">
        <p className="mb-5 text-xs font-semibold tracking-[0.18em] text-muted uppercase sm:mb-6">Документы</p>
        <h1 className="max-w-4xl text-3xl leading-[1.12] font-semibold tracking-[-0.035em] text-primary sm:text-4xl lg:text-5xl">
          {privacyPolicy.title}
        </h1>

        <article className="policy-body mt-10 max-w-[860px] sm:mt-12">
          {privacyPolicy.blocks.map((block, index) => {
            if (block.type === "heading") return <h2 key={index}>{block.text}</h2>;
            if (block.type === "list") {
              return (
                <ul key={index}>
                  {block.items.map((item) => <li key={item}>{item}</li>)}
                </ul>
              );
            }
            return <p key={index}><InlineContent content={block.content} /></p>;
          })}
        </article>
      </Container>
    </section>
  );
}
