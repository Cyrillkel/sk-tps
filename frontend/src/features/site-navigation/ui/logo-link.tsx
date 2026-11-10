"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { MouseEvent, ReactNode } from "react";

import { company } from "@/entities/company";
import { scrollToTop } from "@/shared/lib";

type LogoLinkProps = {
  children: ReactNode;
  onNavigate?: () => void;
};

/** Logo link to the home page; on the home page itself it scrolls back to the top. */
export function LogoLink({ children, onNavigate }: LogoLinkProps) {
  const pathname = usePathname().replace(/\/$/, "") || "/";

  function handleClick(event: MouseEvent<HTMLAnchorElement>) {
    onNavigate?.();
    if (pathname !== "/" || event.metaKey || event.ctrlKey || event.shiftKey || event.button !== 0) return;

    event.preventDefault();
    scrollToTop();
  }

  return (
    <Link href="/" aria-label={`${company.name} — главная`} onClick={handleClick} className="header-logo-link block shrink-0">
      {children}
    </Link>
  );
}
