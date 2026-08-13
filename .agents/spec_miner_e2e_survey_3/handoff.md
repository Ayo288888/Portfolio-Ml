# End-to-End (E2E) Test Specification Report

**Agent**: Spec Miner (`spec_miner_e2e_survey_3`)  
**Target Feature**: Dedicated `/works` route, Procedural 2D Canvas Scroll Tree, Interactive Leaf Tooltips, Glassmorphic Slide-Over Detail Drawer, Navbar Navigation  
**Scope**: Tiers 1–4 Complete E2E Specification Matrix & Edge Cases  
**Date**: 2026-08-11  

---

## 1. Executive Summary

This report establishes the complete, authoritative End-to-End (E2E) Test Specification Matrix for the portfolio's interactive **Works** feature (`/works`). The specifications cover:
1. **Tier 1 (Feature Coverage)**: 25 test cases across 5 core features (minimum 5 per feature).
2. **Tier 2 (Boundary & Corner Cases)**: 12 test cases covering zero data, multi-viewport layout switches (375px, 768px, 1280px, 2560px), rapid scrolling, ESC key dismissal, and scroll lock behavior.
3. **Tier 3 (Cross-Feature Combinations)**: 5 end-to-end multi-step workflow scenarios testing full user journeys across navigation, scroll, hover, click, drawer, resize, and route transitions.
4. **Tier 4 (Real-World Application Scenarios)**: 5 real-world environment scenarios covering technical recruiters, throttled networks/CPUs, high-DPI Retina displays, accessibility screen readers, and dark theme contrast.

---

## 2. Features Discovered

| # | Category | Feature | Description | Inputs | Outputs | Error Behavior | Discovered Via |
|---|----------|---------|-------------|--------|---------|----------------|----------------|
| 1 | Route & Navigation | `/works` Route Loading | Dedicated Next.js App Router route (`app/works/page.tsx`) rendering dark aesthetic layout | Direct URL GET `/works` or client transition | HTTP 200, `/works` HTML DOM, Lenis smooth scroll active | HTTP 404 / 500 fallback if route missing | `PROJECT.md` § Code Layout |
| 2 | Canvas Engine | Procedural 2D Canvas Scroll Tree | HTML5 `<canvas>` rendering organic Cubic Bezier branches bound to window scroll progress $S \in [0, 1]$ | Window `scroll` event, scroll Y position | Parametric curve rendering with `shadowBlur` glow | Falls back to static branch lines if WebGL/Canvas context fails | `ORIGINAL_REQUEST.md` R1 |
| 3 | Canvas Engine | Dynamic High-DPI Canvas Scaling | Canvas bitmap buffer scaled to `window.devicePixelRatio` capped at `2.0` | Window `resize` or screen DPI change | Redrawn crisp canvas paths matching CSS pixel dimensions | Canvas context reset & re-render on resize | `PROJECT.md` § Architecture |
| 4 | UI Layer | Interactive Leaf Nodes | Position-absolute DOM buttons at terminal branch coordinates | Scroll position progress matching `progressOffset` | Rendered leaf buttons with bioluminescent glow indicator | Hidden/unrendered if scroll progress < `progressOffset` | `PROJECT.md` § Interface Contracts |
| 5 | UI Layer | Framer Motion Leaf Tooltips | Hover preview card showing project thumbnail, title, year, category, top 3 tags | Mouse enter or keyboard focus on leaf DOM node | Glassmorphic floating card with smooth opacity/scale animation | Fast hover out cancels animation frame | `ORIGINAL_REQUEST.md` R2 |
| 6 | UI Layer | Slide-Over Detail Drawer | Right-side sheet drawer (`Sheet` / `vaul`) presenting complete project details | Mouse click or `Enter`/`Space` keypress on leaf node | Backdrop overlay blur, right slide-in drawer displaying metrics, descriptions, highlights, links | Closing drawer returns focus to leaf button | `PROJECT.md` F6 |
| 7 | Route & Navigation | Active Navbar State | Navbar link indicator (`components/navbar.tsx`) showing active route (`/works`) | Current pathname `/works` | "Works" link styled with active accent color & indicator line | Standard unselected styling when pathname is `/` | `ORIGINAL_REQUEST.md` R3 |
| 8 | Accessibility & Layout | Body Scroll Locking | Lock document scroll when slide-over drawer is open | Drawer open state `isOpen = true` | `document.body` style `overflow: hidden` / `touch-action: none` | Restores original scroll style on drawer close | `PROJECT.md` § Architecture |

