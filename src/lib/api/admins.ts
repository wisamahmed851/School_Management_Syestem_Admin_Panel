import { apiClient } from "./client";
import { ADMINS } from "./endpoints";
import type {
  AdminListResponse,
  AdminResourceResponse,
  AdminToggleStatusResponse,
  AdminDeleteResponse,
  CreateAdminPayload,
  UpdateAdminPayload,
} from "@/types/admin-resource";

function toFormData(payload: CreateAdminPayload | UpdateAdminPayload): FormData {
  const fd = new FormData();
  Object.entries(payload).forEach(([key, value]) => {
    if (value === undefined || value === null) return;
    if (value instanceof File) {
      fd.append(key, value);
    } else {
      fd.append(key, String(value));
    }
  });
  return fd;
}

export const adminsApi = {
  list: async (): Promise<AdminListResponse> => {
    const res = await apiClient.get<AdminListResponse>(ADMINS.INDEX);
    return res.data;
  },

  show: async (id: number | string): Promise<AdminResourceResponse> => {
    const res = await apiClient.get<AdminResourceResponse>(ADMINS.SHOW(id));
    return res.data;
  },

  create: async (payload: CreateAdminPayload): Promise<AdminResourceResponse> => {
    const res = await apiClient.post<AdminResourceResponse>(
      ADMINS.STORE,
      toFormData(payload),
      { headers: { "Content-Type": "multipart/form-data" } }
    );
    return res.data;
  },

  update: async (
    id: number | string,
    payload: UpdateAdminPayload
  ): Promise<AdminResourceResponse> => {
    const res = await apiClient.put<AdminResourceResponse>(
      ADMINS.UPDATE(id),
      toFormData(payload),
      { headers: { "Content-Type": "multipart/form-data" } }
    );
    return res.data;
  },

  toggleStatus: async (id: number | string): Promise<AdminToggleStatusResponse> => {
    const res = await apiClient.get<AdminToggleStatusResponse>(
      ADMINS.TOGGLE_STATUS(id)
    );
    return res.data;
  },

  remove: async (id: number | string): Promise<AdminDeleteResponse> => {
    const res = await apiClient.delete<AdminDeleteResponse>(ADMINS.REMOVE(id));
    return res.data;
  },
};
