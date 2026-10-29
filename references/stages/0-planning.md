# E0 · Planificación

Antes de diseñar o escribir una línea de código: entender **qué necesita**, **qué priorizar** y **cómo se va a hacer**, y dejarlo organizado por etapas en `ROADMAP.md`.

## Paso 1 · Detectar (sin preguntar)

- `ROADMAP.md`, `PROJECT-BRIEF.md`, `DESIGN.md`, `.stitch/DESIGN.md`, `design-system/*/MASTER.md` → si existen, léelos y **retoma** en la etapa que marque el roadmap.
- Stack y herramientas: `package.json`, `components.json` (shadcn), config de Tailwind, lockfile, `.github/workflows/`, `vercel.json`/`wrangler.toml`/`netlify.toml`, `Dockerfile`.
- Herramientas de diseño disponibles en la sesión: comandos `/design` o `/design-sync` (Claude Code + Claude Design), servidor MCP de Stitch (`list_projects`, `generate_screen_from_text`…), MCP de Figma.

## Paso 2 · Arranque guiado (10 pasos) → `PROJECT-BRIEF.md` + `SECURITY.md`

Sigue [../discovery.md](../discovery.md) **en orden**: 1 tipo de proyecto · 2 tecnología (framework, base de datos, hosting) · 3 diseño (o pausa para subir el diseño existente) · 4 colores · 5 tipografías · 6 logo · 7 apartados · 8 de qué trata · 9 público y enfoque · 10 seguridad y extras. Salta los pasos que el prompt o el repo ya respondan. Cierra con el resumen confirmado, [../../templates/PROJECT-BRIEF.md](../../templates/PROJECT-BRIEF.md) y [../../templates/SECURITY.md](../../templates/SECURITY.md).

## Paso 3 · Prioridades y forma de trabajo

Una sola ronda corta (máx. 4 preguntas, opción recomendada primero). **No repitas nada del arranque guiado:**

| Pregunta | Opciones | Default |
|---|---|---|
| De los apartados del paso 7, ¿cuáles van en el **primer lanzamiento** (P0) y cuáles después (P1/P2)? | Lista de apartados para clasificar | P0 = flujo principal + legal; el resto P1 |
| ¿Dónde diseñamos? | **Claude Design** · Directo en código · **Google Stitch** · Figma (si en el paso 3 subió su diseño, la vía es "desde su diseño") | Claude Design si está disponible; si no, en código |
| ¿Qué automatizaciones quieres? (multi) | CI + deploy automático · Avisos (nuevo contacto, pago) · Emails transaccionales · Publicar desde un panel · Tareas programadas · Integraciones (CRM, Slack, n8n/Zapier) · Ninguna por ahora | CI + deploy |
| ¿Cómo quieres avanzar? | Etapa por etapa con aprobación · Todo seguido y reviso al final | Etapa por etapa |

La **vía de código** se deduce (desde cero, desde Claude Design, desde Stitch, desde Figma o sobre el proyecto existente) y la **profundidad de seguridad** (Básico · Estándar · Completo) ya se acordó en el paso 10. Ambas aparecen en el resumen para que el usuario las cambie si quiere. Si hay fecha límite (paso 10, extras), ajusta las profundidades a ella.

Si el usuario elige una profundidad **mayor** que la recomendada (p. ej. auditoría completa para un portfolio con un solo admin), respétala y añade una línea con el coste ("la auditoría completa lanza varios agentes y tarda más; el alcance real es el panel admin y el formulario"). Si elige una **menor** en un proyecto con pagos, datos sensibles o multi-tenant, avisa del riesgo una vez y anota la decisión en `ROADMAP.md`.

Profundidad de cada etapa: el agente **propone** Básico/Estándar/Completo según el brief y el usuario confirma en la misma ronda.

| Tipo de proyecto | E1 | E2 | E3 | E4 | E5 |
|---|---|---|---|---|---|
| Landing / waitlist | Completo | Básico | Básico | Básico | Completo |
| MVP SaaS | Estándar | Completo | Estándar | Estándar | Estándar |
| Producto con pagos o datos sensibles | Estándar | Completo | Completo | Completo | Estándar |
| Portfolio noir | Completo | Estándar | Básico | Básico | Completo |
| App móvil o de escritorio | Estándar | Completo | Estándar | Estándar | Estándar |
| Web de estudio / datos | Completo | Estándar | Básico | Básico | Completo |

## Paso 4 · Escribir `ROADMAP.md`

Con [../../templates/ROADMAP.md](../../templates/ROADMAP.md):
- Prioridades P0/P1/P2 de funcionalidades.
- Las 6 etapas con profundidad, tareas concretas (del checklist de cada etapa filtrado por profundidad) y criterio de salida.
- Herramienta de diseño y vía de código elegidas.
- Riesgos y supuestos.

## Puerta E0

Muestra (corto): producto en una línea · P0 · orden y profundidad de etapas · herramienta de diseño · stack. Pregunta: **"¿Empezamos con E1 · Diseño?"**
