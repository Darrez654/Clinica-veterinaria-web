/**
 * Neutralino.js - Inicialización para escritorio
 * En web normal (sin Neutralino) no hace nada.
 * Solo importas y llamas: setupNeutralino()
 */

export function setupNeutralino(): void {
  // Detectar si estamos en Neutralino
  const isDesktop = typeof window !== 'undefined' &&
    typeof (window as any).__NL_OS !== 'undefined';

  if (!isDesktop) return; // ← Modo web: no hace nada

  const NL = (window as any).Neutralino;
  if (!NL?.init) return;

  // Modo desktop: inicializa sin async/await para evitar errores
  try {
    NL.init();
    console.log('[Neutralino] Inicializado');
  } catch {
    // Ignorar errores de Neutralino al cargar
  }
}
