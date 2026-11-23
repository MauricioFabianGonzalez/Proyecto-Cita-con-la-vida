'use strict';
/* Lumi de portada: HTML/CSS primero.
 * No se elimina ni se reemplaza el personaje en ningún momento.
 * El 3D queda desactivado en esta portada hasta confirmar compatibilidad móvil.
 */
(() => {
  const host=document.getElementById('lumi-home-fallback');
  const trigger=host?.querySelector('summary');
  if(!host||!trigger)return;
  const sync=()=>{
    trigger.setAttribute('aria-label',host.open?'Cerrar las opciones de Lumi':'Abrir las opciones de Lumi');
  };
  host.addEventListener('toggle',sync);
  sync();
})();
