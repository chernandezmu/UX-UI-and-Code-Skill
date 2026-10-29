# Avisos de terceros

Esta skill integra material de tres proyectos con licencia MIT. Cada carpeta conserva su `LICENSE` original.

| Carpeta | Origen | Licencia | Cambios |
|---|---|---|---|
| `references/shadcn/` | [shadcn-ui/ui](https://github.com/shadcn-ui/ui) — `skills/shadcn` | MIT · © 2023 shadcn | Copia sin cambios; `SKILL.md` original guardado como `shadcn-skill-original.md` (enlaces de `cli.md` y `customization.md` actualizados). Resumen y traducción en `references/identities/product-shadcn.md` |
| `references/security/full-audit/` | [cloudflare/security-audit-skill](https://github.com/cloudflare/security-audit-skill) — `skills/security-audit` | MIT · © 2025-2026 Cloudflare, Inc. | `SKILL.md` renombrado a `AUDIT.md` y referencias actualizadas; tests de los validadores omitidos. Reglas de construcción y revisión derivadas en `references/security/secure-by-default.md` y `review.md` |
| `references/ux/`, `tools/design-intel/` | [nextlevelbuilder/ui-ux-pro-max-skill](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill) — `.claude/skills/ui-ux-pro-max` | MIT · © 2024 Next Level Builder | `quick-reference.md` → `ux-rules.md`, `pro-rules.md` → `native-app-rules.md`; scripts `search.py`, `core.py`, `design_system.py`, `reasoning_contract.py` y `data/` sin cambios; añadido `run.mjs` |

**Referencia sin copia de código:** `references/design-tools/google-stitch.md` y `templates/design-exports/stitch-DESIGN.md` describen el flujo y el formato `DESIGN.md` de [google-labs-code/stitch-skills](https://github.com/google-labs-code/stitch-skills) (Apache-2.0, © Google LLC), redactados de nuevo en español; no se incluyen archivos de ese repositorio.

El resto (SKILL.md, proceso por etapas, discovery, identidades noir/producto/catálogo, guías de Claude Design y Stitch, stack-matrix, secure-by-default, review, plantillas, instalador) es obra de Carlos Hernández.

Para actualizar el material de terceros, vuelve a copiar desde el repositorio de origen y revisa que los enlaces internos sigan funcionando.
