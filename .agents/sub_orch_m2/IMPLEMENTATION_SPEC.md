# Implementation Specification: Milestone 2 Canvas Tree Engine

**Target File**: `components/works-canvas-tree.tsx`
**Milestone**: M2 — Procedural Canvas Tree Engine & Responsive Branch Visualization

---

## 1. Overview & Architectural Goals
`components/works-canvas-tree.tsx` is a `"use client"` React component that renders a 2D HTML5 Canvas procedural bioluminescent tree trunk and Bezier branch network bound to scroll progress parameter $S \in [0, 1]$.

The canvas engine calculates and projects terminal leaf coordinates for portfolio projects and exports them via the `onLeafCoordsUpdate` callback prop so that React DOM overlay components can position themselves accurately.

---

## 2. Exports & Type Contracts

```typescript
import type { Project, LeafNodeConfig } from "@/data/projects";

export interface BranchTarget {
  id: string;
  title: string;
  category: string;
  leafConfig?: LeafNodeConfig;
}

export interface TerminalLeafCoord {
  id: string;
  x: number;      // CSS pixel X position relative to canvas container
  y: number;      // CSS pixel Y position relative to canvas container
  active: boolean; // True if current scrollProgress >= leafConfig.endScroll
  progress: number; // Local branch growth progress in [0, 1]
  accentColor: string;
  side: "left" | "right";
}

export interface WorksCanvasTreeProps {
  scrollProgress: number; // Normalized scroll progress S in [0, 1]
  projects: Project[];    // Array of project items with leafConfig from data/projects.ts
  onLeafCoordsUpdate?: (coords: TerminalLeafCoord[]) => void;
  onSelectProject?: (project: Project) => void;
  activeProjectId?: string;
  className?: string;
}
```

---

## 3. Responsive Geometry Rules

### Breakpoint: `768px`
- **Desktop Mode ($\ge 768\text{px}$)**:
  - Trunk centered at $X = 50\%$ width (`0.50 * width`).
  - Branch direction alternates based on `leafConfig.side`:
    - `side === "left"`: $X_3 = X_{\text{trunk}} - (X_{\text{offset\_pct}} / 100) \cdot (width \cdot 0.42)$
    - `side === "right"`: $X_3 = X_{\text{trunk}} + (X_{\text{offset\_pct}} / 100) \cdot (width \cdot 0.42)$
  - $Y_3 = height \cdot (Y_{\text{offset\_pct}} / 100)$

- **Mobile Mode ($< 768\text{px}$)**:
  - Trunk left-aligned at $X = 32\text{px}$.
  - All branches project rightward:
    - $X_3 = X_{\text{trunk}} + (X_{\text{offset\_pct}} / 100) \cdot (width - 80\text{px})$
    - Clamped $X_3 \in [64\text{px}, width - 24\text{px}]$
  - $Y_3 = height \cdot (Y_{\text{offset\_pct}} / 100)$

---

## 4. 4-Point Cubic Bezier Math & De Casteljau Subdivision

### 4.1 Bezier Control Points
For each project branch with anchor $P_0$ on the trunk and terminal leaf $P_3$:
- $P_0 = (X_{\text{trunk}}, Y_{\text{start\_y}})$ where $Y_{\text{start\_y}} = height \cdot Y_{\text{offset\_pct}} \cdot 0.95$
- $P_1 = (X_0 + 0.45 \cdot (X_3 - X_0), Y_0 + 0.10 \cdot (Y_3 - Y_0))$
- $P_2 = (X_0 + 0.80 \cdot (X_3 - X_0), Y_3 - 0.25 \cdot (Y_3 - Y_0))$
- $P_3 = (X_3, Y_3)$

### 4.2 Growth Progress $s_{\text{branch}}$
For global scroll progress $S \in [0, 1]$ and project bounds $[s_{\text{start}}, s_{\text{end}}]$:
$$s_{\text{branch}} = \text{clamp}\left(\frac{S - s_{\text{start}}}{s_{\text{end}} - s_{\text{start}}}, 0.0, 1.0\right)$$

