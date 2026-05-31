/**
 * VetLayout - Layout para Veterinarios
 * Sidebar con acceso a los módulos del veterinario
 * Barra superior con info del usuario y cierre de sesión
 */
import { useState } from 'react';
import { Outlet, NavLink, useLocation, useNavigate } from 'react-router';
import { useAuth } from '../auth/AuthContext';
import {
  Home, Calendar, FileText, PawPrint, Stethoscope,
  ChevronLeft, Menu, LogOut, Bell, Shield, Syringe, Activity
} from 'lucide-react';

export function VetLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { to: '/veterinario', label: 'Panel', icon: Home, end: true },
    { to: '/veterinario/citas', label: 'Citas', icon: Calendar },
    { to: '/veterinario/expedientes', label: 'Expedientes', icon: FileText },
    { to: '/veterinario/mascotas', label: 'Pacientes', icon: PawPrint },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? 'w-64' : 'w-0 lg:w-16'
        } bg-card border-r border-border transition-all duration-300 flex-shrink-0 overflow-hidden lg:overflow-visible flex flex-col`}
      >
        {/* Logo */}
        <div className="p-5 border-b border-border">
          <div className={`flex items-center ${!sidebarOpen ? 'lg:justify-center' : 'gap-3'}`}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-primary flex items-center justify-center flex-shrink-0">
              <Stethoscope className="w-5 h-5 text-white" />
            </div>
            {sidebarOpen && (
              <div className="overflow-hidden">
                <h1 className="text-lg font-semibold text-foreground leading-tight">VetClinic</h1>
                <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">Veterinario</p>
              </div>
            )}
          </div>
        </div>

        {/* Navegación */}
        <nav className="flex-1 p-3 space-y-1.5 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `flex items-center ${
                  sidebarOpen ? 'gap-3 px-3' : 'lg:justify-center px-0 lg:px-2'
                } py-2.5 rounded-xl transition-all duration-200 group relative ${
                  isActive
                    ? "bg-gradient-to-r from-primary to-primary/80 text-primary-foreground shadow-sm shadow-primary/20"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`
              }
            >
              <div className="flex-shrink-0">
                <item.icon className="w-5 h-5" />
              </div>
              {sidebarOpen && (
                <span className="text-sm font-medium truncate">{item.label}</span>
              )}
              {!sidebarOpen && (
                <div className="absolute left-16 bg-popover text-popover-foreground px-3 py-1.5 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-50 text-sm font-medium">
                  {item.label}
                </div>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Info del usuario y cierre de sesión */}
        <div className="p-3 border-t border-border">
          <div className={`flex items-center ${sidebarOpen ? 'gap-3 px-3' : 'lg:justify-center'} py-2.5`}>
            {sidebarOpen && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{user?.name}</p>
                <p className="text-xs text-muted-foreground truncate">{user?.specialty}</p>
              </div>
            )}
            <button
              onClick={() => setShowLogoutConfirm(true)}
              className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/30 text-muted-foreground hover:text-red-600 dark:hover:text-red-400 transition-colors"
              title="Cerrar sesión"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Contenido principal */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Barra superior */}
        <header className="bg-card/80 backdrop-blur-sm border-b border-border px-4 lg:px-6 py-3 flex items-center justify-between relative z-50">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
            >
              {sidebarOpen ? <ChevronLeft className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">Panel Veterinario</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button className="p-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-destructive rounded-full" />
            </button>
            <div className="flex items-center gap-2 pl-2 border-l border-border">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-primary flex items-center justify-center text-white text-sm font-medium">
                {user?.avatar || 'V'}
              </div>
              <div className="hidden sm:block">
                <p className="text-sm font-medium text-foreground">{user?.name}</p>
                <p className="text-xs text-muted-foreground">{user?.email}</p>
              </div>
            </div>
          </div>
        </header>

        {/* Contenido de la página */}
        <main className="flex-1 overflow-auto bg-gradient-to-b from-background to-muted/20">
          <Outlet />
        </main>
      </div>

      {/* Modal de confirmación de cierre de sesión */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-card border border-border rounded-2xl shadow-2xl p-6 max-w-sm w-full">
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-red-50 dark:bg-red-950/30 flex items-center justify-center mx-auto mb-3">
                <LogOut className="w-6 h-6 text-red-500" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-1">¿Cerrar sesión?</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Volverás a la pantalla de inicio de sesión.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowLogoutConfirm(false)}
                  className="flex-1 py-2 px-4 rounded-xl bg-muted text-foreground font-medium hover:bg-muted/80 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleLogout}
                  className="flex-1 py-2 px-4 rounded-xl bg-destructive text-destructive-foreground font-medium hover:bg-destructive/90 transition-colors"
                >
                  Salir
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
