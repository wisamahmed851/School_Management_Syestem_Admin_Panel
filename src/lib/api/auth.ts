import { apiClient } from "./client";
import { AUTH } from "./endpoints";
import type {
  LoginResponse,
  ProfileResponse,
  ChangePasswordPayload,
  ChangePasswordResponse,
  LogoutResponse,
} from "@/types/admin";

export interface LoginPayload {
  email: string;
  password: string;
}

export const authApi = {
  login: async (payload: LoginPayload): Promise<LoginResponse> => {
    const response = await apiClient.post<LoginResponse>(AUTH.LOGIN, payload);
    return response.data;
  },

  getProfile: async (): Promise<ProfileResponse> => {
    const response = await apiClient.get<ProfileResponse>(AUTH.PROFILE);
    return response.data;
  },

  changePassword: async (
    payload: ChangePasswordPayload
  ): Promise<ChangePasswordResponse> => {
    const response = await apiClient.post<ChangePasswordResponse>(
      AUTH.CHANGE_PASSWORD,
      payload
    );
    return response.data;
  },

  logout: async (): Promise<LogoutResponse> => {
    const response = await apiClient.post<LogoutResponse>(AUTH.LOGOUT);
    return response.data;
  },
};
