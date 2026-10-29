# Identidad · Producto (shadcn/ui)

La identidad de producto profesional: lo que hace que un SaaS, un dashboard o una app con IA se vean "de verdad". No es un look concreto: es un **sistema** de tokens semánticos y componentes compuestos que acepta cualquier marca encima.

**Úsala para:** SaaS, dashboards, paneles de admin, herramientas internas, apps con auth/formularios/ajustes, chats de IA, design systems.
**Stacks:** React (Next.js, Vite, TanStack Start, React Router), Astro (islas React), Laravel (Inertia). Ports comunitarios: `shadcn-svelte` (Svelte/SvelteKit) y `shadcn-vue` (Vue/Nuxt) siguen las mismas reglas. Sin framework: usa los **mismos nombres de tokens** en CSS plano.

Fuente original completa: [../shadcn/shadcn-skill-original.md](../shadcn/shadcn-skill-original.md).

---

## Principios

1. **Componentes existentes primero.** `npx shadcn@latest search` antes de escribir UI propia; revisa registries comunitarios.
2. **Componer, no reinventar.** Ajustes = `Tabs` + `Card` + controles de formulario. Dashboard = `Sidebar` + `Card` + `Chart` + `Table`.
3. **Variantes antes que estilos.** `variant="outline"`, `size="sm"`…
4. **Colores semánticos.** `bg-primary`, `text-muted-foreground` — nunca `bg-blue-500`.

> Ejecuta la CLI con el runner del proyecto: `npx shadcn@latest`, `pnpm dlx shadcn@latest` o `bunx --bun shadcn@latest`.

## Contexto del proyecto (lee antes de escribir código)

```bash
npx shadcn@latest info --json
```

| Campo | Para qué |
|---|---|
| `aliases` | Prefijo real de imports (`@/`, `~/`). Nunca lo asumas |
| `isRSC` | `true` → componentes con estado/eventos/APIs del navegador llevan `"use client"` |
| `tailwindVersion` | `v4` → `@theme inline`; `v3` → `tailwind.config.js` |
| `tailwindCssFile` | El CSS global donde van las variables. Edita ese, no crees otro |
| `style` | Tratamiento visual (`nova`, `vega`, …) |
| `base` | `radix` o `base` → `asChild` vs `render`. Ver [rules/base-vs-radix.md](../shadcn/rules/base-vs-radix.md) |
| `iconLibrary` | `lucide` → `lucide-react`, `tabler` → `@tabler/icons-react`… nunca asumas lucide |
| `packageManager` | Para instalar dependencias que no son de shadcn |

Docs de cualquier componente: `npx shadcn@latest docs button dialog select` → abre las URLs que devuelve **antes** de usar, crear o arreglar un componente.

## Elegir estilo (geometría que las variables no alcanzan)

| Estilo | Carácter | Elígelo cuando |
|---|---|---|
| `vega` | El look clásico de shadcn | SaaS neutro, nada extremo |
| `nova` | Padding y márgenes reducidos | Controles 32–36px, radio 6–8px, hairlines en vez de sombras |
| `maia` | Suave y redondeado, espacioso | Controles 40px+, cards 12px+, ritmo editorial |
| `lyra` | Cuadrado y afilado | Radio 0–4px, bordes duros, tipo mono o técnico (**puente con noir**) |
| `mira` | Compacto | Datos densos, controles 28–32px, tablas apretadas |
| `luma` | Redondo, elevación suave | Botones píldora, sombras en capas, superficies tipo macOS |
| `rhea` | Luma más compacto | Suavidad de luma con densidad de producto |
| `sera` | Editorial y tipográfico | Display serif, jerarquía de revista |

Di la elección en una línea: *"Elegí maia: controles de 40px, cards de 12–16px, padding generoso."*

## Reglas críticas

Siempre aplicadas. Cada una enlaza a pares Incorrecto/Correcto.

**Estilos → [rules/styling.md](../shadcn/rules/styling.md)**
- `className` para layout, no para colores ni tipografía de componentes.
- Nada de `space-x-*`/`space-y-*`: `flex` + `gap-*` (`flex flex-col gap-4`).
- `size-10` en vez de `w-10 h-10`. `truncate` en vez de las tres clases.
- Sin `dark:` manual: tokens semánticos. `cn()` para clases condicionales.
- Sin `z-index` manual en overlays (Dialog, Sheet, Popover… se apilan solos).
- `shimmer` y `scroll-fade` en vez de keyframes propios para "pensando…" y bordes de scroll.

