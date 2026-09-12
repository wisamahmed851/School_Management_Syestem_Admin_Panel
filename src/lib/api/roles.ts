import { apiClient } from "./client";
import { ROLES } from "./endpoints";
import type {
  RoleListResponse,
  RoleResponse,
  RoleToggleStatusResponse,
  RoleDeleteResponse,
  CreateRolePayload,
  UpdateRolePayload,
} from "@/types/role";

export const rolesApi = {
  list: async (guard?: "admin" | "user"): Promise<RoleListResponse> => {
    const res = await apiClient.get<RoleListResponse>(ROLES.INDEX, {
      params: guard ? { guard } : undefined,
    });
    return res.data;
  },

  show: async (id: number | string): Promise<RoleResponse> => {
    const res = await apiClient.get<RoleResponse>(ROLES.SHOW(id));
    return res.data;
  },

  create: async (payload: CreateRolePayload): Promise<RoleResponse> => {
    const res = await apiClient.post<RoleResponse>(ROLES.STORE, payload);
    return res.data;
  },

  update: async (
    id: number | string,
    payload: UpdateRolePayload
  ): Promise<RoleResponse> => {
    const res = await apiClient.patch<RoleResponse>(ROLES.UPDATE(id), payload);
    return res.data;
  },

  toggleStatus: async (
    id: number | string
  ): Promise<RoleToggleStatusResponse> => {
    const res = await apiClient.get<RoleToggleStatusResponse>(
      ROLES.TOGGLE_STATUS(id)
    );
    return res.data;
  },

  remove: async (id: number | string): Promise<RoleDeleteResponse> => {
    const res = await apiClient.delete<RoleDeleteResponse>(ROLES.REMOVE(id));
    return res.data;
  },
};
