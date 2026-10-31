# Revisión de seguridad (guiada · E4 Estándar)

Para "¿es seguro?", "revisa la seguridad antes de lanzar", "mira este endpoint" o revisar un cambio. Es la versión ligera del método de Cloudflare: mismo listón de evidencia, sin crear la carpeta de auditoría ni lanzar decenas de agentes. Si el usuario pide auditoría completa, pentest o informe formal → [full-audit/AUDIT.md](full-audit/AUDIT.md).

## Seguridad del propio revisor

- El código revisado es **solo lectura**. Describe arreglos; aplícalos solo si el usuario lo pide.
- No sondees servicios desplegados, APIs de terceros, identidades reales ni datos de otros usuarios.
- No ejecutes builds, tests ni código del objetivo fuera de un sandbox sin red, con entorno vacío y límites de recursos. Sin sandbox → la pista queda como `needs_validation` con un plan de verificación seguro.
- Datos, usuarios y secretos de prueba siempre ficticios.

## 1. Mapa rápido (5 minutos)

Anota en pocas líneas:
- **Entradas:** rutas HTTP, server actions, webhooks, formularios, subidas, colas, WebSockets, prompts de IA, CLI.
- **Principales:** anónimo, usuario, miembro de otra org, admin, servicio interno, el modelo de IA.
- **Límites de confianza:** dónde pasa algo de un principal de menos confianza a uno de más (navegador → servidor, tenant A → datos de B, usuario → herramienta de la IA, webhook externo → base de datos).
- **Activos:** datos de clientes, dinero/créditos, cuentas, secretos, cuota de gasto.
- **Controles:** auth, autorización, validación, RLS, CSP, rate limit.

Para cada clase, la **defensa concreta** que debería estar en el código está en [hardening.md](hardening.md): úsalo como referencia de "qué tendría que ver aquí".

## 2. Elegir clases a cazar

| Si el proyecto tiene… | Mira | Companion |
|---|---|---|
| Cualquier web/API | Inyección, control de acceso, lógica de negocio, abuso de funciones, secretos | [ATTACK-CLASSES.md](full-audit/ATTACK-CLASSES.md) |
| Sesiones, OAuth, JWT, MFA, API keys | Fijación de sesión, CSRF, `state`/PKCE, vinculación de cuentas, recuperación | [WEB-PROTOCOL-AND-AUTH.md](full-audit/WEB-PROTOCOL-AND-AUTH.md) |
| SPA, `postMessage`, service workers, HTML dinámico | DOM XSS, origen de mensajes, clickjacking, prototype pollution | [CLIENT-SIDE.md](full-audit/CLIENT-SIDE.md) |
| Multi-tenant, búsqueda, exportes, borrado | Aislamiento por tenant, fugas por búsqueda/caché, borrado incompleto | [DATA-ISOLATION-AND-LIFECYCLE.md](full-audit/DATA-ISOLATION-AND-LIFECYCLE.md) |
| IA/LLM, RAG, agentes, MCP | Inyección de prompt indirecta, herramientas con privilegio, salida sin sanitizar | [AI-AND-LLM.md](full-audit/AI-AND-LLM.md) |
| Webhooks, colas, GraphQL, gRPC | Firma, reintentos, deserialización, autorización por campo | [PROTOCOLS-RPC-AND-MESSAGING.md](full-audit/PROTOCOLS-RPC-AND-MESSAGING.md) |
| IaC, contenedores, serverless, buckets | IAM amplio, buckets públicos, secretos en config | [CLOUD-AND-DEPLOYMENT.md](full-audit/CLOUD-AND-DEPLOYMENT.md) |
| CI, dependencias, releases | `pull_request_target`, acciones sin fijar, typosquatting | [SUPPLY-CHAIN-AND-RELEASE.md](full-audit/SUPPLY-CHAIN-AND-RELEASE.md) |
| Trabajo caro por petición | Agotamiento de CPU/cola/cuota, gasto del operador | [RESOURCE-EXHAUSTION-AND-AVAILABILITY.md](full-audit/RESOURCE-EXHAUSTION-AND-AVAILABILITY.md) |
| App de escritorio/móvil, deep links | Webview bridges, componentes exportados, IPC local | [DESKTOP-MOBILE-AND-LOCAL-IPC.md](full-audit/DESKTOP-MOBILE-AND-LOCAL-IPC.md) |
| C/C++/Rust unsafe, parsers binarios | Memoria, enteros, concurrencia | [MEMORY-SAFETY-AND-BINARY.md](full-audit/MEMORY-SAFETY-AND-BINARY.md) |

