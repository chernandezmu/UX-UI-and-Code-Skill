---
name: ux-ui-and-code-skill
description: Especificaciones UX/UI para webs, animaciones y transiciones de estilo noir editorial (oscuras, tipográficas, cinemáticas), adaptadas al stack elegido (HTML/CSS/JS, Svelte, Astro, NestJS, React u otro) y con auditoría de qué elementos usar u omitir.
---

# UX-UI and Code Skill

Un sistema para construir webs que se sienten como un objeto de autor: fondo casi negro, tipografía gigante que *es* la imagen, metadatos pequeños en mono, numeración por todas partes y un movimiento lento, preciso y con peso. Nada es plantilla; todo parece hecho a mano y con intención.

Aplica esta skill completa. Si el usuario pide solo una parte (p. ej. "una transición"), usa igualmente los tokens, easings y reglas de este documento para que la pieza pertenezca al mismo mundo.

---

## 0. Paso previo: stack y auditoría de elementos

Haz esto **antes** de escribir código. El estilo (§1–§5) es el mismo en todos los stacks; lo que cambia es con qué herramientas se implementa y qué piezas sobran.

### 0.1 Definir el formato de programación

1. Si hay un proyecto existente, **detecta el stack tú mismo** (`package.json`, `astro.config.*`, `svelte.config.*`, `next.config.*`, `nest-cli.json`, archivos `.html` sueltos) en vez de preguntar.
2. Si no hay proyecto y el usuario no lo dijo, pregunta una sola vez con estas opciones:
   - **HTML, CSS y JS** (sin framework)
   - **Svelte / SvelteKit**
   - **Astro**
   - **NestJS**
   - **React** (Vite o Next.js)
   - **Other** (pide cuál: Vue/Nuxt, Angular, WordPress, Webflow, Framer…)
3. Si no hay respuesta, usa **HTML, CSS y JS** y dilo en una línea.
4. **NestJS es backend**: no renderiza animaciones por sí solo. Pregunta (o detecta) qué pinta la interfaz:
   - Nest sirve archivos estáticos (`ServeStaticModule`) → aplica la columna HTML/CSS/JS.
   - Nest con motor de plantillas (Handlebars, Pug, EJS) → HTML/CSS/JS dentro de las vistas; scripts en `public/`.
   - Nest como API + frontend separado → aplica la columna del frontend (React, Svelte, Astro…). Nest solo entrega datos.

### 0.2 Matriz por stack: qué usar y qué sobra

| Pieza | HTML/CSS/JS | React (Vite) | Next.js | Svelte / SvelteKit | Astro |
|---|---|---|---|---|---|
| **Scroll suave** | `lenis` por CDN | `lenis/react` (`<ReactLenis root>`) | `lenis/react` en un componente `'use client'` del layout | `lenis` en `onMount` de `+layout.svelte` | `lenis` en un `<script>` del layout |
| **Motor de animación** | GSAP + ScrollTrigger por CDN | `gsap` + `@gsap/react` (`useGSAP` con `scope`, limpia solo) | Igual que React, solo en componentes cliente | GSAP para scroll; `svelte/transition` y `svelte/motion` (`tweened`, `spring`) para micro y menú | GSAP en `<script>` (Astro lo empaqueta) |
| **División de texto** | `SplitType` o GSAP SplitText | SplitText dentro de `useGSAP` | Igual que React | Action `use:reveal` que hace el split | En el `<script>`, sobre `data-reveal` |
| **Transición de página** | View Transitions entre documentos (`@view-transition { navigation: auto; }`) o Barba.js | `motion` (`AnimatePresence`) con el router, o View Transitions | `template.tsx` o View Transitions | `onNavigate` + `document.startViewTransition` | `<ClientRouter />` nativo + `transition:name` / `transition:animate` |
| **Fuentes** | `<link>` de Google Fonts | `@fontsource/*` | `next/font/google` | `@fontsource/*` | `@fontsource/*` |
| **Dónde va el código** | `styles.css` + `main.js` | Hooks / componentes (`<Reveal>`, `<Magnetic>`) | Igual + `'use client'` | Actions y componentes | Componentes `.astro` + `<script>`; islas solo si hay estado |
| **Sobra** | Bundler, framework, Framer Motion | Barba, jQuery, `querySelectorAll` global, `useEffect` sin limpieza | Barba, `react-router`, `<link>` de fuentes | Barba, Framer Motion, librerías de React, `quickTo` (usa `spring`) | Barba, isla de React solo para animar, `client:load` innecesario |

