# E3 · Automatizaciones

Entrada: flujo P0 funcionando en local. Salida: cada cambio pasa por checks automáticos y llega solo a preview y a producción; los procesos repetitivos del negocio corren sin intervención.

Usa lo que el proyecto ya tenga (detectado en E0). Instala dependencias con el gestor del proyecto y pide permiso antes de crear cuentas o conectar servicios externos.

## 1. Calidad en local

- Lint + formato: **Biome** (uno solo para ambos) o ESLint + Prettier. Typecheck (`tsc --noEmit`).
- Scripts en `package.json`: `lint`, `typecheck`, `test`, `test:e2e`, `build`.
- Pre-commit ligero (lefthook o husky + lint-staged): formato y lint **solo** de archivos cambiados. Nada lento en el pre-commit.

## 2. Tests

| Tipo | Herramienta | Qué cubrir primero |
|---|---|---|
| Unidad | Vitest | Validaciones, cálculos de precios, permisos (`canEdit(user, resource)`) |
| Componentes | Testing Library | Formularios (errores, estados de carga), componentes con lógica |
| End-to-end | Playwright | El flujo P0 completo (registro → acción principal), en móvil y escritorio |
| Accesibilidad | `@axe-core/playwright` | Cada página del flujo P0 sin violaciones serias |
| Seguridad (regresión) | Vitest/Playwright | Usuario de la org A no puede leer ni editar datos de la org B (IDOR) |

```ts
// e2e/a11y.spec.ts
import { test, expect } from "@playwright/test"
import AxeBuilder from "@axe-core/playwright"
for (const path of ["/", "/login", "/dashboard"]) {
  test(`a11y ${path}`, async ({ page }) => {
    await page.goto(path)
    const { violations } = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag22aa"]).analyze()
    expect(violations).toEqual([])
  })
}
```

## 3. CI (GitHub Actions)

```yaml
# .github/workflows/ci.yml
name: ci
on: { pull_request: {}, push: { branches: [main] } }
permissions: { contents: read }          # mínimo; súbelo solo en el job que lo necesite
concurrency: { group: ci-${{ github.ref }}, cancel-in-progress: true }
jobs:
  check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4          # en producción fija por SHA
      - uses: pnpm/action-setup@v4
      - uses: actions/setup-node@v4
        with: { node-version: 22, cache: pnpm }
      - run: pnpm install --frozen-lockfile
      - run: pnpm lint && pnpm typecheck
      - run: pnpm test
      - run: pnpm build
      - run: pnpm exec playwright install --with-deps chromium && pnpm test:e2e
```

Ajusta el gestor (npm ci / bun install --frozen-lockfile). Secretos de CI solo en los jobs que los usan; nunca `pull_request_target` con checkout del código del PR; no interpoles `${{ github.event.* }}` dentro de `run:`.

## 4. Despliegue

- **Previews por PR** (Vercel, Cloudflare Pages/Workers, Netlify) con variables de entorno de preview (no las de producción); protégelas si muestran datos reales.
- **Producción** al fusionar en `main`, solo con CI en verde (protección de rama).
- **Migraciones** de base de datos en el pipeline (`drizzle-kit migrate`, `prisma migrate deploy`, `supabase db push`), nunca a mano en producción. Migraciones compatibles hacia atrás.
- **Rollback**: saber cómo volver al despliegue anterior en un clic (documéntalo en el README).

## 5. Mantenimiento automático

- Renovate o Dependabot (agrupar menores semanalmente; parches de seguridad al momento).
- Escaneo de secretos y de dependencias (GitHub secret scanning, `pnpm audit`/`osv-scanner` en CI).
- Lighthouse CI sobre la preview (se usa en E5).

## 6. Automatizaciones de negocio

| Necesidad | Opciones | Reglas |
|---|---|---|
| Emails transaccionales (bienvenida, verificación, reset, recibos) | Resend + React Email, Postmark | Dominio con SPF/DKIM/DMARC · plantillas con la identidad · sin datos sensibles en el asunto |
| Pagos y suscripciones | Webhooks de Stripe / Mercado Pago | Firma verificada, idempotencia por `event.id`, procesado en cola |
| Tareas programadas (resúmenes, limpieza, recordatorios) | Vercel Cron, Cloudflare Cron Triggers, Supabase `pg_cron`, GitHub `schedule` | Endpoint protegido con secreto · idempotentes · con registro |
| Trabajos en segundo plano (IA, exportes, imágenes) | Inngest, Trigger.dev, Upstash QStash, colas de Cloudflare | Reintentos con backoff, cola de errores, límites por usuario |
| Publicar contenido desde un panel (CMS) | CMS basado en git (Keystatic, Decap, TinaCMS) → commit → CI y deploy; CMS headless → webhook al *deploy hook* del hosting | El panel exige login del admin · el deploy hook es un secreto · el contenido pasa el mismo CI (build + a11y) |
| Avisos internos (nuevo registro, pago, error) | Slack/Discord webhook, email | Sin PII innecesaria |
| Integraciones sin código | n8n, Make, Zapier vía webhook | Webhooks firmados o con secreto; el sistema origen es la fuente de verdad |
| Analítica de embudo | PostHog, Plausible eventos | Eventos con nombre estable (`signup_completed`), con consentimiento |

## 7. Observabilidad

- Errores: Sentry (o similar) con source maps y scrubbing de PII.
- Uptime y alertas (Better Stack, UptimeRobot) para la home, la API y el webhook de pagos.
- Logs estructurados con id de correlación (el mismo que ve el usuario en el mensaje de error).

## 8. Automatizaciones del propio agente (opcional)

- `AGENTS.md` del proyecto con comandos (`pnpm lint`, `pnpm test`) y convenciones; añade el bloque de la skill con `node <SKILL_DIR>/install.mjs --agents-md .`.
- En Claude Code, hooks que formatean o lintan tras editar; en Codex, el mismo comando en `AGENTS.md` como paso obligatorio antes de terminar.

## Checklist

| Nivel | Tarea |
|---|---|
| Básico | Lint + typecheck + build en CI · deploy automático a producción desde `main` · previews |
| Estándar | + e2e del flujo P0 · axe en CI · migraciones en pipeline · Renovate/Dependabot · Sentry · emails transaccionales |
| Completo | + test de aislamiento entre tenants · Lighthouse CI · cron/colas con reintentos · avisos internos · uptime · runbook de rollback |

## Puerta E3

Muestra: un PR de ejemplo pasando todos los checks y desplegando a preview, y la lista de automatizaciones activas. Pregunta: **"¿Pasamos a E4 · Seguridad?"**
