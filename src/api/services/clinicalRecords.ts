import { apiClient } from '../client';
import type { ClinicalRecord, ClinicalRecordInput, ApiResponse } from '../types';

export const clinicalRecordsService = {
  getAll: () => apiClient.get<ClinicalRecord[]>('/clinical-records'),

  getById: (id: number) =>
    apiClient.get<ClinicalRecord>(`/clinical-records/${id}`),

  create: (data: ClinicalRecordInput) =>
    apiClient.post<ClinicalRecord>('/clinical-records', data),

  update: (id: number, data: Partial<ClinicalRecordInput>) =>
    apiClient.put<ClinicalRecord>(`/clinical-records/${id}`, data),

  delete: (id: number) => apiClient.delete<void>(`/clinical-records/${id}`),

  getByPet: (petName: string) =>
    apiClient.get<ClinicalRecord[]>('/clinical-records', { pet: petName }),

  getByVeterinarian: (vetName: string) =>
    apiClient.get<ClinicalRecord[]>('/clinical-records', { veterinarian: vetName }),
};
