# Original User Request

## 2026-08-11T14:53:13Z

<USER_REQUEST>
# Teamwork Project Prompt

Dedicated 'Works' page (`/works`) for portfolio featuring an interactive procedural 2D/Canvas tree branch UI design where scrolling down reveals organically growing branches and project "leaves/nodes" with hover tooltips and slide-over detail drawers.

Working directory: c:\Users\wisdo\OneDrive\Documents\GitHub\Portfolio Ml
Integrity mode: development

## Requirements

### R1. Procedural 2D/Canvas Scroll Branch Experience
Create a scroll-driven procedural Canvas/SVG tree branch network for `app/works/page.tsx`. As the user scrolls down, tree trunk and branch paths dynamically draw and branch off organically based on scroll progress, terminating at designated leaf node positions.

### R2. Interactive Leaf Tooltips & Slide-Over Detail Drawer
Implement interactive hover tooltips over each leaf node showing a quick preview (title, image thumbnail, primary tags) and a smooth slide-over drawer on leaf click displaying full project details, metrics, tags, year, and live site / GitHub links.

### R3. Dedicated `/works` Route & Navbar Integration
Create `app/works/page.tsx` with dedicated metadata and layout matching the existing sleek dark aesthetic (dark palette, custom cursor, smooth scrolling) without modifying `app/page.tsx` (the homepage). Update `components/navbar.tsx` links so navigating to Works routes to `/works`.

### R4. Responsive Design & Smooth Canvas Performance
Ensure the canvas branch tree is responsive across mobile, tablet, and desktop viewports with optimal 60fps canvas rendering and animation frame optimization.

## Acceptance Criteria

### Branch Canvas Visualization
- [ ] `app/works/page.tsx` renders a smooth procedural canvas tree trunk & branch system connected to scroll position.
- [ ] Branch paths feature subtle bioluminescent glow, leaf node indicators, and minimalist typography.
- [ ] Mobile and desktop viewports display responsive branch layouts cleanly.

### Leaf Tooltip & Slide-Over Drawer Interaction
- [ ] Hovering a project leaf node displays a floating tooltip card with project title, year, tags, and thumbnail preview.
- [ ] Clicking a project leaf node opens a right slide-over drawer featuring detailed project description, live URL, and source code link.
- [ ] Drawer supports smooth backdrop blur, keyboard ESC close, and dark glassmorphic styling.

### Code & Navigation Integrity
- [ ] `app/page.tsx` (homepage) remains completely untouched.
- [ ] Navbar links for "Works" cleanly navigate to `/works`.
- [ ] `npm run build` succeeds without TypeScript or Next.js routing errors.
</USER_REQUEST>
