import { apiClient } from './apiClient';

export interface Project {
  id: number;
  title: string;
  description: string;
  status: 'planning' | 'in_progress' | 'on_hold' | 'completed';
  client_id: number;
  created_at: string;
  updated_at: string;
}

export interface ProjectCreate {
  title: string;
  description?: string;
  status?: 'planning' | 'in_progress' | 'on_hold' | 'completed';
  client_id?: number;
}

export interface ProjectUpdate {
  title?: string;
  description?: string;
  status?: 'planning' | 'in_progress' | 'on_hold' | 'completed';
  client_id?: number;
}

export const projectService = {
  getProjects: async (): Promise<Project[]> => {
    return apiClient.get<Project[]>('/api/projects/');
  },

  getProject: async (id: number): Promise<Project> => {
    return apiClient.get<Project>(`/api/projects/${id}`);
  },

  createProject: async (data: ProjectCreate): Promise<Project> => {
    return apiClient.post<Project>('/api/projects/', data);
  },

  updateProject: async (id: number, data: ProjectUpdate): Promise<Project> => {
    return apiClient.put<Project>(`/api/projects/${id}`, data);
  },

  deleteProject: async (id: number): Promise<void> => {
    await apiClient.delete(`/api/projects/${id}`);
  },
};
