# Procedural 2D/Canvas & UI Component Technical Analysis

## Executive Summary
This document provides a comprehensive technical exploration and architectural design for the interactive procedural 2D/Canvas tree branch system and accompanying UI components (hover tooltips & slide-over detail drawer) on the `/works` route (`app/works/page.tsx`).

The architecture combines a high-performance 60fps HTML5 2D Canvas background layer for organic scroll-driven branch growth with a semantic, accessible React/Framer Motion DOM overlay for interactive leaf nodes, tooltips, and slide-over drawers.

---

## 1. 2D/Canvas Procedural Scroll Rendering Requirements

### 1.1 Canvas vs SVG Performance Comparison
| Architectural Metric | HTML5 2D Canvas (`<canvas>`) | SVG (`<svg>`) | Selected Approach & Rationale |
| :--- | :--- | :--- | :--- |
| **DOM Overhead** | Single `<canvas>` DOM element regardless of branch complexity. | Dozens of `<path>`, `<circle>`, `<filter>` DOM nodes. | **HTML5 2D Canvas** for branch paths: Zero DOM reflow penalty during continuous 60fps scroll. |
| **Glow & Blur Effects** | Hardware-accelerated native 2D context `shadowBlur` & `shadowColor`. | SVG `<feGaussianBlur>` filters cause severe GPU layout/paint recalculations. | **HTML5 2D Canvas**: Native canvas shadow blur is fast and composited directly on GPU. |
| **Scroll Animation** | Immediate immediate render loop using parametric Bezier interpolation. | `stroke-dashoffset` or dynamic `d` attribute manipulation triggering DOM style recalcs. | **HTML5 2D Canvas**: Line segment interpolation in JS math loop avoids string parsing overhead. |
| **Interactivity & A11y** | Requires manual spatial hit-testing math. | Native CSS `:hover`, `onClick`, and DOM event listeners. | **Hybrid Layering**: Canvas for 2D paths, semantic DOM overlay for interactive leaf buttons. |

### 1.2 DPR (Device Pixel Ratio) Scaling & High-DPI Displays
To ensure ultra-crisp rendering on Retina/4K displays without memory bloat:
```typescript
// DPR Scaling Logic
const dpr = Math.min(typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1, 2);
const rect = container.getBoundingClientRect();

canvas.width = rect.width * dpr;
canvas.height = rect.height * dpr;
canvas.style.width = `${rect.width}px`;
canvas.style.height = `${rect.height}px`;

const ctx = canvas.getContext("2d");
if (ctx) {
  ctx.scale(dpr, dpr);
}
```
*Note*: Capping DPR at `2.0` prevents memory bloat on 3x screens (e.g. high-density mobile devices) while ensuring 100% sharp lines.

### 1.3 ResizeObserver & Dynamic Layout Handling
- A `ResizeObserver` is attached to the parent container (`<div className="relative w-full">`).
- When the container resizes (e.g., window resize, orientation change), the observer callback updates canvas dimensions and recalculates all relative branch control points.
- Debounced resize handler prevents thrashing during active window dragging.

### 1.4 60fps `requestAnimationFrame` Optimization & Lenis Scroll Binding
- **Smooth Scroll Integration**:
  - Bound to Lenis scroll instance via `useLenis` or scroll progress calculation (`scrollY / maxScroll`).
  - Target scroll progress $S_{target} \in [0, 1]$ is smoothed using linear interpolation:
    $$S_{smooth} \leftarrow S_{smooth} + (S_{target} - S_{smooth}) \times 0.08$$
- **Render Loop Efficiency**:
  - Pre-allocate all Bezier control points and tree structure data outside the animation loop.
  - Zero memory allocation (`new Array`, `new Object`) inside the `requestAnimationFrame` callback to prevent Garbage Collection (GC) frame stutters.
  - Frame budget: 16.6ms max (target < 4ms execution time per frame).

---

## 2. Organic Branch Growth Math & Leaf Node Positioning Algorithms

### 2.1 Cubic Bezier Path Generation & Branch Topology
Each branch is defined as a parametric 4-point Cubic Bezier curve $P(t)$:
$$P(t) = (1-t)^3 P_0 + 3(1-t)^2 t P_1 + 3(1-t) t^2 P_2 + t^3 P_3, \quad t \in [0, 1]$$

- $P_0$: Origin point on main trunk $(x_0, y_0)$.
- $P_1, P_2$: Control points defining organic outward curvature.
- $P_3$: Terminal endpoint $(x_{leaf}, y_{leaf})$ where the leaf node resides.