Si tu plataforma tiene sub-agentes, puedes lanzar uno por clase con el archivo companion en su prompt; si no, recórrelas en secuencia.

## 3. Regla de oro: límite + resultado

Un candidato solo es hallazgo si puedes nombrar los seis:
1. **Principal de menor confianza** (quién ataca).
2. **Entrada o acción aceptada** (qué envía).
3. **Control previsto** (qué debería impedirlo).
4. **Límite cruzado** (qué frontera se rompe).
5. **Principal o recurso afectado** (a quién/qué daña).
6. **Resultado concreto** observado o verificable (qué pasa exactamente).

No son hallazgos: una buena práctica ausente, comportamiento de despliegue adivinado, un crash de parser sin impacto, auto-daño, o la falta de la capa B cuando la capa A ya bloquea el ataque (eso es una *nota de endurecimiento*).

## 4. Validar intentando refutar

Para cada candidato, intenta demostrar que **no** es explotable: ¿hay un middleware, RLS, validación o configuración del framework que lo bloquee? ¿El camino es realmente alcanzable por ese principal? Mejor si lo valida un agente distinto del que lo encontró. Evidencia válida: traza en código con archivo y línea + (opcional) un test local mínimo en sandbox que muestre el valor incorrecto o el registro no autorizado, y nada más.

Veredictos:
- **confirmed** — traza completa y resultado acotado demostrado. Lleva severidad.
- **needs_validation** — hipótesis concreta basada en el código pero bloqueada por un hecho que no está en el repo (cabeceras del proxy, política del proveedor, config del hosting). **Sin severidad.** Indica el hecho exacto que falta y cómo comprobarlo sin riesgo.
- **rejected** — refutado; anota por qué (evita repetirlo).

## 5. Severidad (solo para confirmed)

- **crítica** — un actor no autenticado obtiene ejecución de código, acceso a todo el almacén de datos o toma de cuentas arbitrarias.
- **alta** — se anula por completo un control explícito con consecuencias reales: bypass de auth, lectura/escritura entre tenants, XSS almacenado que afecta a otros, RCE autenticada, parada remota no autenticada de un servicio compartido.
- **media** — violación real con radio limitado, precondiciones poco comunes o efecto en un conjunto estrecho de recursos.
- **baja** — revela internos no secretos, o requiere mucho esfuerzo para poca ganancia.
- **informativa** — confirmada pero de impacto mínimo; útil como prerrequisito.

Discriminador alta/media: ¿el resultado **anula** un control para una acción con consecuencias reales, o solo lo **debilita**? Si no puedes decir el daño concreto, la severidad es menor de lo que parece. La severidad nunca supera el impacto demostrado.

## 6. Arreglo mínimo efectivo

Para cada confirmed: el **invariante** que el código debe cumplir y el **cambio más pequeño** que lo impone en el último punto de decisión de confianza, con ruta del repo y un test de regresión. Nada de "endurecer en general".

## 7. Formato de cada hallazgo

```markdown
### [ALTA] Lectura entre organizaciones en GET /api/projects/:id
- Veredicto: confirmed
- Principal: miembro autenticado de la org A
- Entrada: id de un proyecto de la org B en la URL
- Control previsto: el proyecto solo es visible para miembros de su org
- Límite cruzado: tenant A → datos del tenant B
- Resultado: devuelve nombre, miembros y facturación del proyecto de B
- Evidencia: app/api/projects/[id]/route.ts:14 — `db.query.projects.findFirst({ where: eq(projects.id, id) })` sin filtro por `orgId`
- Arreglo mínimo: añadir `and(eq(projects.orgId, session.user.orgId))` a la consulta y responder 404 si no hay fila
- Test de regresión: usuario de org A pide proyecto de org B → 404
```

