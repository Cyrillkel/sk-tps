import Link from "next/link";

import { services } from "@/entities/service";
import { ArrowUpRightIcon } from "@/shared/ui";

export function ServiceLinks({ onNavigate, mobile = false }: { onNavigate: () => void; mobile?: boolean }) {
  return (
    <ul className={mobile ? "grid gap-1" : "grid grid-cols-2 gap-x-3 gap-y-1"}>
      {services.map((service, index) => (
        <li key={service.slug}>
          <Link
            href={`/${service.slug}`}
            onClick={onNavigate}
            className="group flex min-h-12 items-center gap-3 rounded-lg px-3 py-3 text-sm text-primary transition-colors hover:bg-background hover:text-accent"
          >
            <span className="text-[10px] text-muted/70">{String(index + 1).padStart(2, "0")}</span>
            <span className="flex-1 font-medium">{service.navigationLabel}</span>
            <ArrowUpRightIcon className="size-3.5 shrink-0 text-muted/60 transition-colors group-hover:text-accent" />
          </Link>
        </li>
      ))}
    </ul>
  );
}
