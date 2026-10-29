# Identidades

Una identidad es un **lenguaje visual completo**: tokens, tipografía, movimiento, componentes y lo que nunca se hace. Todas comparten los mismos nombres de tokens (estilo shadcn: `--background`, `--foreground`, `--primary`, `--muted-foreground`, `--border`, `--ring`…), así que se pueden combinar.

| | Noir editorial | Producto (shadcn/ui) | Catálogo |
|---|---|---|---|
| Sensación | Objeto de autor, cinemático | Herramienta profesional y clara | La correcta para su industria |
| Para | Portfolio, música, lanzamiento, estudio | SaaS, dashboard, app con auth, IA | Clínica, spa, fintech, restaurante, legal… |
| Fondo | Casi negro | Claro y oscuro | Según el motor |
| Tipografía | Display gigante + texto + mono | Sans de producto, escala `type-*` | Par recomendado por industria |
| Movimiento | Lento, con peso (GSAP + Lenis) | Sutil, funcional (150–300ms) | Según dial *motion* |
| Componentes | Recetas propias (§6) | Componentes shadcn compuestos | shadcn o HTML semántico |
| Archivo | [noir-editorial.md](noir-editorial.md) | [product-shadcn.md](product-shadcn.md) | [catalog.md](catalog.md) |

## Cómo decidir

1. ¿El usuario ya tiene marca? → úsala; elige la identidad solo por **estructura** (producto vs autor).
2. ¿Es una app donde la gente trabaja (formularios, tablas, ajustes)? → **Producto**.
3. ¿Es una pieza para impresionar (portfolio, lanzamiento, marca personal)? → **Noir**.
4. ¿Es un negocio de una industria concreta? → **Catálogo** con la industria en la consulta.
5. ¿Startup con landing + app? → **Híbrida**: la landing con noir o catálogo, la app con producto, y el mismo `DESIGN.md` (colores y fuentes compartidos; la app baja el movimiento y sube la densidad).

## Reglas al mezclar

- Un `DESIGN.md` por proyecto; overrides por página en `design/pages/<pagina>.md`.
- Mismo acento y mismas familias tipográficas en landing y app.
- El movimiento cinemático no entra en la app: allí, transiciones de estado de 150–300ms.
- Los radios pueden diferir (landing 0, app 6–8px) si `DESIGN.md` lo declara explícitamente.
