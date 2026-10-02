"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { assignmentsApi } from "@/lib/api/assignments";
import type {
  CreateAssignmentPayload,
  UpdateAssignmentPayload,
  UpdateSubmissionPayload,
} from "@/types/assignment";

const KEY = ["assignments"] as const;

export function useAssignmentsList() {
  return useQuery({
    queryKey: KEY,
    queryFn: async () => (await assignmentsApi.list()).data,
  });
}

export function useAssignment(id: number | string | undefined) {
  return useQuery({
    queryKey: ["assignments", id],
    enabled: !!id,
    queryFn: async () => (await assignmentsApi.show(id!)).data,
  });
}

export function useCreateAssignment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateAssignmentPayload) => assignmentsApi.create(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
  });
}

export function useUpdateAssignment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: number | string; payload: UpdateAssignmentPayload }) =>
      assignmentsApi.update(id, payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
  });
}

export function useDeleteAssignment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number | string) => assignmentsApi.remove(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
  });
}

export function useUpdateSubmission() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      submissionId,
      payload,
    }: {
      submissionId: number;
      assignmentId: number | string;
      payload: UpdateSubmissionPayload;
    }) => assignmentsApi.updateSubmission(submissionId, payload),
    onSuccess: (_d, { assignmentId }) =>
      qc.invalidateQueries({ queryKey: ["assignments", assignmentId] }),
  });
}
