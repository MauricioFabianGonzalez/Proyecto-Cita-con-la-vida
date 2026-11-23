# Cita con la Vida · Trelew

Sitio web público de la comunidad **Cita con la Vida – Trelew**, Chubut, Argentina.

**Web:** https://mauriciofabiangonzalez.github.io/Proyecto-Cita-con-la-vida/

Este proyecto es independiente de cualquier otro repositorio. Se publica como sitio estático en GitHub Pages, sin cuotas de alojamiento propias ni backend.

## Qué ofrece

- Portada con fotografías aportadas por la comunidad y diseño adaptable a celulares.
- Secciones de nuestra iglesia, comunidad, pastores y galería fotográfica con filtros.
- Archivo de **9 prédicas**: resúmenes editoriales previamente trabajados, filtros temáticos, búsqueda, preguntas de reflexión y enlaces para compartir cada prédica.
- **Devocionales diarios**: `devocional.html`, con una lectura por fecha argentina y contenido de respaldo si falla la actualización de `devocional-hoy.json`.
- **Motivos de oración**: `oracion.html` prepara un texto para enviarlo por mensaje privado a Facebook. **No hay envío automático ni almacenamiento en el sitio**.
- **Lumi**, acompañante visual con accesos a devocionales, oración y prédicas. Permanece visible aun cuando se cierra el panel.

## Lumi 3D — versión experimental para celulares

- `lumi.js`: interacción, bienvenida y estado minimizado.
- `lumi.css`: panel accesible, diseño responsive y alternativa animada por CSS.
- `lumi-3d.js`: figura geométrica 3D animada mediante WebGL y Three.js. Mueve brazos, ojos, cabeza y cuerpo de forma independiente.
- `vendor/three.module.min.js`: copia local de **Three.js r160**, distribuida bajo licencia MIT (véase `vendor/THREE-LICENSE.txt`). La figura **no depende de un CDN externo para descargar Three.js**.
- Si WebGL no está disponible o falla la carga, se mantiene la imagen original en 2D. En dispositivos que solicitan reducción de movimiento, se respetan esas preferencias.
- Esta Lumi es un **personaje geométrico 3D inspirado en la ilustración**, no un modelo GLB esculpido idéntico. La apariencia y el rendimiento deben probarse en un teléfono real.

## Identidad y contenido

Las fotografías, piezas gráficas y referencias de las prédicas fueron proporcionadas por la iglesia o elaboradas en el proceso editorial con ella. Las **recreaciones generadas con IA se indican como tales** y no deben presentarse como imágenes documentales de eventos.

Los elementos alojados en Picsart se enlazan por HTTPS. Conviene mantener copias de los originales y migrarlos más adelante a un almacenamiento definitivo que controle la iglesia.

**Pendiente de confirmar antes de publicitar horarios y servicios:** dirección actual, horarios habituales, contacto oficial, nombre de ministerios, enlaces directos a transmisiones y autorización para publicar imágenes de personas (especialmente menores). Un afiche histórico no confirma horarios actuales.

## Archivos principales

- `index.html`, `styles.css`, `script.js`: página principal, filtros, galería, búsqueda y enlaces para compartir.
- `devocional.html`, `devocional-page.js`, `devocionales.js`, `devocional-hoy.json`: lecturas diarias.
- `oracion.html`, `oracion-page.js`, `bienestar.css`: preparación del motivo de oración y páginas interiores.
- `lumi.js`, `lumi.css`, `lumi-3d.js`, `vendor/three.module.min.js`: personaje.
- `sitemap.xml`, `robots.txt`: ayuda para buscadores.
- `PLAN_DE_MEJORAS.md`: prioridades propuestas.

## Publicación

El repositorio debe permanecer público para su publicación gratuita mediante GitHub Pages en esta configuración. Ajuste recomendado: **Settings → Pages → Deploy from a branch → main → / (root)**.

El primer despliegue o una actualización pueden tardar en reflejarse en el sitio público. Si Chrome conserva una versión anterior, utilizar una recarga o una ventana privada. No se requiere instalación, suscripciones pagas ni clave de API para Lumi.

## Privacidad y accesibilidad

La web no utiliza sistemas de rastreo propios. La mascota no graba, no escucha y no envía datos. El formulario de oración no guarda pedidos en un repositorio. Se incluyen enlaces con etiquetas, teclado y opción de reducir animaciones. El 3D se degrada a 2D si la capacidad gráfica es insuficiente.


## Juegos bíblicos con Lumi — noviembre de 2026

La página **[Jugá con Lumi](juegos.html)** reúne dos minijuegos gratuitos:

### Espadeo Bíblico
- Banco editorial de **300 preguntas diferentes** repartidas en 15 temas, con referencia bíblica y 4 opciones para cada pregunta.
- Selección aleatoria de **10 preguntas por partida**, sin preguntas repetidas dentro de una ronda; el mazo se consume sin repetir entre rondas hasta agotarse.
- Corrección inmediata, referencia para consultar la Biblia, revisión de todas las respuestas, puntaje de 0–10 y frases simpáticas según el resultado.
- Permite volver a jugar y compartir resultados mediante las funciones del navegador.

### Lumi adivina
- Colección inicial de **97 personajes** y **63 características/preguntas**.
- Motor de deducción local: pregunta progresivamente, pondera sí/no/probablemente y permite «no sé» o volver atrás.
- Ofrece una primera hipótesis y puede seguir descartando opciones si la respuesta es negativa.
- **No siempre puede adivinar:** solo contempla su colección actual y depende de las pistas. No tiene IA conectada, no lee pensamientos ni envía respuestas a ningún servicio.
- Las pistas de los personajes muestran referencias bíblicas.

### Código y mantenimiento
- \`juegos.html\`: interfaz.
- \`juegos.css\`: diseño responsive y accesibilidad.
- \`juegos.js\`: selección, puntuación, estados y motor de deducción.
- \`juego-preguntas-1.js\`, \`juego-preguntas-2.js\`, \`juego-preguntas-3.js\`: 100 preguntas en cada archivo.
- \`juego-personajes.js\`: personajes y rasgos de deducción.

No hay clasificación de usuarios, competencia, dinero, anuncios ni almacenamiento de las respuestas. Las preguntas se pueden editar sin modificar el motor de juego. Los textos son para enseñanza recreativa; se recomienda contrastar todas las referencias con la traducción bíblica usada por la comunidad.

### Comprobaciones efectuadas
- Total de preguntas: 300, todas con 4 alternativas diferentes y referencia.
- Sin preguntas duplicadas por texto; 15 temas con 20 preguntas cada uno.
- Datos de personajes: 97 personajes, 63 rasgos y sin fichas de rasgos idénticas.
- En simulaciones con respuestas ideales, el adivinador identificó 97 de 97 personajes de su propia colección.
- JavaScript analizado sintácticamente. **La prueba visual en dispositivos y la publicación de GitHub Pages deben confirmarse en navegador real.**

