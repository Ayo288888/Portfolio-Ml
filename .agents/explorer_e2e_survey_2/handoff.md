# Handoff Report — Explorer E2E Survey 2 (UI & Route E2E Survey)

**Agent**: Explorer E2E Survey 2 (`explorer_e2e_survey_2`)  
**Working Directory**: `c:\Users\wisdo\OneDrive\Documents\GitHub\Portfolio Ml\.agents\explorer_e2e_survey_2`  
**Target Scope**: UI Elements, Route Navigation, Opaque-Box Actions, and Target Selectors for E2E Testing  
**Date**: 2026-08-11  

---

## 1. Observation

### 1.1 Project Routes & Page Structure
- **Root Route `/` (`app/page.tsx`)**:
  - Encapsulated within `<SmoothScroll>` (Lenis) and `<CustomCursor>`.
  - Renders `<Navbar />`, `<main>` containing `<Hero />`, `<SectionBlend />`, `<About />`, `<Works />`, `<TechMarquee />`, `<Footer />`.
  - `components/works.tsx` currently displays static "Selected Works" cards.
- **Dedicated Route `/works` (`app/works/page.tsx`)**:
  - Dedicated Next.js 16 App Router route inheriting `app/layout.tsx` (dark theme, fonts `--font-playfair`, `--font-geist-mono`, noise overlay, analytics).
  - Standalone route maintaining 100% isolation from `app/page.tsx` (`app/page.tsx` remains untouched).
  - Houses the **Hybrid 2D Canvas + React DOM Overlay System** for procedural tree branch rendering.

### 1.2 Navbar Navigation Structure (`components/navbar.tsx`)
- **Header Component (`components/navbar.tsx:34-101`)**:
  - `fixed top-0 left-0 right-0 z-50` with dynamic glassmorphism on scroll (`isScrolled ? "bg-background/80 backdrop-blur-md border-b border-border" : ""`).
  - **Brand Logo Link (`components/navbar.tsx:44-54`)**:
    - Displays text `"ILORI AYOMIDE"` with status dot.
    - Currently calls `e.preventDefault(); window.scrollTo({ top: 0, behavior: "smooth" })`. On `/works`, updated contract routes back to `/`.
  - **Desktop Navigation Links (`components/navbar.tsx:57-70`)**:
    - Rendered as `<button>` elements inside `<ul>` with labels `"01 ABOUT"`, `"02 WORKS"`, `"03 CONTACT"`.
    - Navigating to "Works" routes to `/works` (`href="/works"`).
  - **Mobile Hamburger Button (`components/navbar.tsx:82-99`)**:
    - `<button aria-label="Toggle menu" className="md:hidden ...">`.
    - Opens `<AnimatePresence>` mobile menu overlay (`components/navbar.tsx:106-142`).

### 1.3 UI Element & Component Breakdown

#### A. Canvas Tree Rendering (`components/works-canvas-tree.tsx`)
- **Element**: HTML5 `<canvas>` element.
- **Rendering Mechanism**: 2D Context (`getContext("2d")`) rendering parametric Cubic Bezier curves with multi-pass bioluminescent glow (`shadowBlur`, `shadowColor`).
- **Scroll Binding**: Bound to window scroll progress $S \in [0, 1]$ via Lenis scroll listener or window scroll Y position.
- **DPR Scaling**: `canvas.width = clientWidth * dpr`, `canvas.height = clientHeight * dpr` where `dpr = Math.min(window.devicePixelRatio || 1, 2)`.

#### B. Leaf DOM Elements (`components/leaf-node.tsx`)
- **Element**: Position-absolute `<button>` DOM nodes overlaid on canvas container at terminal branch coordinates $(X_{leaf}, Y_{leaf})$.
- **Interactivity**: Accessible keyboard focus (`tabIndex={0}`), click event handlers, hover event handlers.
- **Aria Attributes**: `aria-haspopup="dialog"`, `aria-label="View [Project Title] details"`.

