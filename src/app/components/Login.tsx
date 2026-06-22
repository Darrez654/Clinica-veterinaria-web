/**
 * Login - Pantalla de inicio de sesión
 * Permite elegir rol: Veterinario o Dueño de mascota
 */
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../auth/AuthContext';
import { PawPrint, Stethoscope, User, Shield, AlertCircle } from 'lucide-react';

export function Login() {
  const navigate = useNavigate();
  const { login, isAuthenticated, user } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'veterinario' | 'dueno'>('veterinario');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Redirigir si ya hay sesión activa
  useEffect(() => {
    if (isAuthenticated && user) {
      navigate(user.role === 'veterinario' ? '/veterinario' : '/dueno', { replace: true });
    }
  }, [isAuthenticated, user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const success = await login({ email, password, role });
    setLoading(false);

    if (success) {
      // Redirigir según el rol
      navigate(role === 'veterinario' ? '/veterinario' : '/dueno', { replace: true });
    } else {
      setError('Credenciales inválidas. Verifica tu email, contraseña y rol.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 dark:from-gray-950 dark:via-emerald-950/20 dark:to-gray-950 p-4">
      <div className="w-full max-w-md">
        {/* Logo y título */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-emerald-600 shadow-lg shadow-primary/25 mb-4">
            <PawPrint className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            VetClinic
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Sistema de Gestión Veterinaria
          </p>
        </div>

        {/* Tarjeta de login */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-800 p-8">
          {/* Selector de rol */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Iniciar sesión como:
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setRole('veterinario')}
                className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all duration-200 ${
                  role === 'veterinario'
                    ? 'border-primary bg-primary/5 dark:bg-primary/10 ring-2 ring-primary/20'
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
              >
                <Stethoscope className={`w-8 h-8 ${role === 'veterinario' ? 'text-primary' : 'text-gray-400'}`} />
                <span className={`text-sm font-medium ${role === 'veterinario' ? 'text-primary' : 'text-gray-500 dark:text-gray-400'}`}>
                  Veterinario
                </span>
              </button>
              <button
                type="button"
                onClick={() => setRole('dueno')}
                className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all duration-200 ${
                  role === 'dueno'
                    ? 'border-amber-500 bg-amber-50 dark:bg-amber-500/10 ring-2 ring-amber-500/20'
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
              >
                <User className={`w-8 h-8 ${role === 'dueno' ? 'text-amber-500' : 'text-gray-400'}`} />
                <span className={`text-sm font-medium ${role === 'dueno' ? 'text-amber-500' : 'text-gray-500 dark:text-gray-400'}`}>
                  Dueño
                </span>
              </button>
            </div>
          </div>

          {/* Formulario */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Correo electrónico
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder={role === 'veterinario' ? 'vet@clinica.com' : 'pedro@email.com'}
                required
                className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Contraseña
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••"
                required
                className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
              />
            </div>

            {error && (
              <div className="flex items-start gap-2 p-3 rounded-lg bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 text-sm">
                <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-primary to-emerald-600 text-white font-medium shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Ingresando...
                </>
              ) : (
                <>
                  <Shield className="w-4 h-4" />
                  Ingresar
                </>
              )}
            </button>
          </form>

          {/* Ayuda para pruebas */}
          <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
            <p className="text-xs text-gray-400 dark:text-gray-500 text-center mb-3">
              Credenciales de prueba
            </p>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400">
                <p className="font-medium">🧑‍⚕️ Veterinario</p>
                <p>vet@clinica.com</p>
                <p className="text-emerald-500">Contraseña: 123456</p>
              </div>
              <div className="p-2 rounded-lg bg-amber-50 dark:bg-amber-950/20 text-amber-700 dark:text-amber-400">
                <p className="font-medium">👤 Dueño</p>
                <p>pedro@email.com</p>
                <p className="text-amber-500">Contraseña: 123456</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
