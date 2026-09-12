"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { rolesApi } from "@/lib/api/roles";
import type { CreateRolePayload, UpdateRolePayload } from "@/types/role";

/** Cache key includes guard so filtered lists don't collide with the full list */
const rolesKey = (guard?: "admin" | "user") =>
  guard ? ["roles", guard] : ["roles"];

export function useRolesList(guard?: "admin" | "user") {
  return useQuery({
    queryKey: rolesKey(guard),
    queryFn: async () => {
      const res = await rolesApi.list(guard);
      return res.data;
    },
  });
}

export function useRole(id: number | string | undefined) {
  return useQuery({
    queryKey: ["roles", id],
    enabled: !!id,
    queryFn: async () => {
      const res = await rolesApi.show(id!);
      return res.data;
    },
  });
}

export function useCreateRole() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateRolePayload) => rolesApi.create(payload),
    // Invalidate all roles queries (unfiltered + any guard-filtered caches)
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: ["roles"], exact: false }),
  });
}

export function useUpdateRole() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: number | string;
      payload: UpdateRolePayload;
    }) => rolesApi.update(id, payload),
    onSuccess: (_data, { id }) => {
      qc.invalidateQueries({ queryKey: ["roles"], exact: false });
      qc.invalidateQueries({ queryKey: ["roles", id] });
    },
  });
}

export function useDeleteRole() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number | string) => rolesApi.remove(id),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: ["roles"], exact: false }),
  });
}

export function useToggleRoleStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number | string) => rolesApi.toggleStatus(id),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: ["roles"], exact: false }),
  });
}
