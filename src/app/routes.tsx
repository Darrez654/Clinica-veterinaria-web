import { createBrowserRouter } from "react-router";
import { Layout } from "./components/Layout";
import { EnhancedDashboard } from "./components/EnhancedDashboard";
import { EnhancedUsers } from "./components/EnhancedUsers";
import { Veterinarians } from "./components/Veterinarians";
import { Pets } from "./components/Pets";
import { Appointments } from "./components/Appointments";
import { ClinicalRecords } from "./components/ClinicalRecords";

export const router = createBrowserRouter([
  {
    path: "/",
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
]);
