# Seguro por defecto (al construir)

Lo que se aplica **mientras se escribe el código**, sin que el usuario lo pida. Está escrito para startups y MVPs: lo mínimo que evita los incidentes reales (fugas entre clientes, cuentas tomadas, secretos expuestos, facturas de IA disparadas). Las clases de ataque vienen de la skill de auditoría de Cloudflare ([full-audit/](full-audit/)); aquí están convertidas en reglas de construcción.

Principio: **el servidor decide**. Todo lo que llega del navegador (campos, roles, precios, IDs, cabeceras, archivos, URLs, texto para la IA) es entrada no confiable hasta validarla y autorizarla en el servidor.

---

## 1. Secretos y configuración

- `.env*` en `.gitignore` desde el primer commit; entrega un `.env.example` sin valores.
- Prefijos públicos = públicos: `NEXT_PUBLIC_*`, `VITE_*`, `PUBLIC_*` (Astro/SvelteKit), `NUXT_PUBLIC_*` terminan en el bundle. Nunca claves de servicio ahí.
- Claves con privilegio (Supabase `service_role`, Stripe secret, claves de LLM, tokens de DB) **solo en servidor**. En Next, marca módulos con `import "server-only"`.
- Nada de secretos en logs, mensajes de error, URLs, analítica ni prompts de sistema.
- Si un secreto llegó a un commit: rotarlo (borrar del historial no basta).

## 2. Autenticación

- Usa un proveedor o librería probada (Auth.js, Better Auth, Clerk, Supabase Auth, Laravel Fortify, Passport). No escribas hashing ni sesiones a mano.
- Si guardas contraseñas: Argon2id (o bcrypt coste ≥ 12). Mínimo 8 caracteres, sin reglas de composición absurdas, comprobación contra contraseñas filtradas si el proveedor lo ofrece.
- Cookies de sesión: `HttpOnly; Secure; SameSite=Lax; Path=/`. Rota la sesión al iniciar sesión y al cambiar privilegios. Invalida en servidor al cerrar sesión.
- Respuestas uniformes en login, registro y "olvidé mi contraseña" ("Si la cuenta existe, te enviamos un correo") para no enumerar usuarios.
- Tokens de reset/magic link: aleatorios criptográficos, de un solo uso, caducan (≤ 30 min), ligados al usuario.
- OAuth/OIDC: valida `state` y PKCE; vincula cuentas solo por email **verificado**.
- MFA o passkeys como opción para cuentas con datos sensibles o admin.
- **UX y seguridad juntas:** permitir pegar y gestores de contraseñas (`autocomplete="current-password"`, `"new-password"`, `"one-time-code"`), mostrar/ocultar contraseña, alternativa no cognitiva (WCAG 2.2 *Accessible Authentication*).

## 3. Autorización (la causa nº 1 de fugas en SaaS)

- Denegar por defecto. Comprueba **en el servidor, en cada operación, sobre el recurso concreto**: "¿este usuario puede hacer *esta* acción sobre *este* objeto?".
- Filtra por dueño/tenant **en la consulta**, no después: `WHERE id = $1 AND org_id = $2`. Responde igual a "no existe" y "no es tuyo" (404).
- Las **server actions y route handlers son endpoints públicos**: valida y autoriza dentro de cada uno, aunque el botón solo se muestre a admins.
- Nunca confíes en campos del cliente para rol, `org_id`, `user_id`, `price`, `isAdmin`, `status` (asignación masiva). Lista blanca de campos editables.
- Operaciones masivas, exportar, importar, búsqueda y filtros respetan los mismos permisos por ítem.
- Multi-tenant: cada tabla con `org_id`; índices y RLS por tenant; cachés y claves de almacenamiento incluyen el tenant.

```ts
// Next.js server action (pseudocódigo con Drizzle)
"use server"
import { z } from "zod"
const Input = z.object({ projectId: z.string().uuid(), name: z.string().trim().min(1).max(80) })

export async function renameProject(raw: unknown) {
  const session = await auth()
  if (!session?.user) throw new Error("UNAUTHENTICATED")
  const { projectId, name } = Input.parse(raw)
  const updated = await db.update(projects).set({ name })
    .where(and(eq(projects.id, projectId), eq(projects.orgId, session.user.orgId)))
    .returning({ id: projects.id })
  if (updated.length === 0) throw new Error("NOT_FOUND") // mismo error para "no existe" y "no es tuyo"
}
```

