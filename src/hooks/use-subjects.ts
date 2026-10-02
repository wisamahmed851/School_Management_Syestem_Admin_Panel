"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { subjectsApi } from "@/lib/api/subjects";
import type { CreateSubjectPayload, UpdateSubjectPayload } from "@/types/subject";

const SUBJECTS_KEY = ["subjects"] as const;

export function useSubjectsList() {
  return useQuery({
    queryKey: SUBJECTS_KEY,
    queryFn: async () => {
      const res = await subjectsApi.list();
      return res.data;
    },
  });
}

export function useSubject(id: number | string | undefined) {
  return useQuery({
    queryKey: ["subjects", id],
    enabled: !!id,
    queryFn: async () => {
      const res = await subjectsApi.show(id!);
      return res.data;
    },
  });
}

export function useCreateSubject() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateSubjectPayload) => subjectsApi.create(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: SUBJECTS_KEY }),
  });
}

export function useUpdateSubject() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: number | string;
      payload: UpdateSubjectPayload;
    }) => subjectsApi.update(id, payload),
    onSuccess: (_data, { id }) => {
      qc.invalidateQueries({ queryKey: SUBJECTS_KEY });
      qc.invalidateQueries({ queryKey: ["subjects", id] });
    },
  });
}

export function useDeleteSubject() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number | string) => subjectsApi.remove(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: SUBJECTS_KEY }),
  });
}

export function useToggleSubjectStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number | string) => subjectsApi.toggleStatus(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: SUBJECTS_KEY }),
  });
}
