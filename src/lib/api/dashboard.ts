import { apiClient } from "./client";
import { DASHBOARD } from "./endpoints";
import type { DashboardSummaryResponse } from "@/types/dashboard";

export const dashboardApi = {
  summary: async (): Promise<DashboardSummaryResponse> => {
    const res = await apiClient.get<DashboardSummaryResponse>(DASHBOARD.SUMMARY);
    return res.data;
  },
};
