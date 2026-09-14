import { apiClient } from "./client";
import { ADMIN_PERMISSIONS } from "./endpoints";
import type {
  AdminPermissionListResponse,
  AdminPermissionResponse,
  AdminPermissionToggleStatusResponse,
  AdminPermissionDeleteResponse,
  CreateAdminPermissionPayload,
  UpdateAdminPermissionPayload,
} from "@/types/admin-permission";

export const adminPermissionsApi = {
  list: async (): Promise<AdminPermissionListResponse> => {
    const res = await apiClient.get<AdminPermissionListResponse>(
      ADMIN_PERMISSIONS.INDEX
    );
    return res.data;
  },

  show: async (id: number | string): Promise<AdminPermissionResponse> => {
    const res = await apiClient.get<AdminPermissionResponse>(
      ADMIN_PERMISSIONS.SHOW(id)
    );
    return res.data;
  },

  create: async (
    payload: CreateAdminPermissionPayload
  ): Promise<AdminPermissionResponse> => {
    const res = await apiClient.post<AdminPermissionResponse>(
      ADMIN_PERMISSIONS.STORE,
      payload
    );
    return res.data;
  },

  update: async (
    id: number | string,
    payload: UpdateAdminPermissionPayload
  ): Promise<AdminPermissionResponse> => {
    const res = await apiClient.patch<AdminPermissionResponse>(
      ADMIN_PERMISSIONS.UPDATE(id),
      payload
    );
    return res.data;
  },

  toggleStatus: async (
    id: number | string
  ): Promise<AdminPermissionToggleStatusResponse> => {
    const res = await apiClient.get<AdminPermissionToggleStatusResponse>(
      ADMIN_PERMISSIONS.TOGGLE_STATUS(id)
    );
    return res.data;
  },

  remove: async (
    id: number | string
  ): Promise<AdminPermissionDeleteResponse> => {
    const res = await apiClient.delete<AdminPermissionDeleteResponse>(
      ADMIN_PERMISSIONS.REMOVE(id)
    );
    return res.data;
  },
};
