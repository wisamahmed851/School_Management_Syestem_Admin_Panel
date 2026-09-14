"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { userPermissionsApi } from "@/lib/api/user-permissions";
import type { CreateUserPermissionPayload } from "@/types/user-permission";

const KEY = ["user-permissions"] as const;

export function useUserPermissionsList() {
  return useQuery({
    queryKey: KEY,
    queryFn: async () => {
      const res = await userPermissionsApi.list();
      return res.data;
    },
  });
}

export function useCreateUserPermission() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateUserPermissionPayload) =>
      userPermissionsApi.create(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
  });
}

export function useDeleteUserPermission() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number | string) => userPermissionsApi.remove(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
  });
}
