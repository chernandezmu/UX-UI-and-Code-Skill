# Agentes compatibles y trabajo entre agentes

La skill es la misma para todos los agentes: un `SKILL.md` en formato **Agent Skills** (estándar abierto: `name` + `description` en el frontmatter, archivos de apoyo cargados bajo demanda). Lo que cambia es **dónde** se instala y **qué capacidades** tiene cada agente. Este archivo dice cómo aplicar el proceso completo en cada uno y cómo se pasan el trabajo entre ellos.

## 1. Cómo carga la skill cada agente

`node <SKILL_DIR>/install.mjs --list` muestra las rutas actuales. Resumen:

| Grupo | Agentes | Cómo la cargan |
|---|---|---|
| **Skills nativas** | Claude Code · Codex · Cursor · GitHub Copilot (VS Code, Visual Studio, CLI) · Gemini CLI · Google Antigravity · Cline · Amp · Goose · OpenCode · Crush · Qwen Code · Mistral Vibe · OpenHands · Kiro · Windsurf · Kilo Code · Continue · Augment · Droid · Trae · Warp · Qoder · CodeBuddy · Kimi Code · CodeWhale · ZCode · Roo Code (legado) | Carpeta `…/skills/ux-ui-and-code-skill/SKILL.md`; el agente lee la descripción y carga la skill cuando la tarea encaja |
| **Carpeta compartida `.agents/skills/`** | Codex, Amp, Goose, Antigravity, y como alias Gemini CLI, Cursor, Copilot, Crush, OpenCode y Zed | Una sola copia en el proyecto sirve a todos |
| **Solo archivo de instrucciones** | JetBrains Junie (`.junie/AGENTS.md` o `AGENTS.md`) · Zed (primer archivo de su lista: `.rules`, `AGENTS.md`…) · Aider (`CONVENTIONS.md` + `read:` en `.aider.conf.yml`) · Replit Agent (`replit.md`) · Amazon Q (`.amazonq/rules/`) | El instalador copia la skill en `.agents/skills/` y añade un bloque que apunta a ella |
| **Cualquier agente que lea `AGENTS.md`** | Devin, Jules, Factory, Warp, Zed, Junie, OpenHands y otros | `node install.mjs --agents-md <proyecto>` |
| **Web y chat sin sistema de archivos** | Lovable · Bolt · v0 · Base44 · ChatGPT (Proyectos, GPTs) · Claude Projects · Gemini Gems | `node install.mjs --portable <carpeta>` → pega `PORTABLE-INSTRUCTIONS.md` en su campo de instrucciones o conocimiento |
| **Lienzos de diseño** | Claude Design · Google Stitch · Figma | Ver [design-tools/](design-tools/) |

## 2. Capacidades y equivalencias

La skill usa términos neutrales. Así se traducen:

| La skill dice… | Si el agente lo tiene | Si no lo tiene |
|---|---|---|
| **Preguntar con opciones** (E0, puertas) | `AskUserQuestion` (Claude Code), herramienta de preguntas o modo plan (Codex, Cursor, Cline, Gemini, Kiro…) | Lista numerada con la opción recomendada primero, máx. 4 preguntas, y esperar respuesta |
| **Planificar antes de actuar** (E0) | Modo plan / plan-act (Claude Code, Codex, Cline, Cursor, Kiro specs, Junie) | Escribe el plan en `ROADMAP.md` y pide aprobación |
| **Sub-agentes** (auditoría completa, verificadores) | Agent/Task (Claude Code), sub-agentes (Codex, Cursor, Amp, OpenCode, Goose…) | Fases en secuencia y dilo en el informe; el verificador puede ser **otro agente** (§4) |
| **Ejecutar comandos** (motor de diseño, tests, validadores) | Terminal del agente | Pide al usuario que ejecute el comando y pegue la salida |
| **MCP** (Stitch, Figma, shadcn) | Servidores MCP configurados | Flujo manual de [design-tools/](design-tools/) |
| **Navegador** (verificación E5) | Navegador integrado o Playwright | Playwright en CI (E3) o checklist manual para el usuario |
| **Memoria entre sesiones** | Memoria propia del agente | `ROADMAP.md` (siempre, aunque haya memoria) |

Regla: si falta una capacidad, **no te saltes el paso**: usa la alternativa y dilo en una línea.

## 3. Estado compartido: una sola verdad para todos los agentes

Todos los agentes leen y escriben los mismos archivos en la raíz del proyecto. Nunca se guarda una decisión solo en la memoria o el archivo propio de un agente.

| Archivo | Qué guarda | Quién lo escribe |
|---|---|---|
| `ROADMAP.md` | Etapa actual, tareas, decisiones, riesgos, **relevo** | Todos, al terminar cada sesión |
| `PROJECT-BRIEF.md` | Producto, público, alcance, supuestos | E0 |
| `DESIGN.md` · `.stitch/DESIGN.md` · `design/pages/*.md` | Sistema de diseño (fuente de verdad visual) | E1 |
| `AGENTS.md` | Comandos del proyecto y bloque de la skill | E0/E3 |
| `CLAUDE.md`, `GEMINI.md`, `.cursor/rules`, `CONVENTIONS.md`, `replit.md`… | **Solo** punteros a `AGENTS.md`/skill y matices del agente | Instalador |

