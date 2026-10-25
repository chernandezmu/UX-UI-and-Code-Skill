# UX-UI and Code Skill

A Claude skill for building dark, typographic, cinematic websites — design tokens, motion system and GSAP/Lenis animation recipes, adapted to your stack (HTML/CSS/JS, Svelte, Astro, NestJS, React) with an audit of what to use and what to drop.

## What it does

**UX-UI and Code Skill** turns a single visual language — near-black backgrounds, giant display type, mono metadata and slow, weighty motion — into concrete specs and code.

Before writing anything, it detects or asks for your stack and picks the right tools for it. It also flags which effects fit your type of site and which dependencies are redundant.

## What's inside

- **Stack selection and audit** — HTML/CSS/JS, Svelte/SvelteKit, Astro, NestJS, React (Vite/Next.js) or other, with a Use / Skip / Remove summary.
- **Design tokens** — color, typography, spacing and grid.
- **Motion system** — easings, durations and choreography rules.
- **Page structure and components** — preloader, nav, hero, lists, CTA, footer, buttons, links.
- **15 animation recipes** — preloader, text and image reveals, magnetic button, custom cursor, grain, CRT, glitch, marquee, horizontal scroll, page transitions and more.
- **Accessibility, performance and mobile rules.**
- **Pre-delivery checklist** and a list of things to never do.

## Installation

**Claude (claude.ai / desktop app):** add the skill folder (containing `SKILL.md`) as a custom skill in your Claude settings.

**Claude Code:** copy the skill into your skills folder:

```bash
mkdir -p ~/.claude/skills/ux-ui-and-code-skill
cp SKILL.md ~/.claude/skills/ux-ui-and-code-skill/SKILL.md
```

## Usage

Ask Claude for a website, landing page, animation or transition in this style. The skill starts by confirming your stack, then delivers design and code that follow its rules.

## Author

Carlos David Hernández Mutis
