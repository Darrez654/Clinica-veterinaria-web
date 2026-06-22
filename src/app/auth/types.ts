/**
 * Tipos de autenticación y roles
 * Compatible con Web, Neutralino y React Native
 */

export type UserRole = 'veterinario' | 'dueno' | 'admin';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
  specialty?: string;    // Solo para veterinarios
  license?: string;      // Solo para veterinarios
  avatar?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
  role: UserRole;
}

export interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

/**
 * Registro de creación para control de propiedad de datos
 * Cada registro en la BD tendrá asociado quién lo creó
 */
export interface OwnershipInfo {
  createdBy: string;      // ID del usuario que creó el registro
  createdByRole: UserRole;
  createdAt: string;
  updatedAt: string;
  updatedBy?: string;
}

/**
 * Extiende los tipos existentes con control de propiedad
 */
export type AccessLevel = 'view' | 'edit' | 'delete';

export function getAccessLevel(
  recordOwner: OwnershipInfo,
  currentUser: AuthUser | null
): AccessLevel {
  if (!currentUser) return 'view';

  // El creador del registro siempre puede editarlo
  if (recordOwner.createdBy === currentUser.id) {
    return 'edit';
  }

  // Administradores (por si se necesitan en el futuro)
  if (currentUser.role === 'admin') {
    return 'delete';
  }

  // Solo vista para los que no son dueños del registro
  return 'view';
}

/**
 * Verifica si el usuario actual puede modificar un registro
 */
export function canModify(
  recordOwner: OwnershipInfo,
  currentUser: AuthUser | null
): boolean {
  if (!currentUser) return false;
  return recordOwner.createdBy === currentUser.id;
}