```typescript
export interface BranchConfig {
  id: string;
  projectId: string;
  startProgress: number; // Global scroll progress S when branch begins growing (e.g., 0.15)
  endProgress: number;   // Global scroll progress S when branch is fully grown (e.g., 0.25)
  p0: { x: number; y: number };
  p1: { x: number; y: number };
  p2: { x: number; y: number };
  p3: { x: number; y: number };
  side: "left" | "right";
}
```

### 2.2 Scroll Progress to Local Branch Growth Interpolation
For global scroll progress $S \in [0, 1]$:
1. Local branch growth parameter $t_i$:
   $$t_i = \text{clamp}\left(\frac{S - S_{start, i}}{S_{end, i} - S_{start, i}}, 0, 1\right)$$
2. De Casteljau's algorithm or step-wise line segment rendering up to parameter $t_i$:
   - For $t = 0$ to $t_i$ with step $\Delta t = 0.02$, evaluate $P(t)$ and execute `ctx.lineTo(P.x, P.y)`.
3. Growing tip coordinate $P_{tip}(t_i)$ is computed for rendering a glowing energy tip dot.

### 2.3 Bioluminescent Glow Rendering Strategy
Multi-pass canvas drawing for organic bioluminescence:
1. **Outer Glow Pass**:
   - `ctx.shadowColor = "rgba(99, 102, 241, 0.8)"` (Indigo-500)
   - `ctx.shadowBlur = 14`
   - `ctx.lineWidth = 4`
   - `ctx.strokeStyle = "rgba(129, 140, 248, 0.6)"` (Indigo-400)
2. **Core Core Highlight Pass**:
   - `ctx.shadowBlur = 0`
   - `ctx.lineWidth = 1.5`
   - `ctx.strokeStyle = "#ffffff"`
3. **Dynamic Pulsing Glow**:
   - Time-based sine wave oscillation: $\alpha = 0.6 + 0.4 \sin(\text{time} \times 2)$.
   - Adds living organic aesthetic matching dark portfolio theme.

### 2.4 Leaf Node Positioning & Spatial Sync
- When $t_i \ge 0.95$, the branch terminal node (leaf) fully blooms.
- Leaf coordinate $(X_{leaf}, Y_{leaf}) = P_3$.
- HTML/Framer Motion DOM interactive nodes are positioned absolute over the canvas container using percentage or exact pixel offsets calculated during canvas layout pass:
  `style={{ left: `${leaf.x}px`, top: `${leaf.y}px` }}`.

---

## 3. Hover Tooltip & Slide-Over Detail Drawer Mechanics

### 3.1 Hover Tooltip Mechanics
- **Trigger**: Hovering or focusing a leaf node button.
- **Positioning**:
  - Absolute positioned card floating near leaf node $(x, y)$.
  - Dynamic viewport collision avoidance: If leaf is near right edge, tooltip renders to the left; if near bottom, renders above.
- **Animation**:
  - Framer Motion `AnimatePresence`.
  - Scale & fade spring transition (`initial={{ opacity: 0, scale: 0.9, y: 8 }} animate={{ opacity: 1, scale: 1, y: 0 }}`).
- **Content Structure**:
  - Thumbnail image (`w-24 h-16 rounded-md object-cover`).
  - Project Title & Year.
  - Primary tags (e.g. `Python`, `FastAPI`).
  - Quick summary sentence.

### 3.2 Slide-Over Detail Drawer Mechanics
- **Trigger**: Clicking a leaf node button or pressing `Enter`/`Space` while focused.
- **Drawer Component**:
  - Utilizes existing `vaul` drawer primitive (`Drawer` from `components/ui/drawer.tsx` with `direction="right"` or custom Framer Motion right panel).
- **Styling**:
  - Backdrop: `fixed inset-0 bg-black/60 backdrop-blur-sm z-50`.
  - Drawer Panel: `fixed inset-y-0 right-0 w-full sm:w-[480px] md:w-[540px] lg:w-[600px] bg-[#0d0d12]/95 backdrop-blur-2xl border-l border-white/10 p-6 md:p-8 z-50 flex flex-col justify-between`.
- **Full Detail Content**:
  1. Header: Project title, year, domain tag, close button (`<X />`).
  2. Main Visual: High-res project screenshot or interactive preview video.
  3. Description & Architecture: Deep breakdown of project purpose, technical highlights, and key features.
  4. Tech Stack Badges: Full list of technologies used.
  5. Action Links:
     - **Live Demo** button (external link icon `ExternalLink`).
     - **GitHub / Code** button (GitHub icon `Github`).

### 3.3 UX & Accessibility Requirements
- **Keyboard ESC Listener**:
  ```typescript
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);
  ```
