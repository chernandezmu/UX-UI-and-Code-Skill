#!/usr/bin/env node
// Lanzador multiplataforma del motor de diseño (UI/UX Pro Max).
// Busca Python 3 (python3, python, py -3) y ejecuta scripts/search.py con los argumentos recibidos.
// Uso: node run.mjs "<consulta>" [--design-system | --domain <d> | --stack <s>] [opciones]
import { spawnSync } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const script = join(here, "scripts", "search.py");
const env = { ...process.env, PYTHONIOENCODING: "utf-8", PYTHONUTF8: "1" };

const candidates = [
  ["python3", []],
  ["python", []],
  ...(process.platform === "win32" ? [["py", ["-3"]]] : []),
];

function works([cmd, pre]) {
  const r = spawnSync(cmd, [...pre, "--version"], { encoding: "utf8", env });
  return r.status === 0 && /Python 3\./.test(`${r.stdout}${r.stderr}`);
}

const py = candidates.find(works);
if (!py) {
  console.error(
    "[design-intel] No se encontró Python 3. Instálalo (python.org) o usa las tablas de respaldo de\n" +
      "references/identities/catalog.md y references/ux/ux-rules.md, avisando al usuario."
  );
  process.exit(127);
}

const [cmd, pre] = py;
const r = spawnSync(cmd, [...pre, script, ...process.argv.slice(2)], { stdio: "inherit", env });
process.exit(r.status ?? 1);