Si dos archivos discrepan, gana `ROADMAP.md` para el estado y `DESIGN.md` para lo visual; corrige el otro.

## 4. Protocolo de relevo entre agentes

Para cambiar de agente a mitad del proyecto (por ejemplo, diseñar en Claude Design, programar en Codex, revisar en Cursor) sin perder contexto.

**Al terminar una sesión**, el agente actualiza la sección `## Relevo` de `ROADMAP.md`:

```markdown
## Relevo
- **Último agente:** Codex · 2026-10-28
- **Etapa:** E2 · Código — 70%
- **Hecho en esta sesión:** auth con magic link, dashboard vacío, tabla de proyectos
- **Siguiente paso concreto:** formulario "Nuevo proyecto" (pantalla 3 de DESIGN.md)
- **Archivos tocados:** app/(app)/dashboard/page.tsx, lib/auth.ts, db/schema.ts
- **Cómo verificar:** `pnpm dev` → /login con email de prueba → /dashboard
- **Preguntas abiertas para el usuario:** ¿límite de proyectos en el plan gratis?
- **No tocar / ojo con:** migración 0003 pendiente de aplicar en preview
```

**Al empezar una sesión**, el agente:
1. Lee `ROADMAP.md` (relevo incluido), `PROJECT-BRIEF.md` y `DESIGN.md`.
2. Comprueba que el estado descrito es real (ejecuta el "cómo verificar" si puede).
3. Resume en 2–3 líneas dónde está el proyecto y confirma con el usuario el siguiente paso antes de seguir.

**Reparto recomendado (opcional)**

| Etapa | Fuerte en… |
|---|---|
| E1 Diseño | Claude Design, Google Stitch, Figma (+ cualquier agente con el motor de diseño) |
| E2 Código y E3 Automatización | Agentes con terminal: Claude Code, Codex, Cursor, Copilot, Gemini CLI, Cline, Amp, OpenCode, Goose… |
| E4 Seguridad | **Un agente distinto del que escribió el código.** Es la regla de la auditoría de Cloudflare: quien verifica no es quien encontró o construyó |
| E5 Optimización | Agentes con navegador o Playwright para medir |

## 5. Particularidades

- **Codex:** skills en `.agents/skills` y `~/.agents/skills`; metadatos en `agents/openai.yml`. Lee `AGENTS.md` siempre.
- **Copilot:** además de `.github/skills`, lee `.claude/skills` y `.agents/skills`; global en `~/.copilot/skills`.
- **Gemini CLI y Antigravity:** `.agents/skills` tiene prioridad sobre `.gemini/skills` en el mismo nivel; las reglas fijas de Antigravity van en `.agents/rules/`.
- **Cline:** el `name` del frontmatter debe coincidir con el nombre de la carpeta (`ux-ui-and-code-skill`). Si migras desde Roo Code, copia la carpeta a `.cline/skills/`.
- **OpenCode:** el `name` debe ser kebab-case e igual a la carpeta (ya lo es). En versiones antiguas la carpeta era `skill/` en singular.
- **Crush:** busca también en `.agents/skills`, `.claude/skills` y `.cursor/skills`; rutas extra en `options.skills_paths` de `crush.json`.
- **Zed:** usa el **primer** archivo de su lista (`.rules` antes que `AGENTS.md`); el instalador escribe en el que ya exista. Skills globales en `~/.agents/skills`.
- **Junie:** prefiere `.junie/AGENTS.md`; si no existe, `AGENTS.md` de la raíz. No crees `.junie/AGENTS.md` si ya hay un `AGENTS.md` raíz con contenido: Junie dejaría de leer el de la raíz.
- **Aider:** no lee skills; carga `CONVENTIONS.md` con `read:` en `.aider.conf.yml` y desde ahí sigue `SKILL.md`. No tiene preguntas con opciones: usa listas numeradas.
- **Replit Agent:** lee `replit.md`; la skill se copia en `.agents/skills/` del Repl.
- **Lovable, Bolt, v0, Base44:** sin terminal ni archivos de la skill: usa `PORTABLE-INSTRUCTIONS.md` (versión condensada) y aplica E3–E5 al exportar el código a un repo con un agente con terminal.
- **ChatGPT, Claude Projects, Gemini Gems:** pega las instrucciones portables y sube `DESIGN.md`/`ROADMAP.md` como archivos del proyecto; el agente de chat puede hacer E0 y E1 completas y generar código para E2.

Las rutas cambian a menudo. Si un agente no carga la skill, comprueba su documentación actual y usa `--dest <ruta>`.
