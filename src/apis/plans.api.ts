import { apiRequest } from './config';
import type { Plan } from '@/lib/mock-data';

export const plansApi = {
  getAll: async (): Promise<Plan[]> => {
    return apiRequest<Plan[]>('/console/plans');
  },

  getById: async (id: string): Promise<Plan> => {
    return apiRequest<Plan>(`/console/plans/${id}`);
  },

  create: async (planData: Partial<Plan>): Promise<Plan> => {
    return apiRequest<Plan>('/console/plans', {
      method: 'POST',
      body: JSON.stringify(planData),
    });
  },

  update: async (id: string, planData: Partial<Plan>): Promise<Plan> => {
    return apiRequest<Plan>(`/console/plans/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(planData),
    });
  },

  delete: async (id: string): Promise<void> => {
    return apiRequest<void>(`/console/plans/${id}`, {
      method: 'DELETE',
    });
  },
};