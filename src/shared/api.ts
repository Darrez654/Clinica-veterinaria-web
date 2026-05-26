/**
 * Módulo compartido para Web + Neutralino + React Native
 *
 * Este archivo de tipos y utilidades puede ser importado
 * tanto en la web (React) como en React Native y Neutralino.
 *
 * Para React Native, copiar este archivo o crear un symlink:
 *   cp src/shared/api.ts ../VetClinicMobile/src/shared/api.ts
 */

// Re-exportamos tipos y el cliente API
export type {
  User,
  Veterinarian,
  Pet,
  Appointment,
  ClinicalRecord,
  DashboardStats,
  RecentActivity,
  UpcomingAppointment,
  AppointmentStatus,
  ApiResponse,
  PaginatedResponse,
} from '../api/types';

// Constantes de entorno
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:3001/api',
  TIMEOUT: 10000,
  VERSION: '1.0.0',
};

// Utilidades compartidas
export function formatDate(date: string): string {
  return new Date(date).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR',
  }).format(amount);
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export function getPetEmoji(species: string): string {
  const emojis: Record<string, string> = {
    Perro: '🐕',
    Gato: '🐱',
    Ave: '🐦',
    Conejo: '🐰',
    Reptil: '🦎',
    Otro: '🐾',
  };
  return emojis[species] || '🐾';
}

export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    Programada: '#2d6a4f',
    'En curso': '#74c69d',
    Completada: '#52796f',
    Cancelada: '#d4183d',
  };
  return colors[status] || '#717182';
}

// Colores del tema (compartidos)
export const THEME = {
  primary: '#2d6a4f',
  secondary: '#95d5b2',
  accent: '#74c69d',
  background: '#f8fdf9',
  foreground: '#1a4d2e',
  muted: '#d8f3dc',
  destructive: '#d4183d',
} as const;
