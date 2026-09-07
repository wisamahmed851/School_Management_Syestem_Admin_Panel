import { apiClient } from "./client";
import { AUTH } from "./endpoints";
import type { LoginResponse } from "@/types/admin";

export interface LoginPayload {
  email: string;
  password: string;
}

export const authApi = {
  login: async (payload: LoginPayload): Promise<LoginResponse> => {
    const response = await apiClient.post<LoginResponse>(AUTH.LOGIN, payload);
    return response.data;
  },
};
