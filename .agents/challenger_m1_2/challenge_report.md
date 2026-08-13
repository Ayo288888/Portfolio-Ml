# Challenge Report — Milestone 1 (Data Infrastructure & Enriched Projects Dataset)

**Challenger**: Challenger 2
**Target File**: `data/projects.ts`
**Date**: 2026-08-11
**Verdict**: **APPROVE**

---

## Challenge Summary

**Overall risk assessment**: **LOW**

Empirical stress testing of `data/projects.ts` was conducted across 429 individual assertions covering TypeScript schema strictness, metrics array completeness, highlights string descriptive depth, tag uniqueness and formatting, URL syntax validity, HTTP network reachability, leaf node scroll progress bounds, and image asset file existence on disk.

The data structure, TypeScript types, and dataset integrity are robust and fully conform to `PROJECT.md` and `SCOPE.md` requirements. 

---

## Stress Test Results

| # | Scenario / Test Harness | Expected Behavior | Actual Behavior | Result |
|---|-------------------------|-------------------|-----------------|--------|
| 1 | `PROJECTS_DATA` array length & ID uniqueness | Exactly 7 enriched projects with unique kebab-case IDs | 7 items, 7 unique kebab-case IDs | **PASS** |
| 2 | Metrics array completeness (`label` & `value`) | Every project has non-empty metrics with valid string `label` and `value` | 7/7 projects pass; all 21 metrics have non-empty `label` and `value` | **PASS** |
| 3 | Metric label uniqueness within projects | No duplicate metric labels in a single project | 0 duplicate metric labels found | **PASS** |
| 4 | Highlights array non-empty descriptive strings | Every highlight is non-empty and >= 10 characters long | 7/7 projects pass; all 21 highlights are descriptive (>= 10 chars) | **PASS** |
| 5 | Tag lists validation & formatting | Non-empty tags, no leading/trailing whitespace, unique within project | 7/7 projects pass; 40+ tags verified cleanly formatted | **PASS** |
| 6 | URL string syntax parsing (`new URL()`) | `liveUrl` and `githubUrl` parse cleanly with `http`/`https` protocol | 100% valid URL syntax across all project links | **PASS** |
| 7 | Live site HTTP network reachability | Live demo URLs return HTTP 2xx/3xx | `marginal-paper-reader.onrender.com` (200 OK), `phish-guard-ebon.vercel.app` (200 OK), `avasoft-health.onrender.com` (200 OK with cold start) | **PASS** |
| 8 | GitHub repository HTTP reachability | GitHub repository URLs return HTTP 200 OK | 1/7 reachable (`sentiment_analysis` 200 OK); 6/7 return HTTP 404 (private/placeholder repos) | **WARN (Non-blocking)** |
| 9 | `leafConfig` scroll progress bounds & order | `startScroll < endScroll` in [0, 1], valid side (`left`/`right`), valid hex `accentColor` (`#XXXXXX`), monotonic sequence | 7/7 leaf configs strictly compliant, monotonic scroll ranges from 0.05 to 0.94 | **PASS** |
| 10 | Image asset existence on disk | Referenced image paths exist under `public/` directory | All 7 images found on disk in `public/` and `public/previews/` | **PASS** |
| 11 | TypeScript compilation & strict type checking | `npx tsc --noEmit data/projects.ts` compiles with 0 errors | 0 TypeScript errors in `data/projects.ts` | **PASS** |
| 12 | Negative type enforcement check | Type violations (e.g. invalid `side`, missing fields) rejected by `tsc` | `tsc` throws `TS2322` / `TS2741` on bad schemas as expected | **PASS** |

---

## Challenges & Findings

### [Low] Challenge 1: GitHub Repository URLs HTTP 404 Responses

- **Assumption challenged**: All specified `githubUrl` links point to public, accessible GitHub repositories.
- **Attack scenario**: User clicks "Source Code" in the slide-over drawer and lands on a GitHub 404 page.
- **Empirical observation**:
  - `https://github.com/Ayo288888/sentiment_analysis` → HTTP 200 OK (Public).
  - `https://github.com/Ayo288888/marginal-paper-reader` → HTTP 404 Not Found.
  - `https://github.com/Ayo288888/healthcare-diagnosis-chatbot` → HTTP 404 Not Found.
  - `https://github.com/Ayo288888/phishguard-detector` → HTTP 404 Not Found.
  - `https://github.com/Ayo288888/deepfake-security-system` → HTTP 404 Not Found.
  - `https://github.com/Ayo288888/kitti-object-detection` → HTTP 404 Not Found.
  - `https://github.com/Ayo288888/nct-progress-tracker-api` → HTTP 404 Not Found.
- **Blast radius**: Cosmetic / UX degradation when users click source code links for non-public repositories.
- **Mitigation**: Ensure target repositories are published or made public before production release, or render drawer UI with appropriate status badges if source code is private.

---

## Unchallenged Areas

- **Canvas Rendering Performance**: Handled in Milestone 2 (`components/works-canvas-tree.tsx`).
- **Drawer Animation & UX**: Handled in Milestone 3 (`components/project-detail-drawer.tsx`).