```sql
-- Supabase: RLS activado en TODAS las tablas expuestas
alter table projects enable row level security;
create policy "miembros leen" on projects for select
  using (org_id in (select org_id from memberships where user_id = (select auth.uid())));
create policy "miembros editan" on projects for update
  using (org_id in (select org_id from memberships where user_id = (select auth.uid())))
  with check (org_id in (select org_id from memberships where user_id = (select auth.uid())));
```

## 4. Entrada y salida

- **Valida en el borde con esquema** (zod, valibot, class-validator, Form Requests): tipos, longitudes, rangos, enums. Rechaza campos desconocidos.
- **SQL:** ORM o consultas parametrizadas. Prohibido concatenar (`$queryRawUnsafe`, `sql.raw`, template strings en `query()`).
- **HTML:** el framework escapa por defecto; no lo rompas. `dangerouslySetInnerHTML`, `{@html}`, `v-html`, `set:html`, `innerHTML` solo con contenido sanitizado (DOMPurify / sanitize-html) y, si es Markdown de usuario, renderizador sin HTML crudo.
- **URLs de usuario en `href`/`src`:** solo `https:` (y `mailto:` si aplica); nunca `javascript:`.
- **Redirecciones:** solo rutas internas.
  ```ts
  const safeRedirect = (to?: string | null) =>
    to && to.startsWith("/") && !to.startsWith("//") && !to.startsWith("/\\") ? to : "/"
  ```
- **SSRF:** si el servidor descarga una URL dada por el usuario (previews, webhooks, importar), lista blanca de hosts, bloquea IPs privadas/link-local/metadata (`169.254.169.254`), sin seguir redirecciones a otros hosts, timeout y tamaño máximo.
- **Archivos subidos:** límite de tamaño, tipo comprobado por contenido (no por extensión), nombre aleatorio, almacenamiento fuera del webroot (S3/R2/Supabase Storage) con URLs firmadas y caducidad; nunca servir SVG/HTML subido en tu dominio principal.
- **Comandos/rutas:** sin `exec` con entrada de usuario; rutas resueltas y confinadas a un directorio base.
- **Errores:** al cliente, mensaje genérico + id de correlación; el detalle (stack, SQL) solo en logs.

## 5. Cabeceras y CSP

Mínimo en todas las respuestas HTML:

| Cabecera | Valor recomendado |
|---|---|
| `Content-Security-Policy` | Ver abajo |
| `Strict-Transport-Security` | `max-age=63072000; includeSubDomains; preload` (solo con HTTPS en todos los subdominios) |
| `X-Content-Type-Options` | `nosniff` |
| `Referrer-Policy` | `strict-origin-when-cross-origin` |
| `Permissions-Policy` | `camera=(), microphone=(), geolocation=()` (abre solo lo que uses) |
| `X-Frame-Options` / `frame-ancestors` | `DENY` / `'none'` salvo que debas embeberte |

CSP base (con nonce para scripts):
```
default-src 'self'; script-src 'self' 'nonce-{NONCE}' 'strict-dynamic'; style-src 'self' 'unsafe-inline';
img-src 'self' data: blob: https:; font-src 'self'; connect-src 'self' https://api.tu-dominio.com;
object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'; upgrade-insecure-requests
```
- `style-src 'unsafe-inline'` es el compromiso habitual (atributos `style` de React/Tailwind y GSAP); el riesgo real está en `script-src`, que **nunca** lleva `'unsafe-inline'` ni `'unsafe-eval'`.
- Scripts de CDN (GSAP, Lenis): versión fija + SRI, o self-host. Añade solo ese origen.
- Analítica, Stripe, Turnstile, etc. → añade sus orígenes documentados en `script-src`/`frame-src`/`connect-src`.

