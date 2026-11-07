import Link from "next/link";

import { serviceDirections } from "@/entities/service";

type DirectionLinksProps = {
  pathname: string;
  onNavigate: () => void;
};

export function DirectionLinks({ pathname, onNavigate }: DirectionLinksProps) {
  return (
    <ul className="space-y-1">
      {serviceDirections.map((direction) => (
        <li key={direction.slug}>
          <Link
            href={`/${direction.slug}`}
            aria-current={pathname === `/${direction.slug}` ? "page" : undefined}
            onClick={onNavigate}
            className={`flex min-h-11 items-center rounded-lg px-4 py-3 text-sm leading-relaxed font-semibold hover:bg-background hover:text-accent ${pathname === `/${direction.slug}` ? "bg-background text-accent" : "text-primary"}`}
          >
            {direction.navigationLabel}
          </Link>
        </li>
      ))}
    </ul>
  );
}
