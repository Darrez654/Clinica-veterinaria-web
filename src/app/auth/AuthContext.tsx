/**
 * AuthContext - Proveedor de autenticación
 * Maneja el estado de sesión y persistencia en localStorage
 */
import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { AuthUser, UserRole, LoginCredentials } from './types';

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<boolean>;
  logout: () => void;
  getRole: () => UserRole | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY = 'vetclinic_auth_user';

// Usuarios de demostración
const DEMO_USERS: AuthUser[] = [
  {
    id: 'vet-001',
    name: 'Dr. Carlos Mendoza',
    email: 'vet@clinica.com',
    role: 'veterinario',
    phone: '+58 412-1234567',
    specialty: 'Medicina General',
    license: 'MV-12345',
    avatar: 'CM',
  },
  {
    id: 'vet-002',
    name: 'Dra. Ana López',
    email: 'ana.vet@clinica.com',
    role: 'veterinario',
    phone: '+58 414-9876543',
    specialty: 'Cirugía',
    license: 'MV-67890',
    avatar: 'AL',
  },
  {
    id: 'own-001',
    name: 'Pedro Rodríguez',
    email: 'pedro@email.com',
    role: 'dueno',
    phone: '+58 416-5550101',
    avatar: 'PR',
  },
  {
    id: 'own-002',
    name: 'María García',
    email: 'maria@email.com',
    role: 'dueno',
    phone: '+58 424-5550202',
    avatar: 'MG',
  },
];

const PASSWORD_MAP: Record<string, string> = {
  'vet@clinica.com': '123456',
  'ana.vet@clinica.com': '123456',
  'pedro@email.com': '123456',
  'maria@email.com': '123456',
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Recuperar sesión al montar
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as AuthUser;
        setUser(parsed);
      }
    } catch {
      localStorage.removeItem(STORAGE_KEY);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = async (credentials: LoginCredentials): Promise<boolean> => {
    setIsLoading(true);
    
    // Simular delay de red
    await new Promise(r => setTimeout(r, 600));

    const foundUser = DEMO_USERS.find(
      u => u.email === credentials.email && u.role === credentials.role
    );

    if (!foundUser) {
      setIsLoading(false);
      return false;
    }

    const expectedPassword = PASSWORD_MAP[credentials.email];
    if (credentials.password !== expectedPassword) {
      setIsLoading(false);
      return false;
    }

    setUser(foundUser);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(foundUser));
    setIsLoading(false);
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
  };

  const getRole = (): UserRole | null => {
    return user?.role ?? null;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
        getRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider');
  }
  return context;
}