**Next.js** (`proxy.ts` en Next 16+, `middleware.ts` en ≤ 15):
```ts
import { NextResponse, type NextRequest } from "next/server"
export function proxy(req: NextRequest) {
  const nonce = Buffer.from(crypto.randomUUID()).toString("base64")
  const csp = [
    "default-src 'self'",
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic'`,
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: blob: https:",
    "font-src 'self'",
    "object-src 'none'", "base-uri 'self'", "form-action 'self'", "frame-ancestors 'none'",
    "upgrade-insecure-requests",
  ].join("; ")
  const headers = new Headers(req.headers)
  headers.set("x-nonce", nonce)
  headers.set("Content-Security-Policy", csp)
  const res = NextResponse.next({ request: { headers } })
  res.headers.set("Content-Security-Policy", csp)
  return res
}
```
Las cabeceras estáticas van en `headers()` de `next.config`. Con CSP por nonce las páginas se renderizan dinámicamente.

**SvelteKit** (`svelte.config.js`): `kit: { csp: { mode: "auto", directives: { "script-src": ["self"], "object-src": ["none"], "base-uri": ["self"] } } }` + resto de cabeceras en `handle` (`hooks.server.ts`).
**Astro:** usa el soporte CSP nativo si tu versión lo tiene; si no, cabeceras en el hosting (`_headers` en Cloudflare/Netlify, `vercel.json`).
**NestJS:** `app.use(helmet())`.
**HTML estático:** cabeceras en el hosting; como último recurso `<meta http-equiv="Content-Security-Policy">` (no admite `frame-ancestors`).

## 6. CORS y CSRF

- CORS: lista blanca de orígenes exactos. Nunca `Access-Control-Allow-Origin: *` junto a credenciales, ni reflejar el `Origin` recibido.
- CSRF con sesiones por cookie: `SameSite=Lax` + verificación de `Origin`/`Host` en peticiones que cambian estado, o token CSRF. Las server actions de Next y SvelteKit comprueban el origen; los route handlers propios no.
- Nada de cambios de estado por `GET`.

## 7. Pagos

- Precios y productos solo desde el servidor (IDs de precio del proveedor); **nunca** el importe que envía el cliente.
- Webhooks: verifica firma sobre el cuerpo crudo, rechaza eventos viejos, **idempotencia** (guarda `event.id`), y confirma el estado con la API antes de dar acceso.
  ```ts
  const event = stripe.webhooks.constructEvent(await req.text(), req.headers.get("stripe-signature")!, process.env.STRIPE_WEBHOOK_SECRET!)
  ```
- El acceso premium se decide por el estado de suscripción guardado por el webhook, no por un parámetro de la URL de éxito.

## 8. Abuso y límites

- Rate limit por IP **y** por cuenta en: login, registro, reset, magic link, OTP, formularios públicos, subidas, búsqueda costosa, endpoints de IA.
- Captcha no intrusivo (Turnstile, hCaptcha) en formularios públicos y waitlists.
- Paginación con máximo; límites de tamaño de body; timeouts en llamadas externas.
- Cuotas de gasto: tope por usuario/día en IA, emails y SMS; alertas de facturación en el proveedor.

## 9. Funciones de IA / LLM

- **Todo lo que entra al modelo desde fuera** (mensajes, documentos, páginas web, resultados de herramientas, memoria) es no confiable y puede contener instrucciones.
- **La salida del modelo es no confiable:** renderízala como texto o Markdown sanitizado; nunca la ejecutes, ni la uses como SQL, ruta, URL de redirección o HTML crudo.
- Herramientas/acciones: privilegio mínimo; la autorización la decide el servidor con la identidad del **usuario**, no lo que diga el modelo; confirmación humana para acciones destructivas, pagos o envíos.
- RAG y memoria aislados por usuario/tenant (filtro por `org_id` en la búsqueda vectorial).
- Sin secretos ni datos de otros usuarios en el prompt de sistema.
- Cuotas por usuario, límite de tokens por petición y de longitud de entrada.
- Detalle de clases: [full-audit/AI-AND-LLM.md](full-audit/AI-AND-LLM.md).

## 10. Datos y privacidad

- Guarda lo mínimo. Datos sensibles (salud, documentos, finanzas, menores) → cifrado en reposo del proveedor + acceso registrado + retención definida.
- Logs sin contraseñas, tokens, tarjetas ni PII innecesaria; monitorización (Sentry, etc.) con scrubbing.
- Derecho a exportar y borrar (GDPR, Ley 1581 Habeas Data, LGPD): el borrado alcanza copias derivadas (búsqueda, caché, analítica, embeddings).
- Consentimiento de cookies donde la ley lo pida; analítica privada por defecto. Política de privacidad y términos enlazados en el footer.

## 11. Cliente / navegador

- Tokens de sesión en cookies `HttpOnly`, no en `localStorage`.
- `postMessage`: valida `event.origin` exacto y el formato del mensaje; envía con origen explícito, nunca `"*"`.
- Enlaces externos con `rel="noopener noreferrer"` si usas `target="_blank"`.
- Service workers: no caches respuestas autenticadas compartibles entre usuarios.
- **Apps de escritorio:** Electron con `contextIsolation: true`, `nodeIntegration: false`, `sandbox: true`, preload mínimo y cada mensaje IPC validado; sin cargar URLs remotas en ventanas con privilegios. Tauri con *capabilities* mínimas por ventana. Actualizaciones firmadas. Detalle: [full-audit/DESKTOP-MOBILE-AND-LOCAL-IPC.md](full-audit/DESKTOP-MOBILE-AND-LOCAL-IPC.md).
- **Apps móviles:** secretos fuera del bundle (se pueden extraer), tokens en almacenamiento seguro del sistema (Keychain/Keystore), deep links validados.
- Detalle: [full-audit/CLIENT-SIDE.md](full-audit/CLIENT-SIDE.md).

## 12. Dependencias y CI (cadena de suministro)

- Lockfile versionado; instala con `npm ci` / `pnpm install --frozen-lockfile`.
- `npm audit` / `pnpm audit` / `osv-scanner` en CI; Dependabot o Renovate activos.
- Paquetes con mantenimiento y descargas razonables; revisa nombres (typosquatting) antes de instalar.
- CDN con versión exacta + SRI. Nada de `@latest` en producción.
- GitHub Actions: `permissions:` mínimos, acciones fijadas por SHA, cuidado con `pull_request_target` y con interpolar `${{ github.event.* }}` en `run:`.
- Detalle: [full-audit/SUPPLY-CHAIN-AND-RELEASE.md](full-audit/SUPPLY-CHAIN-AND-RELEASE.md).

## 13. Despliegue

- Entornos separados (dev / preview / prod) con claves distintas; previews protegidos si exponen datos reales.
- Base de datos no accesible públicamente (o con RLS completo si es Supabase/Firebase); reglas de Firebase nunca en modo test.
- Buckets privados por defecto. Backups automáticos y prueba de restauración.
- Claves de proveedor con el menor alcance posible.
- Detalle: [full-audit/CLOUD-AND-DEPLOYMENT.md](full-audit/CLOUD-AND-DEPLOYMENT.md).

## 14. Disponibilidad y coste

- Trabajos pesados (exportes, IA, procesado de imágenes) en colas con límites, no en la petición.
- Límites de concurrencia por usuario; tamaño máximo de archivos y de lotes.
- Detalle: [full-audit/RESOURCE-EXHAUSTION-AND-AVAILABILITY.md](full-audit/RESOURCE-EXHAUSTION-AND-AVAILABILITY.md).

## 15. Base de datos (según la elegida en el paso 2)

Comunes a todas: cadena de conexión solo en servidor, conexión con TLS, usuario de la app con **mínimo privilegio** (sin `DROP`/`ALTER` ni superusuario), migraciones versionadas en el repo, backups automáticos con **restauración probada**, nada de datos reales en desarrollo, y la base de datos nunca abierta a internet salvo que el proveedor la proteja (RLS/reglas).

| Base de datos | Reglas específicas |
|---|---|
| **Supabase (Postgres)** | `enable row level security` en **todas** las tablas del esquema expuesto, con políticas `using` **y** `with check`; `anon` key en cliente solo con RLS; `service_role` solo en servidor; buckets de Storage con políticas; funciones `security definer` con `search_path` fijado; revisa el *Security Advisor* del panel |
| **Postgres gestionado + ORM** (Drizzle, Prisma) | Consultas siempre por el ORM o parametrizadas (`sql\`...${valor}\`` del ORM, nunca `sql.raw`/`$queryRawUnsafe` con entrada); filtro por dueño/tenant en cada consulta; pool de conexiones adecuado a serverless |
| **MySQL / MariaDB** | Igual que Postgres; `sql_mode` estricto; sin `LOAD DATA LOCAL` |
| **SQLite / Turso / D1** | Archivo fuera de carpetas servidas; tokens de Turso/D1 por entorno y con alcance de solo lectura donde se pueda; consultas preparadas |
| **MongoDB** | Valida con esquema (zod) antes de consultar para impedir **inyección de operadores** (`{ "$gt": "" }`); prohíbe `$where` y `$function` con entrada; usuario por app con rol mínimo; lista de IPs/red privada en Atlas |
| **Firebase / Firestore** | Reglas por colección que comprueban `request.auth.uid` y el dueño del documento; **nunca** `allow read, write: if true` ni el modo test; validación de campos en las reglas; App Check activado; reglas también para Storage |
| **CMS** (git o headless) | Login del panel con el proveedor del CMS y 2FA; token de API de solo lectura en el front; deploy hook tratado como secreto |

