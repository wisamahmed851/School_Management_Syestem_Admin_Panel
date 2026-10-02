import { apiClient } from "./client";
import { GUARDIANS } from "./endpoints";
import type {
  GuardianListResponse,
  GuardianResponse,
  GuardianDeleteResponse,
  CreateGuardianPayload,
  UpdateGuardianPayload,
} from "@/types/guardian";

export const guardiansApi = {
  list: async (search?: string): Promise<GuardianListResponse> => {
    const res = await apiClient.get<GuardianListResponse>(GUARDIANS.INDEX, {
      params: search ? { search } : undefined,
    });
    return res.data;
  },

  show: async (id: number | string): Promise<GuardianResponse> => {
    const res = await apiClient.get<GuardianResponse>(GUARDIANS.SHOW(id));
    return res.data;
  },

  create: async (payload: CreateGuardianPayload): Promise<GuardianResponse> => {
    const res = await apiClient.post<GuardianResponse>(GUARDIANS.STORE, payload);
    return res.data;
  },

  update: async (
    id: number | string,
    payload: UpdateGuardianPayload
  ): Promise<GuardianResponse> => {
    const res = await apiClient.put<GuardianResponse>(
      GUARDIANS.UPDATE(id),
      payload
    );
    return res.data;
  },

  remove: async (id: number | string): Promise<GuardianDeleteResponse> => {
    const res = await apiClient.delete<GuardianDeleteResponse>(
      GUARDIANS.REMOVE(id)
    );
    return res.data;
  },
};
