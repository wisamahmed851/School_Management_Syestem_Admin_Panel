import { apiClient } from "./client";
import { USER_PERMISSIONS } from "./endpoints";
import type {
  UserPermissionListResponse,
  UserPermissionResponse,
  UserPermissionToggleStatusResponse,
  UserPermissionDeleteResponse,
  CreateUserPermissionPayload,
  UpdateUserPermissionPayload,
} from "@/types/user-permission";

export const userPermissionsApi = {
  list: async (): Promise<UserPermissionListResponse> => {
    const res = await apiClient.get<UserPermissionListResponse>(
      USER_PERMISSIONS.INDEX
    );
    return res.data;
  },

  show: async (id: number | string): Promise<UserPermissionResponse> => {
    const res = await apiClient.get<UserPermissionResponse>(
      USER_PERMISSIONS.SHOW(id)
    );
    return res.data;
  },

  create: async (
    payload: CreateUserPermissionPayload
  ): Promise<UserPermissionResponse> => {
    const res = await apiClient.post<UserPermissionResponse>(
      USER_PERMISSIONS.STORE,
      payload
    );
    return res.data;
  },

  update: async (
    id: number | string,
    payload: UpdateUserPermissionPayload
  ): Promise<UserPermissionResponse> => {
    const res = await apiClient.patch<UserPermissionResponse>(
      USER_PERMISSIONS.UPDATE(id),
      payload
    );
    return res.data;
  },

  toggleStatus: async (
    id: number | string
  ): Promise<UserPermissionToggleStatusResponse> => {
    const res = await apiClient.get<UserPermissionToggleStatusResponse>(
      USER_PERMISSIONS.TOGGLE_STATUS(id)
    );
    return res.data;
  },

  remove: async (
    id: number | string
  ): Promise<UserPermissionDeleteResponse> => {
    const res = await apiClient.delete<UserPermissionDeleteResponse>(
      USER_PERMISSIONS.REMOVE(id)
    );
    return res.data;
  },
};
