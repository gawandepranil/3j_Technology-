import { create } from 'zustand';
import { employeeService, Employee } from '../api/employeeService';

interface EmployeeState {
  employees: Employee[];
  isLoading: boolean;
  error: string | null;
  fetchEmployees: () => Promise<void>;
  fetchEmployee: (id: number) => Promise<Employee | null>;
  createEmployee: (data: any) => Promise<Employee | null>;
  updateEmployee: (id: number, data: any) => Promise<Employee | null>;
  deleteEmployee: (id: number) => Promise<void>;
}

export const useEmployeeStore = create<EmployeeState>((set) => ({
  employees: [],
  isLoading: false,
  error: null,

  fetchEmployees: async () => {
    set({ isLoading: true, error: null });
    try {
      const employees = await employeeService.getEmployees();
      set({ employees, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  fetchEmployee: async (id: number) => {
    try {
      return await employeeService.getEmployee(id);
    } catch (error: any) {
      set({ error: error.message });
      return null;
    }
  },

  createEmployee: async (data) => {
    try {
      const employee = await employeeService.createEmployee(data);
      set((state) => ({ employees: [...state.employees, employee] }));
      return employee;
    } catch (error: any) {
      set({ error: error.message });
      return null;
    }
  },

  updateEmployee: async (id, data) => {
    try {
      const employee = await employeeService.updateEmployee(id, data);
      set((state) => ({
        employees: state.employees.map((e) => (e.id === id ? employee : e)),
      }));
      return employee;
    } catch (error: any) {
      set({ error: error.message });
      return null;
    }
  },

  deleteEmployee: async (id) => {
    try {
      await employeeService.deleteEmployee(id);
      set((state) => ({ employees: state.employees.filter((e) => e.id !== id) }));
    } catch (error: any) {
      set({ error: error.message });
    }
  },
}));
