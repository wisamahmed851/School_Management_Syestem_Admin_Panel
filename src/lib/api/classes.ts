import { apiClient } from "./client";
import { CLASSES } from "./endpoints";
import type {
  ClassListResponse,
  ClassResponse,
  ClassToggleStatusResponse,
  ClassDeleteResponse,
  CreateClassPayload,
  UpdateClassPayload,
} from "@/types/class";

export const classesApi = {
  list: async (): Promise<ClassListResponse> => {
    const res = await apiClient.get<ClassListResponse>(CLASSES.INDEX);
    return res.data;
  },

  show: async (id: number | string): Promise<ClassResponse> => {
    const res = await apiClient.get<ClassResponse>(CLASSES.SHOW(id));
    return res.data;
  },

  create: async (payload: CreateClassPayload): Promise<ClassResponse> => {
    const res = await apiClient.post<ClassResponse>(CLASSES.STORE, payload);
    return res.data;
  },

  update: async (
    id: number | string,
    payload: UpdateClassPayload
  ): Promise<ClassResponse> => {
    const res = await apiClient.put<ClassResponse>(CLASSES.UPDATE(id), payload);
    return res.data;
  },

  toggleStatus: async (
    id: number | string
  ): Promise<ClassToggleStatusResponse> => {
    const res = await apiClient.get<ClassToggleStatusResponse>(
      CLASSES.TOGGLE_STATUS(id)
    );
    return res.data;
  },

  remove: async (id: number | string): Promise<ClassDeleteResponse> => {
    const res = await apiClient.delete<ClassDeleteResponse>(CLASSES.REMOVE(id));
    return res.data;
  },
};
