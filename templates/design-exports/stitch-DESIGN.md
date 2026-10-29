<!--
Plantilla para .stitch/DESIGN.md (formato que usa Google Stitch para crear el design system del proyecto).
Se rellena desde nuestro DESIGN.md: cada token pasa a prosa descriptiva con su hex o valor entre paréntesis.
Mapeo:
  colors.*            → §2 (nombre descriptivo + hex + rol + dónde NO se usa)
  typography.*        → §3 (familia, carácter, jerarquía con tamaño/peso/line-height/tracking)
  rounded/elevation/components/controls/focus → §4
  spacing + identidad + layout → §5
  Do's / Don'ts + dials → §6
Escribe en inglés si el proyecto de Stitch es en inglés (genera mejor); los textos de interfaz, en el idioma del producto.
-->
# Design System: {{Nombre}}
**Project ID:** {{id de Stitch o "pendiente"}}

## 1. Visual Theme & Atmosphere

{{2–3 frases con la sensación: p. ej. "calm, trustworthy clinical space with generous whitespace and soft warmth; content-first, photography supports but never dominates".}}

**Key Characteristics:**
- {{densidad: espaciosa / estándar / densa}}
- {{temperatura de neutros: cálidos / fríos}}
- {{tratamiento de imagen}}
- {{tono del movimiento}}

## 2. Color Palette & Roles

### Primary Foundation
- **{{Nombre descriptivo}}** ({{background}}) – Primary background.
- **{{Nombre}}** ({{card}}) – Cards and raised surfaces.

### Accent & Interactive
- **{{Nombre}}** ({{primary}}) – The only accent. Primary CTAs, active nav, focus ring ({{ring}}). Never for body text.
- **{{Nombre}}** ({{primary-foreground}}) – Text on primary buttons.

### Typography & Text Hierarchy
- **{{Nombre}}** ({{foreground}}) – Headlines and body text.
- **{{Nombre}}** ({{muted-foreground}}) – Secondary text and metadata (contrast ≥ 4.5:1 on background).
- **{{Nombre}}** ({{border}}) – Borders and dividers.

### Functional States
- **{{Nombre}}** ({{success}}) – Success. Always paired with icon or text.
- **{{Nombre}}** ({{destructive}}) – Errors and destructive actions.
- **{{Nombre}}** ({{warning}}) – Warnings.

### Dark Mode
- Background {{dark.background}}, surfaces {{dark.card}}, text {{dark.foreground}}, secondary text {{dark.muted-foreground}}, accent {{dark.primary}}.

## 3. Typography Rules

**Primary Font Family:** {{sans}} · **Display:** {{display}} · **Mono:** {{mono}}
**Character:** {{descripción}}

- **Display (H1):** {{size}}, weight {{w}}, line-height {{lh}}, letter-spacing {{tracking}}.
- **Section headers (H2):** …
- **Body:** {{16px}}, weight 400, line-height 1.5.
- **Small / meta:** …
- **Labels / buttons:** …

## 4. Component Stylings

- **Buttons:** radius {{rounded.lg}}, height {{controls.height}}; primary = accent fill + on-accent text; hover {{primary-active}}; focus ring {{focus}}; secondary = outlined with border color.
- **Cards:** radius {{rounded.xl}}, background {{card}}, {{border 1px / elevation.sm}}, padding {{…}}.
- **Inputs:** height {{controls.input}}, border {{input}}, visible label above, error text below in destructive color.
- **Navigation:** {{estilo}}; active state with accent indicator.
- **Badges / chips:** {{rounded.pill}}, muted background.

## 5. Layout Principles

- Spacing scale: {{spacing.scale}} (base {{spacing.base}}).
- Max content width {{…}}; grid {{12 / 4 columnas}}; breakpoints 375 / 768 / 1024 / 1440.
- Section spacing {{…}}; one primary CTA per screen; mobile-first.

## 6. Design System Notes for Stitch Generation

- Use only the colors, fonts and radii above; do not introduce gradients, glassmorphism or extra accents unless listed.
- Icons: one outline icon family, never emojis as icons.
- Accessibility: WCAG 2.2 AA contrast, visible focus states, touch targets ≥ 44px on mobile.
- Do: {{Do's de DESIGN.md}}
- Don't: {{Don'ts de DESIGN.md}}
