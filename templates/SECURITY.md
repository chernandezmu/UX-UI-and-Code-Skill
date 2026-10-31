# SECURITY · {{Nombre}}

> Modelo de amenazas breve del proyecto (ux-ui-and-code-skill). Se crea al cerrar el arranque guiado (E0) con los pasos 2, 9 y 10; se actualiza en cada etapa y se cierra en E4. Todos los agentes lo leen antes de tocar auth, datos, pagos, formularios o despliegue.

**Profundidad acordada:** Básico · Estándar · Completo
**Ley de datos aplicable:** (GDPR, Ley 1581 Habeas Data, LGPD, CCPA, ninguna…)
**Última revisión:** {{fecha}} · {{agente}}

## 1. Qué protegemos (activos)

| Activo | Dónde vive | Por qué importa |
|---|---|---|
| Cuentas de usuario | (Supabase Auth, Auth.js…) | Toma de cuentas |
| Datos de clientes | (tabla/colección) | Fuga, ley de datos |
| Pagos / créditos | (Stripe…) | Fraude, dinero |
| Secretos | (variables de entorno del hosting) | Acceso total |
| Panel de administración | (ruta) | Control del sitio |
| Cuota de gasto (IA, emails, SMS) | (proveedor) | Factura disparada |

## 2. Quién puede atacar

Anónimo en internet · usuario registrado · usuario de otra organización · admin malicioso o con cuenta robada · contenido externo que llega a la IA · dependencia o CI comprometido.

## 3. Límites de confianza

| Límite | Control | Dónde está en el código |
|---|---|---|
| Navegador → servidor | Validación con esquema + autorización por recurso | |
| Usuario A → datos de usuario B | Filtro por dueño en la consulta / RLS | |
| Organización A → organización B | `org_id` en cada consulta + RLS + test de aislamiento | |
| Webhook externo → base de datos | Firma + idempotencia | |
| Usuario → herramientas de la IA | Mínimo privilegio + confirmación | |
| Formulario público → bandeja / base de datos | Rate limit + captcha + validación | |

## 4. Controles por área

Estado: ✅ hecho · ⏳ en curso · ⬜ pendiente · ➖ no aplica · ❓ needs_validation (depende del proveedor/hosting)

| Área | Control | Estado |
|---|---|---|
| Secretos | `.env` fuera del repo, nada privado con prefijo público | ⬜ |
| Auth | Proveedor probado, cookies `HttpOnly; Secure; SameSite`, respuestas uniformes | ⬜ |
| Autorización | Denegar por defecto, por recurso, en cada endpoint/server action | ⬜ |
| Base de datos | RLS / reglas / rol con mínimo privilegio, conexión TLS, backups probados | ⬜ |
| Entrada/salida | Esquemas, SQL parametrizado, HTML sanitizado, redirecciones internas | ⬜ |
| Archivos | Tipo y tamaño, almacenamiento privado, URLs firmadas | ⬜ |
| Cabeceras | CSP (report-only → activa), HSTS, nosniff, Referrer-Policy, frame-ancestors | ⬜ |
| Abuso | Rate limit (auth, formularios, IA, subidas), captcha, cuotas | ⬜ |
| Pagos | Precios desde servidor, webhooks firmados, idempotencia | ⬜ |
| IA | Entrada/salida no confiables, cuotas, sin secretos en prompts | ⬜ |
| Dependencias y CI | Lockfile, audit, secret scanning, permisos mínimos | ⬜ |
| Privacidad | Datos mínimos, logs sin PII, borrar/exportar, política de privacidad | ⬜ |
| Operación | Monitoreo de errores, alertas, `security.txt`, plan de incidentes | ⬜ |

## 4b. Clases de ataque cubiertas

Recorrido del catálogo [hardening.md](../references/security/hardening.md) (35+ clases). Marca ✅ cubierta · ➖ no aplica · ⬜ pendiente · ❓ needs_validation. Copia aquí solo las que apliquen al proyecto.

| Clase | Estado | Dónde se defiende |
|---|---|---|
| Inyección servidor (SQL/NoSQL/cmd) | ⬜ | |
| XSS + CSP | ⬜ | |
| SSRF | ⬜ | |
| XXE / deserialización | ⬜ | |
| Subida de archivos | ⬜ | |
| Autorización por objeto (BOLA/IDOR) | ⬜ | |
| Mass assignment | ⬜ | |
| JWT / sesión / OAuth | ⬜ | |
| Fuerza bruta / enumeración | ⬜ | |
| Carrera / TOCTOU | ⬜ | |
| Pagos / webhooks | ⬜ | |
| Aislamiento de tenants | ⬜ | |
| IA / LLM | ⬜ | |
| (añade las demás que apliquen) | | |

## 5. Hallazgos (E4)

| Severidad | Hallazgo | Estado | Test de regresión |
|---|---|---|---|

## 6. Pendientes `needs_validation`

| Qué | Quién lo comprueba | Cómo |
|---|---|---|

## 7. Si algo sale mal

1. Contener: rotar el secreto o la clave afectada, desactivar la función o el endpoint.
2. Evaluar: qué datos y qué usuarios, desde cuándo (logs).
3. Corregir con test de regresión y desplegar.
4. Avisar a los afectados y, si la ley lo exige, a la autoridad (GDPR: 72 h).
5. Anotar aquí qué pasó y qué se cambió.

Contacto de seguridad publicado en `/.well-known/security.txt`: {{email}}
