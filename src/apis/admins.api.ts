import { apiRequest } from './config';

export interface Admin {
  _id: string;
  email: string;
  name: string;
  role: 'super_admin' | 'admin' | 'moderator';
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export const adminsApi = {
  getAll: async (): Promise<Admin[]> => {
    return apiRequest<Admin[]>('/console/admins');
  },

  getById: async (id: string): Promise<Admin> => {
    return apiRequest<Admin>(`/console/admins/${id}`);
  },

  create: async (adminData: Partial<Admin> & { password: string }): Promise<Admin> => {
    return apiRequest<Admin>('/console/admins', {
      method: 'POST',
      body: JSON.stringify(adminData),
    });
  },

  update: async (id: string, adminData: Partial<Admin>): Promise<Admin> => {
    return apiRequest<Admin>(`/console/admins/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(adminData),
    });
  },

  delete: async (id: string): Promise<void> => {
    return apiRequest<void>(`/console/admins/${id}`, {
      method: 'DELETE',
    });
  },
};
