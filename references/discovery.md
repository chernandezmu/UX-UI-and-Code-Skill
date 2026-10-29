# Arranque guiado (E0 · paso a paso)

Antes de diseñar o programar, la skill hace **siempre** estos 10 pasos, **en este orden**. El objetivo es que el proyecto quede bien formado y que el usuario nunca se pierda: cada turno trata **un solo tema** y dice en qué paso va (`Paso 3 de 10 · Diseño`).

| # | Tema | # | Tema |
|---|---|---|---|
| 1 | Tipo de proyecto, mercado y elementos | 6 | Logo y recursos |
| 2 | **Tecnología: framework, base de datos y hosting** | 7 | Apartados y secciones |
| 3 | Diseño (subir el propio o estilo prediseñado) | 8 | De qué trata el proyecto |
| 4 | Colores | 9 | Público y enfoque |
| 5 | Tipografías | 10 | **Seguridad** y extras |

Reglas:
- **Idioma:** pregunta y responde en el idioma del usuario (este archivo está en español, pero las preguntas se traducen).
- **Salta lo que ya está claro.** Si el prompt o el repo ya responde un paso (p. ej. `package.json` dice el framework), no lo preguntes: confírmalo en una línea ("Entendido: Next.js 16 con Supabase, detectado en el repo") y pasa al siguiente.
- **Un tema por turno**, 1–3 preguntas como máximo, con opciones y la **recomendada primero**. El usuario siempre puede escribir otra respuesta. Usa la herramienta de preguntas de tu plataforma (p. ej. `AskUserQuestion`, máximo 4 opciones por pregunta) o una lista numerada.
- **Las opciones dependen de lo ya respondido.** El paso 1 decide qué opciones se muestran en los demás (tablas al final).
- **Atajo:** al terminar el paso 1 ofrece una vez: *"¿Seguimos paso a paso (recomendado) o prefieres que decida el resto con recomendaciones y te muestre el resumen para corregir?"*. Si elige el atajo, rellena los pasos 2–10 con defaults, márcalos como **Supuesto** y ve directo al resumen. Los pasos 3 (si tiene diseño propio) y 10 (si hay login, pagos o datos sensibles) se preguntan igual.
- **"Decide tú"** en cualquier paso → default de ese paso, anotado como **Supuesto**.
- **Contradicciones** (p. ej. "portafolio" + "varias organizaciones", o "solo frontend" + "login de usuarios"): acláralas con una sola pregunta antes de seguir.
- Al terminar el paso 10: resumen de 5–8 líneas + "¿Está correcto o quieres cambiar algo?". Con la confirmación, escribe `PROJECT-BRIEF.md` y `SECURITY.md`, y pasa a la planificación ([stages/0-planning.md](stages/0-planning.md)).

---

## Paso 1 · ¿Qué tipo de proyecto quieres hacer?

Solo si el prompt no lo dice. Pregunta el **tipo**, el **mercado** y los **elementos principales**. Como las herramientas de preguntas muestran máximo 4 opciones, pregunta en dos niveles:

**1a · Categoría**

| Categoría | Incluye (1b) |
|---|---|
| **Sitio web** | Landing para tu empresa o producto · Portafolio · Web de contenido (blog, revista, docs) · Web de estudio o datos |
| **App o plataforma web** | SaaS · Gestión de negocio (CRM, inventario, reservas, facturación) · Panel interno · Marketplace |
| **App móvil o de escritorio** | iOS/Android · PWA · Windows/macOS/Linux |
| **Tienda online** | E-commerce · Catálogo con pedidos · Reservas pagadas |

**1b · Tipo concreto** dentro de la categoría elegida.

| Tipo | Ruta que activa |
|---|---|
| Landing de empresa o producto | Una página o pocas · catálogo/identidad libre |
| Portafolio | Identidad noir sugerida · casos de estudio |
| App / plataforma / gestión de negocio | Identidad producto shadcn · auth + dashboard |
| App móvil | Reglas nativas ([ux/native-app-rules.md](ux/native-app-rules.md)) |
| App de escritorio | Tauri o Electron + UI web |
| Tienda / marketplace | Pagos + catálogo |
| Web de contenido | CMS |
| Web de estudio o datos | Visualización de datos (`--domain chart`) |

