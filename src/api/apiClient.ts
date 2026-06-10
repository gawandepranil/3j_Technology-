import axios, { AxiosInstance, AxiosError } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { Platform } from 'react-native';

let API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8000';

// On Android emulators, localhost maps to 10.0.2.2 instead of 127.0.0.1
if (Platform.OS === 'android' && (API_BASE_URL.includes('localhost') || API_BASE_URL.includes('127.0.0.1'))) {
  API_BASE_URL = API_BASE_URL.replace('localhost', '10.0.2.2').replace('127.0.0.1', '10.0.2.2');
}

class APIClient {
  private client: AxiosInstance;
  private token: string | null = null;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Response interceptor — handle 401 by fully logging out
    this.client.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        if (error.response?.status === 401) {
          // Clear persisted session
          await AsyncStorage.removeItem('authToken');
          await AsyncStorage.removeItem('authUser');
          this.removeAuthToken();

          // Reset Zustand store — lazy import avoids circular dependency
          try {
            const { useAuthStore } = await import('../store/authStore');
            useAuthStore.getState().logout();
          } catch (e) {
            // ignore
          }
        }
        return Promise.reject(error);
      }
    );

    this.initializeToken();
  }

  private async initializeToken() {
    try {
      this.token = await AsyncStorage.getItem('authToken');
      if (this.token) {
        this.setAuthToken(this.token);
      }
    } catch (error) {
      console.error('Error initializing token:', error);
    }
  }

  public setAuthToken(token: string) {
    this.token = token;
    this.client.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }

  public removeAuthToken() {
    this.token = null;
    delete this.client.defaults.headers.common['Authorization'];
  }

  public async request<T>(method: string, url: string, data?: any): Promise<T> {
    const response = await this.client.request<T>({ method, url, data });
    return response.data;
  }

  public get<T>(url: string): Promise<T> {
    return this.request<T>('GET', url);
  }

  public post<T>(url: string, data: any): Promise<T> {
    return this.request<T>('POST', url, data);
  }

  public put<T>(url: string, data: any): Promise<T> {
    return this.request<T>('PUT', url, data);
  }

  public delete<T>(url: string): Promise<T> {
    return this.request<T>('DELETE', url);
  }
}

export const apiClient = new APIClient();
