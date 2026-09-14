"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adminPermissionsApi } from "@/lib/api/admin-permissions";
import type { CreateAdminPermissionPayload } from "@/types/admin-permission";

const KEY = ["admin-permissions"] as const;

export function useAdminPermissionsList() {
  return useQuery({
    queryKey: KEY,
    queryFn: async () => {
      const res = await adminPermissionsApi.list();
      return res.data;
    },
  });
}

export function useCreateAdminPermission() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateAdminPermissionPayload) =>
      adminPermissionsApi.create(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
  });
}

export function useDeleteAdminPermission() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number | string) => adminPermissionsApi.remove(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
  });
}
