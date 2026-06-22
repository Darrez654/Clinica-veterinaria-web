import { apiClient } from '../client';
import type { Appointment, AppointmentInput, AppointmentStatus, ApiResponse } from '../types';

export const appointmentsService = {
  getAll: () => apiClient.get<Appointment[]>('/appointments'),

  getById: (id: number) => apiClient.get<Appointment>(`/appointments/${id}`),

  create: (data: AppointmentInput) =>
    apiClient.post<Appointment>('/appointments', data),

  update: (id: number, data: Partial<AppointmentInput>) =>
    apiClient.put<Appointment>(`/appointments/${id}`, data),

  updateStatus: (id: number, status: AppointmentStatus) =>
    apiClient.patch<Appointment>(`/appointments/${id}/status`, { status }),

  delete: (id: number) => apiClient.delete<void>(`/appointments/${id}`),

  getByDate: (date: string) =>
    apiClient.get<Appointment[]>('/appointments', { date }),

  getToday: () =>
    apiClient.get<Appointment[]>('/appointments/today'),
};
