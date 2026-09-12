"use client";

import { useQuery } from "@tanstack/react-query";
import { authApi } from "@/lib/api/auth";
import type { AdminProfile } from "@/types/admin";

export function useProfile() {
  return useQuery<AdminProfile>({
    queryKey: ["admin-profile"],
    queryFn: async () => {
      const res = await authApi.getProfile();
      return res.data;
    },
  });
}
