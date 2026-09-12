"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import type { MenuNode } from "@/types/sidebar";

interface SidebarItemProps {
  node: MenuNode;
  depth?: number;
}

function ChevronRight() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <polyline points="9 18 15 12 9 6" />
    </svg>
  );
}

function ChevronDown() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

export default function SidebarItem({ node, depth = 0 }: SidebarItemProps) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // Leaf node — has a route
  if ("route" in node) {
    const isActive = pathname === node.route;
    return (
      <li>
        <Link
          href={node.route}
          className={cn(
            "flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors",
            depth > 0 && "ml-3",
            isActive
              ? "bg-accent text-accent-foreground font-medium"
              : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
          )}
        >
          {node.label}
        </Link>
      </li>
    );
  }

  // Group node — has children
  return (
    <li>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className={cn(
          "flex w-full items-center justify-between rounded-md px-3 py-2 text-sm transition-colors",
          depth > 0 && "ml-3",
          "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
        )}
        aria-expanded={open}
      >
        <span>{node.label}</span>
        {open ? <ChevronDown /> : <ChevronRight />}
      </button>

      {open && (
        <ul className="mt-1 space-y-1">
          {node.children.map((child, idx) => (
            <SidebarItem key={idx} node={child} depth={depth + 1} />
          ))}
        </ul>
      )}
    </li>
  );
}