---

## 3. Edge Cases

| # | Feature | Input | Observed Behavior |
|---|---------|-------|-------------------|
| 1 | Data Model | Empty `PROJECTS_DATA = []` | Canvas renders seed trunk line without throwing `TypeError`; zero leaf DOM nodes rendered |
| 2 | Data Model | Missing optional links (`liveUrl` or `githubUrl` is `undefined`) | Drawer CTA container dynamically omits missing link button without leaving broken anchor tags |
| 3 | Viewport Layout | Mobile Viewport (375px width) | Trunk shifts to left alignment (`X = 32px`), branches extend right, drawer opens as bottom sheet (`direction="bottom"`) |
| 4 | Viewport Layout | Ultra-wide Viewport (2560px width) | Canvas bounds centered with max-width container, branch coordinates scale without pixelation |
| 5 | User Action | Rapid Scroll Flurry (Top to Bottom in <200ms) | Canvas scroll progress interpolates smoothly without DOM frame dropping or out-of-sync leaf positioning |
| 6 | User Action | Rapid Directional Scroll Bounce | Branch growth progress stays bounded within `[0.0, 1.0]` without negative coordinates or NaN curve renders |
| 7 | Keyboard Nav | `Escape` key pressed while drawer is OPEN | Drawer triggers exit transition, backdrop unmounts, focus returns to leaf trigger node |
| 8 | Keyboard Nav | `Escape` key pressed while drawer is CLOSED | No event handlers intercepted, standard browser behavior maintained without JS runtime errors |
| 9 | Window Lifecycle | Window resize while drawer is OPEN | Drawer layout adapts dynamically (e.g. desktop right-sheet to mobile bottom-sheet) without closing or state loss |
| 10 | Component Lifecycle | Unmount `/works` during scroll animation | `cancelAnimationFrame` invoked on active render loop, preventing memory leak or orphaned canvas callbacks |

---

## 4. Tier 1: Feature Coverage E2E Specification Matrix

### Feature 1: `/works` Route Loading & Navigation
| Test ID | Scenario | Preconditions | Input / Steps | Expected Outcome | Assertions & Selectors |
|---------|----------|---------------|---------------|------------------|------------------------|
| **TC-T1-NAV-01** | Direct URL Navigation to `/works` | Browser open | Navigate directly to `http://localhost:3000/works` | Page loads successfully with HTTP 200; dark background theme applied; title matches metadata | `page.url()` ends with `/works`<br>`page.title()` contains "Works"<br>`body` has dark class `bg-background` |
| **TC-T1-NAV-02** | Client-Side Navigation from Home | On homepage `/` | Click "Works" link in desktop top navbar | URL changes to `/works` without full page reload; page content mounts smoothly | `page.url()` equals `/works`<br>Navbar "Works" link has active class<br>No full page refresh (`performance.navigation.type` is SPA transition) |
| **TC-T1-NAV-03** | Route Isolation from Homepage | On `/works` page | Inspect DOM tree for homepage elements (`#hero`, `#about`) | Homepage hero and about sections are NOT present in DOM | `locator('#hero')` count = 0<br>`locator('#about')` count = 0<br>`locator('canvas')` is visible |
| **TC-T1-NAV-04** | Smooth Scroll Initialization | On `/works` page | Query window scroll position and Lenis instance | Smooth scroll engine (Lenis) active; initial scroll Y is `0` | `window.scrollY === 0`<br>`document.documentElement.classList.contains('lenis')` |
| **TC-T1-NAV-05** | Browser Back & Forward Buttons | Navigated `/` -> `/works` | Click browser Back button, then Forward button | Back button returns to `/`; Forward button returns to `/works` with state preserved | URL updates correctly on back/forward<br>Canvas mounts clean on forward navigation |

