"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { rolePermissionsApi } from "@/lib/api/role-permissions";
import type { CreateRolePermissionPayload } from "@/types/role-permission";

const KEY = ["role-permissions"] as const;

export function useRolePermissionsList() {
  return useQuery({
    queryKey: KEY,
    queryFn: async () => {
      const res = await rolePermissionsApi.list();
      return res.data;
    },
  });
}

export function useCreateRolePermission() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateRolePermissionPayload) =>
      rolePermissionsApi.create(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
  });
}

export function useDeleteRolePermission() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number | string) => rolePermissionsApi.remove(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
  });
}
