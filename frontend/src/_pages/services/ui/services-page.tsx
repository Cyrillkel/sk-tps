import type { Metadata } from "next";

import { Container } from "@/shared/ui";

export const metadata: Metadata = {
  title: "Инженерные и технологические системы",
};

export function ServicesPage() {
  return (
    <Container className="py-12 sm:py-20">
      <h1 className="max-w-4xl text-3xl font-semibold tracking-tight text-balance sm:text-5xl">Инженерные и технологические системы</h1>
    </Container>
  );
}
