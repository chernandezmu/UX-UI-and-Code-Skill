# Matriz de stacks (E2)

El estilo es el mismo en todos los stacks; cambia **con qué** se implementa y **qué sobra**. Detecta el stack del repo (E0) antes de preguntar. Para guías finas de un stack: `node <SKILL_DIR>/tools/design-intel/run.mjs "<tema>" --stack <stack>`.

## 1. Elegir stack (si no hay proyecto)

| Proyecto | Recomendado | Alternativa |
|---|---|---|
| SaaS / app con auth y dashboard | **Next.js (App Router) + shadcn/ui + Tailwind v4** | React (Vite) + TanStack Router, SvelteKit + shadcn-svelte |
| Landing o sitio de contenido / blog / docs | **Astro** (+ islas React solo si hay estado) | Next.js estático, HTML/CSS/JS |
| Portfolio noir / lanzamiento | **Astro** o **HTML/CSS/JS** | SvelteKit, Next.js |
| API / backend separado | **NestJS** o rutas del framework | Hono (Cloudflare Workers), Laravel |
| App móvil | React Native (Expo) · Flutter · SwiftUI · Jetpack Compose | PWA |
| App de escritorio | **Tauri** + React/shadcn (ligera, nativa) | Electron + React/shadcn; Flutter desktop |
| Web de estudio / datos | **Astro** o **Next.js** + librería de gráficos (Recharts vía shadcn `Chart`, Observable Plot, ECharts) | HTML/CSS/JS + D3 |
| Gestión de negocio (CRM, inventario, reservas) | **Next.js + shadcn/ui** + Supabase/Postgres | Laravel + Inertia + shadcn |
| Equipo Vue / PHP | Nuxt + shadcn-vue / Nuxt UI · Laravel + Inertia + shadcn | — |

Si no hay respuesta ni proyecto: **HTML/CSS/JS** para piezas sueltas, **Next.js** para apps. Dilo en una línea.

**NestJS es backend:** no pinta UI. Detecta qué la pinta: `ServeStaticModule` → columna HTML/CSS/JS · plantillas (Handlebars/Pug/EJS) → HTML/CSS/JS en vistas y scripts en `public/` · API + front separado → columna del front.

## 2. Herramientas de UI por stack

| Pieza | HTML/CSS/JS | React (Vite) | Next.js | Svelte / SvelteKit | Astro | Vue / Nuxt |
|---|---|---|---|---|---|---|
| **Componentes** | HTML semántico + tokens | shadcn/ui | shadcn/ui | shadcn-svelte | shadcn (islas React) o `.astro` propios | shadcn-vue o Nuxt UI |
| **Estilos** | CSS con variables | Tailwind v4 | Tailwind v4 | Tailwind v4 | Tailwind v4 o CSS scoped | Tailwind v4 |
| **Scroll suave** | `lenis` CDN | `lenis/react` (`<ReactLenis root>`) | `lenis/react` en componente `'use client'` del layout | `lenis` en `onMount` de `+layout.svelte` | `lenis` en `<script>` del layout | `lenis` en plugin cliente |
| **Animación** | GSAP + ScrollTrigger CDN | `gsap` + `@gsap/react` (`useGSAP` con `scope`) | Igual, solo en cliente | GSAP para scroll; `svelte/transition`, `svelte/motion` para micro | GSAP en `<script>` | GSAP en `onMounted` + `<Transition>` |
| **Texto dividido** | GSAP SplitText | SplitText en `useGSAP` | Igual | action `use:reveal` | `<script>` sobre `data-reveal` | directiva `v-reveal` |
| **Transición de página** | View Transitions (`@view-transition { navigation: auto; }`) | `AnimatePresence` o View Transitions | `template.tsx` o View Transitions | `onNavigate` + `document.startViewTransition` | `<ClientRouter />` + `transition:name` | `pageTransition` de Nuxt |
| **Fuentes** | `<link>` Google Fonts | `@fontsource/*` | `next/font/google` | `@fontsource/*` | `@fontsource/*` o Fonts API | `@nuxt/fonts` |
| **Iconos** | SVG en línea | `iconLibrary` del proyecto | ídem | `@lucide/svelte` | `astro-icon` o SVG | `@nuxt/icon` |
| **Formularios** | `<form>` nativo + validación servidor | shadcn `Field` + react-hook-form/TanStack Form + zod | + server actions con zod | superforms + zod/valibot | Actions de Astro con zod | VeeValidate + zod |
| **Sobra** | Bundler, framework, Framer Motion | Barba, jQuery, `querySelectorAll` global, `useEffect` sin limpieza | Barba, `react-router`, `<link>` de fuentes | Barba, Framer Motion, librerías de React | Barba, isla React solo para animar, `client:load` innecesario | Barba, jQuery |

