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
