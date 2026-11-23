'use strict';
/* Lumi es una interfaz local: no escucha, no graba ni envía datos personales. */
(function(){
  const storageWelcome='cita-lumi-bienvenida-v1';
  const storageDismiss='cita-lumi-cerrada-sesion';
  const storageMin='cita-lumi-minimizada';
  const get=(store,key)=>{try{return store.getItem(key)}catch(_){return null}};
  const set=(store,key,value)=>{try{store.setItem(key,value)}catch(_){}};
  if(get(sessionStorage,storageDismiss)==='1')return;
  const container=document.createElement('aside');
  container.className='lumi-widget';
  container.setAttribute('aria-label','Lumi, acompañante del sitio');
  container.innerHTML="<section class=\"lumi-panel\" id=\"lumi-panel\" aria-label=\"Opciones de Lumi\" hidden><div class=\"lumi-panel-header\"><img src=\"https://gcdn.picsart.com/picsart-mcp/81dbfa93-12fe-4f3b-98a0-89cafc6671b2.png\" alt=\"\" width=\"42\" height=\"42\"><div class=\"lumi-panel-heading\"><strong>Lumi</strong><span>Una lucecita de esperanza</span></div><div class=\"lumi-panel-controls\"><button type=\"button\" class=\"lumi-icon-btn\" data-lumi-action=\"min\" aria-label=\"Minimizar a Lumi\" title=\"Minimizar\">−</button><button type=\"button\" class=\"lumi-icon-btn\" data-lumi-action=\"close\" aria-label=\"Cerrar Lumi por esta sesión\" title=\"Cerrar\">×</button></div></div><div class=\"lumi-panel-body\"><p class=\"lumi-message\" id=\"lumi-message\">¡Hola! Soy Lumi. Estoy para acompañarte en tu visita a Cita con la Vida. 💛</p><p class=\"lumi-question\">¿Querés que compartamos el devocional de hoy?</p><div class=\"lumi-actions\"><a class=\"lumi-action lumi-action-primary\" href=\"devocional.html\"><span>Leer el devocional de hoy</span><span aria-hidden=\"true\">↗</span></a><a class=\"lumi-action lumi-action-secondary\" href=\"oracion.html\"><span>Dejar un motivo de oración</span><span aria-hidden=\"true\">♡</span></a></div><button type=\"button\" class=\"lumi-later\" data-lumi-action=\"min\">Ahora no, gracias</button></div></section><button type=\"button\" class=\"lumi-toggle\" id=\"lumi-toggle\" aria-label=\"Abrir las opciones de Lumi\" aria-controls=\"lumi-panel\" aria-expanded=\"false\"><img src=\"https://gcdn.picsart.com/picsart-mcp/81dbfa93-12fe-4f3b-98a0-89cafc6671b2.png\" alt=\"Lumi, mascota amigable de la iglesia\" width=\"78\" height=\"78\"><span class=\"lumi-badge\" aria-hidden=\"true\"></span></button>";
  document.body.appendChild(container);
  document.body.classList.add('lumi-visible');
  const panel=container.querySelector('#lumi-panel');
  const toggle=container.querySelector('#lumi-toggle');
  const message=container.querySelector('#lumi-message');
  function show(){
    panel.hidden=false;container.classList.add('lumi-open');toggle.setAttribute('aria-expanded','true');
    toggle.setAttribute('aria-label','Minimizar las opciones de Lumi');set(localStorage,storageMin,'0');
  }
  function minimize(){
    panel.hidden=true;container.classList.remove('lumi-open');toggle.setAttribute('aria-expanded','false');
    toggle.setAttribute('aria-label','Abrir las opciones de Lumi');set(localStorage,storageMin,'1');
    toggle.focus({preventScroll:true});
  }
  function close(){
    set(sessionStorage,storageDismiss,'1');container.remove();document.body.classList.remove('lumi-visible');
  }
  toggle.addEventListener('click',()=>{if(panel.hidden){if(message)message.textContent='¡Qué bueno verte! ¿Qué te gustaría compartir hoy?';show()}else minimize()});
  container.querySelectorAll('[data-lumi-action]').forEach(button=>button.addEventListener('click',()=>button.dataset.lumiAction==='close'?close():minimize()));
  document.addEventListener('keydown',event=>{if(event.key==='Escape'&&!panel.hidden&&!document.querySelector('dialog[open]'))minimize()});
  // Solo una bienvenida espontánea por navegador. Luego permanece minimizada.
  if(get(localStorage,storageWelcome)!=='1'){
    set(localStorage,storageWelcome,'1');
    window.setTimeout(()=>{if(document.body.contains(container)&&get(sessionStorage,storageDismiss)!=='1')show()},1250);
  }
})();
