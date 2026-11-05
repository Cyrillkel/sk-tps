import { company } from "@/entities/company";

export function HomePage() {
  return <h1 className="sr-only">Строительная компания «{company.name}»</h1>;
}
