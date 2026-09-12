"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

function toLabel(segment: string): string {
  return segment
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

export default function Breadcrumbs() {
  const pathname = usePathname();

  // Split path and filter empty strings
  const segments = pathname.split("/").filter(Boolean);

  if (segments.length === 0) return null;

  // Build cumulative hrefs: ["dashboard", "dashboard/admins", ...]
  const crumbs = segments.map((segment, index) => ({
    label: toLabel(segment),
    href: "/" + segments.slice(0, index + 1).join("/"),
    isLast: index === segments.length - 1,
  }));

  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex items-center gap-1 text-sm">
        {crumbs.map((crumb, i) => (
          <li key={crumb.href} className="flex items-center gap-1">
            {i > 0 && (
              <span className="text-muted-foreground" aria-hidden>
                /
              </span>
            )}
            {crumb.isLast ? (
              <span className="font-medium text-foreground">{crumb.label}</span>
            ) : (
              <Link
                href={crumb.href}
                className="text-muted-foreground transition-colors hover:text-foreground"
              >
                {crumb.label}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
