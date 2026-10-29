<!-- ux-ui-and-code-skill:start -->
## UX/UI, código y seguridad

Para cualquier tarea que cree o cambie interfaces (páginas, componentes, estilos, animaciones, design system), que arranque un proyecto o startup, o que revise UX, accesibilidad o seguridad, sigue la skill **ux-ui-and-code-skill**:

- Entrada: `{{SKILL_DIR}}/SKILL.md` (léelo primero; carga los `references/` solo cuando los necesites).
- Si el usuario no dice qué quiere hacer, empieza por el **arranque guiado** de 10 pasos (tipo de proyecto → framework y base de datos → diseño → colores → tipografías → logo → apartados → de qué trata → público → seguridad y extras), un tema por turno y en el idioma del usuario.
- Proceso por etapas: Planificación (preguntas + `ROADMAP.md`) → Diseño → Código → Automatizaciones → Seguridad → Optimización, con aprobación al final de cada etapa.
- Fuentes de verdad del proyecto: `ROADMAP.md`, `PROJECT-BRIEF.md`, `SECURITY.md` y `DESIGN.md` en la raíz. Si existe `ROADMAP.md`, lee su sección `## Relevo` (puede haberla escrito otro agente), verifica el estado y retoma en su etapa actual; al terminar tu sesión, actualiza `## Relevo`. No los regeneres sin permiso.
- Motor de diseño: `node {{SKILL_DIR}}/tools/design-intel/run.mjs "<consulta>" --design-system`.
- Siempre: tokens semánticos, WCAG 2.2 AA, `prefers-reduced-motion`, validación y autorización en servidor, sin secretos en el cliente.
<!-- ux-ui-and-code-skill:end -->
