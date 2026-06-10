import { apiClient } from './apiClient';

export interface Meeting {
  id: number;
  title: string;
  description?: string;
  date: string;
  project_id?: number;
  created_at: string;
  updated_at: string;
}

export interface MeetingCreate {
  title: string;
  description?: string;
  date: string;
  project_id?: number;
}

export interface MeetingUpdate {
  title?: string;
  description?: string;
  date?: string;
  project_id?: number;
}

export const meetingService = {
  getMeetings: async (): Promise<Meeting[]> => {
    return apiClient.get<Meeting[]>('/api/meetings/');
  },

  getMeeting: async (id: number): Promise<Meeting> => {
    return apiClient.get<Meeting>(`/api/meetings/${id}`);
  },

  createMeeting: async (data: MeetingCreate): Promise<Meeting> => {
    return apiClient.post<Meeting>('/api/meetings/', data);
  },

  updateMeeting: async (id: number, data: MeetingUpdate): Promise<Meeting> => {
    return apiClient.put<Meeting>(`/api/meetings/${id}`, data);
  },

  deleteMeeting: async (id: number): Promise<void> => {
    await apiClient.delete(`/api/meetings/${id}`);
  },
};
