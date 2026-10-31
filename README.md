# UX-UI and Code Skill · v2

A coding-agent skill for building startups, MVPs, SaaS products, landing pages and websites that look, move and hold up like the work of a senior team — **in stages, asking before building**. Works with 30+ coding agents (**Claude Code, Codex, Cursor, GitHub Copilot, Gemini CLI, Antigravity, Cline, Amp, Goose, OpenCode, Crush, Qwen Code, Mistral Vibe, OpenHands, Kiro, Windsurf, JetBrains Junie, Zed, Aider, Replit**…), with web builders and chats (Lovable, Bolt, v0, ChatGPT, Claude Projects, Gemini Gems) through a portable prompt, and with **Claude Design** and **Google Stitch** as design canvases. All agents share the same state (`ROADMAP.md` with a hand-off section), so one agent can pick up where another left off. Written in Spanish.

## How it works

```
E0 Planning → E1 Design → E2 Code → E3 Automation → E4 Security → E5 Optimization & polish
```

| Stage | What happens | Output |
|---|---|---|
| **E0 · Planning** | Guided 10-step intake, one topic per turn, in the user's language: project type → tech (framework, database, hosting) → design (upload yours, or pick a preset style: minimal, noir, baroque, brutalist, organic…) → colors → fonts → logo → sections → what it is about → audience → security and extras (writes SECURITY.md). Then priorities (P0/P1/P2), design canvas, code path and depth per stage | `PROJECT-BRIEF.md`, `ROADMAP.md` |
| **E1 · Design** | Identity (noir editorial · product shadcn/ui · catalog of 50 styles × 192 product types) + design engine → key screens in code, Claude Design, Google Stitch or Figma | `DESIGN.md` + screens |
| **E2 · Code** | Stack audit (Use / Skip / Remove) and implementation from scratch, from a Claude Design handoff, from Stitch HTML, from Figma, or on an existing repo | Working P0 flow |
| **E3 · Automation** | Lint, tests (Vitest, Playwright, axe), CI, previews and deploys, migrations, emails, webhooks, cron, queues, monitoring | Green pipeline |
| **E4 · Security** | Attack-class hardening catalog (35+ classes), launch checklist, pattern sweep, CSP, guided review or Cloudflare's full six-phase audit | No open high/critical findings |
| **E5 · Optimization** | Measure → Core Web Vitals, SEO, final accessibility, UX/copy/motion polish → before/after report | Ready to launch |

Each stage ends with a gate: the agent summarizes and asks before moving on (or runs straight through if you ask it to). `ROADMAP.md` keeps the state so any session — or any agent — can resume.

## Install

Requires Node 18+. Python 3 is optional (enables the design engine).

```bash
node install.mjs --agent claude --global          # Claude Code
node install.mjs --agent codex --global           # Codex (→ ~/.agents/skills)
node install.mjs --agent claude,codex,cursor,copilot --project ../my-app
node install.mjs --agent junie,zed,aider --project ../my-app   # instruction-file agents
node install.mjs --agents-md ../my-app            # agents that only read AGENTS.md
node install.mjs --portable ../my-app             # Lovable, Bolt, v0, ChatGPT, Gemini Gems
node install.mjs --list
```

Manual install: copy this folder to `~/.claude/skills/ux-ui-and-code-skill/` (Claude Code) or `~/.agents/skills/ux-ui-and-code-skill/` (Codex). In claude.ai, upload the folder as a custom skill if your plan allows it.

**Claude Design:** from Claude Code use `/design-sync` and `/design`; or upload the design-system pack (`templates/design-exports/claude-design-pack.md`). Hand off back to Claude Code to implement.
**Google Stitch:** set up the [Stitch MCP](https://stitch.withgoogle.com/docs/mcp/setup/) and the official [stitch-skills](https://github.com/google-labs-code/stitch-skills); this skill writes `.stitch/DESIGN.md` and the screen prompts.

## Use

*"Quiero crear la web de mi startup"*, *"sigamos con el proyecto"*, *"diséñalo en Stitch"*, *"hazme un dashboard SaaS"*, *"revisa la accesibilidad"*, *"¿es seguro lanzar esto?"*.

```bash
node tools/design-intel/run.mjs "dental clinic booking calm" --design-system -p "Sonríe"
node tools/design-intel/run.mjs "error summary validation" --domain ux
```

## Layout

```
SKILL.md              router: modes, stages E0–E5, non-negotiable rules
AGENTS.md             entry point for Codex / generic agents
agents/openai.yml     Codex skill metadata
install.mjs           multi-agent installer (34 agents + AGENTS.md + portable prompt)
references/           stages/ · discovery · stack-matrix · identities/ · design-tools/ · ux/ · shadcn/ · security/
templates/            PROJECT-BRIEF · ROADMAP · DESIGN · AGENTS-snippet · prompts/ · design-exports/
tools/design-intel/   search engine (Python stdlib, offline) + CSV data
```

## Credits

MIT-licensed material from [shadcn/ui](https://github.com/shadcn-ui/ui), [cloudflare/security-audit-skill](https://github.com/cloudflare/security-audit-skill) and [nextlevelbuilder/ui-ux-pro-max-skill](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill); Stitch workflow based on [google-labs-code/stitch-skills](https://github.com/google-labs-code/stitch-skills) (Apache-2.0). See [NOTICE.md](NOTICE.md).

## Author

Carlos Hernández
