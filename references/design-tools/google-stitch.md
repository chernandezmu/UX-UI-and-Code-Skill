# Google Stitch

Herramienta experimental de Google Labs ([stitch.withgoogle.com](https://stitch.withgoogle.com)) que genera pantallas web y móviles a partir de texto o imágenes, crea variantes, mantiene un design system por proyecto a partir de un `DESIGN.md` y exporta HTML/Tailwind (y a Figma). Tiene un **servidor MCP** para que el agente lea y genere pantallas, y skills oficiales en [google-labs-code/stitch-skills](https://github.com/google-labs-code/stitch-skills) (Apache-2.0).

Es experimental: comprueba nombres de herramientas y opciones en la documentación actual antes de depender de ellos.

## Configuración (una vez)

1. **MCP de Stitch:** sigue [stitch.withgoogle.com/docs/mcp/setup](https://stitch.withgoogle.com/docs/mcp/setup/) y registra el servidor en tu agente (Claude Code, Codex, Gemini CLI, Cursor…). Credenciales en variables de entorno, nunca en el repo.
2. **Skills oficiales (recomendado):** hacen las llamadas MCP; esta skill decide qué diseñar y con qué reglas.
   ```bash
   npx plugins add google-labs-code/stitch-skills --scope project --target claude-code   # Claude Code
   npx plugins add google-labs-code/stitch-skills --scope workspace --target cursor       # Cursor
   codex plugin marketplace add google-labs-code/stitch-skills --ref main                 # Codex (luego instala stitch-design)
   ```
3. Convención de carpetas: `.stitch/DESIGN.md` (design system en formato Stitch) y `.stitch/designs/` (HTML y capturas descargadas).

Sin MCP: el mismo flujo funciona a mano en la web de Stitch (pegar el `DESIGN.md`, pegar prompts, exportar código).

## Paso 1 · Crear el design system en Stitch

Stitch aplica colores, fuentes y radios **a nivel de proyecto** desde un `DESIGN.md` en su propio formato (prosa descriptiva con hex, 6 secciones).

1. Convierte nuestro `DESIGN.md` con [../../templates/design-exports/stitch-DESIGN.md](../../templates/design-exports/stitch-DESIGN.md) → guarda en `.stitch/DESIGN.md`.
2. **Pide confirmación al usuario** con un resumen (nombre, colores clave, fuentes, radios) antes de subirlo.
3. Con MCP: `list_projects` / `create_project` → `upload_design_md` (archivos pequeños) o el script `upload_to_stitch.py` de las skills oficiales → `create_design_system_from_design_md`. Para pantallas que ya existían: `apply_design_system`.

## Paso 2 · Generar pantallas

Un prompt por pantalla con [../../templates/prompts/screen-prompt.md](../../templates/prompts/screen-prompt.md), en la variante **Stitch**:
- **Sin colores, fuentes, hex ni radios** en prompts de generación: ya los aplica el design system del proyecto y duplicarlos genera conflictos.
- Describe **propósito, plataforma y estructura**: `PLATFORM: Web, Mobile-first` + `PAGE STRUCTURE:` numerada (header, hero, contenido, footer) con textos reales.
- Usa vocabulario de UI preciso ("navbar fija con logo a la izquierda y CTA a la derecha", no "un header bonito").
- Con MCP: `generate_screen_from_text` (`deviceType`: `MOBILE`, `DESKTOP` o `TABLET`), pasando el design system del proyecto.
- Muestra al usuario la descripción y las sugerencias que devuelve Stitch.
- Para ajustar: `edit_screens` con cambios concretos (aquí sí se admiten hex para un ajuste puntual). **Edita en vez de regenerar** salvo que el layout esté mal de base.
- Imagen o boceto de partida: súbelo (skill `upload-to-stitch`) y refínalo con `edit_screens` describiendo la intención.
- Descarga HTML y captura de cada pantalla (`get_screen` → `htmlCode.downloadUrl`, `screenshot.downloadUrl`) a `.stitch/designs/<pantalla>.html|png`.

## Paso 3 · Revisar

Stitch no garantiza consistencia de tokens entre pantallas. Antes de la puerta E1:
- [ ] Colores del HTML descargado = tokens de `DESIGN.md` (lista los que se desvían).
- [ ] Contraste 4.5:1 / 3:1, foco visible, objetivos táctiles ≥ 24px (44pt en móvil).
- [ ] Un CTA primario; jerarquía de encabezados correcta.
- [ ] Versiones móvil y escritorio de las pantallas P0; estados vacío/error.
- [ ] Iconos de una sola familia y sin emojis como iconos.

## De Stitch al código

E2 · vía C:
1. Toma `.stitch/designs/<pantalla>.html` (o pídelo por MCP) como **referencia de estructura y contenido**.
2. Divide en secciones y mapea cada bloque a componentes del stack (shadcn: `Card`, `Tabs`, `Field`, `Table`, `Sidebar`…). La skill oficial `stitch-build/shadcn-ui` o `react-components` puede ayudar a la conversión; las reglas de [../identities/product-shadcn.md](../identities/product-shadcn.md) mandan.
3. **Normaliza**: cada color/espaciado/radio del HTML al token más cercano de `DESIGN.md`; nada de clases de color crudas (`bg-[#…]`, `text-blue-600`).
4. Reescribe con HTML semántico (`button`, `nav`, `main`, `label`), accesibilidad y estados; conecta datos, validación y autorización en servidor.
5. Anota en `ROADMAP.md` las desviaciones que encontraste y cómo se resolvieron.

## Del código a Stitch

Para pantallas nuevas coherentes con un producto ya construido: genera el `DESIGN.md` de Stitch desde el código (skill oficial `extract-design-md`, o a mano con la plantilla) y súbelo como en el paso 1.
