import { create } from 'zustand';
import { leadService, Lead } from '../api/leadService';

interface LeadState {
  leads: Lead[];
  isLoading: boolean;
  error: string | null;
  fetchLeads: () => Promise<void>;
  fetchLead: (id: number) => Promise<Lead | null>;
  createLead: (data: any) => Promise<Lead | null>;
  updateLead: (id: number, data: any) => Promise<Lead | null>;
  deleteLead: (id: number) => Promise<void>;
}

export const useLeadStore = create<LeadState>((set) => ({
  leads: [],
  isLoading: false,
  error: null,

  fetchLeads: async () => {
    set({ isLoading: true, error: null });
    try {
      const leads = await leadService.getLeads();
      set({ leads, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  fetchLead: async (id: number) => {
    try {
      return await leadService.getLead(id);
    } catch (error: any) {
      set({ error: error.message });
      return null;
    }
  },

  createLead: async (data) => {
    try {
      const lead = await leadService.createLead(data);
      set((state) => ({ leads: [...state.leads, lead] }));
      return lead;
    } catch (error: any) {
      set({ error: error.message });
      return null;
    }
  },

  updateLead: async (id, data) => {
    try {
      const lead = await leadService.updateLead(id, data);
      set((state) => ({
        leads: state.leads.map((l) => (l.id === id ? lead : l)),
      }));
      return lead;
    } catch (error: any) {
      set({ error: error.message });
      return null;
    }
  },

  deleteLead: async (id) => {
    try {
      await leadService.deleteLead(id);
      set((state) => ({ leads: state.leads.filter((l) => l.id !== id) }));
    } catch (error: any) {
      set({ error: error.message });
    }
  },
}));
