# Prompt de pantalla

Un prompt por pantalla. Rellénalo desde `PROJECT-BRIEF.md` y `DESIGN.md`. Sirve para diseñar en código, en Claude Design o en Google Stitch; abajo están las diferencias.

```markdown
**Propósito:** [Qué tiene que lograr esta pantalla y para quién, en una frase. Acción principal: …]

**PLATFORM:** [Web / Mobile], [Mobile / Desktop]-first

**PAGE STRUCTURE:**
1. **Header:** [Logo a la izquierda; navegación: …; CTA a la derecha: "…"]
2. **Hero:** [Titular real: "…"; subtítulo: "…"; CTA primario: "…"; CTA secundario: "…"; visual: …]
3. **[Sección]:** [Componente concreto (grid de 3 cards, tabla con filtros, formulario de 2 pasos…) y su contenido real]
4. **[Sección]:** …
5. **Footer:** [Columnas: …; legal: Privacidad, Términos; © año]

**STATES:** [vacío: "…" + acción · carga: skeleton · error: causa + cómo arreglarlo · éxito: …]

**INTERACTION & MOTION:** [hover/focus/pressed; transición de entrada; qué pasa con prefers-reduced-motion]

**CONTENT TONE:** [voz de la marca en 3 adjetivos]

**CONSTRAINTS:** WCAG 2.2 AA · un CTA primario · sin emojis como iconos · sin lorem ipsum
```

## Variante Claude Design

Antepón: *"Usa exclusivamente el design system del proyecto (tokens y componentes). No introduzcas colores, fuentes ni radios nuevos."* Añade al final: *"Genera versión móvil y escritorio, los estados indicados y un prototipo interactivo del flujo."* Si quieres elegir dirección: *"Genera 3 variantes con el mismo contenido y tokens: (1) … (2) … (3) …"*.

## Variante Google Stitch

- **Quita toda mención de colores, hex, fuentes y radios** (los aplica el design system del proyecto en Stitch).
- Mantén `PLATFORM` y `PAGE STRUCTURE` tal cual; es el formato que mejor entiende Stitch.
- Una pantalla por prompt; para ajustes usa prompts de edición ("Cambia el [botón primario] del [hero] para…").

## Variante en código

Usa el prompt como especificación: cada sección → componente; los textos van tal cual; los estados se implementan todos.

## Ejemplo (Stitch)

```markdown
**Propósito:** Landing de "Sonríe", clínica dental en Bogotá, para que pacientes nuevos agenden su primera cita.

**PLATFORM:** Web, Mobile-first

**PAGE STRUCTURE:**
1. **Header:** Logo "Sonríe" a la izquierda; enlaces Tratamientos, Equipo, Precios, Contacto; botón "Agendar cita" a la derecha. Fija al hacer scroll.
2. **Hero:** Titular "Tu sonrisa, sin miedo ni sorpresas"; subtítulo "Primera valoración gratis y precios claros desde el primer día"; CTA "Agendar valoración gratis"; secundario "Ver tratamientos"; foto del consultorio a la derecha.
3. **Prueba de confianza:** fila con 4 datos: "+12 años", "4.9 en Google", "Odontólogos certificados", "Pagos a cuotas".
4. **Tratamientos:** grid de 6 cards con icono, nombre, descripción corta y "desde $" (Limpieza, Ortodoncia, Implantes, Blanqueamiento, Endodoncia, Odontopediatría).
5. **Testimonios:** 3 citas con nombre, tratamiento y foto; controles anterior/siguiente y pausa.
6. **Reserva:** formulario corto (nombre, teléfono, tratamiento, franja horaria) con texto de privacidad.
7. **Footer:** dirección, horario, WhatsApp, mapa pequeño; enlaces Privacidad y Términos.

**STATES:** formulario enviado: "Te llamamos en menos de 2 horas hábiles"; error: "No pudimos enviar tu solicitud. Revisa tu teléfono o escríbenos por WhatsApp".
```
