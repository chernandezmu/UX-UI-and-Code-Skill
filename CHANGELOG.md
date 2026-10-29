# Changelog

## 2.4.1 · 2026-10-28 · Ajustes tras la simulación completa (10 pasos)

- Paso 4: con modo solo oscuro, derivar versiones oscuras de las paletas del motor (que suelen ser claras) y mostrar el contraste; incluir paleta de datos (≥ 3:1, apta para daltonismo) si hay gráficos.
- Paso 7: cada elemento del paso 1 (galería, contacto, blog…) debe tener su sección; si falta, preguntar.
- Paso 9: si el formato de los datos no encaja con la base de datos del paso 2, preguntar para qué se usará.

## 2.4.0 · 2026-10-28 · Revisión completa, tecnología y seguridad

- Arranque guiado de **10 pasos**: nuevo paso 2 **Tecnología** (framework según el tipo, base de datos y hosting) justo después del tipo de proyecto; paso 10 **Seguridad y extras** ampliado (forma de acceso, qué proteger, profundidad).
- Paso 1 en dos niveles (categoría → tipo) para no esconder opciones; atajo "decido el resto y te muestro el resumen"; recuperada la pregunta de **nivel de movimiento** (paso 3) y su traducción a los dials del motor; preguntas en el idioma del usuario; país de los usuarios para la ley de datos.
- **`SECURITY.md`** nuevo (modelo de amenazas: activos, atacantes, límites, controles, hallazgos, plan de incidentes), creado en E0 y cerrado en E4/E5.
- **Seguridad en cada etapa** con puerta propia (E0–E5).
- `secure-by-default.md` §15 **por base de datos** (Supabase, Postgres/MySQL + ORM, SQLite/Turso/D1, MongoDB, Firebase, CMS) y §16 **después del lanzamiento**; checklist ampliado.
- **Evals**: `evals/evals.json` con 10 casos y `evals/RESULTS.md`.
- Coherencia: brief, planificación, etapas 1/2/4, instrucciones portables y bloque de AGENTS.md alineados con los 10 pasos.

## 2.3.0 · 2026-10-28 · Arranque guiado

- Nuevo arranque de 9 pasos fijos, un tema por turno y con el número de paso visible: tipo de proyecto (landing, portafolio, app web / gestión de negocio, app móvil, app de escritorio, tienda, contenido, estudio con datos) → diseño (pausa para subir el diseño propio, o estilos prediseñados por familia: minimalista, noir, barroco, brutalista, orgánico…) → colores → tipografías → logo → apartados → de qué trata → público y enfoque → técnico, seguridad y extras.
- Si el prompt no dice qué quiere hacer el usuario, la skill empieza siempre por el paso 1.
- Tablas por tipo de proyecto: secciones sugeridas y defaults técnicos (incluye app de escritorio con Tauri/Electron y web de estudio con datos).
- `PROJECT-BRIEF.md` reordenado según los 9 pasos; la planificación ya no repite preguntas (solo prioridades, lienzo, automatizaciones y forma de avanzar).
- Seguridad de apps de escritorio (Electron/Tauri) y móviles en `secure-by-default.md`.

## 2.2.1 · 2026-10-28 · Ajustes tras la simulación de E0

- Orden de prioridad explícito cuando chocan las fuentes de diseño: marca del usuario → identidad → respuestas de E0 → motor (con noir, el motor solo aporta patrón, tipografías alternativas y anti-patrones).
- Descubrimiento: detectar contradicciones y aclararlas con una pregunta; opciones adaptadas al tipo de producto (portfolio → "ver trabajo y contactar"); CMS basados en git (Keystatic, Decap, TinaCMS).
- Planificación: qué hacer si el usuario elige más o menos profundidad que la recomendada.
- Automatizaciones: publicar contenido desde un panel (CMS → commit/deploy hook → CI).

## 2.2.0 · 2026-10-28

- **14 agentes nuevos** en el instalador: Google Antigravity, Cline, Amp, Goose, OpenCode (ruta global), Crush, Qwen Code, Mistral Vibe, OpenHands, CodeWhale, ZCode, JetBrains Junie, Zed, Aider y Replit Agent.
- Rutas actualizadas: Kiro → `.kiro/skills`; globales para Cursor (`~/.cursor/skills`), Copilot (`~/.copilot/skills`), Gemini CLI (`~/.gemini/skills`), Kiro y otros. Marca ✓/~ según si la ruta sale de la documentación oficial.
- Agentes que solo leen un archivo de instrucciones (Junie, Zed, Aider, Replit, Amazon Q): copia en `.agents/skills/` + bloque idempotente en su archivo (respeta el orden de lectura de Zed y la preferencia `.junie/AGENTS.md` de Junie).
- `--portable`: `PORTABLE-INSTRUCTIONS.md` (< 5 KB) para Lovable, Bolt, v0, Base44, ChatGPT, Claude Projects y Gemini Gems.
- `references/agents.md`: capacidades por agente con alternativas, estado compartido y **protocolo de relevo** entre agentes; sección `## Relevo` en `ROADMAP.md`.

## 2.1.0 · 2026-10-28

- **Proceso por etapas** (`references/stages/`): E0 Planificación → E1 Diseño → E2 Código → E3 Automatizaciones → E4 Seguridad → E5 Optimización y pulido, con puerta de aprobación por etapa y profundidad Básico/Estándar/Completo.
- **E0 Planificación:** entrevista de prioridades (P0/P1/P2), lienzo de diseño, vía de código y profundidad por etapa; nueva plantilla `ROADMAP.md` que guarda el estado para retomar sesiones.
- **E3 Automatizaciones** (nuevo): lint, Vitest, Playwright + axe, CI de GitHub Actions, previews y deploy, migraciones, Renovate, emails, webhooks, cron, colas, Sentry, uptime.
- **E5 Optimización y pulido** (nuevo): presupuestos de Core Web Vitals, rendimiento, SEO, accesibilidad final, pulido de UX/copy/motion, informe antes/después.
- **Claude Design:** guía con `/design-sync`, `/design`, pack de design system, prompts y handoff a Claude Code.
- **Google Stitch:** guía con MCP, skills oficiales, `.stitch/DESIGN.md` (plantilla en formato Stitch), prompts sin tokens y conversión de HTML a componentes.
- Prompt de pantalla universal (`templates/prompts/screen-prompt.md`) con variantes para Claude Design y Stitch.
- `SKILL.md` reorganizado alrededor de las etapas; modos con nombre (Proyecto, Retomar, Pieza, Diseño en herramienta, Revisión UX, Revisión de seguridad, Auditoría completa, Design system).
- Eliminada la copia de la v1: todo su contenido vive en `references/identities/noir-editorial.md` y `references/stack-matrix.md`.

## 2.0.0 · 2026-10-28

- `SKILL.md` como router; descubrimiento de proyecto y `PROJECT-BRIEF.md`.
- Identidades noir editorial, producto shadcn/ui y catálogo, con puente de tokens noir ↔ shadcn.
- Motor de diseño de UI/UX Pro Max (`tools/design-intel/`) con lanzador `run.mjs`; 119 reglas UX.
- Reglas, CLI y flujo DESIGN.md → tema de shadcn/ui; plantilla `DESIGN.md`.
- Seguridad: `secure-by-default.md`, `review.md` y la auditoría completa de Cloudflare.
- Compatibilidad multi-agente: `AGENTS.md`, `agents/openai.yml` e instalador para 20 agentes.

## 1.0.0

- Primera versión: estilo noir editorial, matriz de stacks y 15 recetas de animación.
