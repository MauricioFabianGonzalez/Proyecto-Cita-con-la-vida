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
