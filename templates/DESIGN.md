---
# DESIGN.md · {{Nombre}}
# Formato compatible con el flujo shadcn "DESIGN.md → tema" (references/shadcn/design-system.md).
# Hex en lugar de OKLCH cuando vengan de la marca. Todo token sin hueco shadcn se registra en @theme inline.
identity: product-shadcn        # noir-editorial | product-shadcn | catalog | hybrid
style: nova                     # vega | nova | maia | lyra | mira | luma | rhea | sera (si usa shadcn)
dials: { variance: 5, motion: 4, density: 5 }

colors:
  light:
    background: "#FFFFFF"
    foreground: "#0F172A"
    card: "#FFFFFF"
    card-foreground: "#0F172A"
    popover: "#FFFFFF"
    popover-foreground: "#0F172A"
    primary: "#2563EB"
    primary-foreground: "#FFFFFF"
    primary-active: "#1D4ED8"
    secondary: "#F1F5F9"
    secondary-foreground: "#0F172A"
    muted: "#F1F5F9"
    muted-foreground: "#475569"
    accent: "#F1F5F9"
    accent-foreground: "#0F172A"
    border: "#E2E8F0"
    input: "#E2E8F0"
    ring: "#2563EB"
    destructive: "#DC2626"
    success: "#15803D"
    warning: "#B45309"
    chart: ["#2563EB", "#0EA5E9", "#14B8A6", "#F59E0B", "#E11D48"]
  dark:
    background: "#0B1120"
    foreground: "#F8FAFC"
    card: "#111827"
    card-foreground: "#F8FAFC"
    popover: "#111827"
    popover-foreground: "#F8FAFC"
    primary: "#3B82F6"
    primary-foreground: "#0B1120"
    secondary: "#1E293B"
    secondary-foreground: "#F8FAFC"
    muted: "#1E293B"
    muted-foreground: "#94A3B8"
    accent: "#1E293B"
    accent-foreground: "#F8FAFC"
    border: "#1E293B"
    input: "#1E293B"
    ring: "#3B82F6"
    destructive: "#EF4444"

typography:
  families:
    sans: { name: "Inter Variable", fallback: "system-ui, sans-serif", source: "@fontsource-variable/inter" }
    display: { name: "Inter Variable", note: "usar solo en type-display-*" }
    mono: { name: "JetBrains Mono Variable", source: "@fontsource-variable/jetbrains-mono" }
  scale:   # se convierten en utilidades @utility type-*
    display-xl: { size: "clamp(40px, 5vw + 16px, 72px)", weight: 600, line-height: 1.05, tracking: "-0.03em" }
    display-lg: { size: "clamp(32px, 3vw + 16px, 48px)", weight: 600, line-height: 1.1, tracking: "-0.021em" }
    heading:    { size: "24px", weight: 600, line-height: 1.25, tracking: "-0.01em" }
    body:       { size: "16px", weight: 400, line-height: 1.5 }
    small:      { size: "14px", weight: 400, line-height: 1.45 }
    label:      { size: "12px", weight: 500, line-height: 1.3, tracking: "0.06em", transform: uppercase }

rounded:   # paso → clase que usa el componente
  sm: 4px     # acentos
  md: 6px     # ítems de menú/select
  lg: 8px     # botones, inputs
  xl: 12px    # cards, dialogs
  2xl: 16px   # toasts, contenedores grandes
  pill: 9999px

spacing: { base: 4px, scale: [4, 8, 12, 16, 24, 32, 48, 64, 96] }

elevation:
  xs: "0 0 #0000"
  sm: "0 1px 2px rgb(15 23 42 / 0.06)"
  lg: "0 1px 3px rgb(15 23 42 / 0.08), 0 8px 24px rgb(15 23 42 / 0.06)"

controls: { height: 36px, icon-button: 36px, input: 36px }
focus: { type: ring, color: ring, width: 3px, alpha: 0.5 }

motion:
  ease-out: "cubic-bezier(.16, 1, .3, 1)"
  ease-in-out: "cubic-bezier(.87, 0, .13, 1)"
  ease-soft: "cubic-bezier(.33, 1, .68, 1)"
  duration: { micro: 150ms, state: 220ms, enter: 320ms, exit: 200ms, page: 600ms }
  reduced-motion: "fade 150ms, sin parallax ni scrub"

components:
  button-primary: "fill primary, texto primary-foreground, hover primary-active, radio lg, altura 36px"
  button-secondary: "outline con border, fondo background"
  card: "fill card, borde border 1px, sin sombra (o elevation.sm), radio xl"
  input: "altura 36px, borde input, foco ring 3px al 50%"
---

# {{Nombre}} · Sistema de diseño

## Overview
Una frase sobre la sensación (p. ej. "clara, confiable y rápida, como una herramienta que se usa a diario").

## Colors
Rol de cada color y dónde **no** se usa. Pares de contraste comprobados (texto ≥ 4.5:1, UI ≥ 3:1):

| Par | Ratio |
|---|---|
| foreground / background | |
| muted-foreground / background | |
| primary-foreground / primary | |

## Typography
Familias, sustitutos si la fuente de marca es de pago, y reglas (p. ej. display nunca en negrita, sin tracking negativo por debajo de 20px).

## Layout
Grid, max-width, breakpoints (375 / 768 / 1024 / 1440), densidad.

## Motion
Qué se anima, qué no, y comportamiento con `prefers-reduced-motion`.

## Do's
- Un CTA primario por pantalla.
- …

## Don'ts
- Colores crudos en componentes.
- …

## Pages (overrides)
Las reglas específicas por página van en `design/pages/<pagina>.md` y mandan sobre este archivo para esa página.

## Known gaps
Lo que la marca no define y el agente derivó (p. ej. "modo oscuro derivado").
