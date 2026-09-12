"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { permissionsApi } from "@/lib/api/permissions";
import type {
  CreatePermissionPayload,
  UpdatePermissionPayload,
} from "@/types/permission";

const PERMISSIONS_KEY = ["permissions"] as const;

export function usePermissionsList() {
  return useQuery({
    queryKey: PERMISSIONS_KEY,
    queryFn: async () => {
      const res = await permissionsApi.list();
      return res.data;
    },
  });
}

export function usePermission(id: number | string | undefined) {
  return useQuery({
    queryKey: ["permissions", id],
    enabled: !!id,
    queryFn: async () => {
      const res = await permissionsApi.show(id!);
      return res.data;
    },
  });
}

export function useCreatePermission() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreatePermissionPayload) =>
      permissionsApi.create(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: PERMISSIONS_KEY }),
  });
}

export function useUpdatePermission() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: number | string;
      payload: UpdatePermissionPayload;
    }) => permissionsApi.update(id, payload),
    onSuccess: (_data, { id }) => {
      qc.invalidateQueries({ queryKey: PERMISSIONS_KEY });
      qc.invalidateQueries({ queryKey: ["permissions", id] });
    },
  });
}

export function useDeletePermission() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number | string) => permissionsApi.remove(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: PERMISSIONS_KEY }),
  });
}

export function useTogglePermissionStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number | string) => permissionsApi.toggleStatus(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: PERMISSIONS_KEY }),
  });
}
