# Scope: Milestone 2 — Procedural Canvas Tree Engine & Responsive Branch Visualization

## Architecture
- 2D Canvas component (`components/works-canvas-tree.tsx`) rendering smooth procedural 4-point Cubic Bezier curves connecting a main vertical trunk to terminal branch coordinates.
- Scroll-bound interpolation ($S \in [0, 1]$) controlling trunk growth, branch expansion, and leaf node positioning.
- Multi-pass bioluminescent glow effects (shadow blur, shadow color, gradient branch tips).
- Responsive layout scaling:
  - Desktop (>= 768px): Centered trunk (X = 50%) with alternating left/right branches.
  - Mobile (< 768px): Left-aligned trunk (X = 32px) with rightward branches.
- DPR scaling (`Math.min(window.devicePixelRatio, 2)`) and ResizeObserver for clean crisp rendering on high-DPI screens.
- Optimal 60fps rendering with `requestAnimationFrame`, offscreen canvas / path memoization, and minimal canvas state resets.
- Leaf coordinate & progress callbacks so HTML/DOM elements (e.g. project cards / leaf nodes) overlay accurately.

## Requirements Checklist
1. Render 4-point Cubic Bezier curves ($P_0 \to P_1 \to P_2 \to P_3$) from central trunk to terminal leaf positions.
2. Smooth scroll progress binding $S \in [0, 1]$.
3. Bioluminescent multi-pass glow rendering (`shadowBlur`, `shadowColor`, glowing tips/nodes).
4. Device Pixel Ratio (DPR) awareness up to 2x for sharp rendering on high-DPI displays.
5. Responsive breakpoints: Desktop (centered X=50% with left/right branches) vs Mobile (<768px left X=32px with rightward branches).
6. Performant animation loop using `requestAnimationFrame`, canvas dimensions managed via `ResizeObserver`.
7. Terminal coordinate export callback: emits array of calculated leaf `(x, y)` positions and active state to parent/DOM nodes.
8. TypeScript compliance & clean zero-error build (`npx tsc --noEmit` or `npm run build`).

## Interface Contracts
### `components/works-canvas-tree.tsx`
Exported React Component Props interface:
```typescript
export interface BranchTarget {
  id: string;
  title: string;
  category: string;
}

export interface TerminalLeafCoord {
  id: string;
  x: number; // canvas relative or container relative X
  y: number; // Y position along canvas
  active: boolean; // whether scroll progress has reached this leaf
}

export interface WorksCanvasTreeProps {
  scrollProgress: number; // S in [0, 1]
  projects: BranchTarget[];
  onLeafCoordsUpdate?: (coords: TerminalLeafCoord[]) => void;
  className?: string;
}
```

## Milestone Status
| Milestone | Name | Scope | Dependencies | Status |
|-----------|------|-------|-------------|--------|
| M2 | Procedural Canvas Tree Engine & Responsive Branch Visualization | `components/works-canvas-tree.tsx` | M1 (Project Data Architecture) | IN_PROGRESS |
