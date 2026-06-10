import { create } from 'zustand';
import { projectService, Project } from '../api/projectService';

interface ProjectState {
  projects: Project[];
  isLoading: boolean;
  error: string | null;
  fetchProjects: () => Promise<void>;
  fetchProject: (id: number) => Promise<Project | null>;
  createProject: (data: any) => Promise<Project | null>;
  updateProject: (id: number, data: any) => Promise<Project | null>;
  deleteProject: (id: number) => Promise<void>;
}

export const useProjectStore = create<ProjectState>((set) => ({
  projects: [],
  isLoading: false,
  error: null,

  fetchProjects: async () => {
    set({ isLoading: true, error: null });
    try {
      const projects = await projectService.getProjects();
      set({ projects, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  fetchProject: async (id: number) => {
    try {
      return await projectService.getProject(id);
    } catch (error: any) {
      set({ error: error.message });
      return null;
    }
  },

  createProject: async (data) => {
    try {
      const project = await projectService.createProject(data);
      set((state) => ({ projects: [...state.projects, project] }));
      return project;
    } catch (error: any) {
      set({ error: error.message });
      return null;
    }
  },

  updateProject: async (id, data) => {
    try {
      const project = await projectService.updateProject(id, data);
      set((state) => ({
        projects: state.projects.map((p) => (p.id === id ? project : p)),
      }));
      return project;
    } catch (error: any) {
      set({ error: error.message });
      return null;
    }
  },

  deleteProject: async (id) => {
    try {
      await projectService.deleteProject(id);
      set((state) => ({ projects: state.projects.filter((p) => p.id !== id) }));
    } catch (error: any) {
      set({ error: error.message });
    }
  },
}));
