# Identidad · Catálogo (motor de diseño)

Cuando el proyecto pertenece a una industria concreta (clínica, spa, fintech, restaurante, legal, educación…) o el usuario no tiene marca, no adivines: el motor de diseño cruza **192 tipos de producto** con **50 estilos activos**, paletas validadas, pares tipográficos, patrón de landing y anti-patrones de esa industria.

## Generar

```bash
node <SKILL_DIR>/tools/design-intel/run.mjs "<tipo de producto> <industria> <palabras de estilo>" --design-system -p "<Nombre>" \
  [--variance 1-10] [--motion 1-10] [--density 1-10] [-f markdown]
```

Ejemplos:
```bash
node <SKILL_DIR>/tools/design-intel/run.mjs "dental clinic booking trust calm" --design-system -p "Sonríe"
node <SKILL_DIR>/tools/design-intel/run.mjs "fintech personal finance young modern" --design-system -p "Monedero" --variance 6 --motion 5
node <SKILL_DIR>/tools/design-intel/run.mjs "internal analytics dashboard" --design-system -p "Ops" --density 8
```

El resultado trae: **patrón** (orden de secciones, dónde va el CTA), **estilo**, **colores** con nombres de variable compatibles con shadcn, **tipografía** con URL de Google Fonts, **efectos**, **qué evitar** y checklist. Con `--motion` añade un snippet GSAP por nivel.

## Afinar (siempre)

1. **La marca del usuario gana.** Si tiene color o fuente, sustituye y vuelve a comprobar contraste (4.5:1 texto, 3:1 UI).
2. **Comprueba el modo oscuro aparte.** No inviertas colores: usa variantes tonales desaturadas.
3. **Revisa "AVOID".** Son errores típicos de esa industria (p. ej. fintech: "diseño juguetón + comisiones poco claras + gradientes morados de IA").
4. **Un solo acento por pantalla** y un CTA primario.
5. Escribe el resultado en `DESIGN.md` ([plantilla](../../templates/DESIGN.md)). Si el stack usa shadcn, aplícalo con [product-shadcn.md](product-shadcn.md#marca-propia--designmd--tema).

## Estilos disponibles (activos)

**Generales:** Minimalism & Swiss · Neumorphism · Glassmorphism · Brutalism · 3D & Hyperrealism · Vibrant & Block-based · Dark Mode (OLED) · Accessible & Ethical · Claymorphism · Aurora UI · Retro-Futurism · Flat Design · Skeuomorphism · Motion-Driven · Micro-interactions · Inclusive Design · Zero Interface · Soft UI Evolution · Neubrutalism · Bento Box Grid · Y2K · Cyberpunk · Organic Biophilic · AI-Native UI · Memphis · Dimensional Layering · Exaggerated Minimalism · Kinetic Typography · Parallax Storytelling · HUD / Sci-Fi FUI · Pixel Art · Spatial UI (visionOS) · E-Ink / Paper · Gen Z Maximalism · Biomimetic · Anti-Polish / Raw · Tactile / Deformable · Nature Distilled · Interactive Cursor · Voice-First · 3D Product Preview · Editorial Grid / Magazine · Vintage Analog / Film

**Plataforma y sistemas:** Liquid Glass · Fluent 2 · Shopify Polaris · Adobe Spectrum · Material 3 Expressive · Bauhaus · Data-Dense Dashboard

Consulta uno: `node <SKILL_DIR>/tools/design-intel/run.mjs "bento grid" --domain style`.

> Relación con noir: *Kinetic Typography*, *Editorial Grid*, *Dark Mode (OLED)* y *Exaggerated Minimalism* son primos de la identidad noir. Si el motor devuelve uno de ellos para un proyecto creativo, considera usar [noir-editorial.md](noir-editorial.md) completa.

## Tipos de producto cubiertos (selección)

SaaS · Micro SaaS · E-commerce (y lujo) · B2B · Dashboards financieros y de analítica · Salud, clínica, dental, veterinaria, telemedicina, portal de paciente · Educación, e-learning, LMS, idiomas, bootcamp · Agencias, portfolio, fotografía · Fintech, banca, seguros, finanzas personales · IA/chatbot · Productividad, notas, calendario, CRM, facturación, inventario · Marketplaces, freelancers, empleo, clasificados, subastas · Restaurantes, cafés, delivery, recetas · Fitness, yoga, sueño, nutrición, meditación, salud mental · Inmobiliaria, arquitectura, construcción, interiorismo · Viajes, hoteles, aerolíneas, eventos, bodas, ticketing · Legal, gobierno, ONG, religión, museos · Música, video, podcast, newsletters, medios · Juegos (puzzle, trivia, arcade…) · Developer tools, API portals, status pages, changelogs, open source · Clima, energía, agro, logística, movilidad, IoT · y más hasta 192.

Si la industria no aparece, combina las dos más cercanas en la consulta y dilo.

## Sin Python

Si el lanzador no encuentra Python 3: usa estas reglas de respaldo y avisa al usuario ("sin motor; defaults generales"):

| Tipo | Estilo | Paleta | Tipografía |
|---|---|---|---|
| SaaS / B2B | Minimalism & Swiss o Bento | Azul confianza + acento naranja | Inter / Inter, o Geist |
| Fintech / banca | Swiss, sobrio | Azul marino o verde profundo + dorado sutil | IBM Plex Sans |
| Salud | Accessible & Ethical, Soft UI | Azul/teal calmado, mucho blanco | Figtree / Noto Sans |
| Wellness / spa | Organic Biophilic, Soft UI | Tonos tierra, salvia, crema | Cormorant + Montserrat |
| E-commerce | Flat + Vibrant | Neutro + acento de marca fuerte para el CTA | DM Sans |
| Lujo | Exaggerated Minimalism, Editorial | Negro, crema, oro | Playfair Display + Inter |
| Creativo / portfolio | **Noir editorial** | Ver noir | Anton + Inter Tight + JetBrains Mono |
| Educación / niños | Claymorphism, Vibrant | Primarios suaves | Nunito |
| Dev tools | Dark Mode (OLED), Minimal | Neutros fríos + un acento | Geist + Geist Mono |
