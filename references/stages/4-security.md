# E4 · Seguridad

Entrada: app funcionando con CI y deploy. Salida: checklist de lanzamiento completo y sin hallazgos altos o críticos abiertos.

Parte de `SECURITY.md` (creado en E0): activos, límites de confianza y profundidad acordada. Al terminar, sus tablas de controles y hallazgos quedan completas y fechadas. La seguridad base ya se aplicó en E2 ([secure-by-default.md](../security/secure-by-default.md) §1–§11 y §15 de la base de datos elegida). Esta etapa **endurece y verifica**.

## Por nivel

| Nivel | Qué se hace |
|---|---|
| **Básico** | [Checklist de lanzamiento](../security/secure-by-default.md#checklist-de-lanzamiento) completo + [barrido rápido](../security/review.md#barrido-rápido-pre-lanzamiento) + cabeceras y CSP activas |
| **Estándar** | + revisión en modo guía ([review.md](../security/review.md)): mapa de límites de confianza, clases relevantes, cada candidato validado intentando refutarlo, severidad calibrada, arreglo mínimo con test de regresión |
| **Completo** | + auditoría completa de 6 fases ([full-audit/AUDIT.md](../security/full-audit/AUDIT.md)) con `findings.json` validado e informe. Requiere sub-agentes y sandbox |

## Orden de trabajo

1. **Secretos:** barrido del repo **y del build** (`.next/`, `dist/`) en busca de claves; rotar lo que haya salido.
2. **Autorización:** recorre cada route handler, server action y endpoint; confirma validación + autorización por recurso. Añade el test de aislamiento entre tenants si no existe (E3).
3. **Cabeceras y CSP:** despliega la CSP primero como `Content-Security-Policy-Report-Only`, revisa violaciones en la preview y luego actívala.
4. **Abuso y coste:** rate limits, captcha en formularios públicos, cuotas de IA/email, alertas de facturación.
5. **Proveedores:** RLS de Supabase / reglas de Firebase, buckets privados, claves con alcance mínimo, previews protegidas. Lo que no se pueda ver desde el código → `needs_validation` con la comprobación exacta.
6. **Automatización de seguridad en CI** (si no se hizo en E3): `audit`/`osv-scanner`, secret scanning, CodeQL o Semgrep.
7. **Revisión o auditoría** según el nivel. Arreglos en orden de severidad, cada uno con su test de regresión, y re-verificación.
8. **Legal y privacidad:** política de privacidad, términos, consentimiento de cookies si aplica, flujo de borrado/exportación de datos.

## Puerta E4

Muestra: checklist (✅/➖/❓), hallazgos confirmados y su estado, `needs_validation` con quién y cómo debe comprobarlos. Nunca digas "es seguro": di "en lo revisado no quedan hallazgos altos o críticos abiertos" y lista lo no revisado. Pregunta: **"¿Pasamos a E5 · Optimización y pulido?"**
