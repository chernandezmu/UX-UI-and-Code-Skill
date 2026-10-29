# Herramientas de diseño

Esta skill decide **qué** diseñar y con **qué reglas** (identidad, tokens, UX, accesibilidad). La herramienta es solo el lienzo. En todas, `DESIGN.md` es la fuente de verdad: sale hacia la herramienta y lo que vuelve se contrasta contra él.

| Herramienta | Fuerte en | Entrada desde la skill | Vuelta al código | Guía |
|---|---|---|---|---|
| **Directo en código** | Control total, sin cuentas externas | Tokens en el CSS | — | [../stages/2-code.md](../stages/2-code.md) |
| **Claude Design** | Prototipos interactivos, variantes, presentar, sincronizar con el repo | `/design-sync` o pack de design system | Handoff a Claude Code | [claude-design.md](claude-design.md) |
| **Google Stitch** | Muchas pantallas rápido (web y móvil), variantes, MCP | `.stitch/DESIGN.md` → design system del proyecto | HTML/Tailwind por MCP o export | [google-stitch.md](google-stitch.md) |
| **Figma** | Equipos con diseñador, librerías existentes | Variables y componentes en Figma | MCP de Figma | [§ Figma](#figma) |

## Cómo elegir

- ¿Ya hay código y usas Claude Code? → **Claude Design** con `/design-sync`.
- ¿Necesitas muchas pantallas o una app móvil rápido? → **Stitch**.
- ¿Hay un diseñador trabajando en Figma? → **Figma**.
- ¿Proyecto pequeño o sin cuentas? → **Directo en código**.
- Se pueden combinar: explorar en Stitch, prototipar y presentar en Claude Design, construir en código. Siempre con el mismo `DESIGN.md`.

## Prompts

Un formato de prompt para todas: [../../templates/prompts/screen-prompt.md](../../templates/prompts/screen-prompt.md) (con variantes para Claude Design y Stitch).

## Figma

Si la sesión tiene el MCP de Figma: lee la pantalla con su herramienta de contexto de diseño, usa las variables de Figma como tokens (mapeadas a `DESIGN.md`) y Code Connect para enlazar componentes de Figma con los del repo. Mismas reglas de vuelta al código que Stitch: el código generado es referencia; se reescribe con los componentes y tokens del proyecto.
