/**
 * Hook para verificar permisos de modificación de registros
 * Basado en el sistema de roles y propiedad de datos
 */
import { useAuth } from '../app/auth/AuthContext';
import type { Ownership, UserRole } from '../api/types';

interface RecordWithOwnership {
  ownership?: Ownership;
  role?: UserRole;
}

interface PermissionResult {
  canEdit: boolean;
  canDelete: boolean;
  isReadOnly: boolean;
  reason: string;
}

/**
 * Determina los permisos que tiene el usuario actual sobre un registro
 */
export function useRecordPermissions(record: RecordWithOwnership | null): PermissionResult {
  const { user } = useAuth();

  if (!user || !record) {
    return {
      canEdit: false,
      canDelete: false,
      isReadOnly: true,
      reason: 'No hay sesión activa',
    };
  }

  const ownership = record.ownership;

  // Si el registro no tiene información de propiedad, permitir edición
  // (compatibilidad con registros existentes antes del sistema de roles)
  if (!ownership) {
    return {
      canEdit: true,
      canDelete: true,
      isReadOnly: false,
      reason: 'Registro sin propietario definido',
    };
  }

  // El creador del registro siempre puede editarlo
  if (ownership.createdBy === user.id) {
    return {
      canEdit: true,
      canDelete: true,
      isReadOnly: false,
      reason: 'Eres el creador de este registro',
    };
  }

  // Verificar por roles: un veterinario NO puede editar datos de un dueño
  if (user.role === 'veterinario' && ownership.createdByRole === 'dueno') {
    return {
      canEdit: false,
      canDelete: false,
      isReadOnly: true,
      reason: 'Los datos registrados por el dueño son solo de consulta para veterinarios',
    };
  }

  // Un dueño NO puede editar expedientes clínicos creados por veterinarios
  if (user.role === 'dueno' && ownership.createdByRole === 'veterinario') {
    return {
      canEdit: false,
      canDelete: false,
      isReadOnly: true,
      reason: 'Los expedientes clínicos son solo de consulta para el dueño',
    };
  }

  // Por defecto: solo lectura entre distintos usuarios del mismo rol
  return {
    canEdit: false,
    canDelete: false,
    isReadOnly: true,
    reason: `Este registro fue creado por otro ${ownership.createdByRole}`,
  };
}

/**
 * Versión simple: solo dice si se puede modificar o no
 */
export function canModifyRecord(record: RecordWithOwnership | null, userId?: string): boolean {
  if (!record || !userId) return false;
  if (!record.ownership) return true; // Compatibilidad hacia atrás
  return record.ownership.createdBy === userId;
}
