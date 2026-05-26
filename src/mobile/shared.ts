/**
 * Módulo compartido para React Native
 * 
 * Para usar en React Native:
 * 1. Copiar la carpeta src/api/ al proyecto React Native
 * 2. Copiar este archivo como base
 * 3. Reemplazar fetch() con el polyfill de React Native
 *
 * Ejemplo de uso en React Native:
 *
 * ```tsx
 * // react-native-app/src/services/api.ts
 * import { apiClient } from './src/api/client';
 * 
 * // El cliente API funciona igual en React Native
 * const users = await apiClient.get('/users');
 * ```
 */

// Configuración adaptable para React Native
export const RN_CONFIG = {
  // En React Native, la URL base puede venir de un archivo .env
  API_URL: 'http://localhost:3001/api',
  STORAGE_KEYS: {
    AUTH_TOKEN: '@vetclinic/auth_token',
    USER_DATA: '@vetclinic/user_data',
    SETTINGS: '@vetclinic/settings',
  },
};

// Interfaces adaptadas para React Native (con serialización JSON)
export interface RNUserPreferences {
  notificationsEnabled: boolean;
  darkMode: boolean;
  language: 'es' | 'en';
  biometricAuth: boolean;
}

export interface RNNotification {
  id: string;
  title: string;
  body: string;
  data?: Record<string, unknown>;
  read: boolean;
  createdAt: string;
}

// Utilidades RN específicas
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function validatePhone(phone: string): boolean {
  const phoneRegex = /^\+?[\d\s-]{9,15}$/;
  return phoneRegex.test(phone);
}
