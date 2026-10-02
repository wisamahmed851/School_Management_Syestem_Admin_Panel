import { apiClient } from "./client";
import { TEACHERS } from "./endpoints";
import type {
  TeacherListResponse,
  TeacherResponse,
  TeacherToggleStatusResponse,
  TeacherDeleteResponse,
  CreateTeacherPayload,
  UpdateTeacherPayload,
} from "@/types/teacher";

export const teachersApi = {
  list: async (search?: string): Promise<TeacherListResponse> => {
    const res = await apiClient.get<TeacherListResponse>(TEACHERS.INDEX, {
      params: search ? { search } : undefined,
    });
    return res.data;
  },

  show: async (id: number | string): Promise<TeacherResponse> => {
    const res = await apiClient.get<TeacherResponse>(TEACHERS.SHOW(id));
    return res.data;
  },

  create: async (payload: CreateTeacherPayload): Promise<TeacherResponse> => {
    const res = await apiClient.post<TeacherResponse>(TEACHERS.STORE, payload);
    return res.data;
  },

  update: async (
    id: number | string,
    payload: UpdateTeacherPayload
  ): Promise<TeacherResponse> => {
    const res = await apiClient.put<TeacherResponse>(
      TEACHERS.UPDATE(id),
      payload
    );
    return res.data;
  },

  toggleStatus: async (
    id: number | string
  ): Promise<TeacherToggleStatusResponse> => {
    const res = await apiClient.get<TeacherToggleStatusResponse>(
      TEACHERS.TOGGLE_STATUS(id)
    );
    return res.data;
  },

  remove: async (id: number | string): Promise<TeacherDeleteResponse> => {
    const res = await apiClient.delete<TeacherDeleteResponse>(
      TEACHERS.REMOVE(id)
    );
    return res.data;
  },
};