- **Body Scroll Locking**:
  - When drawer opens, set `document.body.style.overflow = "hidden"` to prevent main page Lenis scroll from scrolling behind the open drawer.
  - Restore `document.body.style.overflow = ""` when drawer closes.
- **ARIA Attributes**:
  - Leaf buttons: `aria-haspopup="dialog"`, `aria-expanded={isOpen}`, `aria-label={`View details for ${project.title}`}`.
  - Drawer content: `role="dialog"`, `aria-modal="true"`, `aria-labelledby="drawer-title"`.

---

## 4. Responsive Layout & Performance Constraints

### 4.1 Viewport Breakpoints & Adaptation
| Viewport | Screen Width | Tree Canvas Structure | Drawer Behavior |
| :--- | :--- | :--- | :--- |
| **Desktop** | $\ge 1024\text{px}$ | Centered trunk (X = 50%), alternating left and right organic branches (span 250px - 350px). | Right slide-over panel (width 540px - 600px). |
| **Tablet** | $768\text{px} - 1023\text{px}$ | Trunk at X = 35%-40%, branches extend 150px - 220px to right side. | Right slide-over panel (width 80vw / max 480px). |
| **Mobile** | $< 768\text{px}$ | Left-aligned vertical trunk (X = 32px), short branches projecting rightwards (span 80px - 140px). | Bottom sheet drawer (`direction="bottom"`, height 85vh) for optimal thumb reachability. |

### 4.2 Performance Constraints & Quality Guardrails
- **FPS Cap & Frame Budget**: 60fps target (16.6ms max per frame).
- **Adaptive Blur Quality**: If frame rate drops below 50fps or on low-power devices, shadow blur is automatically reduced (`shadowBlur = 0`) to maintain fluid scrolling.
- **Clean Unmounting**:
  - Cancel `requestAnimationFrame` loop on component unmount.
  - Disconnect `ResizeObserver`.
  - Remove all window scroll and keydown listeners.

---

## 5. Proposed Code Snippets & Architecture Map

### 5.1 Proposed File Structure for `/works` Page
```
app/
└── works/
    └── page.tsx                    # Dedicated /works route page
components/
├── works-canvas-tree.tsx           # Procedural 2D Canvas rendering component
├── leaf-node.tsx                   # Interactive DOM leaf button & hover tooltip wrapper
└── project-detail-drawer.tsx       # Glassmorphic slide-over detail drawer
```

### 5.2 Sample Branch Bezier & Draw Code Logic
```typescript
// Drawing growing Bezier branch on Canvas 2D context
function drawBranch(
  ctx: CanvasRenderingContext2D,
  branch: BranchConfig,
  progress: number
) {
  const { startProgress, endProgress, p0, p1, p2, p3 } = branch;
  const t = Math.max(0, Math.min(1, (progress - startProgress) / (endProgress - startProgress)));
  
  if (t <= 0) return;

  ctx.save();
  
  // Bioluminescent Glow Layer
  ctx.beginPath();
  ctx.shadowColor = "rgba(99, 102, 241, 0.7)";
  ctx.shadowBlur = 12;
  ctx.strokeStyle = "rgba(129, 140, 248, 0.8)";
  ctx.lineWidth = 3;

  // Sample Bezier curve up to progress t
  const steps = 30;
  ctx.moveTo(p0.x, p0.y);
  for (let i = 1; i <= Math.floor(steps * t); i++) {
    const stepT = (i / steps);
    const pt = evaluateCubicBezier(p0, p1, p2, p3, stepT);
    ctx.lineTo(pt.x, pt.y);
  }
  ctx.stroke();

  // Core Highlight Line
  ctx.beginPath();
  ctx.shadowBlur = 0;
  ctx.strokeStyle = "#ffffff";
  ctx.lineWidth = 1.2;
  ctx.moveTo(p0.x, p0.y);
  for (let i = 1; i <= Math.floor(steps * t); i++) {
    const stepT = (i / steps);
    const pt = evaluateCubicBezier(p0, p1, p2, p3, stepT);
    ctx.lineTo(pt.x, pt.y);
  }
  ctx.stroke();

  ctx.restore();
}
```

---

## Conclusion & Recommendations
1. **Hybrid Architecture**: HTML5 `<canvas>` for 60fps organic bioluminescent branch growth + React DOM interactive layer for leaf nodes, tooltips, and detail drawers.
2. **Data Integration**: Utilize existing 7 projects from `components/works.tsx` expanded with detailed descriptions, live site links, and GitHub links.
3. **Accessibility First**: Full keyboard tab focus on leaf nodes, `ESC` key drawer closure, body scroll locking, and ARIA labels.
4. **Zero Regressions**: `app/page.tsx` remains completely untouched. Navbar links navigate cleanly to `/works`.
