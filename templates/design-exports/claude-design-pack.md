# Pack de design system para Claude Design

Carpeta para subir a Claude Design (opción B de [../../references/design-tools/claude-design.md](../../references/design-tools/claude-design.md)) cuando todavía no hay código que sincronizar con `/design-sync`.

```
design/claude-design-pack/
  README.md          ← este archivo, rellenado
  DESIGN.md          ← copia del DESIGN.md del proyecto
  PROJECT-BRIEF.md   ← copia del brief (contexto de producto y público)
  tokens.css         ← variables en claro y oscuro (ver abajo)
  brand/             ← logo.svg, logo-mono.svg, favicon.svg, fotos propias
  references/        ← capturas de trabajo PROPIO o del usuario (nunca de marcas ajenas para copiar)
```

## README.md (rellenar)

```markdown
# {{Nombre}} · Design system

Identidad: {{noir-editorial | product-shadcn | catalog | hybrid}} · Estilo base: {{style}}
Sensación: {{una frase}}

Reglas para diseñar con este sistema:
- Usa solo los tokens de tokens.css / DESIGN.md. No añadas colores, fuentes ni radios.
- Un acento ({{--primary}}) y un CTA primario por pantalla.
- Contraste WCAG 2.2 AA en claro y oscuro; foco siempre visible.
- Componentes: {{lista: Button (default, secondary, outline, ghost), Card, Field + Input, Tabs, Table, Badge, Dialog, Sheet, Sidebar…}}.
- Movimiento: {{p. ej. entradas 0.3s ease-out, salidas 0.2s; noir: máscaras 1.1s expo.out}}; respetar prefers-reduced-motion.
- Do: {{…}}
- Don't: {{…}}
```

## tokens.css

```css
:root {
  --background: {{}}; --foreground: {{}};
  --card: {{}}; --card-foreground: {{}};
  --popover: {{}}; --popover-foreground: {{}};
  --primary: {{}}; --primary-foreground: {{}};
  --secondary: {{}}; --secondary-foreground: {{}};
  --muted: {{}}; --muted-foreground: {{}};
  --accent: {{}}; --accent-foreground: {{}};
  --border: {{}}; --input: {{}}; --ring: {{}};
  --destructive: {{}};
  --radius-sm: {{}}; --radius-md: {{}}; --radius-lg: {{}}; --radius-xl: {{}};
  --font-sans: {{}}; --font-mono: {{}}; --font-display: {{}};
}
.dark {
  --background: {{}}; --foreground: {{}};
  /* … mismos nombres … */
}
```

Cuando el kit exista en el repo, sustituye este pack por `/design-sync` desde Claude Code.