Reglas al traducir las recetas del §6 (escritas en JS plano):
- **React / Next:** usa refs y `useGSAP({ scope })`, nunca selectores globales. Todo lo que toque `window` va en el cliente.
- **Svelte:** cada receta se vuelve una *action* (`use:magnetic`, `use:reveal`) que devuelve `destroy()`.
- **Astro:** re-inicializa en `document.addEventListener("astro:page-load", init)` si usas `<ClientRouter />`, y mata los ScrollTriggers al salir (`astro:before-swap`).
- **Todos:** nada de `window`/`document` al nivel superior del módulo (rompe SSR); limpia ScrollTriggers y listeners al desmontar.
- **Other:** busca primero lo nativo del framework (p. ej. `<Transition>` y `pageTransition` en Vue/Nuxt) y usa GSAP + Lenis solo para lo que no cubre.

### 0.3 Auditoría: qué elementos necesita y cuáles sobran

Antes de construir, clasifica cada pieza en **Necesaria / Opcional / Sobra**.

**1. Según el tipo de sitio**

| Pieza (§6) | Portfolio / música / lanzamiento | Landing de producto / SaaS | E-commerce / sitio de contenido |
|---|---|---|---|
| Preloader con contador (6.2) | Necesaria | Opcional (≤1.5s) | Sobra |
| Reveal de texto e imagen (6.3, 6.7) | Necesaria | Necesaria | Necesaria (más corta) |
| Statement con scrub (6.4) | Necesaria | Opcional | Sobra |
| Botón magnético (6.5) | Opcional | Opcional (solo CTA principal) | Sobra |
| Cursor y rastro de tinta (6.6) | Opcional | Sobra | Sobra |
| Grain (6.8) | Necesaria | Opcional | Opcional |
| CRT / glitch (6.9, 6.10) | Opcional | Sobra | Sobra |
| Marquee (6.11) | Opcional | Opcional | Opcional |
| Scroll horizontal (6.12) | Opcional | Opcional | Sobra |
| Transición de página (6.14) | Necesaria si hay varias páginas | Opcional | Sobra (prioriza velocidad) |
| Three.js / WebGL | Solo con un objeto 3D con propósito | Sobra salvo demo de producto | Sobra |

Reglas fijas:
- Una sola página → sin transición de página ni Barba.
- Sin escena 3D → sin Three.js.
- Sin sección horizontal → sin pin.
- Sin sonido diseñado → sin toggle de sonido.

**2. Dependencias redundantes (elimínalas si aparecen)**
- Dos motores de animación para lo mismo (GSAP + Framer Motion, o GSAP + anime.js).
- Dos scrolls suaves (Lenis + Locomotive, o Lenis + `scroll-behavior: smooth`).
- Barba.js en un framework que ya tiene transiciones de router.
- AOS, ScrollReveal, WOW.js o animate.css (ScrollTrigger ya lo cubre).
- jQuery solo para selectores o eventos.
- SplitType si ya usas GSAP SplitText (o al revés).
- Librerías de iconos completas para 3–4 flechas (usa `↗ → ↑` o SVG en línea).
- Fuentes cargadas que no se usan, o más de 3 familias.

**3. Si hay código existente**
1. Lee `package.json`, imports y CSS global.
2. Lista dependencias redundantes, código muerto (animaciones sin elemento, estilos sin uso) y piezas que contradicen el estilo (§10).
3. Propón qué quitar y qué añadir **antes** de editar. Borra solo con el visto bueno del usuario.

**4. Entregable de esta fase**

Abre la respuesta con un resumen corto como este:

```
Stack: Astro 5 · Tipo: portfolio multipágina
Usar:   Lenis, GSAP + ScrollTrigger, SplitText, <ClientRouter />, @fontsource (Anton, Inter Tight, JetBrains Mono)
Omitir: Barba (Astro ya tiene transiciones), Three.js (no hay 3D), CRT/glitch (no encaja con el tono)
Quitar: aos, animate.css (redundantes con ScrollTrigger)
```

