"use client";

import { useQuery } from "@tanstack/react-query";
import { sidebarApi } from "@/lib/api/sidebar";
import type { SidebarData } from "@/types/sidebar";

export function useSidebar() {
  return useQuery<SidebarData>({
    queryKey: ["sidebar"],
    queryFn: async () => {
      const res = await sidebarApi.getMenu();
      return res.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes — menu doesn't change mid-session
  });
}

/** Actions the admin may perform on a menu route, e.g. useRouteActions("/subjects").actions.create. UX only; the backend enforces. */
export function useRouteActions(route: string) {
  const { data: sidebar, isPending } = useSidebar();
  const node = sidebar?.menu
    .flatMap((n) => ("children" in n ? n.children : [n]))
    .find((n) => "route" in n && n.route === route);
  const actions: Record<string, boolean> = node && "actions" in node ? node.actions : {};
  return { actions, isPending, hasAccess: !!node };
}
