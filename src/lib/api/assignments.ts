import { apiClient } from "./client";
import { ASSIGNMENTS } from "./endpoints";
import type {
  AssignmentListResponse,
  AssignmentResponse,
  AssignmentDeleteResponse,
  SubmissionResponse,
  CreateAssignmentPayload,
  UpdateAssignmentPayload,
  UpdateSubmissionPayload,
} from "@/types/assignment";

export const assignmentsApi = {
  list: async (): Promise<AssignmentListResponse> => {
    const res = await apiClient.get<AssignmentListResponse>(ASSIGNMENTS.INDEX);
    return res.data;
  },

  show: async (id: number | string): Promise<AssignmentResponse> => {
    const res = await apiClient.get<AssignmentResponse>(ASSIGNMENTS.SHOW(id));
    return res.data;
  },

  create: async (payload: CreateAssignmentPayload): Promise<AssignmentResponse> => {
    const res = await apiClient.post<AssignmentResponse>(ASSIGNMENTS.STORE, payload);
    return res.data;
  },

  update: async (
    id: number | string,
    payload: UpdateAssignmentPayload
  ): Promise<AssignmentResponse> => {
    const res = await apiClient.put<AssignmentResponse>(ASSIGNMENTS.UPDATE(id), payload);
    return res.data;
  },

  remove: async (id: number | string): Promise<AssignmentDeleteResponse> => {
    const res = await apiClient.delete<AssignmentDeleteResponse>(ASSIGNMENTS.REMOVE(id));
    return res.data;
  },

  updateSubmission: async (
    submissionId: number | string,
    payload: UpdateSubmissionPayload
  ): Promise<SubmissionResponse> => {
    const res = await apiClient.put<SubmissionResponse>(
      ASSIGNMENTS.UPDATE_SUBMISSION(submissionId),
      payload
    );
    return res.data;
  },
};
