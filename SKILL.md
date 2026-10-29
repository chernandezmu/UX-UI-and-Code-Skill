---
name: ux-ui-and-code-skill
description: Sistema completo para crear startups, MVPs, SaaS, landings, apps y webs de nivel profesional, organizado por etapas (planificación, diseño, código, automatizaciones, seguridad, optimización). Primero pregunta qué se necesita y qué priorizar y escribe el ROADMAP; luego genera el sistema de diseño (noir editorial, producto shadcn/ui o 79 estilos con motor local), diseña en código, Claude Design, Google Stitch o Figma, implementa por stack, automatiza CI/CD y flujos de negocio, endurece la seguridad con revisión y auditoría, y pule rendimiento, SEO y accesibilidad. Úsala al crear o rediseñar una web, landing, app, dashboard o startup; al elegir colores, tipografía, componentes o animaciones; al trabajar con shadcn/ui, Tailwind, React, Next.js, Svelte, Astro, Vue o NestJS; al usar Claude Design o Stitch; o al revisar UI, accesibilidad, rendimiento o seguridad.
---

# UX-UI and Code Skill · v2

Convierte una idea (o un proyecto existente) en un producto que se ve, se mueve y se defiende como uno hecho por un equipo senior, **por etapas y preguntando antes de construir**.

| Capa | Qué aporta | Dónde vive |
|---|---|---|
| **Proceso por etapas** | Preguntas, prioridades y `ROADMAP.md`; puertas de aprobación | [references/stages/](references/stages/) |
| **Descubrimiento** | Preguntas de producto, marca, UI, stack y seguridad → `PROJECT-BRIEF.md` | [references/discovery.md](references/discovery.md) |
| **Inteligencia de diseño** (UI/UX Pro Max) | 79 estilos, 192 tipos de producto con paletas, 74 pares tipográficos, 119 reglas UX, 22 stacks | [tools/design-intel/](tools/design-intel/), [references/ux/](references/ux/) |
| **Identidades** | Noir editorial · Producto shadcn/ui · Catálogo · Híbrida | [references/identities/](references/identities/) |
| **Lienzos de diseño** | Claude Design · Google Stitch · Figma · directo en código | [references/design-tools/](references/design-tools/) |
| **Componentes** (shadcn/ui) | Tokens semánticos, composición, CLI, DESIGN.md → tema | [references/shadcn/](references/shadcn/) |
| **Seguridad** (Cloudflare) | Seguro por defecto, revisión guiada y auditoría completa | [references/security/](references/security/) |

Funciona en más de 30 agentes de código (Claude Code, Codex, Cursor, Copilot, Gemini CLI, Antigravity, Cline, Amp, Goose, OpenCode, Qwen Code, Junie, Zed, Aider…), en constructores web y chats (Lovable, Bolt, v0, ChatGPT) y con Claude Design y Google Stitch, compartiendo el mismo estado entre todos (§9).

---

## 1. Elige el modo

| El usuario pide… | Modo | Qué haces |
|---|---|---|
| "Quiero crear mi startup / app / web / landing / MVP", **o el prompt no dice qué quiere hacer** | **Proyecto** | Arranque guiado (§2, paso 1: "¿Qué tipo de proyecto quieres hacer?") y luego E0→E5 |
| "Sigamos con el proyecto" / hay `ROADMAP.md` | **Retomar** | Lee `ROADMAP.md` (incluido `## Relevo`, aunque lo haya escrito otro agente), verifica el estado y continúa en la etapa actual |
| "Hazme este componente / animación / sección / página" | **Pieza** | Lee `DESIGN.md` si existe → construye con sus tokens (E2) → verificación de E5 de esa pieza |
| "Diséñalo en Claude Design / Stitch / Figma" | **Diseño en herramienta** | E1 con [references/design-tools/](references/design-tools/) |
| "Revisa mi UI / UX / accesibilidad" | **Revisión UX** | [references/ux/ux-rules.md](references/ux/ux-rules.md) por prioridad → informe |
| "¿Es seguro? / revisa la seguridad antes de lanzar" | **Revisión de seguridad** | [references/security/review.md](references/security/review.md) |
| "Audita todo el código / pentest / informe formal" | **Auditoría completa** | [references/security/full-audit/AUDIT.md](references/security/full-audit/AUDIT.md) |
| "Aplica este DESIGN.md / mi marca a shadcn" | **Design system** | [references/shadcn/design-system.md](references/shadcn/design-system.md) |

