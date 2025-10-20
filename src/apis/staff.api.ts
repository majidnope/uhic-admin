import { apiRequest } from './config';

export interface Staff {
  _id: string;
  email: string;
  name: string;
  role: 'super_admin' | 'admin' | 'moderator' | 'customer_support' | 'accountant';
  permissions?: string[];
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export const staffApi = {
  getAll: async (): Promise<Staff[]> => {
    return apiRequest<Staff[]>('/console/staff');
  },

  getById: async (id: string): Promise<Staff> => {
    return apiRequest<Staff>(`/console/staff/${id}`);
  },

  create: async (staffData: Partial<Staff> & { password: string }): Promise<Staff> => {
    return apiRequest<Staff>('/console/staff', {
      method: 'POST',
      body: JSON.stringify(staffData),
    });
  },

  update: async (id: string, staffData: Partial<Staff>): Promise<Staff> => {
    return apiRequest<Staff>(`/console/staff/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(staffData),
    });
  },

  delete: async (id: string): Promise<void> => {
    return apiRequest<void>(`/console/staff/${id}`, {
      method: 'DELETE',
    });
  },
};