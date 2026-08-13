# Scope: E2E Testing Suite for Dedicated /works Page

## Architecture
- Framework: Playwright (`@playwright/test`)
- Scope: Opaque-box E2E user interaction testing for `/works` and `/` routes.
- Coverage: 4-Tier test suite (47 total test cases)

## Feature Inventory
| # | Feature | Description | Milestone | Source |
|---|---------|-------------|-----------|--------|
| 1 | `/works` Route & Navigation | Page loading, URL routing, title, canvas mounting | M1 (Tier 1) | survey |
| 2 | Canvas Tree Rendering & Node Visibility | Bezier tree canvas rendering, scroll progress, leaf DOM nodes | M1 (Tier 1) | survey |
| 3 | Leaf Tooltips & Hover State | Tooltip card display on hover, thumbnail, title, tags | M1 (Tier 1) | survey |
| 4 | Slide-Over Drawer | Glassmorphism sheet modal open/close, metrics, GitHub links, ESC close | M1 (Tier 1) | survey |
| 5 | Navbar Integration | Navigation links, active state indicators, route switching | M1 (Tier 1) | survey |
| 6 | Boundary & Corner Cases | Empty data, viewport sizes (375, 768, 1280, 2560), rapid scroll, body scroll lock | M2 (Tier 2) | survey |
| 7 | Cross-Feature Interactions | Full end-to-end user journeys (nav -> scroll -> hover -> click drawer -> close -> resize) | M3 (Tier 3) | survey |
| 8 | Real-World Application Scenarios | Recruiter audit, mobile throttling, High-DPI canvas, A11y keyboard, contrast ratio | M4 (Tier 4) | survey |

## Milestones
| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| M0 | Infrastructure Setup | Install `@playwright/test` and create `playwright.config.ts` | none | DONE |
| M1 | Tier 1 Feature Coverage | Write 25 test cases for core features | M0 | IN_PROGRESS |
| M2 | Tier 2 Boundary & Corner | Write 12 test cases for boundaries & edge cases | M1 | PLANNED |
| M3 | Tier 3 Cross-Feature | Write 5 test cases for multi-step journeys | M2 | PLANNED |
| M4 | Tier 4 Real-World Scenarios | Write 5 test cases for real-world scenarios | M3 | PLANNED |
| M5 | Suite Execution & Signal | Run full test suite, verify 100% pass, publish `TEST_READY.md` | M4 | PLANNED |

## Interface Contracts
### E2E Test Suite ↔ Portfolio App
- Server Port: `http://localhost:3000` (or `http://localhost:3001` if port in use)
- App Router Routes: `/`, `/works`
- DOM Attributes: `data-testid`, `role`, `aria-label`, `aria-modal`, `aria-expanded`
