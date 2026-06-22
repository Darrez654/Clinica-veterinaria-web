import { createBrowserRouter } from "react-router";

// Auth
import { Login } from "./components/Login";
import { ProtectedRoute } from "./components/ProtectedRoute";

// Layouts
import { Layout } from "./components/Layout";
import { VetLayout } from "./components/VetLayout";
import { OwnerLayout } from "./components/OwnerLayout";

// Dashboards
import { VetDashboard } from "./components/VetDashboard";
import { OwnerDashboard } from "./components/OwnerDashboard";

// Módulos existentes
import { EnhancedDashboard } from "./components/EnhancedDashboard";
import { EnhancedUsers } from "./components/EnhancedUsers";
import { Veterinarians } from "./components/Veterinarians";
import { Pets } from "./components/Pets";
import { Appointments } from "./components/Appointments";
import { ClinicalRecords } from "./components/ClinicalRecords";

export const router = createBrowserRouter([
  // ── Ruta pública: Login ──
  {
    path: "/login",
    Component: Login,
  },

  // ── Ruta raíz: redirige según sesión ──
  {
    path: "/",
    Component: ProtectedRoute,
    children: [
      {
        Component: Layout,
        children: [
          { index: true, Component: EnhancedDashboard },
          { path: "usuarios", Component: EnhancedUsers },
          { path: "veterinarios", Component: Veterinarians },
          { path: "mascotas", Component: Pets },
          { path: "citas", Component: Appointments },
          { path: "expedientes", Component: ClinicalRecords },
        ],
      },
    ],
  },

  // ── Rutas de Veterinario ──
  {
    path: "/veterinario",
    Component: ProtectedRoute,
    children: [
      {
        Component: VetLayout,
        children: [
          { index: true, Component: VetDashboard },
          { path: "citas", Component: Appointments },
          { path: "expedientes", Component: ClinicalRecords },
          { path: "mascotas", Component: Pets },
        ],
      },
    ],
  },

  // ── Rutas de Dueño de Mascota ──
  {
    path: "/dueno",
    Component: ProtectedRoute,
    children: [
      {
        Component: OwnerLayout,
        children: [
          { index: true, Component: OwnerDashboard },
          { path: "mascotas", Component: Pets },
          { path: "citas", Component: Appointments },
          { path: "expedientes", Component: ClinicalRecords },
        ],
      },
    ],
  },
]);