Después sigue con el diseño y el código.

---

## 1. Principios (léelos antes de diseñar)

1. **La tipografía es el hero.** El elemento principal casi nunca es una foto: es una palabra o wordmark que ocupa el ancho del viewport. Las imágenes acompañan, no protagonizan.
2. **Contraste de escalas extremo.** Titulares de 12–22vw conviven con etiquetas de 11–12px. No hay tamaños "medianos" de relleno.
3. **Todo está indexado.** Secciones, proyectos, tracks, figuras y notas llevan numeración: `01/`, `A1`, `B2`, `fig. 02`, `[ 03 ]`, superíndices¹. Da sensación de archivo, catálogo o disco.
4. **El movimiento tiene peso.** Entradas lentas (0.9–1.4s), salidas rápidas (0.4–0.6s), easing exponencial. Nada rebota, nada es lineal salvo marquees y loops.
5. **El sitio es un objeto, no un documento.** Preloader con ritual, sonido opcional, cursor propio, estados de sistema ("cargando…", "disponible"), easter eggs. El usuario *entra* a algo.
6. **Silencio visual.** Mucho negro, mucho espacio, una sola acentuación de color por pantalla. La riqueza viene del movimiento y la tipografía, no de decoración.
7. **Detalle obsesivo en lo pequeño.** Copiar al portapapeles con feedback "Copied!", flechas ↗ en enlaces externos, hora local en vivo, contador de scroll, labels entre corchetes. Los píxeles son pequeños; los detalles no.

---

## 2. Tokens de diseño

### 2.1 Color

Base oscura con un tinte (nunca `#000` puro salvo en video/canvas). Un solo acento.

```css
:root {
  /* Superficies */
  --bg:         #0a0a0b;   /* negro tinta (alternativas: #08090c azulado, #14100a cálido) */
  --bg-elev:    #121214;   /* tarjetas, menús */
  --line:       rgba(255,255,255,0.10); /* hairlines 1px */
  /* Texto */
  --fg:         #ecebe7;   /* hueso, no blanco puro */
  --fg-muted:   rgba(236,235,231,0.55);
  --fg-faint:   rgba(236,235,231,0.28);
  /* Acento — elige UNO por proyecto */
  --accent:     #d8ff3d;   /* ácido. Alternativas: #ff4d1f naranja, #c9a46a oro, #7cf2c6 fósforo */
  /* Inversión (secciones claras ocasionales) */
  --paper:      #ecebe7;
  --ink:        #0a0a0b;
}
```

Reglas:
- El acento se usa en ≤3 lugares por viewport: un punto de estado `●`, un hover, un CTA.
- Secciones invertidas (`--paper` / `--ink`) solo como "golpe" puntual — testimonios, CTA final o footer.
- Variante opcional **CRT/fósforo**: `--fg: #b8ffb0` sobre `#050805` con scanlines (ver §6.9). Permite temas intercambiables vía `[data-theme]`.

### 2.2 Tipografía

Tres roles, nunca más:

| Rol | Uso | Fuentes sugeridas (Google Fonts) | Estilo |
|---|---|---|---|
| **Display** | Hero, títulos de sección, números grandes | `Anton`, `Bebas Neue`, `Archivo Black`, `Big Shoulders Display`, `Unbounded` | MAYÚSCULAS, tracking −0.02 a −0.04em, line-height 0.82–0.9 |
| **Texto** | Párrafos, descripciones | `Inter Tight`, `Manrope`, `Instrument Sans` | 16–20px, line-height 1.45, peso 400 |
| **Mono / sistema** | Labels, índices, metadatos, nav, botones | `JetBrains Mono`, `IBM Plex Mono`, `Space Mono` | 11–13px, MAYÚSCULAS, tracking +0.06 a +0.12em |

Opcional: un **serif itálico** (`Instrument Serif` o `Fraunces` italic) para una sola palabra de énfasis dentro de un titular display.