**1c · Mercado / sector:** "¿Para qué mercado o sector es?" (salud, educación, finanzas, restaurantes, inmobiliaria, tecnología, moda, gobierno, ONG…). Alimenta el motor de diseño.

**1d · Elementos principales** (multi, según el tipo): formularios · pagos · login de usuarios · panel de administración · blog · reservas/agenda · chat o IA · mapas · gráficos de datos · multi-idioma · galería/video · subida de archivos.

Default: landing page para empresa.

## Paso 2 · Tecnología: framework, base de datos y hosting

Justo después del tipo, porque condiciona diseño, componentes y seguridad. Si el repo ya lo dice, confírmalo y salta. Las opciones se filtran por el tipo del paso 1 (tabla "Defaults técnicos por tipo"); la recomendada va primero.

**2a · ¿Con qué framework?**

| Tipo | Opciones (recomendada primero) |
|---|---|
| Landing · portafolio · contenido · estudio | **Astro** · Next.js · SvelteKit · HTML/CSS/JS sin framework |
| App web · gestión de negocio · SaaS · tienda | **Next.js** · React (Vite) + TanStack · SvelteKit · Nuxt (Vue) · Laravel + Inertia · Angular |
| App móvil | **Expo (React Native)** · Flutter · Nativo (SwiftUI / Jetpack Compose) · PWA |
| App de escritorio | **Tauri** · Electron · Flutter desktop |
| Siempre | "Recomiéndame" · "Ya tengo un proyecto" (detectar) · Otro |

Si hay backend separado, pregunta también: rutas del propio framework (recomendado) · NestJS · Express/Hono · Laravel · Django/FastAPI · Otro.

**2b · ¿Va a manejar base de datos? ¿Cuál?**

| Opción | Cuándo | Lo que activa en seguridad |
|---|---|---|
| **No necesita** (solo frontend) | Landing, portafolio sin panel, contenido en archivos | Formularios a un servicio externo con captcha y rate limit |
| **PostgreSQL con Supabase** (recomendada para MVPs) | Auth + datos + archivos en uno | **RLS en todas las tablas**, `service_role` solo en servidor |
| **PostgreSQL** gestionado (Neon, Railway, RDS…) + ORM (Drizzle/Prisma) | Control total del backend | Rol con mínimo privilegio, conexión TLS, consultas parametrizadas |
| **MySQL / MariaDB** (PlanetScale, propio) | Equipos PHP/Laravel o existente | Ídem |
| **SQLite / Turso / Cloudflare D1** | Apps pequeñas, edge, escritorio | Archivo fuera de carpetas públicas, tokens por entorno |
| **MongoDB** (Atlas) | Documentos flexibles | Inyección de operadores (`$where`, `$gt`) bloqueada con validación de esquema, red restringida |
| **Firebase / Firestore** | Móvil y tiempo real | **Reglas de seguridad** por colección (nunca modo test) |
| **CMS** (git o headless) | Contenido editable sin base de datos propia | Login del panel, deploy hook secreto |
| **Ya tengo una** | Existente | Revisar permisos y conexión en E4 |

**2c · ¿Dónde se publica?** (solo si el usuario quiere elegir; si no, default por tipo): **Vercel** · **Cloudflare** · Netlify · Render/Railway/Fly · VPS propio · Tiendas de apps (móvil) · Instalador propio (escritorio).

Default del paso: el de la tabla "Defaults técnicos por tipo".

## Paso 3 · ¿Qué tipo de diseño quieres?

**3a · ¿Ya tienes diseño?**

| Opción | Qué hace la skill |
|---|---|
| **No, quiero elegir un estilo** (recomendada si no hay nada) | Sigue a 3b |
| **Sí, tengo diseño o manual de marca** | **Pausa.** Pide que suba o pegue todo: capturas o exportes, enlace de Figma/Claude Design/Stitch, PDF del manual, `DESIGN.md`, logo, colores y fuentes. Espera. Cuando llegue, extrae colores, fuentes, radios y estilo, muéstralos en una lista para confirmar y **salta los pasos 4–6** que ya queden resueltos |
| **Tengo referencias que me gustan** | Pide 1–3 enlaces o capturas. Se usan para calibrar el estilo, **nunca para copiar** marca ni contenido. Sigue a 3b con un estilo propuesto |

