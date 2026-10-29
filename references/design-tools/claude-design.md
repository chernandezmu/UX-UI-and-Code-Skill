# Claude Design

Herramienta de diseño de Anthropic en claude.ai (beta para planes Pro, Max, Team y Enterprise; en Enterprise la activa un admin). Genera prototipos interactivos, pantallas, presentaciones y piezas visuales a partir de prompts, y trabaja con el **design system del proyecto**: lo importa desde código, GitHub, PDFs, capturas o assets de marca. Exporta a .zip, PDF, PPTX, Canva, HTML standalone y **handoff a Claude Code**.

Las funciones cambian rápido: si algo de esta guía no coincide con lo que ves en el producto, manda el producto y dilo al usuario.

## Cuándo usarlo en el proceso

- **E1 · Diseño:** prototipar las pantallas clave, generar variantes para elegir y presentar al cliente.
- **E2 · Código (vía B):** recibir el handoff y convertirlo en código del stack.
- **Iteraciones de diseño** después del lanzamiento: el design system ya sincronizado evita que cada pantalla nueva "se invente" estilos.

## Paso 1 · Llevar el sistema de diseño a Claude Design

El objetivo es que Claude Design diseñe **con nuestros tokens y componentes**, no con los suyos.

**Opción A · Desde Claude Code (recomendada si ya hay código)**
1. Asegúrate de que los tokens de `DESIGN.md` están en el CSS global y de que existen los componentes base (E2 pasos 1–4; si E1 va antes que el código, crea solo ese "kit" mínimo).
2. Ejecuta `/design-sync` en Claude Code para llevar el design system del repo a Claude Design.
3. Usa `/design` para crear o editar proyectos de diseño sin salir de la terminal.

**Opción B · Desde la web (sin código todavía)**
Sube un **pack de design system** (prepáralo con [../../templates/design-exports/claude-design-pack.md](../../templates/design-exports/claude-design-pack.md)):
- `DESIGN.md` (tokens + Do's/Don'ts) y `PROJECT-BRIEF.md`.
- `tokens.css` con las variables (`--background`, `--primary`…, en claro y oscuro).
- Logo y assets de marca (SVG), y capturas de **trabajo propio** de referencia. Nunca capturas de marcas ajenas para copiarlas.
- O enlaza el repositorio de GitHub si el kit ya está ahí.

Revisa el UI kit que genera (paleta, tipografía, componentes, layouts) contra `DESIGN.md` antes de diseñar pantallas. Corrige allí lo que no coincida.

**Opción C · La skill dentro de claude.ai**
Si tu plan permite skills personalizadas en claude.ai, sube esta carpeta como skill: las mismas reglas (identidades, UX, tokens) guían a Claude también al diseñar. Si no está disponible, las opciones A y B dan el mismo resultado.

## Paso 2 · Diseñar pantallas

Un prompt por pantalla con [../../templates/prompts/screen-prompt.md](../../templates/prompts/screen-prompt.md). Para Claude Design:
- Empieza con: *"Usa exclusivamente el design system del proyecto (tokens y componentes). No introduzcas colores, fuentes ni radios nuevos."*
- Pide **estados** explícitamente (vacío, carga, error, éxito) y **móvil + escritorio**.
- Pide el prototipo **interactivo** del flujo P0 (registro → acción principal) para probarlo de verdad.
- Describe el **movimiento** con palabras y tokens (`entra con máscara desde abajo, 1.1s, ease-out expo; salida 0.5s`): Claude Design puede no ejecutar GSAP, pero la intención viaja en el handoff.
- Para elegir dirección: *"Genera 3 variantes de la landing: (1) más editorial, (2) más producto, (3) más audaz; mismo contenido y tokens."*

## Paso 3 · Revisar lo que devuelve

Antes de aprobar (puerta E1):
- [ ] Solo colores y fuentes de `DESIGN.md`; un acento y un CTA primario por pantalla.
- [ ] Contraste 4.5:1 texto / 3:1 UI en claro y oscuro.
- [ ] Estados y versión móvil presentes.
- [ ] Componentes que existen en el stack (si usa shadcn: Card, Field, Tabs… y no inventos).
- [ ] Copy real en la voz de la marca; nada de lorem ipsum.
- [ ] Nada que imite la marca o el contenido de un sitio existente.

## De Claude Design al código

1. **Export → Hand off to Claude Code** (local o Claude Code Web). El bundle incluye el diseño, los componentes usados y la intención de diseño.
2. En Claude Code, con esta skill activa (E2 · vía B):
   - Lee el bundle completo y compáralo con `DESIGN.md`. Tokens nuevos o distintos → **pregunta** antes de añadirlos a `DESIGN.md`.
   - Implementa con los **componentes del proyecto** y las convenciones del stack ([../stack-matrix.md](../stack-matrix.md)); el HTML/CSS exportado es referencia, no se pega tal cual.
   - Añade lo que un prototipo no trae: datos reales, validación y autorización en servidor, estados de error, accesibilidad completa, `prefers-reduced-motion`.
3. **HTML standalone o .zip** (sin Claude Code): úsalo como referencia visual en `design/exports/claude-design/` y sigue el mismo paso 2.
4. **PDF/PPTX/Canva**: para presentar al cliente o al equipo, no para construir.

## Mantener sincronizado

- Cambias tokens o componentes en el código → vuelve a ejecutar `/design-sync`.
- Cambias el diseño en Claude Design → handoff de nuevo y aplica solo el diff.
- `DESIGN.md` sigue siendo la fuente de verdad: si Claude Design y el código discrepan, gana lo que diga `DESIGN.md` (o se actualiza con permiso del usuario).
