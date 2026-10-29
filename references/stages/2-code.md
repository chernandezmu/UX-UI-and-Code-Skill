# E2 · Código

Entrada: `DESIGN.md` aprobado (+ pantallas). Salida: el flujo P0 funcionando en local.

## 1. Stack y auditoría

Parte del framework, la base de datos y el hosting del paso 2 del arranque (no los vuelvas a preguntar). Con [../stack-matrix.md](../stack-matrix.md) decide herramientas y dependencias, y abre la etapa con el resumen:

```
Stack:     Next.js 16 (App Router) + shadcn/ui (base, nova) + Tailwind v4 · Tipo: SaaS B2B
Identidad: Híbrida — landing noir editorial / app producto shadcn
Vía:       Desde handoff de Claude Design (landing) + desde cero (app)
Usar:      lenis, gsap + @gsap/react (solo landing), next/font, zod, Auth.js, Stripe
Omitir:    Barba (Next tiene router), Three.js (no hay 3D)
Quitar:    aos, animate.css, framer-motion (duplica GSAP)
Datos:     Supabase (Postgres) · RLS en todas las tablas · service_role solo en servidor
Seguridad: cookies HttpOnly, CSP con nonce, rate-limit en auth y IA (detalle en SECURITY.md)
```

## 2. Vías de implementación (elige una por pantalla o sección)

| Vía | Cuándo | Cómo |
|---|---|---|
| **A · Desde cero** | Diseño hecho en código o sin diseño previo | Tokens → layout → componentes → páginas, con la identidad y el stack |
| **B · Desde Claude Design** | E1 en Claude Design | Handoff a Claude Code (bundle con diseño, componentes e intención) → [../design-tools/claude-design.md](../design-tools/claude-design.md#de-claude-design-al-código) |
| **C · Desde Stitch** | E1 en Stitch | HTML/Tailwind por MCP (`get_screen` → `htmlCode`) o exportado → componentes del stack → [../design-tools/google-stitch.md](../design-tools/google-stitch.md#de-stitch-al-código) |
| **D · Desde Figma** | E1 en Figma | MCP de Figma (contexto de diseño + Code Connect) → componentes del proyecto |
| **E · Sobre proyecto existente** | Ya hay código | Auditoría de stack (§5 de stack-matrix) → cambios incrementales, nada de reescribir sin permiso |

**Regla para B, C y D:** el código exportado es **referencia**, no producción. Se reescribe con los componentes del proyecto (shadcn u otros), los tokens de `DESIGN.md`, la semántica HTML correcta y las convenciones del stack. Nunca se pegan colores crudos, `div`s clicables ni CSS inline masivo.

## 3. Orden de construcción

1. Scaffold (`init` del framework / `npx shadcn@latest init …`), lint y formateo.
2. Tokens en el CSS global (`tailwindCssFile` o `:root`) + fuentes.
3. Layout raíz, navegación, footer, página 404.
4. Componentes base (instalados o propios) con todas sus variantes y estados.
5. Páginas P0 con contenido real.
6. Datos y auth (proveedor elegido), validación con esquema y **autorización por recurso** (seguridad base obligatoria: [../security/secure-by-default.md](../security/secure-by-default.md) §1–§4 y §15 para la base de datos elegida; marca cada control en `SECURITY.md`).
7. Estados: vacío, carga (`Skeleton`), error con recuperación, éxito, sin permisos.
8. Motion según la identidad (respetando `prefers-reduced-motion`).
9. P1 si el roadmap lo incluye.

## Checklist

| Nivel | Tarea |
|---|---|
| Básico | Flujo P0 completo · tokens sin colores crudos · responsive 375–1440px · secretos fuera del cliente · validación + autorización en servidor |
| Estándar | + todos los estados · formularios accesibles (labels, errores junto al campo, autocomplete) · dark mode · reglas críticas de shadcn · typecheck sin errores |
| Completo | + P1 · motion completo de la identidad · i18n si aplica · página de design system |

## Puerta E2

Demostración del flujo P0 (pasos para probarlo en local o capturas) + deuda conocida. Pregunta: **"¿Pasamos a E3 · Automatizaciones?"**
