import { apiClient } from "./client";
import { PERMISSIONS } from "./endpoints";
import type {
  PermissionListResponse,
  PermissionResponse,
  PermissionToggleStatusResponse,
  PermissionDeleteResponse,
  CreatePermissionPayload,
  UpdatePermissionPayload,
} from "@/types/permission";

export const permissionsApi = {
  list: async (): Promise<PermissionListResponse> => {
    const res = await apiClient.get<PermissionListResponse>(PERMISSIONS.INDEX);
    return res.data;
  },

  show: async (id: number | string): Promise<PermissionResponse> => {
    const res = await apiClient.get<PermissionResponse>(PERMISSIONS.SHOW(id));
    return res.data;
  },

  create: async (
    payload: CreatePermissionPayload
  ): Promise<PermissionResponse> => {
    const res = await apiClient.post<PermissionResponse>(
      PERMISSIONS.STORE,
      payload
    );
    return res.data;
  },

  update: async (
    id: number | string,
    payload: UpdatePermissionPayload
  ): Promise<PermissionResponse> => {
    const res = await apiClient.patch<PermissionResponse>(
      PERMISSIONS.UPDATE(id),
      payload
    );
    return res.data;
  },

  toggleStatus: async (
    id: number | string
  ): Promise<PermissionToggleStatusResponse> => {
    const res = await apiClient.get<PermissionToggleStatusResponse>(
      PERMISSIONS.TOGGLE_STATUS(id)
    );
    return res.data;
  },

  remove: async (id: number | string): Promise<PermissionDeleteResponse> => {
    const res = await apiClient.delete<PermissionDeleteResponse>(
      PERMISSIONS.REMOVE(id)
    );
    return res.data;
  },
};