Pruebas mínimas (E3/E4): un usuario no lee ni edita filas de otro; un rol no hace lo de otro rol; con la `anon` key (o sin sesión) no se lee nada privado.

## 16. Después del lanzamiento

- `/.well-known/security.txt` con un contacto para reportar vulnerabilidades.
- Monitoreo de errores y alertas (E3) revisados cada semana; alertas de facturación activas.
- Dependencias: parches de seguridad en ≤ 7 días (Renovate/Dependabot).
- Rotación de claves cuando sale alguien del equipo o hay sospecha; inventario de secretos en `SECURITY.md`.
- Prueba de restauración de backups cada trimestre.
- Plan de incidentes de `SECURITY.md` §7 conocido por el equipo.
- Repite la revisión guiada (E4 Estándar) tras cambios grandes: nuevo rol, pagos, IA o multi-tenant.

---

## Checklist de lanzamiento

Marca cada punto como ✅ hecho, ➖ no aplica, o ❓ `needs_validation` (depende del hosting/proveedor y no se ve en el código: di qué hay que comprobar).

**Secretos**
- [ ] `.env` fuera del repo; `.env.example` presente; sin claves privadas con prefijo público.
- [ ] Ningún secreto en el bundle (`grep` del build por `sk_`, `service_role`, `-----BEGIN`).

