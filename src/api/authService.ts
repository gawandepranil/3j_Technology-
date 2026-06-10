import { apiClient } from './apiClient';

interface LoginRequest {
  email: string;
  password: string;
}

interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'employee' | 'client';
}

interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'employee' | 'client';
  created_at: string;
  updated_at: string;
}

interface AuthResponse {
  access_token: string;
  token_type: string;
  user: User;
}

export const authService = {
  login: async (credentials: LoginRequest): Promise<AuthResponse> => {
    return apiClient.post<AuthResponse>('/api/users/login', credentials);
  },

  register: async (data: RegisterRequest): Promise<User> => {
    return apiClient.post<User>('/api/users/register', data);
  },

  getUsers: async (): Promise<User[]> => {
    return apiClient.get<User[]>('/api/users/');
  },

  getUser: async (id: number): Promise<User> => {
    return apiClient.get<User>(`/api/users/${id}`);
  },
};