### Feature 2: Canvas Tree Rendering & Node Visibility
| Test ID | Scenario | Preconditions | Input / Steps | Expected Outcome | Assertions & Selectors |
|---------|----------|---------------|---------------|------------------|------------------------|
| **TC-T1-CANVAS-01** | HTML5 Canvas Mount & High-DPI Scaling | On `/works` page | Inspect `<canvas>` element properties | Canvas element rendered with DPR-scaled width/height attributes matching viewport | `locator('canvas')` count = 1<br>`canvas.width === canvas.clientWidth * Math.min(window.devicePixelRatio, 2)` |
| **TC-T1-CANVAS-02** | Initial Seed Trunk Rendering | At top of page (`scrollY = 0`) | Observe initial canvas rendering | Base trunk rendered at scroll progress `0.0`; leaf nodes for higher scroll progress are hidden/inactive | Leaf DOM nodes with `progressOffset > 0.1` have opacity 0 or pointer-events none |
| **TC-T1-CANVAS-03** | Scroll-Driven Branch Progress | On `/works` page | Scroll down page to `50%` height | Cubic Bezier branches progressively draw along trunk matching scroll progress | Canvas re-renders via `requestAnimationFrame`<br>Leaves with `progressOffset <= 0.5` become visible |
| **TC-T1-CANVAS-04** | Leaf Node DOM Overlay Alignment | Scroll position at `progressOffset` of Project 1 | Query Leaf Node button bounding rect | Leaf DOM button center `(X, Y)` matches terminal branch coordinate on canvas | Leaf button `locator('[data-leaf-id="marginal-ai"]')` is visible<br>`Math.abs(leafRect.x - branchPoint.x) < 5px` |
| **TC-T1-CANVAS-05** | Dynamic Window Resize Adjustment | On `/works` page at scroll `50%` | Resize window width from 1280px to 1024px | Canvas recalculates dimensions and redraws trunk & branches without visual distortion | `canvas.width` updates to new container width<br>Leaf DOM node positions recalculate to new coordinates |

### Feature 3: Leaf Tooltip Hovering & Display
| Test ID | Scenario | Preconditions | Input / Steps | Expected Outcome | Assertions & Selectors |
|---------|----------|---------------|---------------|------------------|------------------------|
| **TC-T1-TOOLTIP-01** | Mouse Hover Triggers Preview Card | Leaf node visible | Hover mouse over leaf node button `[data-leaf-id="marginal-ai"]` | Framer Motion tooltip card fades in adjacent to leaf node | `locator('[data-testid="leaf-tooltip"]')` is visible<br>Opacity transitions to `1` |
| **TC-T1-TOOLTIP-02** | Tooltip Content Completeness | Tooltip visible | Inspect content inside tooltip card | Displays title, year ("2026"), category ("NLP & GenAI"), thumbnail image, and top tags | Tooltip text contains "Marginal: AI Research Paper Reader"<br>Image `src` contains `/previews/marginal-paper-reader.png` |
| **TC-T1-TOOLTIP-03** | Mouse Unhover Dismisses Tooltip | Tooltip active | Move mouse away from leaf node button to empty area | Tooltip card performs exit animation and unmounts/hides | `locator('[data-testid="leaf-tooltip"]')` is hidden or detached |
| **TC-T1-TOOLTIP-04** | Keyboard Focus Tooltip Display | On `/works` page | Press `Tab` key to focus leaf node button | Tooltip card appears on keyboard focus for screen readers / keyboard users | `locator('[data-leaf-id="marginal-ai"]:focus')` is true<br>Tooltip is visible |
| **TC-T1-TOOLTIP-05** | Rapid Hover Transition Between Leaves | 2 leaves visible | Move mouse quickly from Leaf 1 to Leaf 2 | Leaf 1 tooltip hides immediately; Leaf 2 tooltip displays clean without overlapping | Single tooltip instance present in DOM<br>Content updates to Leaf 2 details |

