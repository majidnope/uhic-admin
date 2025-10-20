import { apiRequest } from './config';
import type { Plan } from '@/lib/mock-data';

export const plansApi = {
  getAll: async (): Promise<Plan[]> => {
    return apiRequest<Plan[]>('/console/plans');
  },

  getPending: async (): Promise<Plan[]> => {
    return apiRequest<Plan[]>('/console/plans/pending/list');
  },

  getById: async (id: string): Promise<Plan> => {
    return apiRequest<Plan>(`/console/plans/${id}`);
  },

  approve: async (id: string): Promise<Plan> => {
    return apiRequest<Plan>(`/console/plans/${id}/approve`, {
      method: 'POST',
    });
  },

  reject: async (id: string, reason: string): Promise<Plan> => {
    return apiRequest<Plan>(`/console/plans/${id}/reject`, {
      method: 'POST',
      body: JSON.stringify({ reason }),
    });
  },

  create: async (planData: Partial<Plan>): Promise<Plan> => {
    // Remove fields that shouldn't be sent to the backend
    const { billing, subscribers, revenue, ...cleanData } = planData as any;
    return apiRequest<Plan>('/console/plans', {
      method: 'POST',
      body: JSON.stringify(cleanData),
    });
  },

  update: async (id: string, planData: Partial<Plan>): Promise<Plan> => {
    // Remove fields that shouldn't be sent to the backend
    const { billing, subscribers, revenue, ...cleanData } = planData as any;
    return apiRequest<Plan>(`/console/plans/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(cleanData),
    });
  },

  delete: async (id: string): Promise<void> => {
    return apiRequest<void>(`/console/plans/${id}`, {
      method: 'DELETE',
    });
  },
};