**3b · Estilos prediseñados.** Primero la familia, después el estilo (así nunca hay más de 4 opciones a la vez):

| Familia | Estilos | Identidad / consulta del motor |
|---|---|---|
| **Limpio y profesional** | Minimalista · Corporativo · Bento (tarjetas en cuadrícula) · Suizo (rejilla y tipografía) | Producto shadcn o catálogo `minimalism swiss` / `bento grid` |
| **Editorial y de autor** | Noir editorial (oscuro, tipografía gigante, cinemático) · Revista · Lujo y elegante · Barroco / ornamental (serif clásica, ornamentos, dorados, mucho detalle) | [noir-editorial.md](identities/noir-editorial.md) · catálogo `editorial grid magazine` / `luxury exaggerated minimalism` / `vintage ornamental serif` |
| **Audaz y expresivo** | Brutalista · Neubrutalismo (bordes gruesos, colores planos) · Futurista / cyberpunk · Retro / Y2K | catálogo `brutalism` / `neubrutalism` / `cyberpunk hud` / `y2k retro` |
| **Suave y cercano** | Orgánico / natural · Claymorphism (3D suave, juguetón) · Soft UI · Glass / Aurora (degradados sutiles, tech) | catálogo `organic biophilic` / `claymorphism` / `soft ui` / `aurora glassmorphism` |

Default: la familia que recomiende el motor para el tipo y el mercado del paso 1 (`node <SKILL_DIR>/tools/design-intel/run.mjs "<tipo> <mercado>" --design-system`).

**3c · Modo y movimiento** (en la misma pregunta o la siguiente):
- **Modo:** claro y oscuro (default) · solo claro · solo oscuro (noir: oscuro).
- **Movimiento:** **Mínimo** (casi estático, máxima velocidad) · **Estándar** (transiciones suaves y reveals) · **Cinemático** (preloader, scroll pinneado, transiciones de página, cursor propio). Default: cinemático en noir y portafolios, estándar en el resto, mínimo en apps de gestión.

De aquí salen los *dials* del motor: movimiento → `--motion` (mínimo 2, estándar 5, cinemático 9); familia audaz → `--variance` 8, limpia → 3; apps de gestión y dashboards → `--density` 8, landings y portafolios → 3.

## Paso 4 · Colores

"Escribe los colores que quieres usar" (hex, nombres como "azul marino y dorado", o "los de mi logo").

| Opción | Qué hace la skill |
|---|---|
| **Los escribo yo** | Convierte cada color a tokens (`--primary`, `--background`, `--foreground`, `--muted`, `--border`…), propone los que falten y comprueba contraste 4.5:1 / 3:1 en claro y oscuro. Si un par no pasa, propone el ajuste mínimo |
| **Recomiéndame según el estilo** (recomendada si no tiene) | Paleta del motor para su tipo + mercado + estilo; muestra 2–3 opciones con nombre y hex |
| **Usa los de mi logo** | Extrae los colores del logo (paso 6) y continúa |

Reglas:
- Un solo color de acento para CTAs y foco.
- Si el modo es **solo oscuro** y el motor devuelve paletas claras (es lo habitual), conserva sus tonos y **deriva la versión oscura** (fondo casi negro con el matiz del primario, texto claro, acento aclarado); muestra el contraste de cada opción.
- Si hay **gráficos**, incluye la paleta de datos (4–5 colores distinguibles, ≥ 3:1 contra el fondo, seguros para daltonismo) en las opciones.

## Paso 5 · Tipografías

| Opción | Qué hace la skill |
|---|---|
| **Recomiéndame** (recomendada) | 3 pares tipográficos acordes al estilo (título + texto, y mono si aplica) del motor (`--domain typography`), con una línea de carácter cada uno |
| **Ya tengo mis fuentes** | Que las escriba. Si son de pago, pide los archivos o propone un sustituto gratuito parecido (Google Fonts / Fontsource) y dilo |
| **Elijo de Google Fonts** | Que escriba los nombres; se valida que existan |

Regla: máximo 3 familias.

## Paso 6 · Logo y recursos de marca

