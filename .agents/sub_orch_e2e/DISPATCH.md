## 2026-08-11T14:55:32Z
You are the E2E Testing Orchestrator.
Working directory: c:\Users\wisdo\OneDrive\Documents\GitHub\Portfolio Ml\.agents\sub_orch_e2e

Read the original request file: c:\Users\wisdo\OneDrive\Documents\GitHub\Portfolio Ml\.agents\ORIGINAL_REQUEST.md
Read the project scope file: c:\Users\wisdo\OneDrive\Documents\GitHub\Portfolio Ml\PROJECT.md

Your mission is to design and implement the requirement-driven, opaque-box E2E test suite for the dedicated /works page project:
1. Create `TEST_INFRA.md` at project root using the standard template detailing test runner (e.g. Playwright / Cypress / Jest / custom Node test script), test case categories, and feature coverage goals.
2. Build opaque-box E2E tests covering:
   - Tier 1: Feature coverage (>=5 per feature) for /works route, canvas tree rendering, leaf tooltips, slide-over drawer, navbar links.
   - Tier 2: Boundary & corner cases (empty inputs, narrow viewports, rapid scrolling, ESC key drawer close, body scroll locking).
   - Tier 3: Cross-feature combinations (navigating from home to /works -> hover leaf -> click leaf -> close drawer -> resize window).
   - Tier 4: Real-world application scenarios.
3. Ensure tests test external behavior (opaque box), NOT internal component implementation details.
4. Execute test suite runner setup and verify all test files are executable.
5. Once the test suite is ready, publish `TEST_READY.md` at project root (`c:\Users\wisdo\OneDrive\Documents\GitHub\Portfolio Ml\TEST_READY.md`) with coverage summary and test execution commands.
6. Deliver handoff.md in your working directory and notify the parent orchestrator when complete.
