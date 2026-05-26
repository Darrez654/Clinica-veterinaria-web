
  import { createRoot } from "react-dom/client";
  import App from "./app/App.tsx";
  import "./styles/index.css";

  // Inicializar Neutralino si estamos en desktop
  import { setupNeutralino } from "./neutralino.ts";
  setupNeutralino();

  createRoot(document.getElementById("root")!).render(<App />);
  