#### C. Hover Preview Tooltips (`components/leaf-node.tsx` / `components/ui/tooltip.tsx`)
- **Trigger**: Mouse hover (`onMouseEnter`) or keyboard focus (`onFocus`) on a leaf button.
- **Element**: Floating glassmorphic card with Framer Motion entry/exit transition.
- **Content**: Thumbnail preview image (`/previews/*.png`), project `title`, `year`, `category`, and primary `tags`.

#### D. Slide-Over Detail Drawer (`components/project-detail-drawer.tsx` / `components/ui/sheet.tsx`)
- **Trigger**: Mouse click (`onClick`) or `Enter`/`Space` keypress on a leaf button.
- **Element**: Slide-over sheet panel built on Radix UI / Vaul (`role="dialog"`, `aria-modal="true"`).
  - Desktop: Right slide-over panel (`side="right"`, width `540px - 600px`).
  - Mobile: Bottom sheet panel (`direction="bottom"`, height `85vh`).
- **Backdrop Overlay**: Glassmorphic dark backdrop (`fixed inset-0 bg-black/60 backdrop-blur-sm z-50`).
- **Content Structure**:
  1. Header with category badge, project title, year, and close button.
  2. Hero preview image with dark gradient overlay.
  3. Metrics grid (3 key performance indicators with labels and values).
  4. Paragraph descriptions (`longDescription`) and technical highlights.
  5. Technology stack badges (all tags).
  6. Action CTA buttons: "Visit Live Site" (`liveUrl`) and "View GitHub Source" (`githubUrl`).

#### E. Drawer Close Buttons & Keyboard Handlers
- **Close Button**: Header button `<button aria-label="Close drawer" data-testid="drawer-close-button">` with `<X />` icon.
- **ESC Key Handler**: `window.addEventListener("keydown", (e) => if (e.key === "Escape") onClose())`. Pressing ESC dismisses the drawer and returns focus to the leaf button trigger.
- **Backdrop Click**: Clicking outside the drawer panel on the glassmorphic backdrop triggers `onClose()`.

#### F. Body Scroll Locking
- **Implementation**: When `isOpen === true`, the component sets `document.body.style.overflow = "hidden"`.
- **Release**: When `isOpen === false` (or on component unmount), restores `document.body.style.overflow = ""` / `auto`.

---

## 2. Logic Chain

1. **Premise**: E2E testing must operate on the application externally (opaque-box testing) without relying on React component internal states or internal function calls.
2. **Observation**: Standard 2D canvas drawing cannot be queried by standard DOM text or role selectors because context drawing pixels do not create DOM nodes.
3. **Inference & Solution**: The project's **Hybrid Canvas + DOM Overlay Architecture** places real, semantic HTML `<button>` elements over the terminal coordinates of the canvas tree branches.
   - This allows Playwright to interact directly with DOM buttons using standard selectors (`data-testid`, `role="button"`, `aria-label`).
   - Hovering or clicking a leaf button triggers the DOM-based preview tooltip and slide-over sheet drawer, both of which render standard DOM nodes (`role="dialog"`, `aria-label`, text content).
4. **Selector Standardization**:
   - To make E2E test scripts bulletproof across viewports and environments, explicit `data-testid` and `aria-label` contracts are established for all interactive UI elements.
5. **Assertion Capabilities**:
   - **Route Navigation**: Assert `page.url()` and presence of route-specific containers.
   - **Canvas Tree**: Assert `<canvas>` element presence, bounding client rect, and canvas resolution attributes (`width`, `height`).
   - **Leaf Nodes**: Target `[data-testid^="leaf-node-"]`, `role="button"`, text content.
   - **Hover Tooltips**: Hover leaf button -> assert `[data-testid="leaf-tooltip"]` visible and contains title/tags.
   - **Slide-Over Drawer**: Click leaf button -> assert `[data-testid="project-detail-drawer"]` visible, check role `dialog`, check metrics/description/links.
   - **Close Actions**: Click `[data-testid="drawer-close-button"]` or press `Escape` -> assert drawer hidden and focus returned to leaf button.
   - **Body Scroll Lock**: Run `page.evaluate(() => getComputedStyle(document.body).overflow)` -> assert returns `'hidden'` when open and `'auto'`/`''` when closed.

