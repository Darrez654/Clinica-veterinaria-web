import { apiClient } from '../client';
import type { Veterinarian, VeterinarianInput, ApiResponse } from '../types';

export const veterinariansService = {
  getAll: () => apiClient.get<Veterinarian[]>('/veterinarians'),

  getById: (id: number) => apiClient.get<Veterinarian>(`/veterinarians/${id}`),

  create: (data: VeterinarianInput) =>
    apiClient.post<Veterinarian>('/veterinarians', data),

  update: (id: number, data: Partial<VeterinarianInput>) =>
    apiClient.put<Veterinarian>(`/veterinarians/${id}`, data),

  delete: (id: number) => apiClient.delete<void>(`/veterinarians/${id}`),

  search: (query: string) =>
    apiClient.get<Veterinarian[]>('/veterinarians', { q: query }),
};
