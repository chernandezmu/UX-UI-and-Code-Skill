# Catálogo de endurecimiento (defensa por clase de ataque)

Este archivo recorre **todas las clases de ataque conocidas** y, para cada una, dice **cómo construir la web o la app para que no funcione**. Es 100% defensivo: no hay payloads ni pasos de explotación, solo la contramedida, la configuración y la comprobación. Es el complemento ofensivo-informado de [secure-by-default.md](secure-by-default.md): aquello da el mínimo por área; esto cierra cada vector concreto.

Cómo usarlo:
- En **E2 (construir)**, aplica la columna "Defensa" de las clases que toque el código que escribes.
- En **E4 (seguridad)**, recórrelo como lista: por cada clase, marca cubierta ✅, no aplica ➖ o pendiente ⬜ en `SECURITY.md`.
- La severidad y el método de validación (límite + resultado, intentar refutar) están en [review.md](review.md); aquí solo está la defensa.

Regla base que mata familias enteras de ataque: **el servidor no confía en nada que venga del cliente** (campos, cabeceras, cookies, orden de parámetros, tipos, IDs, precios, nombres de archivo) y **valida contra un esquema + autoriza por recurso** en cada entrada.

---

## 1. Inyección en el servidor

| Clase de ataque | Defensa al construir |
|---|---|
| **SQLi** | ORM o consultas **parametrizadas** siempre; prohibido concatenar entrada en SQL (`$queryRawUnsafe`, `sql.raw`, template strings en `query()`). Usuario de BD con mínimo privilegio. Validación de tipo antes de la consulta. Nunca construir `ORDER BY`/nombres de columna con entrada: lista blanca. |
| **NoSQL / inyección de operadores** (Mongo) | Valida con esquema (zod) **antes** de consultar para que `{"$gt":""}` o `{"$where":...}` nunca lleguen al driver; castea tipos; prohíbe `$where` y `$function` con entrada; `sanitizeFilter`/validación estricta. |
| **RCE / inyección de comandos** | Nunca pasar entrada a `exec`, `spawn({shell:true})`, `eval`, `new Function`, `child_process` con string. Usa APIs sin shell y argumentos como array. Rutas resueltas y confinadas a un directorio base. |
| **SSTI (plantillas)** | Nunca concatenar entrada de usuario dentro de la plantilla (`render_template_string`, `Template(userInput)`, `compile`). El usuario solo pasa **datos** a una plantilla fija. En frameworks JS: nunca `new Function`/`eval` con contenido de usuario; motores (Handlebars, EJS, Pug) sin `allowProtoPropertiesByDefault`. |
| **Inyección en LDAP / XPath / logs / cabeceras / plantillas de email** | Escapar/parametrizar según el destino; sin saltos de línea de usuario en cabeceras HTTP ni en logs (log injection); emails con plantilla y datos escapados. |
| **Inyección indirecta (segundo orden)** | Dato guardado "limpio" que luego se usa en un sink peligroso: valida también en el punto de uso, no solo al entrar. |

## 2. Inyección y ejecución en el cliente