| Opción | Qué hace la skill |
|---|---|
| **Lo subo ahora** | Pausa y pide el logo (SVG ideal; PNG sirve) y otros recursos (fotos, iconos, video) |
| **Lo dejo para el final** (recomendada si no lo tiene listo) | Usa un wordmark de texto con la tipografía elegida como marcador y lo anota como pendiente en `ROADMAP.md` |
| **No tengo logo** | Wordmark tipográfico con la marca como solución definitiva (y se puede encargar después) |

SVG subido por el usuario: se usa como archivo estático o se limpia (sin `<script>`, sin `on*=`, sin enlaces externos) antes de incrustarlo en línea.

## Paso 7 · Apartados y secciones

"¿Qué apartados quieres que tenga?" Muestra las secciones típicas **de su tipo** (tabla al final) como opciones multi, con las recomendadas marcadas, y deja escribir otras. Los **elementos del paso 1** (galería, contacto, blog…) deben tener su sección: si el usuario no la elige, pregunta si la agregas. Pregunta también si es **una sola página** o **varias páginas**.

## Paso 8 · ¿De qué trata el proyecto?

Solo si aún no está claro. "Cuéntame en 2–3 frases de qué trata: qué hace, qué lo hace diferente y qué quieres que la gente sienta al verlo." Con esto se fija el **formato** (una página o multipágina, web o app, tono del copy) y se escriben los textos reales.

## Paso 9 · Público y enfoque

| Pregunta | Ejemplos |
|---|---|
| ¿Para quién es? | Clientes B2B, jóvenes 18–25, pacientes, inversionistas, reclutadores, comunidad académica |
| ¿Qué quieres lograr o mostrar? | Conseguir clientes, vender, mostrar trabajo, informar, captar inversión, mostrar resultados |
| ¿Es un **estudio o investigación** que necesita mostrar datos? | Sí → ¿qué datos (tablas, encuestas, series en el tiempo, mapas)?, ¿en qué formato los tienes (CSV, Excel, API)?, ¿deben ser interactivos?, ¿hay datos personales que anonimizar? Activa visualización de datos y la regla de tabla alternativa accesible. Si el formato no encaja con la base de datos del paso 2 (p. ej. CSV pero eligió Supabase), pregunta para qué se usará la base de datos |
| ¿Dónde lo verán más? | Móvil · computador · ambos (default: móvil primero) |
| ¿En qué idioma(s)? | Default: el del usuario |
| ¿En qué país están los usuarios? | Define la ley de datos aplicable (GDPR, Ley 1581 Habeas Data, LGPD, CCPA…) |

## Paso 10 · Seguridad y extras

La seguridad se pregunta aunque el usuario no la mencione: cambia la arquitectura. Si el paso 2 dijo "sin base de datos", confirma solo lo que aplique (formularios, panel).

**10a · ¿Cómo entran los usuarios?** (si hay login): Magic link / código por email (recomendada) · Email + contraseña · Google/GitHub/Apple (OAuth) · Passkeys · SSO empresarial · Sin login.

**10b · ¿Qué hay que proteger?** (multi)

| Opción | Consecuencia |
|---|---|
| Solo formularios de contacto | Rate limit + captcha + validación en servidor + aviso de privacidad |
| Cuentas de usuario | Auth probado, sesiones seguras, recuperación de cuenta sin enumeración |
| Roles (admin, editor, cliente…) | Matriz de permisos en servidor; pruebas de que un rol no hace lo de otro |
| Pagos | Precios desde servidor, webhooks firmados e idempotentes |
| Datos sensibles (salud, finanzas, documentos, menores) | Cifrado, retención, registro de accesos, seguridad **Completa** recomendada |
| Varias empresas/clientes con datos separados | Aislamiento por tenant desde el día 1, tests de aislamiento |
| Funciones de IA | Entrada y salida no confiables, cuotas, herramientas con mínimo privilegio |
| Subida de archivos | Tipo y tamaño verificados, almacenamiento privado, URLs firmadas |

**10c · Profundidad de seguridad** (se propone según 10b): Básico (checklist) · **Estándar** (checklist + revisión guiada) · Completo (auditoría de 6 fases).

**10d · ¿Algo más que quieras destacar que no te haya preguntado?** Texto libre: integraciones, fecha límite, presupuesto, animaciones especiales, accesibilidad, referencias.

Con las respuestas de los pasos 2, 9 y 10 se escribe [../templates/SECURITY.md](../templates/SECURITY.md) (modelo de amenazas breve). Los mínimos de [security/secure-by-default.md](security/secure-by-default.md) van **siempre**, se elija lo que se elija.

