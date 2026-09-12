import { apiClient } from "./client";
import { USERS } from "./endpoints";
import type {
  UserListResponse,
  UserResponse,
  UserToggleStatusResponse,
  CreateUserPayload,
  UpdateUserPayload,
} from "@/types/user";

/** Build a FormData object from a CreateUserPayload or UpdateUserPayload */
function toFormData(
  payload: CreateUserPayload | UpdateUserPayload
): FormData {
  const fd = new FormData();
  Object.entries(payload).forEach(([key, value]) => {
    if (value === undefined || value === null) return;
    if (value instanceof File) {
      fd.append(key, value);
    } else {
      fd.append(key, String(value));
    }
  });
  return fd;
}

export const usersApi = {
  list: async (): Promise<UserListResponse> => {
    const res = await apiClient.get<UserListResponse>(USERS.INDEX);
    return res.data;
  },

  show: async (id: number | string): Promise<UserResponse> => {
    const res = await apiClient.get<UserResponse>(USERS.SHOW(id));
    return res.data;
  },

  findByEmail: async (email: string): Promise<UserResponse> => {
    const res = await apiClient.post<UserResponse>(USERS.FIND_BY_EMAIL, {
      email,
    });
    return res.data;
  },

  create: async (payload: CreateUserPayload): Promise<UserResponse> => {
    const res = await apiClient.post<UserResponse>(
      USERS.STORE,
      toFormData(payload),
      { headers: { "Content-Type": "multipart/form-data" } }
    );
    return res.data;
  },

  update: async (
    id: number | string,
    payload: UpdateUserPayload
  ): Promise<UserResponse> => {
    const res = await apiClient.put<UserResponse>(
      USERS.UPDATE(id),
      toFormData(payload),
      { headers: { "Content-Type": "multipart/form-data" } }
    );
    return res.data;
  },

  toggleStatus: async (
    id: number | string
  ): Promise<UserToggleStatusResponse> => {
    const res = await apiClient.put<UserToggleStatusResponse>(
      USERS.TOGGLE_STATUS(id)
    );
    return res.data;
  },
};
