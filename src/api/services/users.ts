import { apiClient } from '../client';
import type { User, UserInput, ApiResponse } from '../types';

export const usersService = {
  getAll: () => apiClient.get<User[]>('/users'),

  getById: (id: number) => apiClient.get<User>(`/users/${id}`),

  create: (data: UserInput) => apiClient.post<User>('/users', data),

  update: (id: number, data: Partial<UserInput>) =>
    apiClient.put<User>(`/users/${id}`, data),

  delete: (id: number) => apiClient.delete<void>(`/users/${id}`),

  search: (query: string) =>
    apiClient.get<User[]>('/users', { q: query }),
};
