import { apiRequest } from './config';
import type { User } from '@/lib/mock-data';

export const usersApi = {
  getAll: async (): Promise<User[]> => {
    return apiRequest<User[]>('/console/users');
  },

  getById: async (id: string): Promise<User> => {
    return apiRequest<User>(`/console/users/${id}`);
  },

  create: async (userData: Partial<User>): Promise<User> => {
    return apiRequest<User>('/console/users', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },

  update: async (id: string, userData: Partial<User>): Promise<User> => {
    return apiRequest<User>(`/console/users/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(userData),
    });
  },

  delete: async (id: string): Promise<void> => {
    return apiRequest<void>(`/console/users/${id}`, {
      method: 'DELETE',
    });
  },

  getPendingUsers: async (): Promise<User[]> => {
    return apiRequest<User[]>('/console/users/pending/list');
  },

  approve: async (id: string): Promise<User> => {
    return apiRequest<User>(`/console/users/${id}/approve`, {
      method: 'POST',
    });
  },

  reject: async (id: string, reason: string): Promise<User> => {
    return apiRequest<User>(`/console/users/${id}/reject`, {
      method: 'POST',
      body: JSON.stringify({ reason }),
    });
  },

  sendPasswordResetEmail: async (email: string): Promise<{ message: string }> => {
    return apiRequest<{ message: string }>('/console/users/send-reset-email', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  },
};