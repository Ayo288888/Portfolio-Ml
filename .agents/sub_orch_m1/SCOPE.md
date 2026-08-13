# Scope: Milestone 1 — Projects Data Infrastructure

## Architecture
- `data/projects.ts`: Central dataset and TypeScript types for portfolio projects.
- Shared TypeScript interfaces: `Project`, `ProjectMetric`, `LeafNodeConfig`.
- `PROJECTS_DATA`: Exported array of 7 enriched portfolio project items.

## Feature Inventory Mapping
| # | Feature / Work Item | Description | Milestone | Source |
|---|--------------------|-------------|-----------|--------|
| 1 | TypeScript Types | `Project`, `ProjectMetric`, `LeafNodeConfig` interfaces | M1 | PROJECT.md / ORIGINAL_REQUEST.md |
| 2 | Portfolio Dataset | `PROJECTS_DATA` array with 7 enriched items | M1 | PROJECT.md / ORIGINAL_REQUEST.md |

## Milestones
| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| 1 | Projects Data Infrastructure | Implement `data/projects.ts` with types & 7 enriched portfolio items | none | IN_PROGRESS |

## Interface Contracts
### `data/projects.ts`
- Export `interface LeafNodeConfig`: `{ category: string; description: string; [key: string]: any }` (or detailed fields required by spec)
- Export `interface ProjectMetric`: `{ label: string; value: string; detail?: string }`
- Export `interface Project`: `{ id: string; title: string; subtitle: string; description: string; category: string; tags: string[]; metrics: ProjectMetric[]; leafNodeConfig?: LeafNodeConfig; githubUrl?: string; liveUrl?: string; ... }` (Explorers will detail exact requirements)
- Export `const PROJECTS_DATA: Project[]`