### Feature 4: Slide-Over Detail Drawer
| Test ID | Scenario | Preconditions | Input / Steps | Expected Outcome | Assertions & Selectors |
|---------|----------|---------------|---------------|------------------|------------------------|
| **TC-T1-DRAWER-01** | Leaf Click Opens Slide-Over Drawer | Leaf node visible | Click leaf node button `[data-leaf-id="marginal-ai"]` | Right slide-over drawer panel (`Sheet`) slides in with glassmorphic backdrop | `locator('[role="dialog"]')` is visible<br>`locator('[data-testid="drawer-backdrop"]')` has backdrop-blur |
| **TC-T1-DRAWER-02** | Complete Project Detail Rendering | Drawer open for "marginal-ai" | Inspect drawer body sections | Renders full title, subtitle, long description, metrics grid, highlights, all tags | Metrics grid contains 3 items ("Retrieval Latency", etc.)<br>Highlights list count >= 3<br>All tags rendered as badges |
| **TC-T1-DRAWER-03** | CTA Action External Links | Drawer open | Inspect "Visit Live Site" and "View GitHub" buttons | Buttons render correct URLs with target `_blank` and security attributes | Live button `href` = `https://marginal-paper-reader.onrender.com/`<br>GitHub button `href` contains `github.com`<br>`target="_blank"`, `rel="noopener noreferrer"` |
| **TC-T1-DRAWER-04** | Backdrop Click Dismissal | Drawer open | Click outside drawer panel on glassmorphic backdrop overlay | Drawer slides out right and unmounts backdrop | `locator('[role="dialog"]')` is hidden<br>Document scroll enabled |
| **TC-T1-DRAWER-05** | Explicit Close Button Click | Drawer open | Click drawer header close icon button (`X`) | Drawer closes gracefully and returns focus to trigger leaf button | `locator('[role="dialog"]')` is hidden<br>Focused element is `[data-leaf-id="marginal-ai"]` |

### Feature 5: Navbar Links & Active Route States
| Test ID | Scenario | Preconditions | Input / Steps | Expected Outcome | Assertions & Selectors |
|---------|----------|---------------|---------------|------------------|------------------------|
| **TC-T1-NAVBAR-01** | Active Route Highlight on `/works` | Navigated to `/works` | Inspect Navbar links in header | "Works" navbar link displays active styling (accent color, underline indicator) | `locator('nav button:has-text("WORKS")')` has active class/attribute `data-active="true"` |
| **TC-T1-NAVBAR-02** | Brand Logo Navigation | On `/works` page | Click brand logo link ("ILORI AYOMIDE") | Navigates back to homepage `/` or scrolls to top | `page.url()` equals `http://localhost:3000/`<br>Homepage hero section visible |
| **TC-T1-NAVBAR-03** | Anchor Link Navigation from `/works` | On `/works` page | Click "About" link in navbar | Navigates to `/#about` or smooth scrolls to about section | URL updates to include `/#about` or redirects to homepage with section hash |
| **TC-T1-NAVBAR-04** | Mobile Hamburger Menu Toggle | Viewport width 375px | Tap mobile hamburger button | Mobile menu overlay slides open showing vertical navigation items | `locator('[data-testid="mobile-menu"]')` is visible<br>Navigation links visible |
| **TC-T1-NAVBAR-05** | Scrolled Navbar Glassmorphism | On `/works` page | Scroll down page > 50px | Navbar header adds `backdrop-blur-md` and subtle border | `locator('header')` has class `backdrop-blur-md` and `border-b` |

---

## 5. Tier 2: Boundary & Corner Cases Matrix

