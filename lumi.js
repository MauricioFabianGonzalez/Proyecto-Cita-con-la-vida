'use strict';

/*
 * Lumi · Cita con la Vida — Trelew
 * Mascota de interfaz: no lee mensajes privados, no graba audio ni envía datos.
 * El botón × solo minimiza el diálogo: Lumi siempre puede volver a abrirse.
 */
(() => {
  if (document.querySelector('.lumi-widget')) return;

  const IMAGE = 'https://gcdn.picsart.com/picsart-mcp/81dbfa93-12fe-4f3b-98a0-89cafc6671b2.png';
  // Conservamos las claves anteriores para respetar las preferencias del visitante.
  const STORAGE_WELCOME = 'cita-lumi-bienvenida-v1';
  const STORAGE_MINIMIZED = 'cita-lumi-minimizada';
  const getPreference = (key) => {
    try { return localStorage.getItem(key); } catch (_) { return null; }
  };
  const savePreference = (key, value) => {
    try { localStorage.setItem(key, value); } catch (_) { /* modo privado */ }
  };

  const container = document.createElement('aside');
  container.className = 'lumi-widget';
  container.dataset.state = 'float';
  container.setAttribute('aria-label', 'Lumi, acompañante del sitio');

  container.innerHTML = [
    '<section class="lumi-panel" id="lumi-panel" aria-label="Opciones de Lumi" hidden>',
      '<div class="lumi-panel-header">',
        '<img src="' + IMAGE + '" alt="" width="42" height="42" loading="lazy">',
        '<div class="lumi-panel-heading"><strong>Lumi</strong><span>Una lucecita de esperanza</span></div>',
        '<div class="lumi-panel-controls">',
          '<button type="button" class="lumi-icon-btn" data-lumi-action="min" aria-label="Minimizar el diálogo" title="Minimizar">−</button>',
          '<button type="button" class="lumi-icon-btn" data-lumi-action="close" aria-label="Cerrar el diálogo y dejar a Lumi visible" title="Cerrar diálogo">×</button>',
        '</div>',
      '</div>',
      '<div class="lumi-panel-body">',
        '<p class="lumi-message" id="lumi-message">¡Hola! Soy Lumi. Estoy para acompañarte en tu visita a Cita con la Vida. 💛</p>',
        '<p class="lumi-question">¿Querés que compartamos el devocional de hoy?</p>',
        '<div class="lumi-actions">',
          '<a class="lumi-action lumi-action-primary" href="devocional.html"><span>Leer el devocional de hoy</span><span aria-hidden="true">↗</span></a>',
          '<a class="lumi-action lumi-action-secondary" href="oracion.html"><span>Dejar un motivo de oración</span><span aria-hidden="true">♡</span></a>',
          '<a class="lumi-action lumi-action-tertiary" href="index.html#mensajes"><span>Explorar las prédicas</span><span aria-hidden="true">→</span></a>',
          '<a class="lumi-action lumi-action-play" href="juegos.html#espadeo"><span>⚔️ ¡Te desafío al espadeo!</span><span aria-hidden="true">↗</span></a>',
          '<a class="lumi-action lumi-action-play" href="juegos.html#adivina"><span>🔍 Pensá en un personaje</span><span aria-hidden="true">↗</span></a>',
        '</div>',
        '<button type="button" class="lumi-later" data-lumi-action="min">Ahora no, gracias</button>',
      '</div>',
    '</section>',
    '<button type="button" class="lumi-toggle" id="lumi-toggle" aria-label="Abrir las opciones de Lumi"',
      ' aria-controls="lumi-panel" aria-expanded="false" title="Hablar con Lumi">',
      '<img src="' + IMAGE + '" alt="Lumi, mascota amigable de la iglesia" width="78" height="78">',
      '<span class="lumi-badge" aria-hidden="true"></span>',
    '</button>'
  ].join('');

  document.body.appendChild(container);
  document.body.classList.add('lumi-visible');

  const panel = container.querySelector('#lumi-panel');
  const toggle = container.querySelector('#lumi-toggle');
  const message = container.querySelector('#lumi-message');
  const onGamesPage = window.location.pathname.endsWith('/juegos.html');
  if (onGamesPage) {
    message.textContent = '¡Bienvenido a mis juegos! Estoy listo para ponerte a prueba. 😄';
    const question = container.querySelector('.lumi-question');
    if (question) question.textContent = '¿Espadeo o adivinanza? ¡Vos elegís!';
  }
  const reducedMotion = window.matchMedia
    ? window.matchMedia('(prefers-reduced-motion: reduce)')
    : { matches: false };

  const idleGestures = [
    { name: 'wave', duration: 1650 },
    { name: 'look', duration: 1900 },
    { name: 'sit', duration: 2600 },
    { name: 'yawn', duration: 2100 }
  ];
  let idleTimer = null;
  let gestureTimer = null;
  let welcomeTimer = null;
  let paused = false;
  let gestureIndex = 0;

  function clearIdle() {
    window.clearTimeout(idleTimer);
    window.clearTimeout(gestureTimer);
    idleTimer = null;
    gestureTimer = null;
  }

  function scheduleIdle() {
    clearIdle();
    container.dataset.state = 'float';

    if (!panel.hidden || paused || document.hidden || reducedMotion.matches) return;

    // Los movimientos son espaciados para que no distraigan.
    const delay = 6500 + Math.random() * 4500;
    idleTimer = window.setTimeout(() => {
      if (!panel.hidden || paused || document.hidden || reducedMotion.matches) return;
      const gesture = idleGestures[gestureIndex % idleGestures.length];
      gestureIndex += 1;
      container.dataset.state = gesture.name;
      gestureTimer = window.setTimeout(scheduleIdle, gesture.duration);
    }, delay);
  }

  function showPanel() {
    window.clearTimeout(welcomeTimer);
    clearIdle();
    panel.hidden = false;
    container.classList.add('lumi-open');
    container.dataset.state = reducedMotion.matches ? 'float' : 'wave';
    toggle.setAttribute('aria-expanded', 'true');
    toggle.setAttribute('aria-label', 'Minimizar las opciones de Lumi');
    toggle.title = 'Minimizar Lumi';
    savePreference(STORAGE_MINIMIZED, '0');
  }

  function minimizePanel(restoreFocus = false) {
    window.clearTimeout(welcomeTimer);
    panel.hidden = true;
    container.classList.remove('lumi-open');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Abrir las opciones de Lumi');
    toggle.title = 'Hablar con Lumi';
    savePreference(STORAGE_MINIMIZED, '1');

    // Si el botón que recibió el foco ahora está oculto, devolverlo a Lumi.
    if (restoreFocus) {
      try { toggle.focus({ preventScroll: true }); } catch (_) { toggle.focus(); }
    }
    scheduleIdle();
  }

  toggle.addEventListener('click', () => {
    if (panel.hidden) {
      message.textContent = onGamesPage ? '¡Otra ronda juntos! ¿Qué juego te gustaría probar?' : '¡Qué bueno verte! ¿Querés leer el devocional o dejar un motivo de oración?';
      showPanel();
    } else {
      minimizePanel();
    }
  });

  container.querySelectorAll('[data-lumi-action]').forEach((button) => {
    button.addEventListener('click', () => minimizePanel(true));
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && !panel.hidden && !document.querySelector('dialog[open]')) {
      minimizePanel(true);
    }
  });

  // Pausa las animaciones al pasar el mouse, al ocultar la pestaña o al solicitar menos movimiento.
  container.addEventListener('pointerenter', (event) => {
    if (event.pointerType === 'mouse') {
      paused = true;
      clearIdle();
      container.dataset.state = 'float';
    }
  });
  container.addEventListener('pointerleave', (event) => {
    if (event.pointerType === 'mouse') {
      paused = false;
      scheduleIdle();
    }
  });
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) clearIdle();
    else scheduleIdle();
  });
  if (typeof reducedMotion.addEventListener === 'function') {
    reducedMotion.addEventListener('change', scheduleIdle);
  }

  // La bienvenida aparece solo una vez; en visitas posteriores se respeta si estaba abierta.
  if (getPreference(STORAGE_WELCOME) !== '1') {
    savePreference(STORAGE_WELCOME, '1');
    welcomeTimer = window.setTimeout(() => {
      if (document.hidden) minimizePanel();
      else showPanel();
    }, 1250);
  } else if (getPreference(STORAGE_MINIMIZED) === '0') {
    showPanel();
  } else {
    minimizePanel();
  }
  // Construcción 3D gratuita en tiempo real; no usa API de pago.
  // Si WebGL, la red o el navegador fallan, la imagen 2D sigue siendo accesible.
  import('./lumi-3d.js?v=2')
    .then(({mountLumi3D})=>mountLumi3D(toggle,reducedMotion))
    .catch(()=>{ /* respaldo 2D intencional */ });

})();
