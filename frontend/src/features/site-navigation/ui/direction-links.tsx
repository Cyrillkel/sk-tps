import Link from "next/link";

import type { ServiceDirection } from "@/entities/service";
import { ArrowRightIcon, ArrowUpRightIcon } from "@/shared/ui";

import { ServiceLinks } from "./service-links";

type DirectionLinksProps = {
  direction: ServiceDirection;
  onNavigate: () => void;
  mobile?: boolean;
};

export function DirectionLinks({ direction, onNavigate, mobile = false }: DirectionLinksProps) {
  return (
    <>
      <Link
        href={`/${direction.slug}`}
        onClick={onNavigate}
        className="mb-4 flex min-h-12 items-center justify-between gap-4 rounded-lg bg-background px-3 py-3 text-sm font-semibold text-primary hover:text-accent"
      >
        {direction.overviewLabel}
        <ArrowRightIcon className="size-4 shrink-0" />
      </Link>
      <div className={direction.slug === "seti" && !mobile ? "grid grid-cols-2 gap-5" : "space-y-5"}>
        {direction.slug === "seti" && (
          <div>
            <p className="mb-2 px-3 text-xs font-semibold text-muted">Услуги</p>
            <ServiceLinks mobile={mobile} onNavigate={onNavigate} />
          </div>
        )}
        <div>
          <p className="mb-2 px-3 text-xs font-semibold text-muted">Наши работы</p>
          <ul className="grid gap-1">
            {direction.projects.map((project) => (
              <li key={project.href}>
                <a
                  href={project.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${project.title} (откроется в новой вкладке)`}
                  onClick={onNavigate}
                  className="group flex min-h-11 items-center gap-3 rounded-lg px-3 py-3 text-sm leading-relaxed text-primary hover:bg-background hover:text-accent"
                >
                  <span className="flex-1">{project.title}</span>
                  <ArrowUpRightIcon className="size-3.5 shrink-0 text-muted/60 group-hover:text-accent" />
                </a>
              </li>
            ))}
          </ul>
          <a
            href={direction.projectsHref}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Все работы: ${direction.navigationLabel} (откроется в новой вкладке)`}
            onClick={onNavigate}
            className="mt-3 flex min-h-11 items-center justify-between gap-3 border-t border-border px-3 pt-3 text-sm font-semibold text-accent hover:text-accent-hover"
          >
            Все работы направления
            <ArrowUpRightIcon className="size-4 shrink-0" />
          </a>
        </div>
      </div>
    </>
  );
}