```css
:root {
  --f-display: "Anton", "Bebas Neue", Impact, sans-serif;
  --f-text:    "Inter Tight", system-ui, sans-serif;
  --f-mono:    "JetBrains Mono", ui-monospace, monospace;

  --t-mega:  clamp(4.5rem, 19vw, 22rem);  /* wordmark hero */
  --t-xl:    clamp(3rem, 10vw, 10rem);    /* títulos de sección */
  --t-l:     clamp(2rem, 5vw, 4.5rem);    /* statements */
  --t-m:     clamp(1.25rem, 2.2vw, 1.75rem);
  --t-body:  clamp(1rem, 1.1vw, 1.125rem);
  --t-label: 0.75rem;                      /* 12px mono */
}
.display { font-family: var(--f-display); text-transform: uppercase;
           line-height: .86; letter-spacing: -.03em; }
.label   { font-family: var(--f-mono); font-size: var(--t-label);
           text-transform: uppercase; letter-spacing: .1em; color: var(--fg-muted); }
```

Patrones tipográficos firma:
- **Label entre corchetes:** `[ WHAT I DO ]`, `[ CASE STUDIES ]`.
- **Bullet de estado:** `● TRACKLIST`, `● DISPONIBLE` (el `●` en `--accent`, opcionalmente parpadeando).
- **Titular apilado repetido:** la misma palabra 3–4 veces en líneas, con opacidad decreciente o en outline (`-webkit-text-stroke: 1px var(--fg)` + `color: transparent`), que se revela una a una al hacer scroll.
- **Punto final como logo:** `NOMBRE.`, `FEATURED.` — el punto en acento.
- **Footnotes:** superíndices numerados en el texto¹ que remiten a notas pequeñas en mono más abajo.
- **Líneas tipo terminal/log:** `[ OK ] módulo ........... listo` para preloaders o secciones "sistema".

### 2.3 Espaciado y grid

```css
:root {
  --gutter: clamp(16px, 2vw, 32px);
  --cols: 12;
  --space-1: .5rem; --space-2: 1rem; --space-3: 2rem;
  --space-4: 4rem;  --space-5: 8rem; --space-6: 14rem;  /* entre secciones */
  --radius: 0;       /* esquinas rectas por defecto; 2–4px máx. en inputs */
}
.grid { display: grid; grid-template-columns: repeat(var(--cols), 1fr);
        column-gap: var(--gutter); padding-inline: var(--gutter); }
```

- 12 columnas en desktop, 4 en móvil. Texto de párrafo nunca más ancho que 5–6 columnas.
- Composición **asimétrica**: label en col 1–2, texto en col 7–11; imagen que rompe hacia el borde.
- **Hairlines** de 1px (`--line`) separan filas de listas (proyectos, tracks, FAQ). Son parte del diseño, no bordes de tarjeta.
- Secciones separadas por `--space-6`. El aire es obligatorio.

### 2.4 Imagen y medios

- Fotos con tratamiento uniforme: ligeramente desaturadas o duotono, alto contraste, recorte agresivo.
- Video en loop silencioso con botón `Unmute` en mono; formatos webp animado / mp4 h264.
- **Grain global** siempre (ver §6.8). Opcional: glitch/RGB-shift en hover sobre medios.
- Mockups de producto sobre fondo oscuro sin sombras exageradas; si hay "objeto" (monitor retro, disco, póster), que tenga presencia física.
- Leyendas tipo catálogo: `fig. 02 — Descripción` en mono debajo de cada imagen.

---

## 3. Sistema de movimiento

### 3.1 Easings (usar solo estos)

```js
// GSAP
const EASE = {
  out:    "expo.out",        // entradas de texto e imágenes (default)
  inOut:  "expo.inOut",      // transiciones de página, wipes
  soft:   "power3.out",      // hovers, microinteracciones
  inQuick:"power2.in",       // salidas
};
```
```css
:root {
  --e-out:   cubic-bezier(.16, 1, .3, 1);   /* expo.out */
  --e-inout: cubic-bezier(.87, 0, .13, 1);  /* expo.inOut */
  --e-soft:  cubic-bezier(.33, 1, .68, 1);  /* power3.out */
}
```

### 3.2 Duraciones

| Tipo | Duración | Stagger |
|---|---|---|
| Hover / micro | 0.3–0.45s | — |
| Reveal de línea de texto | 1.0–1.2s | 0.06–0.08s por línea |
| Reveal de caracteres (titular hero) | 1.2–1.4s | 0.02–0.035s por letra |
| Reveal de imagen (máscara) | 1.2–1.6s | — |
| Transición de página (wipe) | 0.9–1.1s total | — |
| Preloader completo | 1.8–3.0s (nunca más) | — |
| Salidas | 40–50% de la entrada | — |

