/**
 * API Central - Punto de entrada único
 * Compatible con Web (React), Desktop (Neutralino) y Mobile (React Native)
 */

export { apiClient } from './client';
export * from './types';
export * from './services/users';
export * from './services/veterinarians';
export * from './services/pets';
export * from './services/appointments';
export * from './services/clinicalRecords';
export * from './services/dashboard';
