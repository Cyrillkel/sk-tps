import Link from "next/link";

export function Breadcrumbs({ items }: { items: readonly { label: string; href?: string }[] }) {
  return (
    <nav aria-label="Хлебные крошки" className="breadcrumbs">
      <ol>
        {items.map((item, index) => (
          <li key={`${item.label}-${index}`}>
            {index > 0 && <span className="text-muted/50" aria-hidden="true">/</span>}
            {item.href ? <Link href={item.href} aria-current={index === items.length - 1 ? "page" : undefined} className="hover:text-accent">{item.label}</Link> : <span aria-current={index === items.length - 1 ? "page" : undefined}>{item.label}</span>}
          </li>
        ))}
      </ol>
    </nav>
  );
}