| Clase de ataque | Defensa al construir |
|---|---|
| **XSS (reflejado, almacenado, DOM)** | El framework escapa por defecto; no lo rompas. `dangerouslySetInnerHTML`, `{@html}`, `v-html`, `set:html`, `innerHTML`, `insertAdjacentHTML` solo con HTML **sanitizado** (DOMPurify / sanitize-html) y configuración restrictiva. Markdown de usuario: renderizador sin HTML crudo. **CSP sin `'unsafe-inline'`/`'unsafe-eval'` en `script-src`** (nonce o hash). Atributos `on*` y `href="javascript:"` nunca desde datos. |
| **Prototype pollution** | No fusionar objetos de usuario con `merge`/`extend` recursivos sin proteger `__proto__`, `constructor`, `prototype`; usa `Object.create(null)` para mapas, `Map`, o librerías seguras; valida claves con esquema. |
| **Clickjacking / UI redress** | `frame-ancestors 'none'` (o lista blanca) en la CSP + `X-Frame-Options: DENY`. Acciones sensibles con confirmación y token. |
| **Open redirect** | Nunca redirigir a una URL que venga del usuario sin validar. Solo rutas internas que empiezan por `/` y no por `//` ni `/\`; o lista blanca de destinos. Igual en `window.location`, `router.push`, cabecera `Location` y en los `returnTo`/`next` de OAuth. |
| **Robo por `postMessage` / `window.opener`** | Valida `event.origin` exacto al recibir; envía con origen explícito, nunca `"*"`. `target="_blank"` siempre con `rel="noopener noreferrer"`. |
| **CSWSH (WebSocket cross-site)** | Comprueba `Origin` en el handshake del WebSocket y exige token; no autentiques solo por cookie. |

## 3. Datos XML, archivos y deserialización

| Clase de ataque | Defensa al construir |
|---|---|
| **XXE** | Desactiva entidades externas y DTD en **todos** los parsers XML (`noent`/`resolve_entities` off, `disallow-doctype-decl`, `FEATURE_SECURE_PROCESSING`). Aplica a XML directo, SOAP, y a archivos que son XML por dentro: **SVG**, `.docx`, `.xlsx`. Prefiere JSON. |
| **Deserialización insegura** | No deserializar formatos que instancian objetos arbitrarios con datos de usuario (`pickle`, Java `readObject`, PHP `unserialize`, `yaml.load` inseguro, .NET `BinaryFormatter`). Usa JSON con esquema; `yaml.safe_load`. Firma/МAC los datos que viajan por el cliente (cookies de sesión, tokens de estado). |
| **Subida de archivos** | Límite de tamaño; tipo comprobado por **contenido** (magic bytes), no por extensión ni `Content-Type`; nombre aleatorio generado por el servidor; guardar **fuera del webroot** (S3/R2/Supabase Storage) con URLs firmadas y caducidad; nunca servir SVG/HTML subido desde tu dominio principal (dominio de assets aparte o `Content-Disposition: attachment` + `Content-Type` fijo); reescala/reencoda imágenes; antivirus si procede. |
| **Zip slip / path traversal al extraer o leer** | Al descomprimir o construir rutas, resuelve y verifica que la ruta final queda dentro del directorio base; rechaza `..`, rutas absolutas, enlaces simbólicos y bytes nulos. |

## 4. HTTP, proxy y API

| Clase de ataque | Defensa al construir |
|---|---|
| **Request smuggling / desincronización** | No escribas tu propio parser HTTP. Usa un runtime y un proxy que rechacen mensajes con `Content-Length` **y** `Transfer-Encoding` a la vez; HTTP/2 de extremo a extremo donde se pueda; mismo servidor/CDN bien configurado (no degradar a HTTP/1.1 ambiguo). Es sobre todo config de hosting → `needs_validation` si no se ve en el repo. |
| **HTTP Parameter Pollution** | Decide un comportamiento explícito ante parámetros duplicados (primero, último o rechazar) y que **frontend y backend coincidan**; valida con esquema que colapsa duplicados; no construyas peticiones a terceros concatenando parámetros de usuario. |
| **Cache poisoning / deception** | No metas cabeceras no confiables en la clave de caché; marca privado lo autenticado (`Cache-Control: private, no-store`); el CDN nunca cachea respuestas con cookie de sesión; cuidado con `X-Forwarded-Host`/`X-Forwarded-Scheme` reflejados. |
| **SSRF** | Si el servidor pide una URL dada por el usuario (previews, webhooks entrantes, importadores, avatar por URL): lista blanca de hosts; **bloquea** IPs privadas, loopback, link-local y `169.254.169.254` (metadata de la nube); resuelve el DNS y valida la IP final; no sigas redirecciones a otros hosts; timeout y tamaño máximo; token de metadata IMDSv2 en AWS. |
| **Abuso de API / BOLA / BFLA** | Autorización **por objeto** en cada endpoint (no solo "está logueado"): "¿este usuario puede esta acción sobre este recurso?". IDs difíciles de adivinar (UUID) no sustituyen la autorización. Operaciones masivas, export, import, búsqueda y filtros aplican permiso por ítem. Versiona y documenta; cierra endpoints internos/debug. |
| **Mass assignment** | Lista blanca de campos editables por el usuario; nunca `update(req.body)` directo. `role`, `isAdmin`, `orgId`, `userId`, `price`, `status`, `credits` jamás desde el cliente. |
| **GraphQL** | Desactiva **introspección** en producción; límite de **profundidad** y de **complejidad/costo** de consulta; desactiva o limita **batching** y **alias** (anti brute-force y DoS); autorización por campo y por nodo (no confíes en IDs de Relay); errores sin stack ni sugerencias de campos; subida multipart con los mismos límites de §3; auth en subscriptions por WebSocket. |

## 5. Autenticación y sesión

| Clase de ataque | Defensa al construir |
|---|---|
| **JWT (alg:none, confusión RS256↔HS256, `kid`/`jku`/`jwk` inyectados, secreto débil)** | Usa una librería mantenida y **fija el algoritmo esperado** al verificar (no leas `alg` del token); nunca aceptes `none`; secreto HMAC largo y aleatorio o claves asimétricas desde JWKS **de confianza fija** (no desde `jku`/`x5u` del token); valida `iss`, `aud`, `exp`, `nbf`; caducidad corta + refresh con rotación; revocación por lista o por versión de sesión. Mejor aún: sesiones del lado servidor en cookie para apps web. |
| **OAuth/OIDC (robo de código, redirect, CSRF de login, mezcla de cuentas)** | `state` + **PKCE** siempre; `redirect_uri` en lista blanca exacta; valida `iss`/`aud` del id_token y el `nonce`; vincula cuentas solo por email **verificado**; no confíes en el email sin `email_verified`. |
| **Fijación / robo de sesión** | Cookies `HttpOnly; Secure; SameSite=Lax` (o `Strict`); **rota** el id de sesión al iniciar sesión y al subir privilegios; invalida en servidor al cerrar sesión y al cambiar contraseña; caducidad e inactividad. Tokens de sesión nunca en `localStorage`. |
| **Credential stuffing / fuerza bruta / enumeración de usuarios** | Rate limit por IP **y** por cuenta en login, registro, reset, OTP, magic link; captcha no intrusivo (Turnstile/hCaptcha); respuestas y tiempos **uniformes** ("si la cuenta existe, te enviamos un correo"); bloqueo temporal progresivo; comprobación contra contraseñas filtradas. |
| **Reset / magic link / OTP** | Tokens aleatorios criptográficos, de un solo uso, caducidad corta (≤30 min), ligados al usuario; OTP con intentos limitados y sin poder forzar por batching; no revelar si el destino existe. |
| **MFA / passkeys** | Ofrécelos para cuentas con datos sensibles o admin; permite gestores de contraseñas y pegar (`autocomplete` correcto); alternativa no cognitiva (WCAG 2.2). |

## 6. Lógica de negocio y concurrencia

| Clase de ataque | Defensa al construir |
|---|---|
| **Condiciones de carrera / TOCTOU (doble gasto, doble canje, saldo negativo)** | Operaciones "comprobar y actuar" **atómicas**: transacción con bloqueo de fila (`SELECT ... FOR UPDATE`), restricción única, o decremento condicional (`UPDATE ... WHERE saldo >= x`). Idempotencia por clave en operaciones de dinero. No confíes en comprobar y luego escribir en dos pasos. |
| **Violación de máquina de estados** | Cada transición valida el estado de origen en el servidor (`cart→shipped` sin `paid` imposible); no permitas saltar ni repetir pasos; reversa consistente ante fallo parcial. |
| **Manipulación numérica / de precios / cupones** | Precios, descuentos, cantidades y totales se calculan **en el servidor** desde IDs de producto; rechaza negativos, cero, overflow y strings que coaccionan a número; un cupón por pedido salvo que el diseño lo permita; límites de cantidad. |
| **Abuso de funciones (export/import/preview/search como oráculo)** | Export/backup respeta el nivel de acceso del que lo pide (no incluye datos de otros, borradores ni historial no permitido); import respeta el mismo modelo de permisos que la UI; búsqueda/filtro/orden no revelan existencia ni campos ocultos; tokens de preview acotados a un ítem. |
| **Anti-automatización / abuso de cuota** | Rate limit y cuotas por usuario/día en acciones caras; detección de patrones; límites de concurrencia. |

## 7. Pagos

| Clase de ataque | Defensa al construir |
|---|---|
| **Manipulación de importe / webhook falso / replay** | Importe y producto solo desde el servidor (IDs de precio del proveedor), nunca el valor del cliente; **verifica la firma** del webhook sobre el cuerpo crudo; **idempotencia** por `event.id`; rechaza eventos viejos; confirma el estado con la API del proveedor antes de dar acceso; el acceso premium se decide por el estado guardado por el webhook, no por el `?success=true` de la URL. |

## 8. Criptografía y secretos

| Clase de ataque | Defensa al construir |
|---|---|
| **Cripto rota (ECB, IV estático, sin autenticar, nonce reusado)** | Usa primitivas de alto nivel (libsodium/`crypto.subtle`); cifrado **autenticado** (AES-GCM, XChaCha20-Poly1305); nunca ECB; IV/nonce aleatorio por mensaje; no inventes esquemas. Contraseñas con Argon2id o bcrypt coste ≥12, nunca hash simple. |
| **Aleatoriedad débil** | Valores de seguridad (tokens, claves, nonces, ids de sesión) con CSPRNG (`crypto.randomBytes`, `crypto.getRandomValues`), nunca `Math.random`. |
| **Secretos expuestos** | `.env` fuera del repo; nada privado con prefijo público (`NEXT_PUBLIC_`, `VITE_`, `PUBLIC_`, `NUXT_PUBLIC_`); claves de servicio solo en servidor (`import "server-only"`); sin secretos en logs, errores, URLs, analítica ni prompts; rota si se filtran; escaneo de secretos en el repo y el build. |
| **Comparación con fuga por tiempo** | Compara secretos/tokens/firmas con comparación en tiempo constante (`crypto.timingSafeEqual`). |
| **TLS** | HTTPS en todo; HSTS con `includeSubDomains`; nunca `rejectUnauthorized:false` ni `NODE_TLS_REJECT_UNAUTHORIZED=0`; TLS 1.2+; redirección de HTTP a HTTPS. |

## 9. IA / LLM (si el producto usa modelos)

| Clase de ataque | Defensa al construir |
|---|---|
| **Inyección de prompt (directa e indirecta)** | Todo lo que entra al modelo desde fuera (mensajes, documentos, páginas, resultados de herramientas, memoria, RAG) es **no confiable** y puede contener instrucciones; sepáralo del prompt de sistema y no le des autoridad. |
| **Salida del modelo usada como código** | La salida es **no confiable**: renderízala como texto o Markdown sanitizado; nunca la ejecutes ni la uses como SQL, ruta, URL de redirección, HTML crudo o comando. |
| **Herramientas/acciones del agente** | Privilegio mínimo; la autorización la decide el servidor con la identidad del **usuario**, no lo que diga el modelo; confirmación humana para acciones destructivas, pagos o envíos. |
| **Fuga entre usuarios en RAG/memoria** | Aísla el contexto por usuario/tenant (filtro por `org_id` en la búsqueda vectorial); sin secretos ni datos de terceros en el prompt de sistema. |
| **Coste / DoS por tokens** | Cuotas por usuario, límite de tokens por petición y de longitud de entrada; timeouts. |

Detalle: [full-audit/AI-AND-LLM.md](full-audit/AI-AND-LLM.md).

## 10. Nube, contenedores y despliegue

| Clase de ataque | Defensa al construir |
|---|---|
| **IAM / roles demasiado amplios** | Rol con mínimo privilegio por servicio; nada de `*:*`; claves de proveedor con alcance acotado; sin credenciales de larga vida en el código (usa OIDC/roles). |
| **Buckets / BD públicos** | Buckets privados por defecto; BD no accesible desde internet (o RLS/reglas completas si es Supabase/Firebase); reglas de Firebase nunca en modo test; `anon` key solo con RLS. |
| **Escape de contenedor / K8s** | Contenedor no root, sin privilegios, sistema de archivos de solo lectura donde se pueda; sin montar el socket de Docker; secretos por el gestor, no en la imagen; `securityContext` restrictivo; imágenes base mínimas y escaneadas. (Config de despliegue → a menudo `needs_validation`.) |
| **Config de runtime filtrada** | Sin endpoints de debug/administración expuestos; sin stack traces al cliente; cabeceras que revelan versión apagadas; separación dev/preview/prod con claves distintas; previews protegidos si muestran datos reales. |

Detalle: [full-audit/CLOUD-AND-DEPLOYMENT.md](full-audit/CLOUD-AND-DEPLOYMENT.md).

## 11. Cadena de suministro y CI/CD

| Clase de ataque | Defensa al construir |
|---|---|
| **Confusión de dependencias / typosquatting** | Lockfile versionado; instala con `--frozen-lockfile`/`npm ci`; revisa nombres antes de instalar; scopes privados configurados para no resolver contra el registro público; evita paquetes abandonados o sin parche. |
| **Dependencia vulnerable** | `npm/pnpm audit` u `osv-scanner` en CI; Renovate/Dependabot; parches de seguridad en ≤7 días. |
| **CDN comprometido** | Scripts de CDN con versión fija + **SRI** + `crossorigin`, o self-host; solo orígenes de confianza en la CSP; nada de `@latest` en producción. |
| **CI comprometido / secretos en CI** | `permissions:` mínimos por job; acciones fijadas por SHA; cuidado con `pull_request_target` y con interpolar `${{ github.event.* }}` en `run:`; secretos solo en los jobs que los usan; sin imprimir secretos en logs; protección de ramas y entornos. |
| **Firma / release** | Artefactos y actualizaciones (escritorio/móvil) firmados; procedencia verificable donde aplique. |

Detalle: [full-audit/SUPPLY-CHAIN-AND-RELEASE.md](full-audit/SUPPLY-CHAIN-AND-RELEASE.md).

## 12. Escritorio, móvil e IPC local (si aplica)

| Clase de ataque | Defensa al construir |
|---|---|
| **Electron** | `contextIsolation:true`, `nodeIntegration:false`, `sandbox:true`, preload mínimo, cada mensaje IPC validado; no cargues URLs remotas en ventanas con privilegios; CSP también en la app. |
| **Tauri** | *Capabilities* mínimas por ventana; comandos expuestos validados; `allowlist` acotada. |
| **Móvil** | Secretos **fuera del bundle** (se extraen); tokens en el almacén seguro del sistema (Keychain/Keystore), no en almacenamiento plano; deep links y esquemas validados; certificate pinning si procede; sin datos sensibles en logs. |
| **Deep links / componentes exportados / webview bridges** | Valida el origen y el destino; no expongas componentes internos; el bridge de webview no da acceso a APIs nativas sin comprobación. |

Detalle: [full-audit/DESKTOP-MOBILE-AND-LOCAL-IPC.md](full-audit/DESKTOP-MOBILE-AND-LOCAL-IPC.md).

## 13. Disponibilidad y abuso de recursos

| Clase de ataque | Defensa al construir |
|---|---|
| **DoS por entrada (ReDoS, zip bomb, depth bomb, payload enorme)** | Límite de tamaño de body y de archivo; regex sin retroceso catastrófico (o timeouts); límite de profundidad al parsear JSON/XML/GraphQL; descompresión con límite de tamaño de salida. |
| **Agotamiento de trabajo compartido** | Trabajos pesados (export, IA, imágenes) en colas con límite y reintentos, no en la petición; concurrencia por usuario; paginación con máximo; timeouts en llamadas externas. |

Detalle: [full-audit/RESOURCE-EXHAUSTION-AND-AVAILABILITY.md](full-audit/RESOURCE-EXHAUSTION-AND-AVAILABILITY.md).

## 14. Aislamiento de datos y ciclo de vida

| Clase de ataque | Defensa al construir |
|---|---|
| **Fuga entre tenants / IDOR horizontal** | Filtra por dueño/tenant **en la consulta** (`WHERE id=$1 AND org_id=$2`), no después; misma respuesta a "no existe" y "no es tuyo" (404); `org_id` en cada tabla, índice, caché y clave de almacenamiento; RLS por tenant; **test de aislamiento** automatizado. |
| **Borrado incompleto** | Borrar/exportar alcanza copias derivadas (búsqueda, caché, analítica, embeddings, backups según política); respeta el derecho a borrar y exportar (GDPR, Ley 1581, LGPD). |
| **Fuga por derivados** | Analítica, búsqueda, sugerencias y exportes no exponen datos por encima del nivel del usuario. |

Detalle: [full-audit/DATA-ISOLATION-AND-LIFECYCLE.md](full-audit/DATA-ISOLATION-AND-LIFECYCLE.md).

## 15. Exposición de información y factor humano (defensa del producto)

| Clase de ataque | Defensa al construir |
|---|---|
| **OSINT / recon** | No publiques secretos, rutas internas, versiones, correos de administración ni stack traces; `robots`/sitemap sin rutas privadas; metadatos de documentos limpios; mensajes de error genéricos. |
| **Phishing contra tus usuarios** | Dominio con **SPF, DKIM y DMARC**; correos transaccionales que no piden contraseña ni enlazan a dominios raros; marca clara; educar en el propio producto; subdominios sin colgar (evita takeover). |
| **WAF como única defensa** | El WAF es una capa extra, **no** la defensa principal: nunca dependas de él para tapar inyección o autorización; el código debe ser seguro aunque el WAF no exista. |

---

## Lista rápida para E4 (marca cada una)

Inyección servidor ⬜ · XSS/CSP ⬜ · prototype pollution ⬜ · clickjacking ⬜ · open redirect ⬜ · postMessage ⬜ · XXE ⬜ · deserialización ⬜ · subida de archivos ⬜ · path traversal/zip slip ⬜ · request smuggling ⬜ · HPP ⬜ · cache ⬜ · SSRF ⬜ · BOLA/BFLA (autz por objeto) ⬜ · mass assignment ⬜ · GraphQL ⬜ · JWT/sesión ⬜ · OAuth ⬜ · fuerza bruta/enumeración ⬜ · reset/OTP ⬜ · carrera/TOCTOU ⬜ · máquina de estados ⬜ · precios ⬜ · abuso de funciones ⬜ · pagos/webhooks ⬜ · cripto/secretos/TLS ⬜ · IA/LLM ⬜ · IAM/buckets ⬜ · contenedor/K8s ⬜ · dependencias/CDN ⬜ · CI/CD ⬜ · escritorio/móvil ⬜ · DoS/recursos ⬜ · aislamiento de tenants ⬜ · borrado/privacidad ⬜ · exposición/phishing ⬜

Lo que no se puede ver desde el código (config de proxy, hosting, proveedor) va como `needs_validation` en `SECURITY.md` con la comprobación exacta.
