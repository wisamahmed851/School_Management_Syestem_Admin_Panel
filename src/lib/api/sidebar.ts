import { apiClient } from "./client";
import { SIDEBAR } from "./endpoints";
import type { SidebarResponse } from "@/types/sidebar";

export const sidebarApi = {
  getMenu: async (): Promise<SidebarResponse> => {
    const response = await apiClient.get<SidebarResponse>(SIDEBAR.GET);
    return response.data;
  },
};
