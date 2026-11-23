# Propuestas de mejora · Cita con la Vida Trelew

Actualización: 23/11/2026. Este documento separa lo **implementado** de las propuestas que requieren confirmar datos o decidir alcance.

## Ya implementado

- [x] Diseño adaptable a celulares, con fotos y galería.
- [x] Archivo de nueve prédicas, con buscador, filtros y resúmenes.
- [x] Compartir prédicas por enlace directo.
- [x] Devocional diario con contenido de respaldo.
- [x] Página para preparar un motivo de oración (sin almacenamiento ni envío automático).
- [x] Lumi con interacción, minimización, gestos y 3D experimental.
- [x] Three.js guardado localmente y alternativa en 2D.
- [x] Enlaces de vista previa social y sitemap.xml.

## Prioridad 1 — Facilitar la primera visita

**Objetivo:** que alguien nuevo sepa dónde ir, cuándo reunirse y cómo escribir.

Para publicar esta información se necesita confirmar:
- Dirección **vigente** de la iglesia. El afiche de Santa Cena aportado incluye «Abraham Mathews 258», pero debe corroborarse que siga siendo la ubicación actual.
- Días y horarios **habituales** de reuniones, distinguiéndolos de eventos especiales.
- Canal institucional de contacto (WhatsApp, e-mail o Facebook con URL estable).
- Si existen grupos o reuniones para niños y familias, sus características y responsables.

**Propuesta:** bloque «Tu primera visita», mapa con instrucciones y botones de contacto. No inventar horarios o servicios.

## Prioridad 2 — Biblioteca de mensajes

**Objetivo:** que cada prédica sea fácil de encontrar, escuchar y compartir.

- Agregar video/audio **solo cuando exista un enlace oficial**.
- Fichas por temática, pastor, pasaje y fecha verificada.
- Lectura de 2–3 minutos + pregunta para reflexionar + botón de compartir.
- Seguimiento editorial de los resúmenes nuevos, sin presentar interpretaciones como transcripciones literales.

## Prioridad 3 — Lumi con movimientos y personalidad

- Validar el 3D experimental en Chrome Android real.
- Mejorar la fidelidad del personaje con un modelo GLB liviano cuando exista un recurso disponible.
- Gestos articulados más naturales y reacciones al tacto; opción de desactivar animación.
- Mantener un respaldo estático si WebGL falla y evitar animaciones constantes que consuman batería.
- Nunca simular conversaciones inteligentes ni decir que un pedido de oración fue recibido si no existe un canal real.

## Prioridad 4 — Oración y acompañamiento privados

La página actual **no envía pedidos**. Para recibirlos directamente hace falta:
- Cuenta/canal administrado por la iglesia.
- Aviso de privacidad, control de acceso, retención y un procedimiento de atención.
- Confirmación real de recepción antes de mostrar un estado «enviado».

No guardar pedidos sensibles en GitHub público.

## Prioridad 5 — Comunicación y comunidad

- Agenda de actividades administrable con fechas confirmadas.
- Secciones para ministerios, voluntariado, jóvenes y familias **solo si los responsables y servicios están confirmados**.
- Historias y testimonios publicados únicamente con consentimiento.
- Fotos optimizadas, etiquetas claras y respaldo de los archivos originales.

## Prioridad 6 — Performance, SEO y accesibilidad

- Probar la publicación en Android, iOS y escritorio.
- Medir peso de imágenes y tiempos de carga; comprimir las que sean demasiado grandes.
- Revisar accesibilidad del teclado, lectores de pantalla y contraste.
- Registrar el sitio en Search Console si la iglesia decide administrarlo.
- Evitar tecnologías de seguimiento invasivas.

## Recomendación de orden

1. Resolver y comprobar Lumi 3D en celulares.
2. Confirmar dirección, horarios y contacto.
3. Agregar enlaces oficiales a prédicas y calendario.
4. Diseñar recepción segura para motivos de oración.
5. Evolucionar Lumi a un personaje 3D más fiel.


## Módulo nuevo: juegos bíblicos con Lumi (implementado el 23/11/2026)

- [x] Espadeo Bíblico: 300 preguntas bíblicas, 15 temas, partidas de 10 con referencias, puntaje y devolución.
- [x] Juego de adivinanza: 97 personajes, 63 rasgos y preguntas adaptativas sin IA de pago.
- [x] Inicio, menú móvil, pie y panel de Lumi enlazan con los dos juegos.
- [x] Navegación por teclado, modo de movimiento reducido y diseño para celulares.
- [ ] Validar visualmente en Chrome Android y Safari iOS.
- [ ] Revisar las 300 preguntas con la traducción bíblica preferida de la iglesia y el equipo pastoral.
- [ ] Añadir más personajes, especialmente mujeres y figuras menos conocidas, con pistas revisadas.
- [x] Modo infantil y modo familiar por turnos con 2–4 participantes, pantalla de pase, marcador y devolución.
- [x] Repaso temporal de preguntas falladas y posibilidad de cambiar de modo desde los resultados.
- [ ] Evaluar modo equipos para grupos grandes y rachas solo locales sin datos personales.
- [ ] Agregar voz a Lumi únicamente si hay consentimiento explícito de reproducción y un recurso de voz seguro.


## Inspiración Camino de Vida / Linktree — cambios implementados

- [x] Revisar la referencia pública https://linktr.ee/caminodevida y sus categorías de navegación.
- [x] Crear **enlaces.html** como landing de enlaces de Cita con la Vida, con logo, datos reales y secciones claras.
- [x] Ordenar **siguiente paso, recursos para crecer, juegos, oración/contacto y comunidad** sin copiar los servicios de la iglesia de referencia.
- [x] Sumar a **index.html** un bloque destacado de accesos rápidos y un enlace directo al hub.
- [x] Diseñar componentes para celular, teclado y vista previa social.
- [ ] Confirmar con responsables la dirección, los horarios y el canal institucional de WhatsApp; agregarlos luego al hub y a la página de primera visita.
- [ ] Obtener enlaces oficiales de transmisiones y predicaciones, si están disponibles, para agregarlos sin enlaces inventados.
- [ ] Realizar una revisión visual final en Chrome Android/Safari y validar la accesibilidad con lectores de pantalla.
