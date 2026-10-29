# Auditoría completa (E4 · Completo)

Copia de [cloudflare/security-audit-skill](https://github.com/cloudflare/security-audit-skill) (MIT). Punto de entrada: **[AUDIT.md](AUDIT.md)** (era `SKILL.md` en el original). Está en inglés a propósito: es un protocolo preciso y conviene no alterar su redacción.

Úsala solo cuando el usuario pida explícitamente auditar o hacer pentest del código, una revisión completa/end-to-end o un informe, o cuando eligió seguridad **Completo** en E0 (y confirma al llegar a E4). Para todo lo demás: [../review.md](../review.md).

Requisitos: agente con sub-agentes paralelos, Node.js para `validate-findings.cjs` y `validate-coverage-ledger.cjs`, y un sandbox del sistema operativo (sin red, entorno vacío, límites) para ejecutar código del objetivo. Sin sandbox, las pistas quedan como `needs_validation`.

Salida por defecto: `~/security-audit-skill/<repo>/run-<N>` (fuera del repo auditado).

Mapa de términos del original a cada plataforma: *Task tool* = Agent/Task en Claude Code, sub-agentes en Codex; *`research` agent* = agente de solo lectura (p. ej. `Explore`); *`general` agent* = agente de propósito general.
