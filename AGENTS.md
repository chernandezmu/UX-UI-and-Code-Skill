# AGENTS.md · ux-ui-and-code-skill

Este repositorio **es una skill**. Si eres un agente de código (Codex, Cursor, Copilot, Gemini, etc.):

- **Para usar la skill:** lee [SKILL.md](SKILL.md) y sigue su proceso por etapas (E0 Planificación → E1 Diseño → E2 Código → E3 Automatizaciones → E4 Seguridad → E5 Optimización), preguntando al usuario antes de construir. Carga los archivos de `references/` solo cuando la etapa lo indique.
- **Para editar la skill:** mantén `SKILL.md` como router corto (< 500 líneas); el detalle va en `references/`. El frontmatter debe conservar `name` y `description` (≤ 1024 caracteres). Escribe en español, frases cortas, tablas para decisiones.
- **Material de terceros** (no lo edites salvo para actualizarlo desde su origen; ver [NOTICE.md](NOTICE.md)):
  - `references/shadcn/` ← shadcn-ui/ui `skills/shadcn`
  - `references/security/full-audit/` ← cloudflare/security-audit-skill (`SKILL.md` renombrado a `AUDIT.md`)
  - `references/ux/` y `tools/design-intel/` ← nextlevelbuilder/ui-ux-pro-max-skill
- **Probar el motor:** `node tools/design-intel/run.mjs "saas dashboard" --design-system -p "Test"`.
- **Probar el instalador:** `node install.mjs --agent all --project <carpeta-temporal> --dry-run`.
- **El arranque guiado vive en 4 sitios** que deben decir lo mismo: `references/discovery.md` (fuente), la tabla de `SKILL.md` §2, `templates/portable-instructions.md` y `templates/AGENTS-snippet.md`. Si cambias uno, cambia los cuatro y `templates/PROJECT-BRIEF.md`.
- **Probar el comportamiento:** casos en `evals/evals.json`; anota resultados en `evals/RESULTS.md` antes de publicar.
- **Añadir un agente nuevo:** entrada en `AGENTS` de `install.mjs` (tipo `skill`, `block` o `rules`, con `verified` solo si la ruta sale de su documentación oficial) + fila en `references/agents.md`.

Para usar la skill desde otro proyecto sin instalarla como skill, ejecuta `node install.mjs --agents-md <proyecto>`: añade un bloque a su `AGENTS.md` que apunta aquí.
