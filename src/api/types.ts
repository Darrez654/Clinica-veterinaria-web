/**
 * Tipos compartidos entre Web (React), Desktop (Neutralino) y Mobile (React Native)
 * Este archivo es compatible con las 3 plataformas
 */

// ── Roles de usuario ──
export type UserRole = 'veterinario' | 'dueno' | 'admin';

// ── Información de propiedad (quién creó/modificó el registro) ──
export interface Ownership {
  createdBy: string;
  createdByRole: UserRole;
  createdAt: string;
  updatedAt: string;
  updatedBy?: string;
}

// ---- Usuarios ----
export interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  registrationDate: string;
  active: boolean;
  role: UserRole;
  ownership?: Ownership;
}

export interface UserInput {
  name: string;
  email: string;
  phone: string;
  address: string;
}

// ---- Veterinarios ----
export interface Veterinarian {
  id: number;
  name: string;
  email: string;
  phone: string;
  specialty: string;
  license: string;
  yearsExperience: number;
  active: boolean;
  photoUrl?: string;
  role: 'veterinario';
  ownership?: Ownership;
}

export interface VeterinarianInput {
  name: string;
  email: string;
  phone: string;
  specialty: string;
  license: string;
  yearsExperience: number;
}

// ---- Mascotas ----
export interface Pet {
  id: number;
  name: string;
  species: string;
  breed: string;
  age: number;
  weight: number;
  owner: string;
  ownerId?: number;
  registrationDate: string;
  color: string;
  photoUrl?: string;
  medicalNotes?: string;
  role?: 'dueno';
  ownership?: Ownership;
}

export interface PetInput {
  name: string;
  species: string;
  breed: string;
  age: number;
  weight: number;
  owner: string;
  color: string;
}

// ---- Citas ----
export type AppointmentStatus = 'Programada' | 'Completada' | 'Cancelada' | 'En curso';
export type AppointmentRole = 'veterinario' | 'dueno';

export interface Appointment {
  id: number;
  date: string;
  time: string;
  pet: string;
  petId?: number;
  owner: string;
  veterinarian: string;
  veterinarianId?: number;
  reason: string;
  status: AppointmentStatus;
  notes?: string;
  duration?: number;
  role?: AppointmentRole;
  ownership?: Ownership;
}

export interface AppointmentInput {
  date: string;
  time: string;
  pet: string;
  owner: string;
  veterinarian: string;
  reason: string;
}

// ---- Expedientes Clínicos ----
export interface ClinicalRecord {
  id: number;
  pet: string;
  petId?: number;
  owner: string;
  date: string;
  veterinarian: string;
  veterinarianId?: number;
  diagnosis: string;
  treatment: string;
  notes: string;
  medications: string;
  weight: number;
  temperature: number;
  followUpDate?: string;
  attachments?: string[];
  role: 'veterinario';
  ownership?: Ownership;
}

export interface ClinicalRecordInput {
  pet: string;
  owner: string;
  date: string;
  veterinarian: string;
  diagnosis: string;
  treatment: string;
  notes: string;
  medications: string;
  weight: number;
  temperature: number;
}

// ---- Dashboard ----
export interface DashboardStats {
  totalUsers: number;
  totalVeterinarians: number;
  totalPets: number;
  todayAppointments: number;
  pendingAppointments: number;
  completedToday: number;
}

export interface RecentActivity {
  id: number;
  action: string;
  detail: string;
  time: string;
  type: 'user' | 'pet' | 'appointment' | 'record';
}

export interface UpcomingAppointment {
  time: string;
  pet: string;
  owner: string;
  vet: string;
}

// ---- API Response genérico ----
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

// ---- Paginación ----
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
