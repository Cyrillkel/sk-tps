import type { Metadata } from "next";

import { company } from "@/entities/company";
import { Container } from "@/shared/ui";

export const metadata: Metadata = { title: "Контакты" };

export function ContactsPage() {
  return (
    <Container className="py-12 sm:py-20">
      <h1 className="text-3xl font-semibold tracking-tight sm:text-5xl">Контакты</h1>
      <address className="mt-8 flex max-w-xl flex-col items-start gap-4 text-lg not-italic">
        <a href={company.phoneHref} className="hover:text-accent">{company.phone}</a>
        <a href={`mailto:${company.email}`} className="hover:text-accent">{company.email}</a>
        <p className="text-muted">{company.address}</p>
      </address>
    </Container>
  );
}