### 4.3 De Casteljau Sub-Curve Truncation
When $0 < s_{\text{branch}} < 1$, compute exact sub-curve control points $Q_0, Q_1, Q_2, Q_3$ via de Casteljau subdivision at parameter $t = s_{\text{branch}}$:
```typescript
function truncateCubicBezier(curve: CubicBezier, tau: number): CubicBezier {
  const t = Math.max(0, Math.min(1, tau));
  const { p0, p1, p2, p3 } = curve;

  const p01 = { x: (1 - t) * p0.x + t * p1.x, y: (1 - t) * p0.y + t * p1.y };
  const p12 = { x: (1 - t) * p1.x + t * p2.x, y: (1 - t) * p1.y + t * p2.y };
  const p23 = { x: (1 - t) * p2.x + t * p3.x, y: (1 - t) * p2.y + t * p3.y };

  const p012 = { x: (1 - t) * p01.x + t * p12.x, y: (1 - t) * p01.y + t * p12.y };
  const p123 = { x: (1 - t) * p12.x + t * p23.x, y: (1 - t) * p12.y + t * p23.y };

  const p0123 = { x: (1 - t) * p012.x + t * p123.x, y: (1 - t) * p012.y + t * p123.y };

  return { p0, p1: p01, p2: p012, p3: p0123 };
}
```

---

## 5. Bioluminescent Multi-Pass Glow Engine
1. **Trunk Pass**:
   - Background bioluminescent glow stroke (`ctx.globalCompositeOperation = 'lighter'`, `ctx.strokeStyle = '#3b82f6'`, `ctx.lineWidth = 5` desktop / `3` mobile, `ctx.shadowColor = '#3b82f6'`, `ctx.shadowBlur = 12`).
   - Core white filament (`ctx.strokeStyle = '#ffffff'`, `ctx.lineWidth = 2` desktop / `1.2` mobile).
2. **Branch Pass 1 (Diffuse Aura)**:
   - `ctx.globalCompositeOperation = 'lighter'`, `ctx.strokeStyle = accentColor`, `ctx.shadowColor = accentColor`, `ctx.shadowBlur = 16`, `ctx.lineWidth = 5` desktop / `3.5` mobile.
3. **Branch Pass 2 (Crisp Core)**:
   - `ctx.globalCompositeOperation = 'source-over'`, `ctx.strokeStyle = '#ffffff'`, `ctx.shadowColor = accentColor`, `ctx.shadowBlur = 4`, `ctx.lineWidth = 1.8` desktop / `1.2` mobile.
4. **Terminal Node Glow Pulse**:
   - Harmonic sine breathing radius $R(t) = R_{\text{base}} + 3 \sin(2.5 t_{\text{sec}} + idx \cdot 0.8)$.
   - Radial gradient centered at active tip $Q_3$: stop 0 `#ffffff`, stop 0.3 `accentColor`, stop 1.0 `rgba(0,0,0,0)`.

---

## 6. High-DPI Scaling & Callback Throttling
1. **DPR Scaling**:
   - `dpr = Math.min(window.devicePixelRatio || 1, 2)`
   - `canvas.width = Math.floor(width * dpr)`
   - `canvas.height = Math.floor(height * dpr)`
   - `canvas.style.width = width + 'px'`, `canvas.style.height = height + 'px'`
   - `ctx.scale(dpr, dpr)`
2. **ResizeObserver**: Attached to container div, recalculating buffer dimensions automatically.
3. **onLeafCoordsUpdate Throttling**: Only trigger callback if $X$ or $Y$ changes by $> 0.5\text{px}$, progress changes by $> 0.01$, or `active` boolean flips state.

---

## 7. Verification Requirement
Worker must verify implementation by building without TypeScript errors:
`npx tsc --noEmit` or `npm run build`.
