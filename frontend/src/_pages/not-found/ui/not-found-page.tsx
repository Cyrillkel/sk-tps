import Link from "next/link";

import { Container } from "@/shared/ui";

export function NotFoundPage() {
  return (
    <Container className="py-16 sm:py-24">
      <p className="text-sm font-medium text-muted">404</p>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-5xl">Страница не найдена</h1>
      <Link href="/" className="mt-8 inline-flex font-medium text-accent underline underline-offset-4">
        На главную
      </Link>
    </Container>
  );
}
