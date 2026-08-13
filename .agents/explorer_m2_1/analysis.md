# Milestone 2 Investigation Report: Procedural Canvas Tree Engine & Responsive Branch Visualization

## Executive Summary
This report provides the architectural investigation, data mapping specifications, mathematical formulations, and component contract design for `components/works-canvas-tree.tsx` under **Milestone 2**.

The `/works` page relies on a **Hybrid 2D Canvas + DOM Overlay Architecture**:
1. **Canvas Layer**: Renders the vertical tree trunk, organic 4-point Cubic Bezier branch curves, scroll-interpolated tip growth, and multi-pass bioluminescent glow effects at 60fps.
2. **DOM Overlay Layer**: Positioned absolutely above the canvas, DOM elements (leaf nodes) receive terminal leaf pixel coordinates $(X, Y)$ and active state from the canvas engine via an `onLeafCoordsUpdate` callback callback contract.

---

## 1. Codebase & Environment Audit

### 1.1 Tech Stack & Tooling
- **Framework**: Next.js 16.0.3 with React 19.2.0 (App Router).
- **TypeScript**: 5.x with strict type checking (`tsconfig.json` path alias `@/*` -> `./*`).
- **Styling**: Tailwind CSS 4.1.9 with `@tailwindcss/postcss`, `tw-animate-css`, `clsx`, `tailwind-merge`.
- **Smooth Scroll**: `lenis` v1.3.15 via `ReactLenis` wrapper (`components/smooth-scroll.tsx`).
- **Canvas API**: HTML5 2D Canvas Context (`CanvasRenderingContext2D`) with DPR cap at `Math.min(window.devicePixelRatio, 2)`.

### 1.2 Component Isolation & Navigation Strategy
- Route isolation: `/works` route is completely isolated from `app/page.tsx` (homepage remain untouched per R3 / AC).
- `components/works-canvas-tree.tsx` is a client component (`"use client"`) designed for smooth animation loops and DOM coordinate synchronization.

---

## 2. Project Data & Branch Target Mapping (`data/projects.ts`)

The project data array `PROJECTS_DATA` contains 7 enriched portfolio items, each configured with a `leafConfig: LeafNodeConfig` block that defines scroll triggers, branch side, relative offsets, and accent color.

### 2.1 Project Data Mapping Matrix

| Project ID | Title | Category | Side | `startScroll` | `endScroll` | `xOffsetPct` | `yOffsetPct` | Accent Color |
|---|---|---|---|---|---|---|---|---|
| `marginal-ai-reader` | Marginal: AI Research Paper Reader | Generative AI & RAG | left | 0.05 | 0.16 | 28% | 10% | `#3b82f6` (Blue) |
| `healthcare-diagnosis-chatbot` | Healthcare Diagnosis Chatbot | Medical NLP | right | 0.18 | 0.29 | 32% | 24% | `#10b981` (Emerald) |
| `phishguard-detector` | PhishGuard: Phishing Detector | Cybersecurity AI | left | 0.31 | 0.42 | 25% | 38% | `#f59e0b` (Amber) |
| `deepfake-security-system` | Deepfake Security System | Audio & Vision Forensics | right | 0.44 | 0.55 | 35% | 52% | `#ec4899` (Pink) |
| `kitti-object-detection` | KITTI Object Detection | Computer Vision | left | 0.57 | 0.68 | 30% | 66% | `#8b5cf6` (Violet) |
| `nct-progress-tracker-api` | NCT Progress Tracker API | Backend Microservices | right | 0.70 | 0.81 | 28% | 80% | `#06b6d4` (Cyan) |
| `transformer-sentiment-analysis` | Transformer Sentiment Analysis | Deep Learning & NLP | left | 0.83 | 0.94 | 32% | 92% | `#6366f1` (Indigo) |

### 2.2 Key Data Mapping Insights
1. **Vertical Progression**: `startScroll` and `endScroll` non-overlapping intervals range smoothly from 0.05 to 0.94, leaving buffer margins at the top (0.00 to 0.05) and bottom (0.94 to 1.00).
2. **Alternating Branch Rhythm**: Branches cleanly alternate `left` -> `right` -> `left` -> `right` -> `left` -> `right` -> `left`.
3. **yOffset Alignment**: `yOffsetPct` (10% to 92%) maps monotonically to vertical container height, ensuring branches originate and terminate in order down the scroll length.

---

## 3. Interface Contracts & Component Type Architecture

To satisfy both `PROJECT.md` and `SCOPE.md` contracts, `components/works-canvas-tree.tsx` must export the following types and interfaces:

