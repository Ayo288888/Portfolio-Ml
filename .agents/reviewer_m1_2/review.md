# Milestone 1 Code Review: `data/projects.ts`

**Reviewer**: Reviewer 2 (Milestone 1)
**Date**: 2026-08-11
**Target File**: `data/projects.ts`
**Verdict**: **APPROVE**

---

## Review Summary

`data/projects.ts` provides a clean, architecturally robust, and type-safe data model and dataset for the portfolio's 7 machine learning projects. The implementation fully conforms to all specifications detailed in `PROJECT.md` § Interface Contracts and `SCOPE.md`.

All 7 portfolio items contain rich, real-world metrics and technical details. The `leafConfig` scroll bounds are monotonically increasing, non-overlapping, and include clean 0.02 spacing buffers between adjacent node branches. All image preview assets exist in the `public/` filesystem.

Target file `data/projects.ts` introduces zero compilation or type errors.

---

## Dimension Assessments

### 1. Correctness & Type Safety
- **Target File (`data/projects.ts`)**: 0 compilation errors. All interfaces (`ProjectMetric`, `LeafNodeConfig`, `Project`) exported with exact shape matching `PROJECT.md`.
- **Dataset**: `PROJECTS_DATA` array contains 7 fully populated items.
- **Helper**: `getProjectById` exported and correctly types return as `Project | undefined`.
- **TypeScript strictness**: All fields adhere to strict types; optional fields (`liveUrl?: string`, `githubUrl?: string`, `description?: string` on metrics) are properly typed.
- **Global `npx tsc --noEmit` Note**: 4 type errors reported in pre-existing homepage components (`components/sentient-sphere.tsx` for missing `@types/three` and `components/tech-marquee.tsx` for `WebkitTextStroke` property casing). Target file `data/projects.ts` has zero errors.

### 2. Scroll Progression (`leafConfig` Bounds)
- Scroll bounds check across all 7 items:
  1. `marginal-ai-reader`: `startScroll`: 0.05, `endScroll`: 0.16 (side: left, y: 10%, x: 28%)
  2. `healthcare-diagnosis-chatbot`: `startScroll`: 0.18, `endScroll`: 0.29 (side: right, y: 24%, x: 32%)
  3. `phishguard-detector`: `startScroll`: 0.31, `endScroll`: 0.42 (side: left, y: 38%, x: 25%)
  4. `deepfake-security-system`: `startScroll`: 0.44, `endScroll`: 0.55 (side: right, y: 52%, x: 35%)
  5. `kitti-object-detection`: `startScroll`: 0.57, `endScroll`: 0.68 (side: left, y: 66%, x: 30%)
  6. `nct-progress-tracker-api`: `startScroll`: 0.70, `endScroll`: 0.81 (side: right, y: 80%, x: 28%)
  7. `transformer-sentiment-analysis`: `startScroll`: 0.83, `endScroll`: 0.94 (side: left, y: 92%, x: 32%)
- **Validation Results**:
  - `startScroll < endScroll` holds for every item ($\Delta = 0.11$).
  - Consecutive items have positive scroll gaps ($0.02$), ensuring no branch overlap during animation rendering.
  - Alternating branch sides (`left` -> `right` -> `left` -> `right` -> `left` -> `right` -> `left`).
  - Y-offset percentages increase monotonically from 10% to 92%.
  - Hex accent colors are distinct for bioluminescent glow rendering.

### 3. Image Asset Integrity Verification
Verified that all relative image paths point to existing files in `public/`:
- `/previews/marginal-paper-reader.png` (90 KB) — Verified
- `/previews/healthcare-chatbot-preview.png` (454 KB) — Verified
- `/previews/phishguard-preview.png` (695 KB) — Verified
- `/abstract-neural-network-visualization-dark-theme.jpg` (87 KB) — Verified
- `/futuristic-data-dashboard-dark-minimal.jpg` (58 KB) — Verified
- `/sound-wave-visualization-dark-theme.jpg` (81 KB) — Verified
- `/previews/sentiment-analysis-preview.png` (213 KB) — Verified

### 4. Adversarial & Integrity Audit
- **Integrity Check**: Pass. No hardcoded test overrides, dummy mocks, or self-certifying shortcuts found.
- **Null Safety**: Optional fields (`liveUrl`, `githubUrl`) are safely declared and handled.
- **UI Integration Readiness**: All 7 projects provide complete datasets required for downstream Canvas rendering (M2), Leaf Tooltips (M3), Detail Drawer (M3), and `/works` page (M4).

---

## Verified Claims

- Target `data/projects.ts` contains zero compilation errors → Verified via `npx tsc --noEmit` output → PASS
- Interfaces export correctly (`ProjectMetric`, `LeafNodeConfig`, `Project`) → Verified via file inspection → PASS
- `PROJECTS_DATA` contains 7 items → Verified via file inspection → PASS
- `getProjectById` helper exported → Verified via file inspection → PASS
- `leafConfig` scroll ranges non-overlapping → Verified via scroll range calculations → PASS
- Image files exist in `public/` → Verified via directory search → PASS

---

## Findings (Pre-Existing Codebase)
- **Minor / Pre-existing Finding**: `components/sentient-sphere.tsx` (Lines 5, 6) missing `@types/three` module declaration; `components/tech-marquee.tsx` (Lines 55, 59) uses upper-case `WebkitTextStroke` instead of `webkitTextStroke`. Not related to Milestone 1 `data/projects.ts`.

---

## Verdict

**APPROVE**