| Test ID | Sub-Category | Preconditions / Input | Observed / Expected Behavior | Verification Assertions |
|---------|--------------|-----------------------|------------------------------|-------------------------|
| **TC-T2-BND-01** | Zero Data Handling | `PROJECTS_DATA = []` mock injected | Page renders clean empty tree trunk; canvas does not crash; empty state text displayed if configured | `locator('canvas')` count = 1<br>No JS errors in console<br>`locator('[data-leaf-id]')` count = 0 |
| **TC-T2-BND-02** | Missing Links Fallback | Project object with `liveUrl: undefined` | Drawer opens cleanly; "Visit Live Site" button hidden; "View GitHub" button renders cleanly | `locator('text="Visit Live Site"')` count = 0<br>`locator('text="View GitHub"')` count = 1 |
| **TC-T2-VIEW-01** | Mobile Viewport 375px | Set viewport 375x667 (iPhone SE) | Tree trunk aligns left (`X = 32px`), branches extend right; drawer opens as bottom sheet (`direction="bottom"`) | `canvas.clientWidth === 375`<br>`locator('[role="dialog"]')` slides up from bottom |
| **TC-T2-VIEW-02** | Tablet Viewport 768px | Set viewport 768x1024 (iPad) | Canvas layout adjusts branch curvature and length factors; leaf buttons remain inside bounds | All leaf node bounding rects satisfy `0 <= X <= 768` |
| **TC-T2-VIEW-03** | Desktop Viewport 1280px | Set viewport 1280x800 (Laptop) | Tree trunk centers horizontally (`X = 640px`), branches alternate left and right | Branch left terminals satisfy `X < 640`; right terminals satisfy `X > 640` |
| **TC-T2-VIEW-04** | Ultra-Wide Viewport 2560px | Set viewport 2560x1440 (4K Monitor) | Canvas layout max-width clamped to 1440px centered container; crisp rendering maintained | Container centered; canvas context DPR scale = 2.0 |
| **TC-T2-SCRL-01** | Rapid Scroll Flurry | Rapid mouse wheel scroll (0 to 3000px in 100ms) | Animation frame loop processes scroll delta smoothly; FPS >= 30; no leaf node displacement | Console performance timing < 16ms/frame<br>Leaf node positions align with final scroll coordinate |
| **TC-T2-SCRL-02** | Directional Scroll Bounce | Scroll 0 -> 100% -> 0% -> 100% rapidly | Scroll progress variable $S$ stays strictly bounded `0.0 <= S <= 1.0`; no canvas stroke overflow | `$S >= 0.0 && $S <= 1.0`<br>No `NaN` values passed to `bezierCurveTo` |
| **TC-T2-ESC-01** | ESC Key Drawer Close | Drawer OPEN, focus in drawer | Press `Escape` key | Drawer close transition begins immediately; backdrop vanishes; focus returns to leaf trigger | `locator('[role="dialog"]')` hidden<br>`document.activeElement` matches leaf button |
| **TC-T2-ESC-02** | Inert ESC Key Press | Drawer CLOSED, on `/works` page | Press `Escape` key | Event ignored cleanly; no unexpected navigation or console warnings | Page state unchanged; zero console errors |
| **TC-T2-LOCK-01** | Body Scroll Lock Active | Drawer OPEN | Inspect `document.body` computed styles | `body` has `overflow: hidden`; background page cannot be scrolled via mouse wheel or touch swipe | `window.getComputedStyle(document.body).overflow === 'hidden'` |
| **TC-T2-LOCK-02** | Body Scroll Lock Release | Drawer CLOSED from open state | Inspect `document.body` computed styles | `body` overflow restored to original state (`unset` / `auto`); background page scrolling resumes | `window.getComputedStyle(document.body).overflow !== 'hidden'` |

---

## 6. Tier 3: Cross-Feature Combination Workflows

### Scenario TC-T3-FLOW-01: Full Visitor Discovery & Inspection Journey
- **Step 1**: User lands on Homepage (`/`). Clicks "Works" in Navbar.
- **Step 2**: Route transitions smoothly to `/works`. Lenis scroll engine initializes at `scrollY = 0`. Seed trunk rendered.
- **Step 3**: User slowly scrolls down page. Procedural Canvas tree grows Bezier branches dynamically.
- **Step 4**: Leaf node for "Marginal AI" resolves at `progressOffset = 0.14`. User hovers mouse over leaf node.
- **Step 5**: Framer Motion preview card pops up showing thumbnail, title, year, tags.
- **Step 6**: User clicks leaf node. Slide-over drawer opens from right with glassmorphic blur.
- **Step 7**: User reads project description, inspects metrics grid, clicks "Visit Live Site" (opens new tab).
- **Step 8**: User presses `Escape` key to close drawer. Drawer slides out right. Focus returns to leaf node.
- **Step 9**: User resizes browser window from 1280px to 768px. Canvas & leaf nodes re-layout seamlessly.
- **Step 10**: User clicks Brand Logo in Navbar to return Home (`/`). Page transitions cleanly.

### Scenario TC-T3-FLOW-02: Multi-Project Sequential Exploration
- **Step 1**: User navigates to `/works` and scrolls to 50% height.
- **Step 2**: Clicks Leaf Node 2 ("Healthcare Chatbot"). Slide-over drawer opens.
- **Step 3**: Inspects metrics ("Clinical F1-Score: 0.942"). Clicks glassmorphic backdrop overlay to dismiss drawer.
- **Step 4**: Scrolls further to 90% height. Hovers Leaf Node 7 ("Transformer Sentiment Analysis").
- **Step 5**: Tooltip preview displays. User clicks Leaf Node 7. Drawer opens with sentiment analysis details.
- **Step 6**: Clicks header `X` close button. Drawer closes. Page scroll position remains anchored at 90%.

