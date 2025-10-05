import { apiRequest } from './config';
import type { User } from '@/lib/mock-data';

export const usersApi = {
  getAll: async (): Promise<User[]> => {
    return apiRequest<User[]>('/api/admin/users');
  },

  getById: async (id: string): Promise<User> => {
    return apiRequest<User>(`/api/admin/users/${id}`);
  },

  create: async (userData: Partial<User>): Promise<User> => {
    return apiRequest<User>('/api/admin/users', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },

  update: async (id: string, userData: Partial<User>): Promise<User> => {
    return apiRequest<User>(`/api/admin/users/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(userData),
    });
  },

  delete: async (id: string): Promise<void> => {
    return apiRequest<void>(`/api/admin/users/${id}`, {
      method: 'DELETE',
    });
  },
};