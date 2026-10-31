# Proceso por etapas

Todo proyecto (modo Proyecto) se hace en este orden. Cada etapa tiene **entrada**, **entregables** y una **puerta**: al terminar, el agente muestra el resumen y el usuario aprueba antes de pasar a la siguiente.

```
E0 Planificación ─▶ E1 Diseño ─▶ E2 Código ─▶ E3 Automatizaciones ─▶ E4 Seguridad ─▶ E5 Optimización y pulido
   preguntas,          sistema de      implementación   CI/CD, tests,        endurecimiento,      rendimiento, SEO,
   prioridades,        diseño,         por stack o      deploy, emails,      revisión y           accesibilidad final,
   ROADMAP.md          pantallas       desde el diseño  flujos de negocio    auditoría            copy y motion
```

| Etapa | Archivo | Entregable principal | Puerta (lo que aprueba el usuario) |
|---|---|---|---|
| **E0 · Planificación** | [0-planning.md](0-planning.md) | `PROJECT-BRIEF.md` + `ROADMAP.md` | Alcance, prioridades y orden |
| **E1 · Diseño** | [1-design.md](1-design.md) | `DESIGN.md` + pantallas clave (en código, Claude Design, Stitch o Figma) | El look de 1–3 pantallas clave |
| **E2 · Código** | [2-code.md](2-code.md) | App funcionando en local con datos reales o de prueba | Flujo principal usable de punta a punta |
| **E3 · Automatizaciones** | [3-automation.md](3-automation.md) | CI, tests, deploy de previews y prod, flujos de negocio | Un cambio llega a producción solo con checks en verde |
| **E4 · Seguridad** | [4-security.md](4-security.md) | Checklist de lanzamiento + revisión guiada o auditoría completa | Sin hallazgos altos/críticos abiertos |
| **E5 · Optimización y pulido** | [5-optimization.md](5-optimization.md) | Métricas antes/después, informe final | Listo para lanzar |

## Reglas del proceso

1. **El orden es el orden de foco, no un permiso para hacer mal lo anterior.** La seguridad básica (secretos, validación, autorización) y la accesibilidad se aplican desde E2; E4 y E5 las *endurecen* y *verifican*.
2. **Una puerta por etapa.** Al final de cada etapa: resumen corto (qué se hizo, decisiones, pendientes) + pregunta "¿seguimos con E<n+1>?". Si el usuario pide "hazlo todo seguido" (modo continuo), sigue sin parar pero escribe igual el resumen de cada etapa en `ROADMAP.md`.
3. **Profundidad por etapa.** En E0 el usuario elige para cada etapa: *Básico* · *Estándar* · *Completo* (o *Omitir*). Los checklists de cada archivo están marcados con esos niveles.
4. **`ROADMAP.md` es el estado.** Marca tareas ✅/⏳/⬜, registra decisiones y la etapa actual. Al retomar una sesión, léelo primero y continúa donde quedó.
5. **Volver atrás es legal.** Si en E2 aparece un problema de diseño, se anota, se corrige en `DESIGN.md` (E1) y se sigue. No se rediseña en silencio.
6. **Relevo entre agentes.** Antes de cerrar cada sesión, actualiza la sección `## Relevo` de `ROADMAP.md`; al empezar, léela y verifica el estado. Así cualquier agente (Claude Code, Codex, Cursor, Gemini, Cline…) continúa el trabajo de otro. Ver [../agents.md](../agents.md#4-protocolo-de-relevo-entre-agentes).
7. **Piezas puntuales (modo Pieza)** no usan el proceso completo: aplican solo la etapa que toque (normalmente E2 con los tokens de `DESIGN.md`).

## Seguridad en cada etapa

La seguridad no espera a E4. `SECURITY.md` (plantilla en [../../templates/SECURITY.md](../../templates/SECURITY.md)) se crea en E0 y cada etapa deja su parte hecha:

| Etapa | Qué se hace de seguridad | Puerta (no se pasa sin esto) |
|---|---|---|
| **E0** | Pasos 2, 9 y 10 del arranque → activos, atacantes, límites de confianza y profundidad en `SECURITY.md` | `SECURITY.md` creado |
| **E1** | UX segura: login con pegado y gestores de contraseñas, mensajes que no revelan si una cuenta existe, confirmación de acciones destructivas, aviso de privacidad y consentimiento en formularios, ningún dato sensible en pantallas compartibles | Flujos de auth y formularios revisados |
| **E2** | [secure-by-default.md](../security/secure-by-default.md) §1–§11 y §15 + la defensa por clase de [hardening.md](../security/hardening.md) mientras se escribe: secretos, validación + autorización por recurso, base de datos con RLS/reglas/rol mínimo, cabeceras, y el vector concreto de cada pieza (inyección, XSS, SSRF, carrera, pagos…) | Ningún endpoint sin validar y autorizar |
| **E3** | Seguridad automatizada: audit de dependencias, secret scanning, test de aislamiento entre usuarios/tenants, CSP en report-only en la preview, permisos mínimos en CI | CI falla si aparece un secreto o una dependencia vulnerable crítica |
| **E4** | Checklist de lanzamiento + barrido + revisión guiada o auditoría completa, idealmente **por un agente distinto** del que construyó; CSP activa | Sin hallazgos altos/críticos abiertos |
| **E5** | Cabeceras verificadas en producción, `security.txt`, alertas activas, §16 (después del lanzamiento) | `SECURITY.md` cerrado y fechado |
