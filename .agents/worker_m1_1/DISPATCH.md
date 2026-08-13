# Task Assignment: Worker 1 for Milestone 1

## Identity
- Role: Worker 1
- Type: teamwork_preview_worker
- Working Directory: c:\Users\wisdo\OneDrive\Documents\GitHub\Portfolio Ml\.agents\worker_m1_1
- Target Implementation File: c:\Users\wisdo\OneDrive\Documents\GitHub\Portfolio Ml\data\projects.ts

## Context & Files to Read
- Original Request: c:\Users\wisdo\OneDrive\Documents\GitHub\Portfolio Ml\.agents\ORIGINAL_REQUEST.md
- Project Scope: c:\Users\wisdo\OneDrive\Documents\GitHub\Portfolio Ml\PROJECT.md
- Milestone Scope: c:\Users\wisdo\OneDrive\Documents\GitHub\Portfolio Ml\.agents\sub_orch_m1\SCOPE.md
- Explorer Blueprint: c:\Users\wisdo\OneDrive\Documents\GitHub\Portfolio Ml\.agents\explorer_m1_1\analysis.md
- Spec Requirements: c:\Users\wisdo\OneDrive\Documents\GitHub\Portfolio Ml\.agents\spec_miner_m1_3\spec_requirements.md

## Mission
Implement `data/projects.ts` cleanly, exporting:
1. `ProjectMetric` interface
2. `LeafNodeConfig` interface
3. `Project` interface
4. `PROJECTS_DATA: Project[]` (array of 7 enriched portfolio items)
5. `getProjectById(id: string): Project | undefined` helper function

Then verify TypeScript compilation by running `npm run build` or `npx tsc --noEmit`.

## MANDATORY INTEGRITY WARNING
DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A teamwork_preview_auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.

## Deliverables
- Write `changes.md` and `handoff.md` in `c:\Users\wisdo\OneDrive\Documents\GitHub\Portfolio Ml\.agents\worker_m1_1\`.
- Report build/type-check results in `handoff.md`.

## 2026-08-11T14:58:07Z
<USER_REQUEST>
You are Worker 1 for Milestone 1.
Your working directory is: c:\Users\wisdo\OneDrive\Documents\GitHub\Portfolio Ml\.agents\worker_m1_1
Read your task dispatch file: c:\Users\wisdo\OneDrive\Documents\GitHub\Portfolio Ml\.agents\worker_m1_1\DISPATCH.md
Read ORIGINAL_REQUEST.md: c:\Users\wisdo\OneDrive\Documents\GitHub\Portfolio Ml\.agents\ORIGINAL_REQUEST.md
Read PROJECT.md: c:\Users\wisdo\OneDrive\Documents\GitHub\Portfolio Ml\PROJECT.md
Read SCOPE.md: c:\Users\wisdo\OneDrive\Documents\GitHub\Portfolio Ml\.agents\sub_orch_m1\SCOPE.md
Read Explorer Blueprint: c:\Users\wisdo\OneDrive\Documents\GitHub\Portfolio Ml\.agents\explorer_m1_1\analysis.md

Implement `data/projects.ts` containing the TypeScript interfaces (`Project`, `ProjectMetric`, `LeafNodeConfig`), the `PROJECTS_DATA` array of 7 enriched portfolio items, and `getProjectById` function.
Run TypeScript compilation check (`npm run build` or `npx tsc --noEmit`) and verify there are no compilation errors.
Document your changes in `changes.md` and deliver `handoff.md` in `c:\Users\wisdo\OneDrive\Documents\GitHub\Portfolio Ml\.agents\worker_m1_1\`.
Send a completion message back to parent when done.
</USER_REQUEST>
