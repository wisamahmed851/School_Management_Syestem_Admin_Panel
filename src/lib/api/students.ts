import { apiClient } from "./client";
import { STUDENTS } from "./endpoints";
import type {
  StudentListResponse,
  StudentResponse,
  StudentToggleStatusResponse,
  StudentDeleteResponse,
  CreateStudentPayload,
  UpdateStudentPayload,
} from "@/types/student";

export const studentsApi = {
  list: async (): Promise<StudentListResponse> => {
    const res = await apiClient.get<StudentListResponse>(STUDENTS.INDEX);
    return res.data;
  },

  show: async (id: number | string): Promise<StudentResponse> => {
    const res = await apiClient.get<StudentResponse>(STUDENTS.SHOW(id));
    return res.data;
  },

  create: async (payload: CreateStudentPayload): Promise<StudentResponse> => {
    const res = await apiClient.post<StudentResponse>(STUDENTS.STORE, payload);
    return res.data;
  },

  update: async (
    id: number | string,
    payload: UpdateStudentPayload
  ): Promise<StudentResponse> => {
    const res = await apiClient.put<StudentResponse>(
      STUDENTS.UPDATE(id),
      payload
    );
    return res.data;
  },

  toggleStatus: async (
    id: number | string
  ): Promise<StudentToggleStatusResponse> => {
    const res = await apiClient.get<StudentToggleStatusResponse>(
      STUDENTS.TOGGLE_STATUS(id)
    );
    return res.data;
  },

  remove: async (id: number | string): Promise<StudentDeleteResponse> => {
    const res = await apiClient.delete<StudentDeleteResponse>(
      STUDENTS.REMOVE(id)
    );
    return res.data;
  },
};
