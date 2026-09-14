"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adminRolesApi } from "@/lib/api/admin-roles";
import type { CreateAdminRolePayload } from "@/types/admin-role";

const KEY = ["admin-roles"] as const;

export function useAdminRolesList() {
  return useQuery({
    queryKey: KEY,
    queryFn: async () => {
      const res = await adminRolesApi.list();
      return res.data;
    },
  });
}

export function useCreateAdminRole() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateAdminRolePayload) =>
      adminRolesApi.create(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
  });
}

export function useDeleteAdminRole() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number | string) => adminRolesApi.remove(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
  });
}