**Auth y acceso**
- [ ] Proveedor de auth probado; cookies `HttpOnly; Secure; SameSite`.
- [ ] Cada endpoint/server action valida entrada **y** autoriza por recurso.
- [ ] Consultas filtradas por dueño/tenant; RLS activo en todas las tablas expuestas.
- [ ] Mensajes uniformes en login/registro/reset; rate limit en ellos.

**Entrada/salida**
- [ ] Sin HTML crudo sin sanitizar; sin SQL concatenado; redirecciones solo internas.
- [ ] Subidas con límite, tipo verificado y almacenamiento privado.
- [ ] Errores genéricos al cliente.

**Navegador**
- [ ] CSP sin `'unsafe-inline'`/`'unsafe-eval'` en `script-src`; HSTS, nosniff, Referrer-Policy, frame-ancestors.
- [ ] CORS con lista blanca; CSRF cubierto en endpoints con cookies.

**Negocio**
- [ ] Precios desde servidor; webhooks firmados e idempotentes.
- [ ] Cuotas en IA/email/SMS y alertas de facturación.
- [ ] Captcha en formularios públicos.

**Operación**
- [ ] Dependencias auditadas; lockfile; CI con permisos mínimos.
- [ ] Backups; entornos separados; previews protegidos.
- [ ] Política de privacidad, términos y (si aplica) consentimiento de cookies.

**Base de datos**
- [ ] Reglas de §15 para la base de datos elegida (RLS / reglas de Firebase / rol mínimo / validación anti-inyección).
- [ ] Test: usuario A no lee ni edita datos de B; sin sesión no se lee nada privado.
- [ ] Restauración de backup probada al menos una vez.

**Después del lanzamiento**
- [ ] `security.txt` publicado; alertas de errores y de facturación activas; plan de incidentes en `SECURITY.md`.
