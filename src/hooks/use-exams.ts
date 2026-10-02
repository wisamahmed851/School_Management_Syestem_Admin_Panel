"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { examsApi } from "@/lib/api/exams";
import type {
  CreateExamPayload,
  UpdateExamPayload,
  UpdateResultPayload,
} from "@/types/exam";

const KEY = ["exams"] as const;

export function useExamsList() {
  return useQuery({
    queryKey: KEY,
    queryFn: async () => (await examsApi.list()).data,
  });
}

export function useExam(id: number | string | undefined) {
  return useQuery({
    queryKey: ["exams", id],
    enabled: !!id,
    queryFn: async () => (await examsApi.show(id!)).data,
  });
}

export function useCreateExam() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateExamPayload) => examsApi.create(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
  });
}

export function useUpdateExam() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: number | string; payload: UpdateExamPayload }) =>
      examsApi.update(id, payload),
    // total_marks changes recompute results, so refresh the detail too
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
  });
}

export function useToggleExamStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number | string) => examsApi.toggleStatus(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
  });
}

export function useDeleteExam() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number | string) => examsApi.remove(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
  });
}

export function useUpdateResult() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      resultId,
      payload,
    }: {
      resultId: number;
      examId: number | string;
      payload: UpdateResultPayload;
    }) => examsApi.updateResult(resultId, payload),
    onSuccess: (_d, { examId }) => qc.invalidateQueries({ queryKey: ["exams", examId] }),
  });
}