### 3.3 Coreografía

- Orden de entrada en cada sección: **label mono → titular → párrafo → media → CTA**. Cada capa 0.1–0.15s después de la anterior.
- Texto: entra desde `yPercent: 110` dentro de una máscara `overflow: hidden` (líneas que "suben" desde su propia línea base). Nunca fade-in plano para titulares.
- Imágenes: `clip-path: inset(100% 0 0 0)` → `inset(0)` + `scale: 1.25 → 1` simultáneo.
- Parallax sutil: medios a `yPercent: -8 a -15` con `scrub: true`. Nunca más del 20%.
- Una sola animación "protagonista" por pantalla; lo demás acompaña.

### 3.4 Stack técnico

- **GSAP + ScrollTrigger** (animaciones y scroll), **SplitText** o `SplitType` (división de texto), **Lenis** (scroll suave).
- **Three.js** solo si hay una escena 3D con propósito (objeto de producto, esfera navegable, shader de fondo).
- Transiciones de página: **Barba.js** (multi-página estática), o en Next/Astro con View Transitions API / `AnimatePresence`.
- La herramienta exacta por stack está en §0.2. Los CDN de abajo son solo para HTML/CSS/JS; en frameworks instala por npm (`gsap`, `@gsap/react`, `lenis`).
- CDN (cdnjs / jsdelivr):
```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/lenis@1.1.13/dist/lenis.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/split-type@0.3.4/umd/index.min.js"></script>
```

---

## 4. Estructura de página tipo

1. **Preloader** — contador `00 → 100` en display gigante + línea de estado mono ("Preparing your visit", o log `[ OK ]`). Termina con un wipe vertical que revela el hero.
2. **Nav** — fija, mínima, en mono: logo-texto a la izquierda (`NOMBRE.`), 3–4 links en mayúsculas, a la derecha un CTA (`LET'S TALK`) y/o estado (`● disponible`, hora local, toggle de sonido, idioma).
3. **Hero** — wordmark/titular `--t-mega` a ancho completo, anclado abajo. Arriba o al lado: una frase corta en `--t-body` y 2–3 metadatos mono (`15+ YEARS`, `BASED IN …`, fecha de lanzamiento). Indicador `Scroll` con línea animada.
4. **Statement** — una frase grande (`--t-l`) que se revela palabra por palabra con scrub (opacidad 0.15 → 1).
5. **Índice / lista** — proyectos, tracks o servicios como filas con hairline: `01 · Nombre ········ Categoría · Año ↗`. Hover revela imagen flotante que sigue al cursor.
6. **Showcase** — galería con scroll horizontal pinneado o grid asimétrico con leyendas `fig.`.
7. **Bloque narrativo** — texto editorial con footnotes¹ y notas laterales en mono.
8. **Testimonios / prueba social** — titular apilado de tres palabras cortas, una por línea, + citas numeradas grandes.
9. **CTA final** — palabra gigante, email clicable con copiar-al-portapapeles, botón magnético.
10. **Footer** — columnas mono (SITE / FOLLOW), créditos, `© año`, `Back to top ↑`, y una línea de cierre con personalidad.

---

## 5. Componentes

**Botón primario** — rectangular o pastilla, mono mayúsculas, borde 1px `--fg`. Hover: fondo se llena desde abajo (`::before` con `scaleY 0→1`, `transform-origin: bottom`) y el texto hace *roll* (dos copias del label apiladas, se desplazan `yPercent -100`). Magnético (§6.5).

**Link** — subrayado 1px que entra de izquierda a derecha (`scaleX 0→1`, origin left) y sale hacia la derecha (origin right). Externos con `↗` que se desplaza 2px en diagonal en hover.

**Fila de lista** — `display:grid` con índice / título / meta / flecha; `border-top: 1px solid var(--line)`. Hover: título se desplaza `x: 12px`, resto baja a `--fg-faint`, aparece imagen flotante.

**Label de sección** — `[ NOMBRE ]` o `● NOMBRE` + índice `01/` alineado a la derecha.

**Estado del sistema** — punto `●` parpadeante (opacity 1↔.3, 1.2s) + texto mono: `disponible`, `on air`, `cargando…`.