```typescript
import type { Project, LeafNodeConfig } from "@/data/projects";

/** Lightweight branch target interface for canvas positioning */
export interface BranchTarget {
  id: string;
  title: string;
  category: string;
  leafConfig?: LeafNodeConfig;
}

/** Calculated terminal leaf coordinate emitted to overlay DOM layer */
export interface TerminalLeafCoord {
  id: string;
  x: number;      // Pixel X relative to canvas/container
  y: number;      // Pixel Y relative to canvas/container
  active: boolean; // True if current scrollProgress >= leafConfig.endScroll
}

/** Props for WorksCanvasTree component */
export interface WorksCanvasTreeProps {
  scrollProgress: number; // Normalized scroll progress S in [0, 1]
  projects: Project[];    // Array of project items with leafConfig
  onLeafCoordsUpdate?: (coords: TerminalLeafCoord[]) => void;
  className?: string;
  onSelectProject?: (project: Project) => void;
  activeProjectId?: string;
}
```

---

## 4. Canvas Geometry & Math Specifications

### 4.1 Responsive Layout Engine

#### Desktop Viewport ($\text{width} \ge 768\text{px}$)
- **Trunk Center**: $X_{\text{trunk}} = \text{width} \times 0.5$
- **Branch Termination**:
  - Left side: $X_{\text{leaf}} = X_{\text{trunk}} - (\text{width} \times \frac{\text{xOffsetPct}}{100})$
  - Right side: $X_{\text{leaf}} = X_{\text{trunk}} + (\text{width} \times \frac{\text{xOffsetPct}}{100})$
  - $Y_{\text{leaf}} = \text{height} \times \frac{\text{yOffsetPct}}{100}$

#### Mobile Viewport ($\text{width} < 768\text{px}$)
- **Trunk Alignment**: $X_{\text{trunk}} = 32\text{px}$ (left-aligned)
- **Branch Termination**:
  - All branches project rightward: $X_{\text{leaf}} = X_{\text{trunk}} + (\text{width} - 64\text{px}) \times \frac{\text{xOffsetPct}}{100 \times 1.2}$
  - $Y_{\text{leaf}} = \text{height} \times \frac{\text{yOffsetPct}}{100}$

### 4.2 4-Point Cubic Bezier Curve Formulation
Each branch path is defined by four control points $P_0, P_1, P_2, P_3$:
- **$P_0$ (Trunk Origin)**: $(X_{\text{trunk}}, Y_{\text{start\_y}})$ where $Y_{\text{start\_y}} = \text{height} \times \text{startScroll}$
- **$P_1$ (Initial Outward Curve)**: $(X_{\text{trunk}} \pm \Delta X_1, Y_{\text{start\_y}} + 0.3 \times (Y_{\text{leaf}} - Y_{\text{start\_y}}))$
- **$P_2$ (Approach Control)**: $(X_{\text{leaf}} \mp 0.2 \times \Delta X_{\text{total}}, Y_{\text{leaf}} - 0.1 \times \Delta Y_{\text{total}})$
- **$P_3$ (Terminal Leaf)**: $(X_{\text{leaf}}, Y_{\text{leaf}})$

#### Branch Tip Interpolation $t \in [0, 1]$
For scroll progress $S$:
$$t = \text{clamp}\left(\frac{S - \text{startScroll}}{\text{endScroll} - \text{startScroll}}, 0, 1\right)$$

- If $t = 0$: Branch has not emerged; not rendered.
- If $0 < t < 1$: Sub-curve $B(u)$ for $u \in [0, t]$ is rendered using De Casteljau subdivision, with a glowing pulse tip rendered at $B(t)$.
- If $t = 1$: Full curve $P_0 \to P_3$ is rendered; leaf node marks `active = true`.

### 4.3 Multi-Pass Bioluminescent Glow Rendering
To achieve organic bioluminescence:
1. **Outer Ambient Glow Pass**:
   - `ctx.shadowBlur = 16`, `ctx.shadowColor = accentColor`
   - `ctx.strokeStyle = accentColor`, `ctx.lineWidth = 3`
2. **Inner Bright Core Pass**:
   - `ctx.shadowBlur = 0`
   - `ctx.strokeStyle = '#ffffff'`, `ctx.lineWidth = 1`
3. **Terminal Node Glow Pulse**:
   - `ctx.beginPath(); ctx.arc(x, y, 4 + 2 * Math.sin(time), 0, 2 * Math.PI)`
   - `ctx.fillStyle = accentColor`

---

## 5. Performance & Technical Constraints

1. **DPR Scaling**:
   ```typescript
   const dpr = Math.min(window.devicePixelRatio || 1, 2);
   canvas.width = rect.width * dpr;
   canvas.height = rect.height * dpr;
   ctx.scale(dpr, dpr);
   ```
2. **ResizeObserver**: Automatically syncs canvas resolution on window / container resize without manual scroll handler recalculation.
3. **AnimationFrame Efficiency**: Use `requestAnimationFrame` loop; only execute full redrawn pass when `scrollProgress` changes or during active particle pulsing.
4. **Clean Handoff to DOM**: `onLeafCoordsUpdate` callback fires whenever canvas layout or leaf positions update, keeping HTML leaf cards perfectly synced.

---

## Conclusion
The architecture and data mapping for `components/works-canvas-tree.tsx` are fully verified and ready for implementation by the Implementer agent. All type definitions, responsive geometry rules, and performance patterns are specified above.
