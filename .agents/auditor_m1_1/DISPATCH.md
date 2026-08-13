# Task Assignment: Forensic Auditor for Milestone 1

## Identity
- Role: Forensic Auditor 1
- Type: teamwork_preview_auditor
- Working Directory: c:\Users\wisdo\OneDrive\Documents\GitHub\Portfolio Ml\.agents\auditor_m1_1
- Target File to Audit: c:\Users\wisdo\OneDrive\Documents\GitHub\Portfolio Ml\data\projects.ts

## Context & Files to Read
- Original Request: c:\Users\wisdo\OneDrive\Documents\GitHub\Portfolio Ml\.agents\ORIGINAL_REQUEST.md
- Project Scope: c:\Users\wisdo\OneDrive\Documents\GitHub\Portfolio Ml\PROJECT.md
- Milestone Scope: c:\Users\wisdo\OneDrive\Documents\GitHub\Portfolio Ml\.agents\sub_orch_m1\SCOPE.md
- Worker Handoff: c:\Users\wisdo\OneDrive\Documents\GitHub\Portfolio Ml\.agents\worker_m1_1\handoff.md

## Mission
Perform rigorous forensic integrity audit on `data/projects.ts` to detect any cheating, hardcoding, mock shortcuts, dummy implementations, or fake metrics.
Verify:
1. `data/projects.ts` contains genuine, full-fledged TypeScript type exports and 7 enriched project objects matching portfolio requirements.
2. No mock or bypass hacks were introduced into `tsconfig.json` or build scripts.
3. Compilation checks were genuinely run and passed.

## Deliverables
- Write `audit_report.md` and `handoff.md` in `c:\Users\wisdo\OneDrive\Documents\GitHub\Portfolio Ml\.agents\auditor_m1_1\`.
- Explicitly state verdict: `CLEAN` or `INTEGRITY VIOLATION`.
