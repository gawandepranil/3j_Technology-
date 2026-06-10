import { apiClient } from './apiClient';

export interface Lead {
  id: number;
  company: string;
  contact_name?: string;
  contact_email?: string;
  contact_phone?: string;
  status: 'new' | 'contacted' | 'qualified' | 'proposal_sent' | 'negotiation' | 'won' | 'lost';
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface LeadCreate {
  company: string;
  contact_name?: string;
  contact_email?: string;
  contact_phone?: string;
  status?: 'new' | 'contacted' | 'qualified' | 'proposal_sent' | 'negotiation' | 'won' | 'lost';
  notes?: string;
}

export interface LeadUpdate {
  company?: string;
  contact_name?: string;
  contact_email?: string;
  contact_phone?: string;
  status?: 'new' | 'contacted' | 'qualified' | 'proposal_sent' | 'negotiation' | 'won' | 'lost';
  notes?: string;
}

export const leadService = {
  getLeads: async (): Promise<Lead[]> => {
    return apiClient.get<Lead[]>('/api/leads/');
  },

  getLead: async (id: number): Promise<Lead> => {
    return apiClient.get<Lead>(`/api/leads/${id}`);
  },

  createLead: async (data: LeadCreate): Promise<Lead> => {
    return apiClient.post<Lead>('/api/leads/', data);
  },

  updateLead: async (id: number, data: LeadUpdate): Promise<Lead> => {
    return apiClient.put<Lead>(`/api/leads/${id}`, data);
  },

  deleteLead: async (id: number): Promise<void> => {
    await apiClient.delete(`/api/leads/${id}`);
  },
};
