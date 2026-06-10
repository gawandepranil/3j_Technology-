import { apiClient } from './apiClient';

export interface Employee {
  id: number;
  name: string;
  designation: string;
  department?: string;
  user_id: number;
  created_at: string;
  updated_at: string;
}

export interface EmployeeCreate {
  name: string;
  designation: string;
  department?: string;
  user_id: number;
}

export interface EmployeeUpdate {
  name?: string;
  designation?: string;
  department?: string;
}

export const employeeService = {
  getEmployees: async (): Promise<Employee[]> => {
    return apiClient.get<Employee[]>('/api/employees/');
  },

  getEmployee: async (id: number): Promise<Employee> => {
    return apiClient.get<Employee>(`/api/employees/${id}`);
  },

  createEmployee: async (data: EmployeeCreate): Promise<Employee> => {
    return apiClient.post<Employee>('/api/employees/', data);
  },

  updateEmployee: async (id: number, data: EmployeeUpdate): Promise<Employee> => {
    return apiClient.put<Employee>(`/api/employees/${id}`, data);
  },

  deleteEmployee: async (id: number): Promise<void> => {
    await apiClient.delete(`/api/employees/${id}`);
  },
};
