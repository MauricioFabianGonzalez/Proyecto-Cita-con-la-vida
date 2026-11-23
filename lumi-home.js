'use strict';

/* Lumi de portada: la interfaz principal ya existe en HTML (details + summary).
   Este script solo añade reacciones y, si funciona WebGL, un personaje 3D.
   Si falla o no se ejecuta, Lumi sigue flotando, abre su menú y utiliza un SVG local.
*/
(() => {
  const host = document.getElementById('lumi-home-fallback');
  if (!host) return;

  const trigger = host.querySelector('summary');
  if (!trigger) return;

  const reducedMotion = window.matchMedia
    ? window.matchMedia('(prefers-reduced-motion: reduce)')
    : { matches:false };

  // Native <details> owns opening and closing. Never replace or remove Lumi.
  const refresh = () => {
    trigger.setAttribute('aria-label', host.open
      ? 'Cerrar las opciones de Lumi'
      : 'Abrir las opciones de Lumi');
  };
  host.addEventListener('toggle', refresh);
  refresh();

  // 3D is an enhancement, not the element responsible for visibility.
  // Prevent its loading on devices requesting reduced motion or reduced data.
  const saveData = navigator.connection && navigator.connection.saveData;
  if (reducedMotion.matches || saveData || !window.WebGLRenderingContext) return;

  async function enhance3D() {
    try {
      const module = await import('./lumi-3d.js?v=4');
      if (module && typeof module.mountLumi3D === 'function') {
        // This draws inside the existing floating summary button.
        await module.mountLumi3D(trigger,reducedMotion);
      }
    } catch (_) {
      // The illustrated character stays visible. No third-party services needed.
    }
  }

  // Give content precedence over optional WebGL on low-end phones.
  if ('requestIdleCallback' in window) {
    window.requestIdleCallback(enhance3D, {timeout:2500});
  } else {
    window.setTimeout(enhance3D,1200);
  }
})();
