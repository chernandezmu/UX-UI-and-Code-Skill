# E5 · Optimización y pulido

Entrada: app segura y desplegada en preview. Salida: métricas dentro de presupuesto, revisión de calidad completa e informe de lanzamiento.

**Regla:** mide antes y después. Cada optimización se justifica con una métrica; sin dato, no hay cambio.

## 1. Medir

- Lighthouse (móvil, throttling por defecto) en las páginas P0 de la preview: rendimiento, accesibilidad, buenas prácticas y SEO.
- Core Web Vitals de campo si hay tráfico (Vercel Speed Insights, Cloudflare Web Analytics, CrUX).
- Tamaño de bundle: `@next/bundle-analyzer`, `vite-bundle-visualizer`, `astro build` + informe.
- Código muerto y dependencias sin uso: `knip`.

## 2. Presupuestos

| Métrica | Objetivo |
|---|---|
| LCP | < 2.5 s (p75 móvil) |
| INP | < 200 ms |
| CLS | < 0.1 |
| JS inicial (landing) | < 170 KB gzip |
| Lighthouse (cada categoría) | ≥ 90 |
| Violaciones axe serias | 0 |

## 3. Rendimiento

- **LCP:** el elemento LCP (imagen hero o titular) se sirve en el HTML inicial; imagen con `fetchpriority="high"` y sin `loading="lazy"`; precarga solo la fuente display; el preloader (noir) nunca tapa el render del hero detrás.
- **CLS:** `width`/`height` o `aspect-ratio` en medios; fuentes con métricas de respaldo (`next/font`, `size-adjust`); espacio reservado para contenido asíncrono y banners.
- **INP:** divide JS pesado por ruta; inicializa GSAP/Lenis después de la primera pintura; evita tareas largas (> 50 ms) en manejadores; `debounce` en inputs de búsqueda.
- **Imágenes:** AVIF/WebP con `srcset`/`sizes` (componente de imagen del framework); vídeo en bucle comprimido y con póster.
- **Red y caché:** estáticos con hash y `Cache-Control: public, max-age=31536000, immutable`; páginas estáticas o ISR donde se pueda; compresión Brotli; CDN.
- **Terceros:** scripts `async`/`defer`, fachadas para embeds (YouTube, chat, mapas), elimina lo que no aporte.
- **Datos:** índices para las consultas del flujo P0, sin N+1, paginación, caché de lecturas frecuentes.

## 4. SEO y compartir

- `title` y `description` únicos por página, `canonical`, `lang` correcto.
- Open Graph y Twitter cards con imagen 1200×630 generada con la identidad.
- `sitemap.xml`, `robots.txt`, JSON-LD (`Organization`, `Product`, `FAQPage`, `Article` según el caso), `hreflang` si hay idiomas.
- Un solo `h1` por página y jerarquía de encabezados sin saltos.
- Favicon, iconos de app y `manifest.webmanifest` con los colores de `DESIGN.md`.

## 5. Accesibilidad final

- axe sin violaciones serias (ya en CI desde E3).
- Recorrido completo solo con teclado (orden lógico, foco visible, sin trampas, `Esc` cierra overlays).
- Prueba rápida con lector de pantalla (VoiceOver o NVDA) del flujo P0.
- Zoom al 200% y texto grande sin romper el layout; `prefers-reduced-motion` probado.
- Contraste verificado en claro y oscuro, incluidos estados (hover, focus, disabled).

## 6. Pulido de UX y diseño

Revisión contra `DESIGN.md`, pantalla por pantalla:
- **Consistencia:** solo tokens; espaciado en la escala; radios y sombras de la escala; una familia de iconos.
- **Tipografía:** `text-wrap: balance` en titulares cortos y `pretty` en párrafos; longitud de línea 60–75 caracteres; cifras tabulares en datos.
- **Microcopy:** botones con verbo ("Crear proyecto", no "Enviar"); errores con causa + solución; vacíos con acción; confirmaciones claras.
- **Estados:** hover, focus, active y disabled visibles y coherentes; carga sin saltos; feedback < 100 ms.
- **Motion:** salidas más cortas que entradas; nada bloquea la interacción; una animación protagonista por pantalla; en la app, transiciones de 150–300 ms.
- **Detalles de autor** (noir): microinteracciones del checklist de la identidad y footer con personalidad.
- **Conversión:** un CTA primario por pantalla, prueba social cerca del CTA, formularios con el mínimo de campos, eventos del embudo funcionando.

## 7. Pulido de código

- Elimina código muerto, dependencias sin uso (`knip`) y `console.log`.
- TypeScript estricto sin `any` injustificados.
- README del proyecto: cómo arrancar, variables de entorno (`.env.example`), comandos, despliegue y rollback.

## Checklist

| Nivel | Tarea |
|---|---|
| Básico | Lighthouse en páginas P0 · LCP/CLS dentro de presupuesto · meta + OG + sitemap · favicon |
| Estándar | + INP y JS inicial en presupuesto · JSON-LD · recorrido de teclado y lector de pantalla · pulido de microcopy y estados · `knip` |
| Completo | + datos de campo · revisión pantalla por pantalla contra `DESIGN.md` · imágenes OG por página · optimización de consultas · README de operación |

## Puerta E5 · Informe final

| Métrica | Antes | Después |
|---|---|---|
| LCP / INP / CLS | | |
| Lighthouse (rend. / a11y / BP / SEO) | | |
| JS inicial | | |

Más: qué se construyó y dónde · decisiones y supuestos · desviaciones deliberadas de `DESIGN.md` · `needs_validation` de seguridad pendientes · siguiente paso recomendado (P1 del roadmap). Marca el proyecto como **listo para lanzar** en `ROADMAP.md`.
