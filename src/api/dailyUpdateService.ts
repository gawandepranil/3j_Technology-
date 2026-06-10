import { apiClient } from './apiClient';

export interface DailyUpdate {
  id: number;
  content: string;
  employee_id: number;
  date: string;
  created_at: string;
  updated_at: string;
}

export interface DailyUpdateCreate {
  content: string;
  employee_id: number;
  date?: string;
}

export interface DailyUpdateUpdate {
  content?: string;
}

export const dailyUpdateService = {
  getDailyUpdates: async (): Promise<DailyUpdate[]> => {
    return apiClient.get<DailyUpdate[]>('/api/daily-updates/');
  },

  getDailyUpdate: async (id: number): Promise<DailyUpdate> => {
    return apiClient.get<DailyUpdate>(`/api/daily-updates/${id}`);
  },

  createDailyUpdate: async (data: DailyUpdateCreate): Promise<DailyUpdate> => {
    return apiClient.post<DailyUpdate>('/api/daily-updates/', data);
  },

  updateDailyUpdate: async (id: number, data: DailyUpdateUpdate): Promise<DailyUpdate> => {
    return apiClient.put<DailyUpdate>(`/api/daily-updates/${id}`, data);
  },

  deleteDailyUpdate: async (id: number): Promise<void> => {
    await apiClient.delete(`/api/daily-updates/${id}`);
  },
};
