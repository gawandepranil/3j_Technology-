import { apiClient } from './apiClient';

export interface Requirement {
  id: number;
  description: string;
  project_id: number;
  status: 'pending' | 'in_progress' | 'completed' | 'rejected';
  created_at: string;
  updated_at: string;
}

export interface RequirementCreate {
  description: string;
  project_id: number;
  status?: 'pending' | 'in_progress' | 'completed' | 'rejected';
}

export interface RequirementUpdate {
  description?: string;
  status?: 'pending' | 'in_progress' | 'completed' | 'rejected';
}

export const requirementService = {
  getRequirements: async (): Promise<Requirement[]> => {
    return apiClient.get<Requirement[]>('/api/requirements/');
  },

  getRequirement: async (id: number): Promise<Requirement> => {
    return apiClient.get<Requirement>(`/api/requirements/${id}`);
  },

  createRequirement: async (data: RequirementCreate): Promise<Requirement> => {
    return apiClient.post<Requirement>('/api/requirements/', data);
  },

  updateRequirement: async (id: number, data: RequirementUpdate): Promise<Requirement> => {
    return apiClient.put<Requirement>(`/api/requirements/${id}`, data);
  },

  deleteRequirement: async (id: number): Promise<void> => {
    await apiClient.delete(`/api/requirements/${id}`);
  },
};
