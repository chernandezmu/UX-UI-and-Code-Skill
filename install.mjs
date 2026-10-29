#!/usr/bin/env node
// Instalador multi-agente de ux-ui-and-code-skill (Node 18+, sin dependencias).
//
//   node install.mjs --list
//   node install.mjs --agent claude --global
//   node install.mjs --agent codex,cursor,cline --project ../mi-app
//   node install.mjs --agent all --project ../mi-app
//   node install.mjs --agents-md ../mi-app          (bloque en AGENTS.md para cualquier agente)
//   node install.mjs --portable ../mi-app           (texto para Lovable, Bolt, v0, ChatGPT, Gemini Gems…)
//   node install.mjs --agent claude --global --dry-run
//
// Opciones: --force (reemplaza una instalación previa), --dest <carpeta> (destino manual).
import { cpSync, existsSync, mkdirSync, readFileSync, rmSync, writeFileSync, statSync } from "node:fs";
import { homedir } from "node:os";
import { basename, dirname, join, relative, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

const SKILL = "ux-ui-and-code-skill";
const SRC = dirname(fileURLToPath(import.meta.url));
const EXCLUDE = new Set([".git", "node_modules", "__pycache__", ".DS_Store"]);
const SHARED = ".agents/skills"; // carpeta estándar de Agent Skills; aquí va la copia para agentes sin carpeta propia

// Tipos:
//   skill  → copia la carpeta en <project>/<SKILL>/ (y en <global>/<SKILL>/ con --global)
//   block  → copia la carpeta en .agents/skills/ y añade un bloque que apunta a ella en el archivo de instrucciones del agente
//   rules  → copia la carpeta en <root>/<SKILL>/ y escribe un archivo de reglas propio que apunta a ella
// "verified": la ruta viene de la documentación oficial del agente; si no, de guías de terceros (comprobar si no carga).
const AGENTS = {
  // Skills nativas (estándar Agent Skills)
  claude:      { name: "Claude Code",            type: "skill", project: ".claude/skills",   global: "~/.claude/skills", verified: true },
  codex:       { name: "Codex (OpenAI)",         type: "skill", project: SHARED,             global: "~/.agents/skills", verified: true },
  universal:   { name: "Estándar .agents",       type: "skill", project: SHARED,             global: "~/.agents/skills", verified: true },
  cursor:      { name: "Cursor",                 type: "skill", project: ".cursor/skills",   global: "~/.cursor/skills", verified: true },
  copilot:     { name: "GitHub Copilot",         type: "skill", project: ".github/skills",   global: "~/.copilot/skills", verified: true },
  gemini:      { name: "Gemini CLI",             type: "skill", project: ".gemini/skills",   global: "~/.gemini/skills", verified: true },
  antigravity: { name: "Google Antigravity",     type: "skill", project: SHARED,             global: "~/.gemini/antigravity/skills" },
  cline:       { name: "Cline",                  type: "skill", project: ".cline/skills",    global: "~/.cline/skills", verified: true },
  amp:         { name: "Amp (Sourcegraph)",      type: "skill", project: SHARED,             global: "~/.config/agents/skills", verified: true },
  goose:       { name: "Goose",                  type: "skill", project: SHARED,             global: "~/.agents/skills", verified: true },
  opencode:    { name: "OpenCode",               type: "skill", project: ".opencode/skills", global: "~/.config/opencode/skills", verified: true },
  crush:       { name: "Crush (Charm)",          type: "skill", project: ".crush/skills",    global: "~/.config/crush/skills", verified: true },
  qwen:        { name: "Qwen Code",              type: "skill", project: ".qwen/skills",     global: "~/.qwen/skills", verified: true },
  vibe:        { name: "Mistral Vibe",           type: "skill", project: ".vibe/skills",     global: "~/.vibe/skills" },
  openhands:   { name: "OpenHands",              type: "skill", project: ".openhands/skills", verified: true },
  kiro:        { name: "Kiro",                   type: "skill", project: ".kiro/skills",     global: "~/.kiro/skills" },
  windsurf:    { name: "Windsurf",               type: "skill", project: ".windsurf/skills" },
  roo:         { name: "Roo Code (legado)",      type: "skill", project: ".roo/skills" },
  kilocode:    { name: "Kilo Code",              type: "skill", project: ".kilocode/skills" },
  continue:    { name: "Continue",               type: "skill", project: ".continue/skills" },
  augment:     { name: "Augment",                type: "skill", project: ".augment/skills" },
  droid:       { name: "Droid (Factory)",        type: "skill", project: ".factory/skills" },
  trae:        { name: "Trae",                   type: "skill", project: ".trae/skills" },
  warp:        { name: "Warp",                   type: "skill", project: ".warp/skills" },
  qoder:       { name: "Qoder",                  type: "skill", project: ".qoder/skills" },
  codebuddy:   { name: "CodeBuddy",              type: "skill", project: ".codebuddy/skills" },
  kimi:        { name: "Kimi Code",              type: "skill", project: ".kimi-code/skills" },
  codewhale:   { name: "CodeWhale",              type: "skill", project: ".codewhale/skills" },
  zcode:       { name: "ZCode",                  type: "skill", project: ".zcode/skills" },
  // Solo archivo de instrucciones
  junie:       { name: "JetBrains Junie",        type: "block", target: (b) => existsFile(join(b, ".junie", "AGENTS.md")) ? ".junie/AGENTS.md" : "AGENTS.md", verified: true },
  zed:         { name: "Zed",                    type: "block", target: zedTarget, verified: true },
  aider:       { name: "Aider",                  type: "block", target: () => "CONVENTIONS.md", after: aiderConfig },
  replit:      { name: "Replit Agent",           type: "block", target: () => "replit.md" },
  amazonq:     { name: "Amazon Q Developer",     type: "rules", root: ".amazonq", rules: ".amazonq/rules" },
};

const args = process.argv.slice(2);
const flag = (n) => args.includes(`--${n}`);
const opt = (n) => { const i = args.indexOf(`--${n}`); return i >= 0 ? args[i + 1] : undefined; };
const dry = flag("dry-run");
const force = flag("force");
const expand = (p) => p.replace(/^~(?=$|[\\/])/, homedir());
const log = (m) => console.log(m);
const posix = (p) => p.split(sep).join("/");
function existsFile(p) { return existsSync(p) && statSync(p).isFile(); }

function zedTarget(base) {
  // Zed usa el primer archivo que encuentra de esta lista; si escribimos en otro, lo ignoraría.
  const order = [".rules", ".cursorrules", ".windsurfrules", ".clinerules", ".github/copilot-instructions.md", "AGENT.md", "AGENTS.md", "CLAUDE.md", "GEMINI.md"];
  return order.find((f) => existsFile(join(base, f))) ?? "AGENTS.md";
}

function aiderConfig(base) {
  const conf = join(base, ".aider.conf.yml");
  if (!existsSync(conf)) {
    log(`  → ${conf} (read: CONVENTIONS.md)`);
    if (!dry) writeFileSync(conf, "read:\n  - CONVENTIONS.md\n");
  } else if (!/CONVENTIONS\.md/.test(readFileSync(conf, "utf8"))) {
    log(`  ! añade CONVENTIONS.md a la clave "read:" de ${conf} (no lo edito para no romper tu YAML)`);
  }
}

function help() {
  log(`ux-ui-and-code-skill · instalador

  --list                          Lista agentes soportados y sus rutas
  --agent <a,b|all> --global      Instala en el home (agentes con ruta global)
  --agent <a,b|all> --project <d> Instala dentro de un proyecto
  --agents-md <d>                 Añade el bloque de la skill al AGENTS.md del proyecto <d>
  --portable <d>                  Copia PORTABLE-INSTRUCTIONS.md a <d> (Lovable, Bolt, v0, ChatGPT, Gemini Gems, Claude Projects)
  --dest <carpeta>                Destino manual (la skill queda en <carpeta>/${SKILL})
  --force                         Reemplaza una instalación existente
  --dry-run                       Muestra qué haría sin escribir`);
}

const done = new Set();
function copySkill(target) {
  const t = resolve(target);
  if (done.has(t)) { log(`  · ya copiada en ${t}`); return true; }
  done.add(t);
  if (t === SRC || t.startsWith(SRC + sep)) throw new Error(`El destino está dentro de la propia skill: ${t}`);
  if (existsSync(t)) {
    if (!force) { log(`  · ya existe ${t} (usa --force para reemplazar)`); return false; }
    if (!dry) rmSync(t, { recursive: true, force: true });
  }
  log(`  → ${t}`);
  if (dry) return true;
  mkdirSync(dirname(t), { recursive: true });
  cpSync(SRC, t, { recursive: true, filter: (src) => !EXCLUDE.has(basename(src)) });
  return true;
}

function snippet(skillDir) {
  return readFileSync(join(SRC, "templates", "AGENTS-snippet.md"), "utf8").replaceAll("{{SKILL_DIR}}", skillDir);
}

function upsertBlock(file, body) {
  const current = existsSync(file) ? readFileSync(file, "utf8") : "";
  const re = /<!-- ux-ui-and-code-skill:start -->[\s\S]*?<!-- ux-ui-and-code-skill:end -->\n?/;
  const next = re.test(current) ? current.replace(re, body) : `${current}${current && !current.endsWith("\n") ? "\n" : ""}${current ? "\n" : ""}${body}`;
  log(`  → ${file} (bloque de la skill)`);
  if (!dry) { mkdirSync(dirname(file), { recursive: true }); writeFileSync(file, next); }
}

function installAgent(key, { global, project, dest }) {
  const a = AGENTS[key];
  if (!a) throw new Error(`Agente desconocido: ${key}. Usa --list.`);
  log(`${a.name}${a.verified ? "" : "  (ruta de guías de terceros; compruébala si no carga)"}`);
  if (dest) return copySkill(join(expand(dest), SKILL));

  if (global) {
    if (a.type !== "skill" || !a.global) { log(`  · sin ruta global documentada; usa --project`); return false; }
    return copySkill(join(expand(a.global), SKILL));
  }

  const base = resolve(project);
  if (!existsSync(base)) throw new Error(`No existe el proyecto: ${base}`);
  if (a.type === "skill") return copySkill(join(base, a.project, SKILL));

  if (a.type === "block") {
    copySkill(join(base, SHARED, SKILL));
    upsertBlock(join(base, a.target(base)), snippet(`${SHARED}/${SKILL}`));
    a.after?.(base);
    return true;
  }

  if (a.type === "rules") {
    const skillDir = join(base, a.root, SKILL);
    copySkill(skillDir);
    upsertBlock(join(base, a.rules, `${SKILL}.md`), snippet(posix(relative(base, skillDir))));
    return true;
  }
}

function addAgentsMd(projectDir) {
  const base = resolve(projectDir);
  if (!existsSync(base) || !statSync(base).isDirectory()) throw new Error(`No existe el proyecto: ${base}`);
  const options = [join(base, SHARED, SKILL), join(base, ".claude", "skills", SKILL), join(homedir(), ".agents", "skills", SKILL), join(homedir(), ".claude", "skills", SKILL)];
  const found = options.find((p) => existsSync(join(p, "SKILL.md"))) ?? SRC;
  const skillDir = found.startsWith(base) ? posix(relative(base, found)) : posix(found);
  log(`AGENTS.md (skill en ${skillDir})`);
  upsertBlock(join(base, "AGENTS.md"), snippet(skillDir));
}

function portable(dir) {
  const base = resolve(dir);
  const out = join(base, "PORTABLE-INSTRUCTIONS.md");
  log(`Instrucciones portables → ${out}`);
  if (!dry) { mkdirSync(base, { recursive: true }); cpSync(join(SRC, "templates", "portable-instructions.md"), out); }
  log("  Pégalo en: Lovable (Knowledge), Bolt (Project prompt), v0 (Instructions), ChatGPT (Proyecto/GPT), Claude (Project instructions), Gemini (Gem).");
}

try {
  if (!args.length || flag("help") || flag("h")) { help(); process.exit(0); }
  if (flag("list")) {
    for (const [k, a] of Object.entries(AGENTS)) {
      const where = a.type === "skill" ? `${a.project}/${SKILL}/`
        : a.type === "rules" ? `${a.root}/${SKILL}/ + ${a.rules}/${SKILL}.md`
        : `${SHARED}/${SKILL}/ + bloque en archivo de instrucciones`;
      log(`${k.padEnd(12)} ${a.name.padEnd(22)} ${(a.verified ? "✓" : "~")} proyecto: ${where}${a.global ? `   global: ${a.global}/${SKILL}/` : ""}`);
    }
    log("\n✓ ruta de la documentación oficial · ~ ruta de guías de terceros\nWeb y chat (Lovable, Bolt, v0, ChatGPT, Gemini Gems, Claude Projects): --portable <carpeta>");
    process.exit(0);
  }
  const agentsMd = opt("agents-md");
  if (agentsMd) addAgentsMd(agentsMd);
  const portableDir = opt("portable");
  if (portableDir) portable(portableDir);

  const list = opt("agent");
  if (list) {
    const global = flag("global");
    const project = opt("project");
    const dest = opt("dest");
    if (!global && !project && !dest) throw new Error("Indica --global, --project <carpeta> o --dest <carpeta>.");
    const keys = list === "all" ? Object.keys(AGENTS) : list.split(",").map((s) => s.trim()).filter(Boolean);
    for (const k of keys) installAgent(k, { global, project, dest });
    log(dry ? "\n(dry-run: no se escribió nada)" : "\nListo. Reinicia el agente para que cargue la skill.");
  } else if (!agentsMd && !portableDir) {
    help();
  }
} catch (e) {
  console.error(`Error: ${e.message}`);
  process.exit(1);
}
