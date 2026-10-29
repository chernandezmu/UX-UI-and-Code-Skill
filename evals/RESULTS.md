# Resultados de evals

Corre los casos de [evals.json](evals.json) en cada agente antes de publicar una versión. Una fila por caso y agente.

| Fecha | Versión | Agente | Caso | Resultado | Notas |
|---|---|---|---|---|---|
| 2026-10-28 | 2.2.1 | Claude Code | simulación E0 (portafolio noir) | pass con ajustes | Encontró conflicto motor/noir y contradicción multi-tenant; corregidos en 2.2.1 |
| 2026-10-28 | 2.4.0 | Claude Code | simulación completa 10 pasos (web de estudio) | pass con ajustes | Detectó paletas claras con modo oscuro, elementos del paso 1 sin sección y Supabase vs CSV; corregidos en 2.4.1 |
