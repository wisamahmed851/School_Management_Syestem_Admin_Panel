"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { guardiansApi } from "@/lib/api/guardians";
import type { CreateGuardianPayload, UpdateGuardianPayload } from "@/types/guardian";

/** search-backed list — staleTime 30 s */
export function useGuardiansList(search?: string) {
  return useQuery({
    queryKey: ["guardians", search ?? ""],
    queryFn: async () => {
      const res = await guardiansApi.list(search);
      return res.data;
    },
    staleTime: 30_000,
  });
}

export function useGuardian(id: number | string | undefined) {
  return useQuery({
    queryKey: ["guardians", "detail", id],
    enabled: !!id,
    queryFn: async () => {
      const res = await guardiansApi.show(id!);
      return res.data;
    },
  });
}

export function useCreateGuardian() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateGuardianPayload) => guardiansApi.create(payload),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: ["guardians"], exact: false }),
  });
}

export function useUpdateGuardian() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: number | string;
      payload: UpdateGuardianPayload;
    }) => guardiansApi.update(id, payload),
    onSuccess: (_data, { id }) => {
      qc.invalidateQueries({ queryKey: ["guardians"], exact: false });
      qc.invalidateQueries({ queryKey: ["guardians", "detail", id] });
    },
  });
}

export function useDeleteGuardian() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number | string) => guardiansApi.remove(id),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: ["guardians"], exact: false }),
  });
}
