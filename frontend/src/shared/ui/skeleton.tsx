import type { ComponentProps } from "react";

/** Skeleton placeholder with the shadcn/ui API, styled with project tokens. */
export function Skeleton({ className = "", ...props }: ComponentProps<"div">) {
  return <div data-slot="skeleton" className={`skeleton ${className}`} {...props} />;
}
