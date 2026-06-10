import { create } from 'zustand';
import { dailyUpdateService, DailyUpdate } from '../api/dailyUpdateService';

interface DailyUpdateState {
  updates: DailyUpdate[];
  isLoading: boolean;
  error: string | null;
  fetchDailyUpdates: () => Promise<void>;
  fetchDailyUpdate: (id: number) => Promise<DailyUpdate | null>;
  createDailyUpdate: (data: any) => Promise<DailyUpdate | null>;
  updateDailyUpdate: (id: number, data: any) => Promise<DailyUpdate | null>;
  deleteDailyUpdate: (id: number) => Promise<void>;
}

export const useDailyUpdateStore = create<DailyUpdateState>((set) => ({
  updates: [],
  isLoading: false,
  error: null,

  fetchDailyUpdates: async () => {
    set({ isLoading: true, error: null });
    try {
      const updates = await dailyUpdateService.getDailyUpdates();
      set({ updates, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  fetchDailyUpdate: async (id: number) => {
    try {
      return await dailyUpdateService.getDailyUpdate(id);
    } catch (error: any) {
      set({ error: error.message });
      return null;
    }
  },

  createDailyUpdate: async (data) => {
    try {
      const update = await dailyUpdateService.createDailyUpdate(data);
      set((state) => ({ updates: [...state.updates, update] }));
      return update;
    } catch (error: any) {
      set({ error: error.message });
      return null;
    }
  },

  updateDailyUpdate: async (id, data) => {
    try {
      const update = await dailyUpdateService.updateDailyUpdate(id, data);
      set((state) => ({
        updates: state.updates.map((u) => (u.id === id ? update : u)),
      }));
      return update;
    } catch (error: any) {
      set({ error: error.message });
      return null;
    }
  },

  deleteDailyUpdate: async (id) => {
    try {
      await dailyUpdateService.deleteDailyUpdate(id);
      set((state) => ({ updates: state.updates.filter((u) => u.id !== id) }));
    } catch (error: any) {
      set({ error: error.message });
    }
  },
}));
