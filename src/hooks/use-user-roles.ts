"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { userRolesApi } from "@/lib/api/user-roles";
import type { CreateUserRolePayload } from "@/types/user-role";

const KEY = ["user-roles"] as const;

export function useUserRolesList() {
  return useQuery({
    queryKey: KEY,
    queryFn: async () => {
      const res = await userRolesApi.list();
      return res.data;
    },
  });
}

export function useCreateUserRole() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateUserRolePayload) =>
      userRolesApi.create(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
  });
}

export function useDeleteUserRole() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number | string) => userRolesApi.remove(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
  });
}
