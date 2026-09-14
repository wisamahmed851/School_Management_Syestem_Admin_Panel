import { apiClient } from "./client";
import { USER_ROLES } from "./endpoints";
import type {
  UserRoleListResponse,
  UserRoleResponse,
  UserRoleToggleStatusResponse,
  UserRoleDeleteResponse,
  CreateUserRolePayload,
  UpdateUserRolePayload,
} from "@/types/user-role";

export const userRolesApi = {
  // NOTE: 8.2 uses /list not /index — per API_DOCUMENTATION.txt section 8
  list: async (): Promise<UserRoleListResponse> => {
    const res = await apiClient.get<UserRoleListResponse>(USER_ROLES.LIST);
    return res.data;
  },

  show: async (id: number | string): Promise<UserRoleResponse> => {
    const res = await apiClient.get<UserRoleResponse>(USER_ROLES.SHOW(id));
    return res.data;
  },

  create: async (payload: CreateUserRolePayload): Promise<UserRoleResponse> => {
    const res = await apiClient.post<UserRoleResponse>(
      USER_ROLES.STORE,
      payload
    );
    return res.data;
  },

  update: async (
    id: number | string,
    payload: UpdateUserRolePayload
  ): Promise<UserRoleResponse> => {
    const res = await apiClient.patch<UserRoleResponse>(
      USER_ROLES.UPDATE(id),
      payload
    );
    return res.data;
  },

  toggleStatus: async (
    id: number | string
  ): Promise<UserRoleToggleStatusResponse> => {
    const res = await apiClient.get<UserRoleToggleStatusResponse>(
      USER_ROLES.TOGGLE_STATUS(id)
    );
    return res.data;
  },

  remove: async (id: number | string): Promise<UserRoleDeleteResponse> => {
    const res = await apiClient.delete<UserRoleDeleteResponse>(
      USER_ROLES.REMOVE(id)
    );
    return res.data;
  },
};