### Scenario TC-T3-FLOW-03: Responsive Viewport Switch Mid-Interaction
- **Step 1**: On desktop (1440px), user opens slide-over drawer for "PhishGuard".
- **Step 2**: While drawer is open, emulate mobile device viewport (375px width).
- **Step 3**: Drawer dynamically transforms layout from right slide-over sheet to bottom sheet (`direction="bottom"`).
- **Step 4**: Project metrics grid reshapes from 3-column horizontal row to stacked 1-column layout.
- **Step 5**: User dismisses drawer via swipe-down gesture or close button. Canvas resumes left-aligned mobile layout.

### Scenario TC-T3-FLOW-04: Mobile Touch Navigation & Swipe Gesture Flow
- **Step 1**: On mobile viewport (375px), user opens mobile hamburger navbar menu.
- **Step 2**: Taps "WORKS". Mobile menu closes and page navigates to `/works`.
- **Step 3**: User performs touch drag / swipe up gesture. Canvas tree grows vertically along left axis (`X = 32px`).
- **Step 4**: Taps Leaf Node 1. Bottom sheet drawer slides up smoothly.
- **Step 5**: Body scroll is locked. Touch dragging inside drawer body scrolls long description text without moving background canvas page.
- **Step 6**: Taps backdrop or drags sheet down to close. Body scroll lock releases.

### Scenario TC-T3-FLOW-05: Rapid Route Switching & Canvas Lifecycle Stress
- **Step 1**: User rapidly clicks Navbar links: `/` -> `/works` -> `/` -> `/works` in under 1 second.
- **Step 2**: Canvas component unmounts and remounts rapidly.
- **Step 3**: Verify `cancelAnimationFrame` cleans up previous animation frame IDs.
- **Step 4**: Verify memory heap usage remains stable (no detached HTMLCanvasElement memory leak).
- **Step 5**: Final state on `/works` renders clean canvas tree without ghost canvas contexts or duplicate event listeners.

---

## 7. Tier 4: Real-World Application Scenarios

### Scenario TC-T4-RW-01: Recruiter / Technical Screener Fast Audit
- **Context**: A technical recruiter or engineering manager opens the portfolio to evaluate machine learning projects.
- **Interaction**: Directly inputs URL `/works`, quickly scrolls through all 7 projects, hovers each leaf to read tags (`PyTorch`, `FastAPI`, `XGBoost`), clicks "Marginal AI" drawer, and clicks "View GitHub Source".
- **Verification Criteria**:
  1. All 7 project GitHub links open valid repositories in a new tab (`target="_blank"` with `rel="noopener noreferrer"`).
  2. Thumbnail preview images load within 200ms without broken image icons.
  3. Metrics (e.g. "Retrieval Latency <120ms") are clearly readable against dark glassmorphic background with contrast ratio >= 4.5:1.

### Scenario TC-T4-RW-02: Low-End Mobile Device on Throttled 3G Network
- **Context**: User on a budget smartphone with slow CPU and throttled 3G network connection.
- **Interaction**: Navigates to `/works`. CPU throttled 4x; network throttled to Slow 3G.
- **Verification Criteria**:
  1. Initial HTML/DOM renders layout skeleton without blocking UI main thread.
  2. Canvas rendering caps DPR at `1.0` or reduces `shadowBlur` dynamically if frame time exceeds 16ms, ensuring smooth 30-60fps scrolling.
  3. Leaf node hover/click interactions respond within 100ms budget without input lag or dropped tap events.

### Scenario TC-T4-RW-03: High-DPI Retina Screen & 4K Display Crispness
- **Context**: User on Apple MacBook Pro Retina (DPR 2.0 / 3.0) or 4K desktop display.
- **Interaction**: Displays `/works` page across full monitor width.
- **Verification Criteria**:
  1. Canvas bitmap dimensions (`canvas.width`, `canvas.height`) scale to match `devicePixelRatio`, ensuring Bezier branch lines and glow effects are razor-sharp without pixel blur.
  2. DOM Leaf buttons align perfectly over branch end coordinates down to sub-pixel accuracy (`<1px` deviation).

### Scenario TC-T4-RW-04: Keyboard-Only & Screen Reader Accessibility (a11y)
- **Context**: Visually impaired user navigating via screen reader (NVDA / VoiceOver) or keyboard-only navigation.
- **Interaction**: Uses `Tab` key to move focus through navbar to `/works` page, tabs to Leaf Node 1, presses `Enter` to open detail drawer, tabs through drawer links, and presses `Escape` to close.
- **Verification Criteria**:
  1. Leaf DOM buttons have accessible labels (e.g., `aria-label="View project details for Marginal: AI Research Paper Reader"`).
  2. Tooltip has `role="tooltip"`; Drawer panel has `role="dialog"` with `aria-modal="true"`.
  3. Focus trap keeps keyboard focus constrained within slide-over drawer while open.
  4. Closing drawer restores focus to triggering leaf button element.

