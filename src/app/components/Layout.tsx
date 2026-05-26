import { useState } from "react";
import { Outlet, NavLink, useLocation } from "react-router";
import {
  Users, Stethoscope, PawPrint, Calendar, FileText, Home,
  Menu, X, ChevronLeft, Settings, LogOut, Bell, Moon, Sun,
  Shield, Maximize2, Minimize2
} from "lucide-react";
import { useNeutralino } from "../../hooks/useNeutralino";

export function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showNotifications, setShowNotifications] = useState(false);
  const { isNeutralino, os } = useNeutralino();
  const location = useLocation();

  const navItems = [
    { to: "/", label: "Inicio", icon: Home },
    { to: "/usuarios", label: "Usuarios", icon: Users },
    { to: "/veterinarios", label: "Veterinarios", icon: Stethoscope },
    { to: "/mascotas", label: "Mascotas", icon: PawPrint },
    { to: "/citas", label: "Citas", icon: Calendar },
    { to: "/expedientes", label: "Expedientes", icon: FileText },
  ];

  const getPageTitle = () => {
    const paths: Record<string, string> = {
      '/': 'Panel de Control',
      '/usuarios': 'Gestión de Usuarios',
      '/veterinarios': 'Gestión de Veterinarios',
      '/mascotas': 'Gestión de Mascotas',
      '/citas': 'Gestión de Citas',
      '/expedientes': 'Expedientes Clínicos',
    };
    return paths[location.pathname] || 'VetClinic';
  };

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? 'w-64' : 'w-0 lg:w-16'
        } bg-card border-r border-border transition-all duration-300 flex-shrink-0 overflow-hidden lg:overflow-visible`}
      >
        <div className="p-5 border-b border-border">
          <div className={`flex items-center ${!sidebarOpen ? 'lg:justify-center' : 'gap-3'}`}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center flex-shrink-0">
              <PawPrint className="w-5 h-5 text-white" />
            </div>
            {sidebarOpen && (
              <div className="overflow-hidden">
                <h1 className="text-lg font-semibold text-foreground leading-tight">VetClinic</h1>
                <p className="text-xs text-muted-foreground">Sistema de Gestión</p>
              </div>
            )}
          </div>
        </div>

        <nav className="p-3 space-y-1.5">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/"}
              className={({ isActive }) =>
                `flex items-center ${
                  sidebarOpen ? 'gap-3 px-3' : 'lg:justify-center px-0 lg:px-2'
                } py-2.5 rounded-xl transition-all duration-200 group ${
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
              {/* Tooltip cuando el sidebar está colapsado */}
              {!sidebarOpen && (
                <div className="absolute left-16 bg-popover text-popover-foreground px-3 py-1.5 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-50 text-sm font-medium">
                  {item.label}
                </div>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Sidebar Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-3 border-t border-border">
          <div className={`flex items-center ${sidebarOpen ? 'gap-3 px-3' : 'lg:justify-center'} py-2.5 rounded-xl text-muted-foreground hover:bg-muted transition-colors cursor-pointer`}>
            <Settings className="w-5 h-5 flex-shrink-0" />
            {sidebarOpen && <span className="text-sm">Configuración</span>}
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Bar */}
        <header className="bg-card/80 backdrop-blur-sm border-b border-border px-4 lg:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
              title={sidebarOpen ? 'Colapsar menú' : 'Expandir menú'}
            >
              {sidebarOpen ? <ChevronLeft className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <div>
              <h2 className="text-lg font-semibold text-foreground">{getPageTitle()}</h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Indicador Neutralino */}
            {isNeutralino && (
              <span className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 bg-purple-50 dark:bg-purple-950/30 text-purple-600 dark:text-purple-400 rounded-full text-xs font-medium">
                <Shield className="w-3 h-3" />
                Desktop ({os})
              </span>
            )}

            {/* Notificaciones */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors relative"
              >
                <Bell className="w-5 h-5" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-destructive rounded-full" />
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-2 w-72 bg-card border border-border rounded-xl shadow-xl z-50">
                  <div className="p-3 border-b border-border">
                    <p className="text-sm font-medium">Notificaciones</p>
                  </div>
                  <div className="p-3 space-y-2">
                    <div className="p-2 bg-muted rounded-lg text-sm">
                      <p className="font-medium">📅 Nueva cita</p>
                      <p className="text-muted-foreground text-xs">Max - Vacunación a las 09:00</p>
                    </div>
                    <div className="p-2 bg-muted rounded-lg text-sm">
                      <p className="font-medium">💊 Recordatorio</p>
                      <p className="text-muted-foreground text-xs">Medicación para Luna</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Perfil */}
            <div className="flex items-center gap-2 pl-2 border-l border-border">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white text-sm font-medium">
                AD
              </div>
              <div className="hidden sm:block">
                <p className="text-sm font-medium text-foreground">Admin</p>
                <p className="text-xs text-muted-foreground">admin@vetclinic.com</p>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto bg-gradient-to-b from-background to-muted/20">
          <Outlet />
        </main>
      </div>

      {/* Overlay para móvil */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-10 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}