Si dudas entre dos modos, haz **una** pregunta corta. Nunca arranques la auditoría completa sin que la pidan: crea archivos y lanza muchos agentes.

---

## 2. Proceso por etapas (modo Proyecto)

```
E0 Planificación → E1 Diseño → E2 Código → E3 Automatizaciones → E4 Seguridad → E5 Optimización y pulido
```

### Arranque guiado (siempre lo primero en un proyecto)

Antes de diseñar o programar, haz estos 10 pasos **en orden**, un tema por turno, diciendo en qué paso vas (`Paso 4 de 10 · Colores`), **en el idioma del usuario**. Salta los que el prompt o el repo ya respondan y confírmalos en una línea. Tras el paso 1, ofrece una vez el atajo "decido el resto y te muestro el resumen". Detalle, opciones y tablas por tipo: [references/discovery.md](references/discovery.md).

| Paso | Pregunta | Clave |
|---|---|---|
| 1 | **¿Qué tipo de proyecto quieres hacer?** Sitio web (landing para tu empresa, portafolio, contenido, estudio con datos) · App o plataforma web (gestión de negocio, SaaS) · App móvil o de escritorio · Tienda — para qué mercado y con qué elementos | Decide las opciones de los pasos siguientes |
| 2 | **Tecnología:** ¿qué framework? (recomendado según el tipo: Astro, Next.js, Expo, Tauri…) · ¿base de datos? (ninguna, Supabase/Postgres, MySQL, SQLite/Turso, MongoDB, Firebase, CMS) · ¿dónde se publica? | Define componentes y reglas de seguridad de datos |
| 3 | **¿Qué tipo de diseño quieres?** ¿Ya tienes diseño? → **pausa** y pide que suba todo (capturas, Figma, manual, logo, colores, fuentes). Si no → estilos prediseñados por familia (limpio y profesional · editorial y de autor · audaz y expresivo · suave y cercano: minimalista, noir, barroco, brutalista, orgánico…). Modo claro/oscuro y nivel de movimiento (mínimo · estándar · cinemático) | Diseño subido → salta 4–6 si ya quedan resueltos |
| 4 | **Colores:** que los escriba (hex o nombres), use los de su logo, o se los recomiendes | Contraste comprobado, un acento |
| 5 | **Tipografías:** recomendadas (3 pares), las suyas o de Google Fonts | Máx. 3 familias |
| 6 | **Logo y recursos:** subirlos ahora o dejarlos para el final (wordmark temporal) | Pendiente queda en `ROADMAP.md` |
| 7 | **Apartados y secciones** sugeridos según el tipo; una página o varias | Base del alcance |
| 8 | **¿De qué trata el proyecto?** (si no lo dijo) | Fija formato y copy |
| 9 | **Público y enfoque:** para quién, qué quiere lograr o mostrar, si es un estudio con datos, dispositivo, idiomas, país | Visualización de datos y ley de datos aplicable |
| 10 | **Seguridad y extras:** cómo entran los usuarios, qué hay que proteger (cuentas, roles, pagos, datos sensibles, varias empresas, IA, archivos), profundidad de seguridad, y "¿algo más que quieras destacar?" | Crea `SECURITY.md` |

Cierra con un resumen de 5–8 líneas y "¿está correcto?"; con la confirmación escribe `PROJECT-BRIEF.md` y `SECURITY.md` y sigue con prioridades y forma de trabajo ([0-planning.md](references/stages/0-planning.md)).

