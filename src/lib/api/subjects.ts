import { apiClient } from "./client";
import { SUBJECTS } from "./endpoints";
import type {
  SubjectListResponse,
  SubjectResponse,
  SubjectToggleStatusResponse,
  SubjectDeleteResponse,
  CreateSubjectPayload,
  UpdateSubjectPayload,
} from "@/types/subject";

export const subjectsApi = {
  list: async (): Promise<SubjectListResponse> => {
    const res = await apiClient.get<SubjectListResponse>(SUBJECTS.INDEX);
    return res.data;
  },

  show: async (id: number | string): Promise<SubjectResponse> => {
    const res = await apiClient.get<SubjectResponse>(SUBJECTS.SHOW(id));
    return res.data;
  },

  create: async (payload: CreateSubjectPayload): Promise<SubjectResponse> => {
    const res = await apiClient.post<SubjectResponse>(SUBJECTS.STORE, payload);
    return res.data;
  },

  update: async (
    id: number | string,
    payload: UpdateSubjectPayload
  ): Promise<SubjectResponse> => {
    const res = await apiClient.put<SubjectResponse>(
      SUBJECTS.UPDATE(id),
      payload
    );
    return res.data;
  },

  toggleStatus: async (
    id: number | string
  ): Promise<SubjectToggleStatusResponse> => {
    const res = await apiClient.get<SubjectToggleStatusResponse>(
      SUBJECTS.TOGGLE_STATUS(id)
    );
    return res.data;
  },

  remove: async (id: number | string): Promise<SubjectDeleteResponse> => {
    const res = await apiClient.delete<SubjectDeleteResponse>(
      SUBJECTS.REMOVE(id)
    );
    return res.data;
  },
};
