/**
 * Hook para detectar e integrar Neutralino.js
 * Permite que la app funcione como aplicación de escritorio nativa
 */

import { useState, useEffect } from 'react';

interface NeutralinoState {
  isNeutralino: boolean;
  os: string | null;
  windowSize: { width: number; height: number };
  isReady: boolean;
}

export function useNeutralino() {
  const [state, setState] = useState<NeutralinoState>({
    isNeutralino: false,
    os: null,
    windowSize: { width: 1280, height: 800 },
    isReady: false,
  });

  useEffect(() => {
    const checkNeutralino = async () => {
      const NL = (window as any).Neutralino;

      if (NL && NL.app) {
        try {
          const os = await NL.os.getOSInfo().catch(() => ({ name: 'unknown' }));
          const winSize = await NL.window.getSize().catch(() => ({
            width: 1280,
            height: 800,
          }));

          setState({
            isNeutralino: true,
            os: os.name || 'unknown',
            windowSize: { width: winSize.width, height: winSize.height },
            isReady: true,
          });

          // Configurar menú de aplicación si está en Neutralino
          setupNeutralinoMenu(NL);
        } catch {
          setState(prev => ({ ...prev, isReady: true }));
        }
      } else {
        setState(prev => ({ ...prev, isReady: true }));
      }
    };

    checkNeutralino();
  }, []);

  return state;
}

function setupNeutralinoMenu(NL: any) {
  // Solo configurar si la API de menú está disponible
  if (!NL.menu) return;

  try {
    NL.menu.set({
      menu: [
        {
          id: 'file',
          label: 'Archivo',
          items: [
            { id: 'export', label: 'Exportar datos' },
            { id: 'import', label: 'Importar datos' },
            { type: 'separator' },
            { id: 'quit', label: 'Salir' },
          ],
        },
        {
          id: 'view',
          label: 'Ver',
          items: [
            { id: 'reload', label: 'Recargar' },
            { type: 'separator' },
            { id: 'fullscreen', label: 'Pantalla completa' },
          ],
        },
        {
          id: 'help',
          label: 'Ayuda',
          items: [
            { id: 'about', label: 'Acerca de VetClinic' },
          ],
        },
      ],
    });
  } catch {
    // El menú no está soportado en esta versión
  }
}
