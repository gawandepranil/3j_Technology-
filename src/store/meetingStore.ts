import { create } from 'zustand';
import { meetingService, Meeting } from '../api/meetingService';

interface MeetingState {
  meetings: Meeting[];
  isLoading: boolean;
  error: string | null;
  fetchMeetings: () => Promise<void>;
  fetchMeeting: (id: number) => Promise<Meeting | null>;
  createMeeting: (data: any) => Promise<Meeting | null>;
  updateMeeting: (id: number, data: any) => Promise<Meeting | null>;
  deleteMeeting: (id: number) => Promise<void>;
}

export const useMeetingStore = create<MeetingState>((set) => ({
  meetings: [],
  isLoading: false,
  error: null,

  fetchMeetings: async () => {
    set({ isLoading: true, error: null });
    try {
      const meetings = await meetingService.getMeetings();
      set({ meetings, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  fetchMeeting: async (id: number) => {
    try {
      return await meetingService.getMeeting(id);
    } catch (error: any) {
      set({ error: error.message });
      return null;
    }
  },

  createMeeting: async (data) => {
    try {
      const meeting = await meetingService.createMeeting(data);
      set((state) => ({ meetings: [...state.meetings, meeting] }));
      return meeting;
    } catch (error: any) {
      set({ error: error.message });
      return null;
    }
  },

  updateMeeting: async (id, data) => {
    try {
      const meeting = await meetingService.updateMeeting(id, data);
      set((state) => ({
        meetings: state.meetings.map((m) => (m.id === id ? meeting : m)),
      }));
      return meeting;
    } catch (error: any) {
      set({ error: error.message });
      return null;
    }
  },

  deleteMeeting: async (id) => {
    try {
      await meetingService.deleteMeeting(id);
      set((state) => ({ meetings: state.meetings.filter((m) => m.id !== id) }));
    } catch (error: any) {
      set({ error: error.message });
    }
  },
}));
