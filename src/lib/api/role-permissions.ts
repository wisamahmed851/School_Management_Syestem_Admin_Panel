import { apiClient } from "./client";
import { ROLE_PERMISSIONS } from "./endpoints";
import type {
  RolePermissionListResponse,
  RolePermissionResponse,
  RolePermissionToggleStatusResponse,
  RolePermissionDeleteResponse,
  CreateRolePermissionPayload,
  UpdateRolePermissionPayload,
} from "@/types/role-permission";

export const rolePermissionsApi = {
  list: async (): Promise<RolePermissionListResponse> => {
    const res = await apiClient.get<RolePermissionListResponse>(
      ROLE_PERMISSIONS.INDEX
    );
    return res.data;
  },

  show: async (id: number | string): Promise<RolePermissionResponse> => {
    const res = await apiClient.get<RolePermissionResponse>(
      ROLE_PERMISSIONS.SHOW(id)
    );
    return res.data;
  },

  create: async (
    payload: CreateRolePermissionPayload
  ): Promise<RolePermissionResponse> => {
    const res = await apiClient.post<RolePermissionResponse>(
      ROLE_PERMISSIONS.STORE,
      payload
    );
    return res.data;
  },

  update: async (
    id: number | string,
    payload: UpdateRolePermissionPayload
  ): Promise<RolePermissionResponse> => {
    const res = await apiClient.patch<RolePermissionResponse>(
      ROLE_PERMISSIONS.UPDATE(id),
      payload
    );
    return res.data;
  },

  toggleStatus: async (
    id: number | string
  ): Promise<RolePermissionToggleStatusResponse> => {
    const res = await apiClient.get<RolePermissionToggleStatusResponse>(
      ROLE_PERMISSIONS.TOGGLE_STATUS(id)
    );
    return res.data;
  },

  remove: async (id: number | string): Promise<RolePermissionDeleteResponse> => {
    const res = await apiClient.delete<RolePermissionDeleteResponse>(
      ROLE_PERMISSIONS.REMOVE(id)
    );
    return res.data;
  },
};