**Formularios → [rules/forms.md](../shadcn/rules/forms.md)**
- `FieldGroup` + `Field` siempre (nunca `div` + `space-y`).
- `InputGroup` con `InputGroupInput`/`InputGroupTextarea`; botones dentro con `InputGroupAddon`.
- 2–7 opciones → `ToggleGroup`. Grupos de checkbox/radio → `FieldSet` + `FieldLegend`.
- Validación: `data-invalid` en `Field` + `aria-invalid` en el control. Deshabilitado: `data-disabled` + `disabled`.

**Composición → [rules/composition.md](../shadcn/rules/composition.md)**
- Ítems dentro de su grupo (`SelectItem` → `SelectGroup`, `DropdownMenuItem` → `DropdownMenuGroup`, `CommandItem` → `CommandGroup`).
- `Dialog`, `Sheet`, `Drawer` siempre con título (`sr-only` si va oculto).
- `Card` completa: `CardHeader`/`CardTitle`/`CardDescription`/`CardContent`/`CardFooter`.
- `Button` no tiene `isLoading`: `<Button disabled><Spinner data-icon="inline-start" />Guardando…</Button>`.
- `TabsTrigger` dentro de `TabsList`. `Avatar` con `AvatarFallback`.
- Callouts → `Alert`. Vacíos → `Empty`. Separadores → `Separator`. Carga → `Skeleton`. Etiquetas → `Badge`.
- Toasts: `toast` del componente en proyectos Base UI; `sonner` en Radix/Aria.

**Iconos → [rules/icons.md](../shadcn/rules/icons.md)**
- En `Button`: `data-icon="inline-start|inline-end"`, sin clases de tamaño.
- Pasa iconos como componentes (`icon={CheckIcon}`), no como strings.

**Chat e IA → [rules/chat.md](../shadcn/rules/chat.md)**
- `MessageScroller` (scroll, streaming y "ir al último" incluidos), `Message`, `Bubble`, `Attachment`, `Marker`, `Trace` para razonamiento y llamadas a herramientas. Nada de burbujas `div` a mano ni hooks `useStickToBottom`.

## Qué componente para qué

| Necesidad | Usa |
|---|---|
| Acción | `Button` + variante |
| Inputs | `Input`, `Select`, `Combobox`, `Switch`, `Checkbox`, `RadioGroup`, `Textarea`, `InputOTP`, `Slider` |
| 2–5 opciones | `ToggleGroup` |
| Datos | `Table`, `Card`, `Badge`, `Avatar`, `Chart` (Recharts) |
| Navegación | `Sidebar`, `NavigationMenu`, `Breadcrumb`, `Tabs`, `Pagination` |
| Overlays | `Dialog` (tarea con input) · `AlertDialog` (confirmar destructivo) · `Sheet` (panel lateral) · `Drawer` (móvil) · `Popover` · `HoverCard` · `Tooltip` |
| Feedback | `toast`/`sonner`, `Alert`, `Progress`, `Skeleton`, `Spinner` |
| Paleta de comandos | `Command` dentro de `Dialog` |
| Layout | `Card`, `Separator`, `Resizable`, `ScrollArea`, `Accordion`, `Collapsible` |
| Vacíos | `Empty` |
| Menús | `DropdownMenu`, `ContextMenu`, `Menubar` |
| Chat | `MessageScroller`, `Message`, `Bubble`, `Attachment`, `Marker`, `Trace` |

## Flujo de trabajo

1. Contexto (`info`). 2. Mira qué ya está instalado (no reinstales). 3. `search`. 4. `docs` + fetch de URLs; `view` para lo no instalado. 5. `add` (para actualizar: `--dry-run` y `--diff` primero; nunca `--overwrite` sin permiso). 6. Tras añadir de registries de terceros, **lee los archivos**, corrige imports con los `aliases` reales y cambia los iconos a la `iconLibrary` del proyecto. 7. Si piden un bloque sin registry, **pregunta cuál** (no asumas `@shadcn`).