**Copiar al portapapeles** — al click el texto rueda a `Copied!` 1.4s y vuelve.

**Toggle de sonido** — `[S] SOUND: ON/OFF` o barras de ecualizador animadas en CSS. Sonidos UI cortos (<80ms) en hover/click, desactivados por defecto.

**Menú móvil** — overlay a pantalla completa `--bg`, links en display gigante con stagger, cierre con `Esc`.

---

## 6. Recetas de animación (código de referencia)

### 6.1 Arranque común

```js
gsap.registerPlugin(ScrollTrigger);
const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

const lenis = new Lenis({ duration: 1.15, easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
lenis.on("scroll", ScrollTrigger.update);
gsap.ticker.add(t => lenis.raf(t * 1000));
gsap.ticker.lagSmoothing(0);
```

### 6.2 Preloader contador + wipe

```html
<div class="loader"><span class="loader__num display">00</span>
  <p class="label">Preparing your visit</p></div>
```
```js
function preloader() {
  const num = document.querySelector(".loader__num"), o = { v: 0 };
  return gsap.timeline()
    .to(o, { v: 100, duration: reduce ? 0.3 : 2, ease: "power2.inOut",
             onUpdate: () => num.textContent = String(Math.round(o.v)).padStart(2, "0") })
    .to(".loader", { clipPath: "inset(0 0 100% 0)", duration: 1, ease: "expo.inOut" })
    .add(heroIn(), "-=0.5");
}
```
```css
.loader { position: fixed; inset: 0; z-index: 100; background: var(--bg);
          display: grid; place-content: end start; padding: var(--gutter);
          clip-path: inset(0 0 0 0); }
.loader__num { font-size: var(--t-mega); }
```

### 6.3 Reveal de texto por líneas / caracteres

```css
.line-mask { overflow: hidden; display: block; }
```
```js
function splitReveal(el, { type = "lines", stagger = 0.07, delay = 0 } = {}) {
  const s = new SplitType(el, { types: type === "chars" ? "lines,chars" : "lines" });
  s.lines.forEach(l => { const w = document.createElement("span");
    w.className = "line-mask"; l.parentNode.insertBefore(w, l); w.appendChild(l); });
  return gsap.from(type === "chars" ? s.chars : s.lines, {
    yPercent: 110, rotate: type === "chars" ? 4 : 0, duration: 1.2,
    ease: "expo.out", stagger, delay });
}
function heroIn() {
  return gsap.timeline()
    .add(splitReveal(".hero__title", { type: "chars", stagger: 0.03 }))
    .from(".hero .label", { opacity: 0, y: 10, stagger: 0.08, duration: .8, ease: "power3.out" }, "-=0.9");
}
document.querySelectorAll("[data-reveal]").forEach(el =>
  ScrollTrigger.create({ trigger: el, start: "top 85%", once: true,
    onEnter: () => splitReveal(el) }));
```

### 6.4 Statement con scrub palabra por palabra

```js
const words = new SplitType(".statement", { types: "words" }).words;
gsap.fromTo(words, { opacity: .15 }, { opacity: 1, stagger: .1, ease: "none",
  scrollTrigger: { trigger: ".statement", start: "top 75%", end: "bottom 45%", scrub: true } });
```

### 6.5 Botón magnético

```js
document.querySelectorAll("[data-magnetic]").forEach(b => {
  const xTo = gsap.quickTo(b, "x", { duration: .6, ease: "power3.out" }),
        yTo = gsap.quickTo(b, "y", { duration: .6, ease: "power3.out" });
  b.addEventListener("pointermove", e => { const r = b.getBoundingClientRect();
    xTo((e.clientX - r.left - r.width / 2) * .35); yTo((e.clientY - r.top - r.height / 2) * .35); });
  b.addEventListener("pointerleave", () => { xTo(0); yTo(0); });
});
```

### 6.6 Cursor propio + rastro de "tinta"

- Cursor: círculo de 10px `mix-blend-mode: difference`, sigue con `quickTo` (0.35s). Sobre links crece a 56px y muestra texto mono (`VIEW`, `PLAY`, `DRAG`).
- Rastro: canvas a pantalla completa (`pointer-events:none`) que dibuja trazos suaves que se desvanecen — invita a interactuar.

