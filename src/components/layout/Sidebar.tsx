"use client";

import { useEffect } from "react";
import { useSidebar } from "@/hooks/use-sidebar";
import { useAuthStore } from "@/lib/auth/auth-store";
import { Skeleton } from "@/components/ui/skeleton";
import SidebarItem from "@/components/layout/SidebarItem";

export default function Sidebar() {
  const { data, isPending } = useSidebar();
  const setPermissions = useAuthStore((s) => s.setPermissions);

  // Sync flat permissions array into global store once loaded
  useEffect(() => {
    if (data?.permissions) {
      setPermissions(data.permissions);
    }
  }, [data?.permissions, setPermissions]);

  return (
    <aside className="flex h-full w-64 shrink-0 flex-col border-r border-border bg-card">
      {/* Brand / Logo area */}
      <div className="flex h-14 items-center border-b border-border px-6">
        <span className="text-sm font-semibold text-foreground">
          School Admin
        </span>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-4">
        {isPending ? (
          // Loading skeleton — 5 placeholder rows
          <div className="space-y-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-9 w-full rounded-md" />
            ))}
          </div>
        ) : (
          <ul className="space-y-1">
            {data?.menu.map((node, idx) => (
              <SidebarItem key={idx} node={node} />
            ))}
          </ul>
        )}
      </nav>
    </aside>
  );
}