Presets: nunca decodifiques códigos a mano → `npx shadcn@latest preset decode|url|open|resolve`. Aplicar: `apply <code>` (existente) o `init --preset <code>`. Antes de cambiar de preset, pregunta: sobrescribir · parcial (`--only theme,font`) · fusionar · saltar. Detalle: [../shadcn/cli.md](../shadcn/cli.md).

Proyecto nuevo:
```bash
npx shadcn@latest init --name mi-app --preset base-nova --template next   # templates: next, vite, start, react-router, astro, laravel
npx shadcn@latest add button card dialog field input sonner
```

## Marca propia / DESIGN.md → tema

Cuando haya `DESIGN.md` (lo genera E1) sigue [../shadcn/design-system.md](../shadcn/design-system.md): mapear tokens a variables en `tailwindCssFile`, fijar escala de radios en `@theme inline`, sombras en `@theme`, fuentes con Fontsource, escala tipográfica como utilidades `type-*` (no `--text-*`), alturas de control **todas a la vez**, foco como lo dicte la marca. Para una página de design system: [../shadcn/design-system-page.md](../shadcn/design-system-page.md) + `node <SKILL_DIR>/references/shadcn/scripts/showcase-coverage.mjs <ui-dir> <src-dir>`.

Mapeo de roles:

| Rol en DESIGN.md | Variable shadcn |
|---|---|
| canvas / fondo | `--background` |
| tinta / texto | `--foreground`, `--card-foreground`, `--popover-foreground` |
| CTA principal / texto sobre CTA | `--primary` / `--primary-foreground` |
| botón secundario | `--secondary` / `--secondary-foreground` |
| banda suave | `--muted` · texto secundario `--muted-foreground` |
| hover de ghost, tab activa | `--accent` / `--accent-foreground` |
| tarjeta | `--card` · capa flotante `--popover` |
| hairline | `--border`, `--input` |
| foco | `--ring` |
| error | `--destructive` |
| ilustración / datos | `--chart-1…5` |
| barra lateral | `--sidebar-*` |

Tokens sin hueco → variable en `:root` (y `.dark`) + registro en `@theme inline` (`--color-primary-active: var(--primary-active)`).

## Puente noir ↔ shadcn

Para startups híbridas (landing de autor + app de producto) o para dar a una app shadcn el carácter noir:

| Token noir | Variable shadcn | Valor |
|---|---|---|
| `--bg` | `--background` | `#0a0a0b` |
| `--bg-elev` | `--card`, `--popover` | `#121214` |
| `--fg` | `--foreground` | `#ecebe7` |
| `--fg-muted` | `--muted-foreground` | `rgba(236,235,231,.55)` → usa un hex sólido equivalente que pase 4.5:1 |
| `--line` | `--border`, `--input` | `rgba(255,255,255,.10)` |
| `--accent` | `--primary` (CTA) **y** `--ring` | `#d8ff3d` · `--primary-foreground: #0a0a0b` |
| `--paper` / `--ink` | sección `.dark` invertida o `--secondary` | `#ecebe7` / `#0a0a0b` |
| `--radius: 0` | `--radius-*` en `@theme inline` | 0 (2–4px máx. en inputs) |
| `--f-mono` | `--font-mono`; labels con utilidad `type-label` | JetBrains Mono |
| `--f-display` | utilidad `type-display` (no `--font-heading`: el display no se lee bien a 16px) | Anton |

Estilo base: `lyra`. Sombras: `--shadow-xs: 0 0 #0000` (solo hairlines). Motion: easings de noir (`--e-out`, `--e-inout`) aplicados con `tw-animate-css`/CSS propio; GSAP solo en la landing.

## Verificar

Typecheck (`npx tsc -p tsconfig.app.json --noEmit` en Vite, `npx tsc --noEmit` en Next), sin errores de consola, carga en el top, sin overflow a 375/1280px, modo oscuro, contraste de pares < 4.5:1 reportado. Trampas conocidas (Command que salta el scroll, Sidebar fijo, Select base que muestra el valor crudo…): tabla en [../shadcn/design-system.md](../shadcn/design-system.md#known-traps).
