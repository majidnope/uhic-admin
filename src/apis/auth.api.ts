import { apiRequest } from './config';

export interface LoginResponse {
  access_token: string;
  user: {
    id: string;
    email: string;
    name: string;
    role: string;
    userType: 'admin' | 'staff';
    permissions: string[];
  };
}

export const authApi = {
  login: async (email: string, password: string): Promise<LoginResponse> => {
    return apiRequest<LoginResponse>('/console/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },

  getCurrentUser: async () => {
    const token = localStorage.getItem('access_token');
    return apiRequest('/console/auth/me', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },

  changePassword: async (currentPassword: string, newPassword: string) => {
    const token = localStorage.getItem('access_token');
    return apiRequest('/console/auth/change-password', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ currentPassword, newPassword }),
    });
  },
};
