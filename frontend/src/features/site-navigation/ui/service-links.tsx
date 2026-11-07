import Link from "next/link";

import { navigationServices } from "@/entities/service";

type ServiceLinksProps = {
  pathname: string;
  onNavigate: () => void;
};

export function ServiceLinks({ pathname, onNavigate }: ServiceLinksProps) {
  return (
    <ul className="space-y-1">
      {navigationServices.map((service) => (
        <li key={service.slug}>
          <Link
            href={`/${service.slug}`}
            aria-current={pathname === `/${service.slug}` ? "page" : undefined}
            onClick={onNavigate}
            className={`flex min-h-11 items-center rounded-lg px-4 py-3 text-sm leading-relaxed font-semibold hover:bg-background hover:text-accent ${pathname === `/${service.slug}` ? "bg-background text-accent" : "text-primary"}`}
          >
            {service.navigationLabel}
          </Link>
        </li>
      ))}
    </ul>
  );
}
