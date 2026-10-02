import { apiClient } from "./client";
import { EXAMS } from "./endpoints";
import type {
  ExamListResponse,
  ExamResponse,
  ExamResultResponse,
  ExamToggleStatusResponse,
  ExamDeleteResponse,
  CreateExamPayload,
  UpdateExamPayload,
  UpdateResultPayload,
} from "@/types/exam";

export const examsApi = {
  list: async (): Promise<ExamListResponse> => {
    const res = await apiClient.get<ExamListResponse>(EXAMS.INDEX);
    return res.data;
  },

  show: async (id: number | string): Promise<ExamResponse> => {
    const res = await apiClient.get<ExamResponse>(EXAMS.SHOW(id));
    return res.data;
  },

  create: async (payload: CreateExamPayload): Promise<ExamResponse> => {
    const res = await apiClient.post<ExamResponse>(EXAMS.STORE, payload);
    return res.data;
  },

  update: async (
    id: number | string,
    payload: UpdateExamPayload
  ): Promise<ExamResponse> => {
    const res = await apiClient.put<ExamResponse>(EXAMS.UPDATE(id), payload);
    return res.data;
  },

  toggleStatus: async (id: number | string): Promise<ExamToggleStatusResponse> => {
    const res = await apiClient.get<ExamToggleStatusResponse>(EXAMS.TOGGLE_STATUS(id));
    return res.data;
  },

  remove: async (id: number | string): Promise<ExamDeleteResponse> => {
    const res = await apiClient.delete<ExamDeleteResponse>(EXAMS.REMOVE(id));
    return res.data;
  },

  updateResult: async (
    resultId: number | string,
    payload: UpdateResultPayload
  ): Promise<ExamResultResponse> => {
    const res = await apiClient.put<ExamResultResponse>(EXAMS.UPDATE_RESULT(resultId), payload);
    return res.data;
  },
};
