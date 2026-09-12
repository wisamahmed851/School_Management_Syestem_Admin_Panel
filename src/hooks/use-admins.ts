"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adminsApi } from "@/lib/api/admins";
import type { CreateAdminPayload, UpdateAdminPayload } from "@/types/admin-resource";

const ADMINS_KEY = ["admins"] as const;

export function useAdminsList() {
  return useQuery({
    queryKey: ADMINS_KEY,
    queryFn: async () => {
      const res = await adminsApi.list();
      return res.data;
    },
  });
}

export function useAdmin(id: number | string | undefined) {
  return useQuery({
    queryKey: ["admins", id],
    enabled: !!id,
    queryFn: async () => {
      const res = await adminsApi.show(id!);
      return res.data;
    },
  });
}

export function useCreateAdmin() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateAdminPayload) => adminsApi.create(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ADMINS_KEY }),
  });
}

export function useUpdateAdmin() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: number | string;
      payload: UpdateAdminPayload;
    }) => adminsApi.update(id, payload),
    onSuccess: (_data, { id }) => {
      qc.invalidateQueries({ queryKey: ADMINS_KEY });
      qc.invalidateQueries({ queryKey: ["admins", id] });
    },
  });
}

export function useDeleteAdmin() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number | string) => adminsApi.remove(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ADMINS_KEY }),
  });
}

export function useToggleAdminStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number | string) => adminsApi.toggleStatus(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ADMINS_KEY }),
  });
}