---

## Tablas por tipo de proyecto

### Secciones sugeridas (paso 7)

| Tipo | Recomendadas | Opcionales |
|---|---|---|
| Landing de empresa | Hero · Servicios/beneficios · Cómo funciona · Prueba social (logos, testimonios) · CTA final · Contacto · Footer legal | Precios · FAQ · Equipo · Blog · Casos de éxito |
| Portafolio | Hero con nombre/wordmark · Proyectos destacados · Índice de proyectos + caso de estudio · Sobre mí / experiencia · Contacto | Servicios · Testimonios · Blog/notas · CV descargable |
| App / gestión de negocio | Login/registro · Dashboard · Listados con filtros (clientes, productos, citas…) · Detalle/edición · Ajustes y perfil · Roles | Facturación · Reportes · Notificaciones · Importar/exportar · Onboarding |
| App móvil | Onboarding · Inicio · Navegación inferior (≤ 5) · Perfil · Ajustes | Notificaciones · Pagos · Modo offline |
| App de escritorio | Ventana principal · Barra lateral · Preferencias · Atajos de teclado | Sincronización · Actualizaciones automáticas |
| Tienda / marketplace | Home · Catálogo con filtros · Producto · Carrito · Checkout · Cuenta · Pedidos | Reseñas · Wishlist · Panel de vendedor |
| Web de contenido | Home · Listado de artículos · Artículo · Categorías · Buscador · Newsletter | Autores · Comentarios |
| Web de estudio / datos | Resumen del estudio · Metodología · Resultados con gráficos · Tablas descargables · Conclusiones · Equipo/autores · Contacto | Comparador interactivo · Mapa · Descarga del informe (PDF) |

Siempre, aunque no se pregunte: 404, política de privacidad y términos si hay datos o formularios, y estados vacío/carga/error.

### Defaults técnicos por tipo (paso 2)

| Tipo | Framework | Base de datos / back | Hosting | Identidad sugerida |
|---|---|---|---|---|
| Landing | Astro | Ninguna; formularios a servicio o función serverless | Cloudflare / Vercel | Catálogo por mercado |
| Portafolio | Astro | Ninguna, o CMS basado en git (Keystatic, Decap, TinaCMS) si quiere panel | Cloudflare / Vercel | Noir editorial |
| App / gestión | Next.js + shadcn/ui | Supabase (Postgres) o Postgres + Drizzle, auth probado | Vercel | Producto shadcn |
| App móvil | Expo (React Native) | Supabase o Firebase | Tiendas de apps (EAS) | Producto + reglas nativas |
| App de escritorio | Tauri + React/shadcn | SQLite local o API | Instalador firmado | Producto shadcn |
| Tienda | Next.js + shadcn/ui | Postgres + Stripe/Mercado Pago, o Shopify headless | Vercel | Catálogo |
| Contenido | Astro | CMS (git o headless) | Cloudflare / Netlify | Catálogo / editorial |
| Estudio / datos | Astro o Next.js + librería de gráficos | Datos estáticos (CSV/JSON) o Postgres de solo lectura | Cloudflare / Vercel | Editorial o producto |

### Del brief a las decisiones

| Respuesta | Decisión automática |
|---|---|
| App / gestión / SaaS | Producto shadcn · density 7–8 · Sidebar + Card + Table + Chart |
| Portafolio / lanzamiento | Noir sugerido · motion 8 · preloader + transiciones |
| Landing de un sector concreto | Catálogo: `--design-system` con el sector |
| Waitlist | Una página + formulario con doble opt-in + rate limit + captcha |
| Varias empresas con datos separados | Aislamiento por tenant desde el día 1; seguridad Estándar o Completa en E4 |
| IA / chat | Componentes de chat shadcn + reglas de [AI-AND-LLM](security/full-audit/AI-AND-LLM.md) |
| Pagos | Precios solo en servidor, webhooks firmados, idempotencia |
| Datos sensibles | Seguridad Completa recomendada en E4 + `needs_validation` para lo que dependa del proveedor |
| Estudio con datos | Gráfico correcto por tipo de dato, leyenda, tabla alternativa, descarga de datos, anonimización si hay personas |
