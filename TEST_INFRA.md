# E2E Test Infra: Portfolio Ml - Dedicated /works Page

## Test Philosophy
- Opaque-box, requirement-driven end-to-end testing.
- Independent of internal React component implementations or internal state.
- Focus on user-observable UI behaviors, DOM attributes (`data-testid`, `role`, `aria-label`), interactive canvas tree nodes, leaf tooltips, glassmorphic drawer modal, keyboard accessibility (`Escape` key), body scroll locking, responsive viewports, and route transitions.
- Testing Framework: Playwright (`@playwright/test`) with automatic Next.js dev/prod server lifecycle management.

## Feature Inventory
| # | Feature | Source (requirement) | Tier 1 | Tier 2 | Tier 3 | Tier 4 |
|---|---------|---------------------|:------:|:------:|:------:|:------:|
| 1 | `/works` Route & Navigation | ORIGINAL_REQUEST §1, PROJECT.md M1 | 5 | 2 | ✓ | ✓ |
| 2 | Canvas Tree Rendering & Node Visibility | ORIGINAL_REQUEST §2, PROJECT.md M2 | 5 | 3 | ✓ | ✓ |
| 3 | Leaf Hover Tooltips & Preview | ORIGINAL_REQUEST §3, PROJECT.md M3 | 5 | 2 | ✓ | ✓ |
| 4 | Slide-Over Detail Drawer | ORIGINAL_REQUEST §4, PROJECT.md M4 | 5 | 3 | ✓ | ✓ |
| 5 | Navbar Links & Active Route States | ORIGINAL_REQUEST §5, PROJECT.md M5 | 5 | 2 | ✓ | ✓ |

## Test Architecture
- **Runner**: `@playwright/test`
- **Config file**: `playwright.config.ts`
- **Test Command**: `npx playwright test`
- **Dev WebServer Command**: `npm run dev` (Port 3000)
- **Directory Layout**:
  - `playwright.config.ts` (Root test configuration)
  - `tests/e2e/tier1-feature-coverage.spec.ts` (25 Tier 1 test cases)
  - `tests/e2e/tier2-boundary-corner.spec.ts` (12 Tier 2 test cases)
  - `tests/e2e/tier3-cross-feature.spec.ts` (5 Tier 3 test cases)
  - `tests/e2e/tier4-real-world.spec.ts` (5 Tier 4 test cases)

## Real-World Application Scenarios (Tier 4)
| # | Scenario | Features Exercised | Complexity |
|---|----------|--------------------|------------|
| 1 | Recruiter Fast Audit Journey | Navbar, `/works` route, canvas tree scroll, leaf click, drawer open/close, live links | Medium |
| 2 | Throttled Mobile & Slow Network Audit | 375px viewport, touch interaction, scroll lock, drawer ESC close | High |
| 3 | High-DPI Display Scaling & Canvas Render | Retina 2x scaling, viewport resize, canvas branch ratio stability | Medium |
| 4 | Keyboard Accessibility & Screen Reader Audit | Tab navigation, leaf focus, aria-expanded, ESC key closure, aria-modal focus trap | High |
| 5 | Visual Contrast & Theme Consistency | Dark mode background `#030712`, glowing branch canvas visibility, glassmorphism drawer | Medium |

## Coverage Thresholds
- Tier 1: 25 test cases (5 per feature across 5 core features)
- Tier 2: 12 boundary & corner test cases
- Tier 3: 5 cross-feature combination test cases
- Tier 4: 5 real-world application scenario test cases
- **Total test cases**: 47 opaque-box E2E test cases