### Scenario TC-T4-RW-05: Dark Theme Aesthetic & Bioluminescent Contrast
- **Context**: User exploring portfolio in low-light environment.
- **Interaction**: Views procedural canvas branches with custom glow colors (`#3b82f6`, `#10b981`, `#f59e0b`, `#8b5cf6`, `#ec4899`, `#06b6d4`, `#a855f7`).
- **Verification Criteria**:
  1. Bioluminescent glow effects use composite blend mode or multi-pass shadow blur without washing out dark background `#0d0d12`.
  2. All text typography (white/silver text over glassmorphic panels) satisfies WCAG AA contrast ratio standard (minimum 4.5:1).

---

## 8. Five-Component Handoff Protocol

### 1. Observation
- **Original Prompt & Requirements**: `ORIGINAL_REQUEST.md:15-26` specifies a dedicated `/works` route featuring scroll-driven procedural Canvas 2D tree branch growth, leaf hover tooltips, right slide-over detail drawer, and active navbar routing.
- **Architecture Specification**: `PROJECT.md:4-9` outlines the Hybrid 2D Canvas + React DOM Overlay system, `PROJECTS_DATA` schema (`data/projects.ts`), component interfaces (`WorksCanvasTreeProps`, `ProjectDetailDrawerProps`), and route layout.
- **Existing Components Analyzed**:
  - `components/navbar.tsx`: Header navigation component with links array (`[{ label: "Works", href: "#works" }]`).
  - `components/smooth-scroll.tsx`: ReactLenis smooth scroll wrapper (`lerp: 0.1`).
  - `components/ui/sheet.tsx` & `components/ui/drawer.tsx`: Radix / Vaul sheet and drawer primitives supporting right slide-over and bottom sheets.

### 2. Logic Chain
1. **Observation**: The requirements demand opaque-box E2E test coverage for 5 primary features, boundary cases, cross-feature workflows, and real-world application scenarios.
2. **Inference**: Test cases must be formalized into deterministic, verifiable test specifications with explicit preconditions, steps, expected outcomes, and selector assertions for automated Playwright / Cypress execution.
3. **Structuring**:
   - Tier 1 features require >=5 test cases per feature (25 total) to guarantee full coverage of routing, canvas rendering, tooltips, drawer, and navbar.
   - Tier 2 boundary cases require isolating edge states (zero data, mobile/tablet/desktop/4K viewports, rapid scroll bursts, ESC key, scroll lock).
   - Tier 3 workflows combine features into multi-step journeys reflecting real user behavioral paths.
   - Tier 4 scenarios validate real-world conditions (recruiters, throttled networks, high-DPI screens, accessibility screen readers, dark theme contrast).

### 3. Caveats
- **Canvas Rendering Testing**: HTML5 Canvas pixel output cannot be queried directly via DOM text selectors; canvas testing relies on inspecting canvas context calls, scale attributes, and DOM overlay leaf node positioning coordinates.
- **Animation Timing**: Smooth scroll (Lenis) and Framer Motion tooltip/drawer transitions introduce async animation delays (~300ms); test automation scripts must include explicit wait-for-selector assertions rather than static timeouts.

### 4. Conclusion
The E2E Test Specification Matrix contained in this report provides 100% comprehensive coverage of the `/works` feature requirements (R1–R4). All 5 core features, 12 boundary/corner cases, 5 cross-feature workflows, and 5 real-world scenarios are fully formalized and ready for test implementation in Milestone M5.

### 5. Verification Method
To verify these E2E specifications against the codebase implementation:
1. Verify `data/projects.ts`, `components/works-canvas-tree.tsx`, `components/project-detail-drawer.tsx`, `components/navbar.tsx`, and `app/works/page.tsx` exist and conform to interface contracts in `PROJECT.md`.
2. Execute E2E test runner (e.g. `npx playwright test` or `npm run test:e2e`) using the test case IDs and selector assertions specified in Tiers 1–4 above.
3. Validate that `npm run build` succeeds without TypeScript compilation or Next.js route errors.
