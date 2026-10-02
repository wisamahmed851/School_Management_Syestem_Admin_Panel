"use client";

import { useQuery } from "@tanstack/react-query";
import { dashboardApi } from "@/lib/api/dashboard";

export function useDashboardSummary() {
  return useQuery({
    queryKey: ["dashboard", "summary"],
    queryFn: async () => (await dashboardApi.summary()).data,
    retry: false, // a 403 is a permission answer, not a transient failure
  });
}