```js
const c = document.querySelector("#ink"), ctx = c.getContext("2d"); let pts = [];
const fit = () => { c.width = innerWidth * devicePixelRatio; c.height = innerHeight * devicePixelRatio;
                    ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0); };
fit(); addEventListener("resize", fit);
addEventListener("pointermove", e => pts.push({ x: e.clientX, y: e.clientY, life: 1 }));
(function loop() {
  ctx.clearRect(0, 0, innerWidth, innerHeight);
  pts = pts.filter(p => (p.life -= 0.018) > 0);
  ctx.lineCap = "round";
  for (let i = 1; i < pts.length; i++) {
    ctx.strokeStyle = `rgba(236,235,231,${pts[i].life * .6})`;
    ctx.lineWidth = pts[i].life * 14;
    ctx.beginPath(); ctx.moveTo(pts[i-1].x, pts[i-1].y); ctx.lineTo(pts[i].x, pts[i].y); ctx.stroke();
  }
  requestAnimationFrame(loop);
})();
```
Desactivar cursor y rastro en `(pointer: coarse)` y con reduced-motion.

### 6.7 Reveal de imagen con máscara + parallax

```js
gsap.utils.toArray("[data-img]").forEach(w => {
  const img = w.querySelector("img");
  gsap.timeline({ scrollTrigger: { trigger: w, start: "top 80%", once: true } })
    .fromTo(w, { clipPath: "inset(100% 0 0 0)" }, { clipPath: "inset(0% 0 0 0)", duration: 1.4, ease: "expo.out" })
    .from(img, { scale: 1.25, duration: 1.6, ease: "expo.out" }, 0);
  gsap.to(img, { yPercent: -10, ease: "none",
    scrollTrigger: { trigger: w, start: "top bottom", end: "bottom top", scrub: true } });
});
```

### 6.8 Grain global

```css
body::after { content: ""; position: fixed; inset: -50%; z-index: 90; pointer-events: none;
  opacity: .07; background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
  animation: grain 1s steps(6) infinite; }
@keyframes grain { 0%{transform:translate(0,0)} 33%{transform:translate(-3%,2%)}
  66%{transform:translate(2%,-3%)} 100%{transform:translate(0,0)} }
```

### 6.9 Overlay CRT (variante "sistema")

```css
.crt::before { content:""; position:fixed; inset:0; pointer-events:none; z-index:95;
  background: repeating-linear-gradient(to bottom, rgba(0,0,0,.25) 0 1px, transparent 1px 3px);
  mix-blend-mode: multiply; }
.crt { text-shadow: 0 0 6px color-mix(in srgb, var(--fg) 50%, transparent); }
```
Con interruptor "Apagar el tubo" que anima `scaleY 1 → .005 → 0` (efecto TV apagándose, 0.5s).

### 6.10 Glitch / RGB-shift en hover

```css
.glitch { position: relative; }
.glitch:hover img { animation: rgb .35s steps(2) 2; }
@keyframes rgb { 0%{filter:drop-shadow(3px 0 #f0f) drop-shadow(-3px 0 #0ff); transform:translateX(-2px)}
  50%{filter:drop-shadow(-3px 0 #f0f) drop-shadow(3px 0 #0ff); transform:translateX(2px)}
  100%{filter:none; transform:none} }
```

### 6.11 Marquee infinito

```js
gsap.utils.toArray(".marquee__track").forEach(t => {
  t.innerHTML += t.innerHTML;
  const tl = gsap.to(t, { xPercent: -50, duration: 22, ease: "none", repeat: -1 });
  lenis.on("scroll", ({ velocity }) =>
    gsap.to(tl, { timeScale: 1 + Math.min(Math.abs(velocity) / 8, 4) * Math.sign(velocity || 1), duration: .4 }));
});
```

### 6.12 Scroll horizontal pinneado

```js
const track = document.querySelector(".h-track");
gsap.to(track, { x: () => -(track.scrollWidth - innerWidth), ease: "none",
  scrollTrigger: { trigger: ".h-section", pin: true, scrub: 1, end: () => "+=" + track.scrollWidth,
                   invalidateOnRefresh: true } });
```

### 6.13 Imagen flotante en lista (hover)