Reglas al traducir recetas en JS plano:
- **React / Next:** refs y `useGSAP({ scope })`, nunca selectores globales. Todo lo que toque `window` va en cliente.
- **Svelte:** cada receta es una *action* (`use:magnetic`) que devuelve `destroy()`.
- **Astro:** re-inicializa en `astro:page-load` si usas `<ClientRouter />`; mata ScrollTriggers en `astro:before-swap`.
- **Vue:** composables (`useReveal`) con limpieza en `onBeforeUnmount`.
- **Todos:** nada de `window`/`document` al nivel superior del módulo (rompe SSR); limpia listeners y ScrollTriggers al desmontar.
- **Otro framework:** primero lo nativo del framework; GSAP + Lenis solo para lo que no cubra.

## 3. Seguridad por stack (librerías de referencia)

| Necesidad | Next.js | SvelteKit | Astro | Nuxt | NestJS | Laravel |
|---|---|---|---|---|---|---|
| Validación | zod / valibot en server actions y route handlers | zod/valibot en `+page.server` actions | zod en Actions | zod en `server/api` | `ValidationPipe({ whitelist: true, forbidNonWhitelisted: true })` + class-validator | Form Requests |
| Auth | Auth.js, Better Auth, Clerk, Supabase Auth | Better Auth, Lucia-style (Oslo), Supabase | Better Auth, Clerk | nuxt-auth-utils, Better Auth | Passport + guards | Breeze / Fortify / Sanctum |
| CSP / cabeceras | `middleware.ts` con nonce + `headers()` en `next.config` | `kit.csp` en `svelte.config.js` + `handle` hook | `security.csp` (si tu versión lo trae) o cabeceras del hosting | `nuxt-security` | `helmet()` | middleware de cabeceras |
| Rate limit | Upstash Ratelimit, Arcjet | ídem | ídem | `nuxt-security` | `@nestjs/throttler` | `RateLimiter` |
| CSRF | Server actions comprueban Origin; route handlers con cookies → token o `SameSite` + verificación de Origin | integrado (`checkOrigin`) | `security.checkOrigin` | `nuxt-security` | `csrf-csrf` si usa cookies | integrado |
| Sanitizar HTML | `isomorphic-dompurify` | ídem | ídem | ídem | `sanitize-html` | `HTMLPurifier` |

Detalle y código: [security/secure-by-default.md](security/secure-by-default.md).

## 4. Dependencias redundantes (quítalas si aparecen)

- Dos motores de animación para lo mismo (GSAP + Framer Motion, GSAP + anime.js).
- Dos scrolls suaves (Lenis + Locomotive, o Lenis + `scroll-behavior: smooth`).
- Barba.js en un framework con transiciones de router.
- AOS, ScrollReveal, WOW.js, animate.css (ScrollTrigger o CSS lo cubren).
- jQuery solo para selectores/eventos. Moment.js (usa `Intl` o date-fns).
- SplitType junto a GSAP SplitText.
- Librerías de iconos completas para 3–4 iconos; dos librerías de iconos a la vez.
- Más de 3 familias tipográficas o fuentes cargadas sin uso.
- Dos librerías de componentes (shadcn + MUI/Chakra/Bootstrap) en la misma app.
- Paquetes abandonados (> 2 años sin release) o con avisos de seguridad sin parche.

## 5. Proyecto existente

1. Lee `package.json`, imports, CSS global y config del framework.
2. Lista: dependencias redundantes, código muerto, piezas que contradicen la identidad, riesgos de seguridad visibles (barrido rápido de [security/review.md](security/review.md#barrido-rápido-pre-lanzamiento)).
3. Propón qué quitar y qué añadir **antes** de editar. Borra solo con visto bueno.
4. Entrega el resumen `Stack / Identidad / Usar / Omitir / Quitar / Seguridad` (formato en stages/2-code.md).
