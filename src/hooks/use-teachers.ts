"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { teachersApi } from "@/lib/api/teachers";
import type { CreateTeacherPayload, UpdateTeacherPayload } from "@/types/teacher";

/** search-backed list — staleTime kept short (30 s) since results change per query */
export function useTeachersList(search?: string) {
  return useQuery({
    queryKey: ["teachers", search ?? ""],
    queryFn: async () => {
      const res = await teachersApi.list(search);
      return res.data;
    },
    staleTime: 30_000,
  });
}

export function useTeacher(id: number | string | undefined) {
  return useQuery({
    queryKey: ["teachers", "detail", id],
    enabled: !!id,
    queryFn: async () => {
      const res = await teachersApi.show(id!);
      return res.data;
    },
  });
}

export function useCreateTeacher() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateTeacherPayload) => teachersApi.create(payload),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: ["teachers"], exact: false }),
  });
}

export function useUpdateTeacher() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: number | string;
      payload: UpdateTeacherPayload;
    }) => teachersApi.update(id, payload),
    onSuccess: (_data, { id }) => {
      qc.invalidateQueries({ queryKey: ["teachers"], exact: false });
      qc.invalidateQueries({ queryKey: ["teachers", "detail", id] });
    },
  });
}

export function useDeleteTeacher() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number | string) => teachersApi.remove(id),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: ["teachers"], exact: false }),
  });
}

export function useToggleTeacherStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number | string) => teachersApi.toggleStatus(id),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: ["teachers"], exact: false }),
  });
}
