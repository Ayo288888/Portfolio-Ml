# Implementation Plan: Interactive /works Page & Procedural Canvas Tree UI

## Objective
Implement a dedicated interactive `/works` page with a 2D/Canvas procedural tree branch UI, hover leaf preview tooltips, slide-over project detail drawer, navbar link integration, dark aesthetic matching existing theme, and 60fps responsive canvas rendering, while keeping `app/page.tsx` completely untouched.

## Execution Strategy (Project Orchestration Pattern)
1. **Step 0: Survey Phase**
   - Dispatch 3 parallel Explorers:
     - `explorer_1`: Investigate current codebase structure, Next.js version/routing setup, Tailwind CSS / styling conventions, global styles, font, theme, existing components (Navbar, UI components), and project data sources.
     - `explorer_2`: Investigate existing Works/Projects data model, projects list (if any in codebase), types, images/thumbnails, external links, and state management pattern.
     - `explorer_3`: Investigate technical requirements for 2D/Canvas procedural tree rendering (scroll progress binding, branch growth algorithm, responsive canvas resizing, DPR scaling, performance optimization for 60fps, hover detection/hit-testing on canvas nodes, glassmorphic drawer UI design).
2. **Step 1: Scope Synthesis & Project Specification (`PROJECT.md`)**
   - Consolidate survey findings.
   - Map Feature Inventory and define architecture, component boundaries, interface contracts, and milestone breakdown.
3. **Step 2: Dual Track Execution**
   - **E2E Testing Track**: Build opaque-box E2E test suite covering Tiers 1-4 for all requirements (canvas rendering, drawer interaction, tooltips, navigation integrity, responsiveness, build validity).
   - **Implementation Track**: Execute milestones via sub-orchestrators/workers (Component design, Canvas engine, Works page, Navbar updates, E2E validation & adversarial hardening).
4. **Step 3: Verification & Sentinel Handoff**
   - Verify 100% build & test pass + Forensic Audit CLEAN status.
   - Deliver final report to Sentinel.