Al entrar en una fila, una imagen de 320×400 aparece con `scale .8→1, opacity 0→1` y sigue al cursor con `quickTo` (0.5s); entre filas cambia el `src` con un crossfade de 0.25s; al salir de la lista desaparece.

### 6.14 Transición de página

Panel `--bg` a pantalla completa:
1. Salida: panel entra `clipPath inset(100% 0 0 0) → inset(0)` (0.6s, `expo.inOut`), en el centro aparece el título del destino en display o el índice `02/`.
2. Cambio de contenido; `lenis.scrollTo(0, { immediate: true })`.
3. Entrada: panel sale `inset(0) → inset(0 0 100% 0)` (0.7s) + `heroIn()` de la nueva página solapado −0.4s.
Con View Transitions API: `::view-transition-old(root)` y `new(root)` con las mismas máscaras y `--e-inout`.

### 6.15 Hora local / contador vivo

Reloj mono en la nav (`BOG 17:47`) actualizado cada minuto; indicador de progreso de scroll `00–100` en una esquina.

---

## 7. Accesibilidad y rendimiento (no negociable)

- `prefers-reduced-motion: reduce` → sin Lenis, sin parallax ni scrub, sin cursor/rastro; reveals reducidos a fade de 0.3s; preloader ≤0.4s.
- Contraste: `--fg` sobre `--bg` ≥ 12:1; `--fg-muted` solo en texto ≥ 12px mono, nunca en párrafos largos.
- Mantener `:focus-visible` visible (outline 1px `--accent`, offset 3px). El cursor custom nunca oculta el foco.
- Link "Saltar al contenido" al inicio. Menú cerrable con `Esc`. Sonido siempre opt-in.
- Titulares divididos con SplitType conservan `aria-label` con el texto completo.
- Animar solo `transform`, `opacity`, `clip-path`. `will-change` solo durante la animación.
- Fuentes con `font-display: swap` + `preload` de la display. Imágenes `webp/avif`, `loading="lazy"` excepto hero.
- `ScrollTrigger.refresh()` tras cargar fuentes e imágenes; `gsap.matchMedia()` para desactivar pins en móvil si estorban.
- Objetivo: LCP < 2.5s aun con preloader (el preloader no debe bloquear el render del hero detrás).

---

## 8. Móvil

- Wordmark hero sigue a ancho completo (vw), pero el texto secundario pasa a 4 columnas.
- Scroll horizontal pinneado → carrusel con scroll-snap nativo.
- Hover → estados en `:active` y reveals al entrar en viewport. Sin cursor ni imagen flotante.
- Lenis con `syncTouch: false` (scroll nativo en táctil).

---

## 9. Checklist antes de entregar

- [ ] ¿Se definió el stack y se entregó el resumen Usar / Omitir / Quitar (§0)?
- [ ] ¿El código sigue las convenciones del stack (limpieza, SSR, sin dependencias redundantes)?
- [ ] ¿El hero es tipográfico y ocupa el ancho?
- [ ] ¿Hay como máximo 3 familias (display / texto / mono) y un solo acento?
- [ ] ¿Cada sección tiene label mono + índice?
- [ ] ¿Todos los titulares entran con máscara (no fade plano)?
- [ ] ¿Easings solo de la tabla §3.1 y duraciones de §3.2?
- [ ] ¿Preloader ≤ 3s y omitible en visitas repetidas (sessionStorage con try/catch)?
- [ ] ¿Grain activo, hairlines en listas, esquinas rectas?
- [ ] ¿Al menos 3 microinteracciones de autor (magnético, copiar, cursor, sonido, reloj, easter egg)?
- [ ] ¿Funciona con reduced-motion, teclado y en 375px sin scroll horizontal?
- [ ] ¿El footer cierra con una frase con personalidad?

## 10. Lo que NUNCA hacer

- Gradientes morados genéricos, glassmorphism, sombras suaves de tarjeta, esquinas muy redondeadas, iconos de librería en todos lados.
- Fade-up de 20px idéntico para todo. Bounce/elastic. Animaciones de más de 1.6s en elementos individuales.
- Más de una animación protagonista a la vez. Texto de párrafo centrado en bloques largos.
- Copiar la marca, wordmark o contenido de cualquier sitio existente: este es un **lenguaje**, no una plantilla de alguien.
