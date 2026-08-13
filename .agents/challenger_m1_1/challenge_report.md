# Challenge Report — Milestone 1 (Challenger 1)

## Challenge Summary

**Overall risk assessment**: LOW

All empirical verification checks against `data/projects.ts` passed successfully. The data structure, field types, array constraints, filesystem assets, and helper lookup function comply 100% with the specs set forth in `PROJECT.md` and `SCOPE.md`.

---

## Challenges & Stress Test Scenarios

### [Low] Challenge 1: Non-existent image asset paths
- **Assumption challenged**: Every `image` URL in `PROJECTS_DATA` references a valid, existing image asset in the `/public` directory.
- **Attack scenario**: If image paths contain typos or reference non-existent files, frontend components (e.g. leaf hover tooltips or detail drawers) will render broken image icons or trigger 440/404 image load errors.
- **Blast radius**: Degraded UI user experience with missing thumbnails on tooltips/drawers.
- **Stress Test Results**:
  - `marginal-ai-reader`: `/previews/marginal-paper-reader.png` (90,067 bytes) → [EXISTS] → [PASS]
  - `healthcare-diagnosis-chatbot`: `/previews/healthcare-chatbot-preview.png` (454,505 bytes) → [EXISTS] → [PASS]
  - `phishguard-detector`: `/previews/phishguard-preview.png` (695,295 bytes) → [EXISTS] → [PASS]
  - `deepfake-security-system`: `/abstract-neural-network-visualization-dark-theme.jpg` (87,553 bytes) → [EXISTS] → [PASS]
  - `kitti-object-detection`: `/futuristic-data-dashboard-dark-minimal.jpg` (58,512 bytes) → [EXISTS] → [PASS]
  - `nct-progress-tracker-api`: `/sound-wave-visualization-dark-theme.jpg` (81,569 bytes) → [EXISTS] → [PASS]
  - `transformer-sentiment-analysis`: `/previews/sentiment-analysis-preview.png` (213,250 bytes) → [EXISTS] → [PASS]
- **Mitigation**: All 7 files physically exist in `public/`.

### [Low] Challenge 2: Duplicate or invalid Project IDs
- **Assumption challenged**: All items in `PROJECTS_DATA` possess unique, non-empty string IDs for routing, selection state, and lookup.
- **Attack scenario**: Duplicate IDs would cause `getProjectById` to return incorrect data or create React key collision warnings when rendering leaf nodes.
- **Blast radius**: Incorrect project selected in slide-over drawer; key collisions in React DOM render.
- **Stress Test Results**:
  - Exactly 7 items present.
  - Set of unique IDs size = 7.
  - IDs tested: `marginal-ai-reader`, `healthcare-diagnosis-chatbot`, `phishguard-detector`, `deepfake-security-system`, `kitti-object-detection`, `nct-progress-tracker-api`, `transformer-sentiment-analysis`.
  - All 7 IDs unique → [PASS]

### [Low] Challenge 3: Helper function `getProjectById` boundary behavior
- **Assumption challenged**: `getProjectById` retrieves valid projects by ID and returns `undefined` safely when passed non-existent or invalid inputs without throwing runtime errors.
- **Attack scenario**: Invalid ID passed via query parameter or state resulting in runtime exception or false positive match.
- **Blast radius**: Application crash on invalid project lookup.
- **Stress Test Results**:
  - `getProjectById(id)` for all 7 valid IDs → returns corresponding `Project` instance → [PASS]
  - `getProjectById('non-existent-id')` → returns `undefined` → [PASS]
  - `getProjectById('')` → returns `undefined` → [PASS]
  - `getProjectById('invalid_123')` → returns `undefined` → [PASS]
  - `getProjectById('MARGINAL-AI-READER')` (case mismatch) → returns `undefined` → [PASS]

### [Low] Challenge 4: `leafConfig` numerical range & boundary constraints
- **Assumption challenged**: Scroll offsets (`startScroll`, `endScroll`) are normalized between 0.0 and 1.0, monotonically increasing (`startScroll < endScroll`), percentage offsets are within 0-100%, and side is strictly `"left"` | `"right"`.
- **Attack scenario**: Out-of-bounds scroll values or inverted start/end ranges would cause canvas branch animation glitching, instant branch jumps, or branches rendering off-screen.
- **Blast radius**: Visual artifacts in 2D canvas tree rendering engine in Milestone 2.
- **Stress Test Results**:
  - `startScroll` values: `0.05, 0.18, 0.31, 0.44, 0.57, 0.70, 0.83` (all within [0.0, 1.0]) → [PASS]
  - `endScroll` values: `0.16, 0.29, 0.42, 0.55, 0.68, 0.81, 0.94` (all within [0.0, 1.0] and `endScroll > startScroll`) → [PASS]
  - `side`: Alternates between `"left"` and `"right"` across all 7 projects → [PASS]
  - `xOffsetPct`: All values in range [25, 35] → [PASS]
  - `yOffsetPct`: All values in range [10, 92] → [PASS]
  - `accentColor`: Hex color strings match `/^#[0-9a-fA-F]{6}$/` (`#3b82f6`, `#10b981`, `#f59e0b`, `#ec4899`, `#8b5cf6`, `#06b6d4`, `#6366f1`) → [PASS]

### [Low] Challenge 5: Completeness of required string fields & collections
- **Assumption challenged**: No project has missing or empty strings (`title`, `shortDescription`, `longDescription`, `year`, `category`) or empty arrays (`tags`, `metrics`, `highlights`).
- **Attack scenario**: Missing fields would cause undefined render errors or layout collapse in leaf tooltips and slide-over drawers.
- **Blast radius**: UI rendering errors in detail drawers and hover tooltips.
- **Stress Test Results**:
  - All 7 projects verified to contain valid non-empty string properties and non-empty arrays for `tags`, `metrics`, and `highlights` → [PASS]

---

## Stress Test Results Summary Table

| Test Scenario | Target | Expected Behavior | Actual Behavior | Result |
|---------------|--------|-------------------|-----------------|--------|
| Dataset Count | `PROJECTS_DATA.length` | Exactly 7 | 7 | PASS |
| ID Uniqueness | `PROJECTS_DATA[].id` | 7 unique IDs | 7 unique IDs | PASS |
| File Assets | `public/${image}` | All 7 files exist on disk | All 7 files exist on disk | PASS |
| Helper Lookup | `getProjectById` | Exact match for valid ID, `undefined` for invalid | Exact match for valid ID, `undefined` for invalid | PASS |
| Leaf Config Bounds | `leafConfig` | `0 <= start < end <= 1`, valid side/offsets/hex | All 7 configs satisfy constraints | PASS |
| Field Schema | String & Array fields | Non-empty strings & populated arrays | All 7 projects fully populated | PASS |

---

## Unchallenged Areas

- **Canvas 2D Rendering Engine Integration**: Canvas rendering performance (60fps) and Bezier path generation are scheduled for Milestone 2 (`components/works-canvas-tree.tsx`) and are out of scope for Milestone 1 data infrastructure validation.