### Etapas

Reglas: [references/stages/README.md](references/stages/README.md). En resumen:
- **Preguntar antes de construir.** El arranque guiado define el proyecto; E0 añade prioridades y forma de trabajo y lo deja en `ROADMAP.md`.
- **Una puerta por etapa:** resumen corto + "¿seguimos con la siguiente?". Si el usuario pide todo seguido, no pares, pero registra cada etapa en `ROADMAP.md`.
- **Profundidad por etapa** (Básico · Estándar · Completo · Omitir), acordada en E0.
- **El orden es de foco, no de permiso:** la seguridad base y la accesibilidad se aplican desde E2; E4 y E5 las endurecen y verifican. Cada etapa tiene su puerta de seguridad ([stages/README.md](references/stages/README.md#seguridad-en-cada-etapa)) y `SECURITY.md` acompaña todo el proyecto.

| Etapa | Qué pasa | Entregable | Guía |
|---|---|---|---|
| **E0 · Planificación** | Detectar contexto → arranque guiado (10 pasos) → prioridades y forma de trabajo | `PROJECT-BRIEF.md`, `SECURITY.md`, `ROADMAP.md` | [0-planning.md](references/stages/0-planning.md) |
| **E1 · Diseño** | Identidad → sistema de diseño con el motor → pantallas clave en el lienzo elegido | `DESIGN.md` + pantallas | [1-design.md](references/stages/1-design.md) |
| **E2 · Código** | Stack y auditoría → vía de implementación (desde cero, Claude Design, Stitch, Figma, existente) → flujo P0 | App funcionando en local | [2-code.md](references/stages/2-code.md) |
| **E3 · Automatizaciones** | Lint, tests, CI, previews y deploy, emails, webhooks, cron, colas, observabilidad | Pipeline en verde | [3-automation.md](references/stages/3-automation.md) |
| **E4 · Seguridad** | Checklist de lanzamiento, barrido, CSP, revisión guiada o auditoría completa | Sin altos/críticos abiertos | [4-security.md](references/stages/4-security.md) |
| **E5 · Optimización y pulido** | Medir → rendimiento, SEO, accesibilidad final, pulido de UX, copy y motion → informe | Informe final, listo para lanzar | [5-optimization.md](references/stages/5-optimization.md) |

**Detección inicial (E0, sin preguntar):** `ROADMAP.md`, `PROJECT-BRIEF.md`, `DESIGN.md`, `.stitch/DESIGN.md` (si existen, mandan; no los regeneres sin permiso) · stack por `package.json` y configs · `components.json` (shadcn → `npx shadcn@latest info --json`) · gestor de paquetes por lockfile · CI y hosting · herramientas de la sesión (`/design`, `/design-sync`, MCP de Stitch o Figma).

**Cómo preguntar:** un tema por turno (arranque guiado: 1–3 preguntas; después, máximo 4), con opciones y la **recomendada** primero, y el número de paso visible. Usa la herramienta de preguntas de tu plataforma (p. ej. `AskUserQuestion` en Claude Code) o una lista numerada. Lo que el usuario delegue ("decide tú") se resuelve con defaults y se anota como **Supuesto**.

---

## 3. Reglas no negociables (todas las etapas e identidades)

**Prioridad UX** (de UI/UX Pro Max; en este orden):

| # | Categoría | Imprescindible | Evitar |
|---|---|---|---|
| 1 | Accesibilidad | Contraste 4.5:1 (3:1 texto grande/UI), foco visible, alt, teclado, labels, skip link | Quitar outline, botones de solo icono sin nombre |
| 2 | Interacción | Objetivos ≥24×24px web (44pt iOS / 48dp Android), feedback < 100ms, estado de carga | Depender del hover, cambios de 0ms |
| 3 | Rendimiento | WebP/AVIF, lazy, espacio reservado (CLS < 0.1), split por ruta | Layout thrashing, JS bloqueante |
| 4 | Estilo | Un estilo coherente con el producto, iconos SVG de una sola familia | Emojis como iconos, mezclar flat y skeuo |
| 5 | Layout | Mobile-first, `min-h-dvh`, sin scroll horizontal, max-width consistente | Desactivar zoom, anchos fijos en px |
| 6 | Tipo y color | Body ≥16px, line-height 1.5, tokens semánticos, cifras tabulares en datos | Gris sobre gris, hex sueltos en componentes |
| 7 | Animación | Solo `transform`/`opacity`/`clip-path`, salidas más cortas que entradas, interrumpible | Una duración para todo, animar width/height |
| 8 | Formularios | Label visible, error junto al campo con causa + solución, autocomplete, pegar contraseñas | Placeholder como label, errores solo arriba |
| 9 | Navegación | Atrás predecible, deep links, estado activo, foco al cambiar de ruta | Modales como navegación principal |
| 10 | Datos | Tipo de gráfico correcto, leyenda, tabla alternativa, no solo color | Pie con > 5 categorías |

**Tokens:** todo color, tipo, radio, sombra y duración sale de variables con nombres estilo shadcn (`--background`, `--foreground`, `--primary`, `--muted-foreground`, `--border`, `--ring`, `--destructive`…), uses o no shadcn. `DESIGN.md` es la fuente de verdad también para Claude Design, Stitch y Figma.

**Seguridad base desde la primera línea** ([secure-by-default.md](references/security/secure-by-default.md)):
- Nada de secretos en el cliente ni en el repo (`NEXT_PUBLIC_*`, `VITE_*`, `PUBLIC_*` son públicos).
- Validación con esquema y **autorización por recurso** en el servidor, en cada endpoint y server action.
- Nada de HTML crudo de usuario sin sanitizar; SQL siempre parametrizado.
- Cookies `HttpOnly; Secure; SameSite=Lax`; scripts de CDN con versión fija.
- Rate limit en auth, formularios públicos, subidas y endpoints de IA.

**Código exportado de herramientas de diseño** (Claude Design, Stitch, Figma) es referencia: se reescribe con los componentes, tokens y convenciones del proyecto.

**Movimiento:** `prefers-reduced-motion` siempre; una animación protagonista por pantalla; nunca bloquees la entrada del usuario.

---

## 4. Motor de diseño

```bash
node <SKILL_DIR>/tools/design-intel/run.mjs "<consulta>" [--design-system | --domain <d> | --stack <s>] [-n 3] [--json]
```

`<SKILL_DIR>` = carpeta de este `SKILL.md`. El lanzador busca Python 3 (`python3`, `python`, `py -3`). Sin Python: usa las tablas de este archivo, [catalog.md](references/identities/catalog.md#sin-python) y [ux-rules.md](references/ux/ux-rules.md), y **dilo**.

| Necesito | Uso |
|---|---|
| Dirección visual completa | `"saas b2b analytics minimal" --design-system -p "Nombre" [--variance 1-10 --motion 1-10 --density 1-10]` |
| Estilos · paletas · fuentes | `--domain style` · `--domain color` · `--domain typography` / `google-fonts` |
| Estructura de landing | `"hero social-proof pricing" --domain landing` |
| Regla UX concreta | `"error summary validation" --domain ux` (un resultado observable por consulta) |
| Gráficos · animación · React | `--domain chart` · `--domain gsap` · `--domain react` |
| Guías por stack | `--stack react|nextjs|vue|svelte|astro|nuxtjs|nuxt-ui|angular|laravel|shadcn|html-tailwind|threejs|react-native|flutter|swiftui|jetpack-compose|…` |

Una intención por consulta (2–5 términos), un reintento más estrecho si sale vacío, y **nunca presentes un resultado vacío como dato**. Los resultados son recomendaciones. Si chocan, manda: marca del usuario → identidad elegida → respuestas de E0 → motor ([1-design.md](references/stages/1-design.md#2-sistema-de-diseño)). No metas datos privados en las consultas.

---

## 5. Identidades y lienzos en una línea

- **Noir editorial** ([noir-editorial.md](references/identities/noir-editorial.md)): fondo casi negro, tipografía gigante, metadatos mono, movimiento lento con peso (GSAP + Lenis), 15 recetas.
- **Producto shadcn** ([product-shadcn.md](references/identities/product-shadcn.md)): tokens semánticos, componentes compuestos, estilos `vega · nova · maia · lyra · mira · luma · rhea · sera`, puente de tokens con noir.
- **Catálogo** ([catalog.md](references/identities/catalog.md)): 50 estilos activos × 192 tipos de producto; el motor decide y tú afinas.
- **Claude Design** ([claude-design.md](references/design-tools/claude-design.md)): `/design-sync` o pack de design system → prototipos y variantes → handoff a Claude Code.
- **Google Stitch** ([google-stitch.md](references/design-tools/google-stitch.md)): `.stitch/DESIGN.md` como design system del proyecto → pantallas por prompt o MCP → HTML como referencia.

---

## 6. Seguridad de la web que se construye

Prioridad del proyecto, no un anexo. `SECURITY.md` (activos, atacantes, límites de confianza, controles, hallazgos, plan de incidentes) se crea al final del arranque y cada etapa tiene su puerta de seguridad ([stages/README.md](references/stages/README.md#seguridad-en-cada-etapa)).

- **Siempre (E2):** [secure-by-default.md](references/security/secure-by-default.md) — 16 áreas con código por stack, incluidas reglas **por base de datos** (§15: Supabase RLS, Postgres/MySQL con rol mínimo, SQLite/Turso, MongoDB anti-inyección de operadores, reglas de Firebase, CMS) y **después del lanzamiento** (§16).
- **Básico (E4):** [checklist de lanzamiento](references/security/secure-by-default.md#checklist-de-lanzamiento) + [barrido rápido](references/security/review.md#barrido-rápido-pre-lanzamiento).
- **Estándar (E4):** revisión guiada ([review.md](references/security/review.md)): límite de confianza + resultado concreto, validar intentando refutar, severidad calibrada, arreglo mínimo.
- **Completo (E4):** auditoría de 6 fases ([full-audit/AUDIT.md](references/security/full-audit/AUDIT.md)) con `findings.json` validado. Requiere sub-agentes y sandbox; sin sub-agentes, fases en secuencia y dilo en el informe.

Reglas del propio agente: código ajeno en solo lectura; no sondees servicios desplegados ni de terceros; no ejecutes código del objetivo fuera de un sandbox sin red; datos y secretos de prueba siempre ficticios.

---

## 7. Anti-patrones

- Construir sin preguntar ni priorizar; saltarse la puerta de una etapa sin decirlo.
- Gradientes morado/rosa genéricos "de IA", glassmorphism sin motivo, sombras de tarjeta por todas partes, emojis como iconos.
- El mismo fade-up de 20px para todo; bounce/elastic sin intención; más de una animación protagonista.
- Colores crudos (`bg-blue-500`, `#3b82f6`) en componentes; `dark:` manual; pegar el HTML exportado de una herramienta de diseño sin reescribirlo.
- Markup a mano donde existe componente (`Alert`, `Empty`, `Skeleton`, `Badge`, `Separator`…).
- Formularios sin label, errores genéricos, sin estados de carga, vacío o error.
- Secretos en el front, autorización solo en el cliente, `cors('*')` con credenciales, precios que llegan del cliente.
- Optimizar sin medir; reportar "best practices" ausentes como vulnerabilidades; severidad sin impacto demostrado.
- Copiar marca, wordmark o contenido de un sitio existente: las identidades son **lenguajes**, no plantillas de alguien.

---

## 8. Mapa de archivos (carga solo lo que necesites)

```
SKILL.md                          ← router (estás aquí)
AGENTS.md · agents/openai.yml     ← entrada para Codex / agentes genéricos
install.mjs                       ← instalador multi-agente
references/
  stages/                         ← README + 0-planning · 1-design · 2-code · 3-automation · 4-security · 5-optimization
  agents.md                       ← agentes compatibles, capacidades y relevo entre agentes
  discovery.md                    ← cuestionario de producto/startup (E0)
  stack-matrix.md                 ← herramientas por stack, qué sobra (E2)
  identities/                     ← README · noir-editorial · product-shadcn · catalog
  design-tools/                   ← README · claude-design · google-stitch (+ Figma)
  ux/                             ← ux-rules (119 reglas) · native-app-rules
  shadcn/                         ← reglas, CLI, registry, DESIGN.md → tema, página de design system
  security/                       ← secure-by-default · review · full-audit/ (Cloudflare)
templates/
  PROJECT-BRIEF.md · SECURITY.md · ROADMAP.md · DESIGN.md · AGENTS-snippet.md
  portable-instructions.md        ← versión condensada para web y chat (Lovable, Bolt, v0, ChatGPT…)
  prompts/screen-prompt.md        ← prompt de pantalla (código, Claude Design, Stitch)
  design-exports/                 ← stitch-DESIGN.md · claude-design-pack.md
tools/design-intel/               ← motor de búsqueda (Python stdlib, sin red) + datos
```

---

## 9. Compatibilidad entre agentes

Detalle completo, capacidades por agente y relevo: [references/agents.md](references/agents.md). Instalación: `node install.mjs --list`.

| Grupo | Agentes | Instalación |
|---|---|---|
| Skills nativas | Claude Code · Codex · Cursor · Copilot · Gemini CLI · Antigravity · Cline · Amp · Goose · OpenCode · Crush · Qwen Code · Mistral Vibe · OpenHands · Kiro · Windsurf · Kilo · Continue · Augment · Droid · Trae · Warp · Qoder · CodeBuddy · Kimi · CodeWhale · ZCode · Roo (legado) | `node install.mjs --agent <nombre> --project <ruta>` o `--global` |
| Solo instrucciones | JetBrains Junie · Zed · Aider · Replit Agent · Amazon Q | `--agent <nombre> --project <ruta>` (copia + bloque en su archivo) |
| Cualquiera con `AGENTS.md` | Devin, Jules, Factory y otros | `--agents-md <ruta>` |
| Web y chat | Lovable · Bolt · v0 · Base44 · ChatGPT · Claude Projects · Gemini Gems | `--portable <ruta>` → pegar `PORTABLE-INSTRUCTIONS.md` |
| Lienzos de diseño | Claude Design (`/design-sync`, `/design`, pack) · Google Stitch (MCP + `stitch-skills`) · Figma (MCP) | [references/design-tools/](references/design-tools/) |

**Trabajo entre agentes:** el estado vive en `ROADMAP.md`, `PROJECT-BRIEF.md` y `DESIGN.md`, nunca solo en la memoria de un agente. Al cerrar cada sesión, actualiza `## Relevo` en `ROADMAP.md`; al empezar, léelo, verifica el estado y confirma el siguiente paso. En E4, la revisión la hace un agente distinto del que construyó.

Términos neutrales: *preguntar al usuario* = la herramienta de preguntas de tu plataforma o una lista numerada; *sub-agente* = el mecanismo de delegación de tu plataforma (si no existe, trabaja en secuencia); si falta una capacidad, usa la alternativa de [agents.md §2](references/agents.md#2-capacidades-y-equivalencias) y dilo. Las rutas son relativas a `<SKILL_DIR>`.

---

Créditos: material con licencia MIT de [shadcn/ui](https://github.com/shadcn-ui/ui), [cloudflare/security-audit-skill](https://github.com/cloudflare/security-audit-skill) y [nextlevelbuilder/ui-ux-pro-max-skill](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill); flujo de Stitch basado en [google-labs-code/stitch-skills](https://github.com/google-labs-code/stitch-skills) (Apache-2.0). Ver [NOTICE.md](NOTICE.md).
