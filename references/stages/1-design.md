# E1 · Diseño

Entrada: `PROJECT-BRIEF.md` + `ROADMAP.md`. Salida: `DESIGN.md` aprobado + 1–3 pantallas clave diseñadas.

## 1. Identidad

Parte de lo decidido en el arranque guiado: estilo (paso 3), colores (4), tipografías (5) y logo (6). Si el usuario **subió su diseño**, extrae de ahí los tokens y úsalos tal cual; el motor solo rellena huecos. Si eligió un estilo prediseñado, mapea a identidad con [../identities/README.md](../identities/README.md): noir editorial · producto shadcn · catálogo · híbrida.

## 2. Sistema de diseño

```bash
node <SKILL_DIR>/tools/design-intel/run.mjs "<tipo> <industria> <3 palabras de estilo>" --design-system -p "<Nombre>" [--variance] [--motion] [--density]
```

**Orden de prioridad cuando chocan:** 1) marca del usuario → 2) identidad elegida (noir o producto) → 3) respuestas de E0 (dials, motion) → 4) motor. El motor es una sugerencia: con identidad **noir**, toma de él solo patrón de secciones, alternativas tipográficas y anti-patrones de la industria; paleta, radios y motion salen de [noir-editorial.md](../identities/noir-editorial.md). Con identidad **producto**, su paleta vale si la marca no define una. Si el motor contradice lo elegido (p. ej. fondo claro o "transiciones instantáneas" en un proyecto noir cinemático), descártalo y dilo en una línea.

Comprueba contraste en claro y oscuro y escribe `DESIGN.md` con [../../templates/DESIGN.md](../../templates/DESIGN.md). Overrides por página en `design/pages/<pagina>.md`.

## 3. Lienzo de diseño

| Lienzo | Cuándo | Guía |
|---|---|---|
| **Directo en código** | Sin herramientas externas, o proyecto pequeño | Prototipo HTML/componentes con los tokens; revisión en navegador |
| **Claude Design** | Prototipos interactivos, variaciones rápidas, presentar al cliente, sincronizar con el código | [../design-tools/claude-design.md](../design-tools/claude-design.md) |
| **Google Stitch** | Generar muchas pantallas rápido (web y móvil), variantes, exportar HTML/Tailwind | [../design-tools/google-stitch.md](../design-tools/google-stitch.md) |
| **Figma** | Equipo con diseñador o librería existente en Figma | [../design-tools/README.md](../design-tools/README.md#figma) |

Sea cual sea el lienzo, **`DESIGN.md` es la fuente de verdad**: se exporta a la herramienta y lo que vuelve se contrasta contra él.

## 4. Pantallas

Orden: la pantalla que más vende la idea (normalmente la landing o el dashboard principal) → el flujo P0 (registro → acción principal) → estados (vacío, carga, error).
Para cada pantalla escribe un prompt con [../../templates/prompts/screen-prompt.md](../../templates/prompts/screen-prompt.md) (sirve para Claude Design, Stitch y para ti mismo en código).

## Checklist

| Nivel | Tarea |
|---|---|
| Básico | Identidad elegida · `DESIGN.md` con colores, tipografía, radios, espaciado y Do's/Don'ts · 1 pantalla clave |
| Estándar | + modo oscuro comprobado · pares de contraste en `DESIGN.md` · flujo P0 completo · estados vacío/carga/error · móvil 375px |
| Completo | + variantes (2–3) de la pantalla clave para elegir · design system page (shadcn) · motion definido por pantalla · copy real en la voz de la marca |

Siempre: reglas de prioridad 1–6 de [../ux/ux-rules.md](../ux/ux-rules.md) (accesibilidad, interacción, rendimiento, estilo, layout, tipo y color).

## Puerta E1

Muestra: identidad + paleta + fuentes (con contraste) + las pantallas (capturas, enlace del proyecto de Claude Design/Stitch o ruta local). Pregunta: **"¿Aprobamos el diseño y pasamos a E2 · Código?"** Anota en `ROADMAP.md` los cambios pedidos.
