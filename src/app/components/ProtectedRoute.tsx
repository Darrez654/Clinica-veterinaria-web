/**
 * ProtectedRoute - Guardia de rutas
 * Redirige al login si no hay sesión activa
 * Detecta automáticamente el rol requerido según la ruta:
 *   /veterinario/* → solo veterinarios
 *   /dueno/*       → solo dueños
 *   /login          → redirige si ya hay sesión
 */
import { Navigate, Outlet, useLocation } from 'react-router';
import { useAuth } from '../auth/AuthContext';
import type { UserRole } from '../auth/types';

interface ProtectedRouteProps {
  /** Rol requerido para acceder a esta ruta */
  requiredRole?: UserRole;
  /** Ruta de redirección si no está autenticado */
  redirectTo?: string;
  /** Si es true, redirige al dashboard si ya hay sesión (para login) */
  redirectIfAuth?: boolean;
}

/**
 * Detecta el rol requerido basado en el pathname
 */
function detectRequiredRole(pathname: string): UserRole | undefined {
  if (pathname.startsWith('/veterinario')) return 'veterinario';
  if (pathname.startsWith('/dueno')) return 'dueno';
  return undefined;
}

export function ProtectedRoute({
  requiredRole: explicitRole,
  redirectTo = '/login',
  redirectIfAuth = false,
}: ProtectedRouteProps) {
  const { isAuthenticated, user, isLoading } = useAuth();
  const location = useLocation();

  // Detectar rol según la ruta (si no se especificó explícitamente)
  const requiredRole = explicitRole || detectRequiredRole(location.pathname);

  // Mostrar loader mientras se verifica sesión
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full border-4 border-primary/30 border-t-primary animate-spin" />
          <p className="text-sm text-muted-foreground">Verificando sesión...</p>
        </div>
      </div>
    );
  }

  // Si está autenticado y la ruta redirige si hay sesión (login)
  if (isAuthenticated && redirectIfAuth) {
    const dashboardPath = user?.role === 'veterinario' ? '/veterinario' : '/dueno';
    return <Navigate to={dashboardPath} replace />;
  }

  // No autenticado → redirigir al login
  if (!isAuthenticated) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  // Verificar rol requerido
  if (requiredRole && user && user.role !== requiredRole) {
    // Redirigir al dashboard correspondiente según su rol
    const dashboardPath = user.role === 'veterinario' ? '/veterinario' : '/dueno';
    return <Navigate to={dashboardPath} replace />;
  }

  return <Outlet />;
}
