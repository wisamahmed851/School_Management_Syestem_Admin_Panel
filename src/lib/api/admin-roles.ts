import { apiClient } from "./client";
import { ADMIN_ROLES } from "./endpoints";
import type {
  AdminRoleListResponse,
  AdminRoleResponse,
  AdminRoleToggleStatusResponse,
  AdminRoleDeleteResponse,
  CreateAdminRolePayload,
  UpdateAdminRolePayload,
} from "@/types/admin-role";

export const adminRolesApi = {
  list: async (): Promise<AdminRoleListResponse> => {
    const res = await apiClient.get<AdminRoleListResponse>(ADMIN_ROLES.INDEX);
    return res.data;
  },

  show: async (id: number | string): Promise<AdminRoleResponse> => {
    const res = await apiClient.get<AdminRoleResponse>(ADMIN_ROLES.SHOW(id));
    return res.data;
  },

  create: async (
    payload: CreateAdminRolePayload
  ): Promise<AdminRoleResponse> => {
    const res = await apiClient.post<AdminRoleResponse>(
      ADMIN_ROLES.STORE,
      payload
    );
    return res.data;
  },

  update: async (
    id: number | string,
    payload: UpdateAdminRolePayload
  ): Promise<AdminRoleResponse> => {
    const res = await apiClient.patch<AdminRoleResponse>(
      ADMIN_ROLES.UPDATE(id),
      payload
    );
    return res.data;
  },

  toggleStatus: async (
    id: number | string
  ): Promise<AdminRoleToggleStatusResponse> => {
    const res = await apiClient.get<AdminRoleToggleStatusResponse>(
      ADMIN_ROLES.TOGGLE_STATUS(id)
    );
    return res.data;
  },

  remove: async (id: number | string): Promise<AdminRoleDeleteResponse> => {
    const res = await apiClient.delete<AdminRoleDeleteResponse>(
      ADMIN_ROLES.REMOVE(id)
    );
    return res.data;
  },
};
