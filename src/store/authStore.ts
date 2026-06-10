import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authService } from '../api/authService';
import { apiClient } from '../api/apiClient';
import { User, UserRole } from '../types';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  /** True while checkAuth() is in progress on first app launch */
  isInitializing: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  isInitializing: true,

  login: async (email: string, password: string) => {
    set({ isLoading: true });
    try {
      const response = await authService.login({ email, password });

      // Store token & user in persistent storage
      await AsyncStorage.setItem('authToken', response.access_token);

      // Map API response to User type
      // Backend role is: 'admin' | 'employee' | 'client'
      const user: User = {
        id: response.user.id.toString(),
        full_name: response.user.name,
        email: response.user.email,
        role: response.user.role as UserRole,
        availability: 'available',
      };

      await AsyncStorage.setItem('authUser', JSON.stringify(user));

      // Inject token into all future API requests
      apiClient.setAuthToken(response.access_token);

      set({ user, isAuthenticated: true, isLoading: false });
      return { success: true };
    } catch (error: any) {
      console.error('Login error:', error);
      set({ isLoading: false });

      let errorMsg = 'Invalid email or password.';
      if (error?.message === 'Network Error' || !error?.response) {
        errorMsg =
          'Could not connect to the server. Please check your internet connection or backend configuration.';
      } else if (error?.response?.data?.detail) {
        errorMsg = error.response.data.detail;
      }
      return { success: false, error: errorMsg };
    }
  },

  logout: async () => {
    try {
      await AsyncStorage.removeItem('authToken');
      await AsyncStorage.removeItem('authUser');
      apiClient.removeAuthToken();
      set({ user: null, isAuthenticated: false });
    } catch (error) {
      console.error('Logout error:', error);
    }
  },

  checkAuth: async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      const userStr = await AsyncStorage.getItem('authUser');
      if (token && userStr) {
        const user: User = JSON.parse(userStr);
        apiClient.setAuthToken(token);
        set({ user, isAuthenticated: true, isInitializing: false });
      } else {
        // Clear any partial state to avoid broken sessions
        await AsyncStorage.removeItem('authToken');
        await AsyncStorage.removeItem('authUser');
        apiClient.removeAuthToken();
        set({ user: null, isAuthenticated: false, isInitializing: false });
      }
    } catch (error) {
      console.error('Auth check error:', error);
      set({ user: null, isAuthenticated: false, isInitializing: false });
    }
  },
}));
