import { apiClient } from '../client';
import type { Pet, PetInput, ApiResponse } from '../types';

export const petsService = {
  getAll: () => apiClient.get<Pet[]>('/pets'),

  getById: (id: number) => apiClient.get<Pet>(`/pets/${id}`),

  create: (data: PetInput) => apiClient.post<Pet>('/pets', data),

  update: (id: number, data: Partial<PetInput>) =>
    apiClient.put<Pet>(`/pets/${id}`, data),

  delete: (id: number) => apiClient.delete<void>(`/pets/${id}`),

  search: (query: string) =>
    apiClient.get<Pet[]>('/pets', { q: query }),

  getByOwner: (ownerId: number) =>
    apiClient.get<Pet[]>(`/pets?ownerId=${ownerId}`),
};