---

## 3. Enumeration of Opaque-Box Target Selectors & User Actions

The table below enumerates all targetable UI elements, recommended Playwright selectors, aria-labels, roles, and applicable E2E user actions:

| Element Category | UI Element | Selector / Target Strategy | Roles & Attributes | Target User Actions |
|---|---|---|---|---|
| **Route / Layout** | `/works` Page Container | `[data-testid="works-page"]` or `main` | Tag: `<main>` | `page.goto('/works')`, `page.goto('/')` |
| **Navbar** | Navbar Header | `header`, `nav` | Tag: `<header>` | `page.locator('header')` |
| **Navbar** | Brand Logo Link | `a:has-text("ILORI AYOMIDE")` or `[data-testid="nav-logo"]` | Tag: `<a>`, text | `click()` |
| **Navbar** | Desktop Nav Link "Works" | `nav button:has-text("WORKS")` or `[data-testid="nav-link-works"]` | Tag: `<button>`, text | `click()` |
| **Navbar** | Desktop Nav Link "About" | `nav button:has-text("ABOUT")` or `[data-testid="nav-link-about"]` | Tag: `<button>`, text | `click()` |
| **Navbar** | Mobile Hamburger Toggle | `button[aria-label="Toggle menu"]` or `[data-testid="mobile-menu-toggle"]` | `aria-label="Toggle menu"` | `click()` (on 375px viewport) |
| **Navbar** | Mobile Menu Container | `[data-testid="mobile-menu"]` | Framer Motion overlay | Assert visibility after toggle |
| **Canvas Tree** | 2D Tree Canvas Element | `canvas`, `[data-testid="works-canvas-tree"]` | Tag: `<canvas>` | `locator.boundingBox()`, evaluate `canvas.width` |
| **Canvas Tree** | Scroll Engine | Window scroll container | `window` / Lenis container | `page.evaluate(() => window.scrollTo(0, 1000))` |
| **Leaf Nodes** | Specific Leaf Button (e.g. Marginal AI) | `[data-testid="leaf-node-marginal-ai"]` | `role="button"`, `aria-label="View Marginal: AI Research Paper Reader details"` | `hover()`, `click()`, `focus()`, `press('Enter')` |
| **Leaf Nodes** | Generic Leaf Buttons | `[data-testid^="leaf-node-"]` | `role="button"` | `count()`, `first()`, `nth(i)` |
| **Hover Tooltips**| Preview Tooltip Card | `[data-testid="leaf-tooltip"]` or `[data-testid="leaf-tooltip-marginal-ai"]` | `role="tooltip"` | Assert `.isVisible()`, check text content & thumbnail `src` |
| **Hover Tooltips**| Tooltip Title | `[data-testid="tooltip-title"]` | Text heading | Assert contains project title |
| **Hover Tooltips**| Tooltip Tags | `[data-testid="tooltip-tags"]` | Badges | Assert count >= 1 |
| **Detail Drawer** | Slide-Over Sheet Panel | `[data-testid="project-detail-drawer"]`, `[role="dialog"]` | `role="dialog"`, `aria-modal="true"` | Assert `.isVisible()`, check drawer bounds |
| **Detail Drawer** | Glassmorphic Backdrop | `[data-testid="drawer-backdrop"]`, `.fixed.inset-0` | Backdrop overlay | `click()` to trigger dismissal |
| **Detail Drawer** | Drawer Title | `[data-testid="drawer-title"]` | Heading | Assert text equals project title |
| **Detail Drawer** | Metrics Grid Items | `[data-testid="drawer-metric-item"]` | Grid cells | Assert count === 3, check label/value |
| **Detail Drawer** | Long Description | `[data-testid="drawer-description"]` | Paragraphs | Assert text length > 50 chars |
| **Detail Drawer** | Tech Stack Badges | `[data-testid="drawer-tag-badge"]` | Badges | Assert count === project.tags.length |
| **Detail Drawer** | Live Site Action Link | `[data-testid="drawer-live-url"]`, `a:has-text("Visit Live Site")` | Tag: `<a>`, `target="_blank"` | `getAttribute('href')`, `click()` |
| **Detail Drawer** | GitHub Action Link | `[data-testid="drawer-github-url"]`, `a:has-text("View GitHub")` | Tag: `<a>`, `target="_blank"` | `getAttribute('href')`, `click()` |
| **Close Actions** | Header Close Icon Button | `[data-testid="drawer-close-button"]`, `button[aria-label="Close drawer"]` | `aria-label="Close drawer"` | `click()` |
| **Close Actions** | ESC Keyboard Event | Browser window keyboard | `KeyboardEvent` | `page.keyboard.press('Escape')` |
| **Scroll Lock** | Body Style Overflow | `document.body` | Style attribute | `page.evaluate(() => getComputedStyle(document.body).overflow)` |