`needs_validation` usa el mismo formato sin severidad y con **Hecho que falta** + **Cómo verificar**.

## 8. Informe

1. Alcance revisado (rutas, commit) y lo que **no** se revisó — nunca digas "es seguro"; di "en lo revisado no encontré…".
2. Confirmed por severidad.
3. needs_validation con su verificación.
4. Notas de endurecimiento (separadas, sin severidad).
5. Siguiente paso: arreglar en orden, y si hay datos sensibles o multi-tenant, proponer la auditoría completa (E4 Completo). Una sola pasada nunca agota un objetivo: en las pruebas de Cloudflare una ejecución encontró aproximadamente la mitad de lo que encontraron varias.

---

## Barrido rápido pre-lanzamiento

Búsquedas que suelen revelar problemas reales. Cada coincidencia es una **pista**, no un hallazgo: aplícale §3–§4.

```bash
# Secretos y claves expuestas
rg -n --hidden -g '!node_modules' -g '!*.lock' -e 'sk_live_|sk_test_|service_role|-----BEGIN (RSA|EC|OPENSSH) PRIVATE KEY|AKIA[0-9A-Z]{16}|xox[baprs]-|ghp_[A-Za-z0-9]{36}'
rg -n -e '(NEXT_PUBLIC|VITE|PUBLIC|NUXT_PUBLIC)_[A-Z_]*(SECRET|PRIVATE|SERVICE|TOKEN|KEY)' .
git ls-files | rg -e '(^|/)\.env($|\.)' | rg -v '\.example$'

# HTML crudo / ejecución dinámica
rg -n -e 'dangerouslySetInnerHTML|\{@html|v-html|set:html|\.innerHTML\s*=|insertAdjacentHTML|document\.write|eval\(|new Function\('

# SQL sin parámetros
rg -n -e '\$queryRawUnsafe|\$executeRawUnsafe|sql\.raw\(|\.raw\(`|query\(`[^`]*\$\{'

# Comandos y rutas
rg -n -e 'child_process|exec\(|execSync\(|spawn\(.*shell:\s*true' -e 'path\.join\([^)]*req\.(params|query|body)'

# CORS, TLS, cookies
rg -n -e "origin:\s*['\"]\*['\"]|Access-Control-Allow-Origin['\"]?,\s*['\"]\*" -e 'rejectUnauthorized:\s*false|NODE_TLS_REJECT_UNAUTHORIZED' -e 'httpOnly:\s*false|secure:\s*false'

# Redirecciones abiertas y SSRF
rg -n -e 'redirect\((req|request|searchParams|params)\.' -e 'fetch\((req|body|input|params|searchParams)\.'

# Autorización: endpoints y server actions (revisa a mano que cada uno autorice por recurso)
rg -n -l -e "^['\"]use server['\"]" -g '*.ts' -g '*.tsx'
rg -n -e 'export (async )?function (GET|POST|PUT|PATCH|DELETE)' -g 'route.ts'

# Supabase / Firebase
rg -n -e 'create table' -g '*.sql' ; rg -n -e 'enable row level security' -g '*.sql'
rg -n -e 'allow read, write: if true' -g '*.rules'

# Webhooks sin verificar
rg -n -e 'webhook' -i -l | xargs rg -L -e 'constructEvent|verify|signature' 2>/dev/null

# CI
rg -n -e 'pull_request_target' -e '\$\{\{\s*github\.event\.' .github/ 2>/dev/null
```

Sin `rg`: usa la herramienta de búsqueda de tu plataforma o `grep -rnE`.
Después del barrido, recorre el [checklist de lanzamiento](secure-by-default.md#checklist-de-lanzamiento).
