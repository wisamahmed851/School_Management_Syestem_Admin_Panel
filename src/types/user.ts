// Matches API_DOCUMENTATION.txt section 3 exactly

export interface User {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  address: string | null;
  image: string | null;
  status: number;
  created_at?: string;
}

export interface UserListResponse {
  success: boolean;
  message: string;
  data: User[];
}

export interface UserResponse {
  success: boolean;
  message: string;
  data: User;
}

export interface UserToggleStatusResponse {
  success: boolean;
  message: string;
  data: { id: number; status: number };
}

// Request payloads — multipart/form-data (sent as FormData)
export interface CreateUserPayload {
  name: string;
  email: string;
  password: string;
  phone?: string;
  address?: string;
  image?: File | null;
  role_id: number;
}

export interface UpdateUserPayload {
  name?: string;
  email?: string;
  password?: string;
  phone?: string;
  address?: string;
  image?: File | null;
}