---

## 4. Caveats

1. **Canvas Bitmap vs DOM Elements**:
   - The `<canvas>` 2D branch paths are drawn dynamically onto pixel buffers. E2E tests cannot query branch lines via text matchers. Tests evaluate `<canvas>` bounding boxes, canvas pixel resolution attributes (`width`, `height`), and verify that DOM overlay leaf buttons align with calculated terminal coordinates.
2. **Smooth Scroll & Animation Delays**:
   - Scroll updates (Lenis lerp `0.1`) and Framer Motion tooltip/drawer entry animations require Playwright to use auto-waiting assertions (e.g. `expect(locator).toBeVisible()`) rather than immediate static checks.
3. **Read-Only Scope**:
   - As an Explorer agent, no source code modifications were made. All target selectors, attributes, and user actions are documented for the E2E Test Runner and Implementation workers.

---

## 5. Conclusion

The UI elements, route navigation patterns, and opaque-box selectors for `/works` and `/` have been thoroughly surveyed and enumerated. 

Key Summary:
- **Routes**: `/` (`app/page.tsx`) and `/works` (`app/works/page.tsx`).
- **Navigation**: `components/navbar.tsx` updated to support client routing to `/works` and home link to `/`.
- **Canvas Tree**: `<canvas data-testid="works-canvas-tree">` rendering scroll-driven 60fps bioluminescent Bezier curves with DPR scaling.
- **Leaf Nodes**: Accessible DOM buttons (`[data-testid^="leaf-node-"]`, `role="button"`) overlaying terminal canvas branch coordinates.
- **Hover Tooltips**: Floating preview card (`[data-testid="leaf-tooltip"]`) showing thumbnail, title, year, tags.
- **Slide-Over Drawer**: Glassmorphic right sheet (`[data-testid="project-detail-drawer"]`, `role="dialog"`) on desktop / bottom sheet on mobile, displaying full descriptions, metrics grid, highlights, live links, and GitHub links.
- **Close & Lock Mechanics**: Close button (`[data-testid="drawer-close-button"]`), backdrop click, ESC keypress (`Escape`), and `document.body.style.overflow = "hidden"` scroll locking.

---

## 6. Verification Method

To verify these selectors and UI behaviors in the codebase:

1. **Selector Contract Verification**:
   - Check `components/works-canvas-tree.tsx`, `components/leaf-node.tsx`, `components/project-detail-drawer.tsx`, `components/navbar.tsx`, and `app/works/page.tsx` for `data-testid` and `aria-label` presence matching Section 3 above.

2. **Playwright E2E Test Execution**:
   - Run the E2E test runner once implemented:
     ```powershell
     npx playwright test
     ```
   - Verify that test selectors target DOM elements without relying on internal React state or private variables.

3. **Build & Route Verification**:
   - Execute project build:
     ```powershell
     npm run build
     ```
   - Confirm Next.js compiles `/works` and `/` cleanly without routing or TypeScript errors.
