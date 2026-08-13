# Architecture & Performance Analysis Report: Procedural Canvas Tree Engine
**Agent**: Explorer 3 (`teamwork_preview_explorer`)  
**Milestone**: M2 — Procedural Canvas Tree Engine & Responsive Branch Visualization  
**Target Component**: `components/works-canvas-tree.tsx`  
**Date**: 2026-08-11  

---

## 1. Executive Summary

This report delivers the technical architecture, mathematical specifications, performance optimizations, and DOM callback interface for the **Procedural 2D Canvas Tree Engine** (`components/works-canvas-tree.tsx`).

The engine is responsible for rendering an organic, scroll-reactive 2D bioluminescent tree trunk and Bezier branch network for the `/works` portfolio page. To achieve high-fidelity rendering across all target devices (mobile, tablet, desktop, high-DPI displays) while maintaining a strict 60fps budget, this analysis details:
1. **DPR Sizing & `ResizeObserver` setup**: High-DPI buffer scaling using `Math.min(window.devicePixelRatio, 2)` to eliminate canvas blur while avoiding VRAM bloat.
2. **Responsive Layout Rules**: Desktop centered trunk ($X = 50\%$) with dual-sided alternating branches vs. Mobile left-aligned trunk ($X = 32\text{px}$) with rightward branch projections.
3. **60fps Frame Loop & Memoization**: `requestAnimationFrame` dirty-checking loop, offscreen canvas pre-rendering for glowing static paths, and `Path2D` caching.
4. **Terminal Leaf Coordinates Export**: Exact coordinate mapping formula and low-overhead `onLeafCoordsUpdate` callback contract for positioning React DOM leaf overlay elements.

---

## 2. Topic 1: Device Pixel Ratio (DPR) Scaling & `ResizeObserver` Engine

### 2.1 The Canvas Blur Problem on High-DPI Displays
HTML5 `<canvas>` elements have two distinct dimension spaces:
- **CSS Display Dimensions** (`canvas.style.width`, `canvas.style.height`): Determines the layout size in logical CSS pixels on the Web page.
- **Internal Canvas Buffer Dimensions** (`canvas.width`, `canvas.height`): Determines the underlying pixel grid bitmap buffer rendered by the GPU.

If `canvas.width` matches `canvas.style.width` on a High-DPI display (e.g. Retina display with `devicePixelRatio = 2`), the browser upscales the 1x canvas bitmap buffer to fill 2x physical pixels, causing noticeable blurriness on fine Bezier branch lines, glowing leaf nodes, and text.

### 2.2 DPR Capping Strategy
To ensure maximum crispness without risking GPU memory exhaustion on ultra-high-DPI screens (e.g. 3x mobile screens or 4x modern tablets):
$$\text{DPR} = \min(\text{window.devicePixelRatio} \parallel 1, 2)$$

- **Cap at 2.0x**: Scaling beyond 2.0x quadruples bitmap memory requirement with imperceptible visual difference for vector stroke lines.
- **Physical Buffer Calculation**:
  $$\text{bufferWidth} = \lfloor \text{displayWidth} \times \text{DPR} \rfloor$$
  $$\text{bufferHeight} = \lfloor \text{displayHeight} \times \text{DPR} \rfloor$$

### 2.3 `ResizeObserver` Lifecycle & Canvas Scaling Math
The canvas component attaches a `ResizeObserver` to its parent container element to dynamically resize the canvas buffer whenever container dimensions change (e.g., window resize, orientation change, drawer toggles).

```typescript
// ResizeObserver setup in useEffect
useEffect(() => {
  const container = containerRef.current;
  if (!container) return;

  const handleResize = (entries: ResizeObserverEntry[]) => {
    const entry = entries[0];
    if (!entry) return;

    const { width, height } = entry.contentRect;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const canvas = canvasRef.current;
    if (!canvas) return;

    // 1. Set physical buffer dimensions (GPU render target)
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);

    // 2. Set logical display dimensions (CSS layout)
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    // 3. Apply coordinate system scaling context
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.scale(dpr, dpr);
    }

    // 4. Invalidate pre-cached Path2D geometries
    recalculatePaths(width, height);
  };

  const observer = new ResizeObserver(handleResize);
  observer.observe(container);

  return () => observer.disconnect();
}, []);
```

### 2.4 Resolution Change Listener
Users moving a browser window between a 1x monitor and a 2x Retina display will not trigger container `contentRect` changes if the window size remains identical. To handle dynamic DPR shifts seamlessly:

```typescript
useEffect(() => {
  const mediaQuery = window.matchMedia(`(resolution: ${window.devicePixelRatio}dppx)`);
  const onChange = () => {
    // Force re-trigger resize handler
    triggerResize();
  };
  mediaQuery.addEventListener("change", onChange);
  return () => mediaQuery.removeEventListener("change", onChange);
}, []);
```

---

## 3. Topic 2: Responsive Layout Rules (Desktop vs Mobile Geometry)

### 3.1 Breakpoint & Layout Modes
The procedural tree engine evaluates viewport width against a standard $768\text{px}$ breakpoint:
- **Desktop Mode** ($\text{width} \ge 768\text{px}$): Dual-sided, centered trunk structure.
- **Mobile Mode** ($\text{width} < 768\text{px}$): Left-aligned trunk structure for optimal readability of project nodes.

```typescript
export interface ResponsiveLayout {
  isMobile: boolean;
  trunkX: number; // Logical X coordinate of vertical main trunk
  leftMargin: number;
  rightMargin: number;
  usableWidth: number;
}

export function getResponsiveLayout(width: number): ResponsiveLayout {
  const isMobile = width < 768;
  if (isMobile) {
    return {
      isMobile: true,
      trunkX: 32, // Fixed 32px from left container boundary
      leftMargin: 32,
      rightMargin: 16,
      usableWidth: width - 48,
    };
  }
  return {
    isMobile: false,
    trunkX: width * 0.5, // Centered at 50% container width
    leftMargin: 40,
    rightMargin: 40,
    usableWidth: width - 80,
  };
}
```

### 3.2 Desktop Layout Math ($\text{width} \ge 768\text{px}$)
- **Trunk Alignment**: $X_{\text{trunk}} = 0.5 \times \text{width}$
- **Branch Alternation**: Leaves are assigned `side: "left"` or `side: "right"` in `LeafNodeConfig`.
- **Terminal Coordinate Calculation**:
  - For `side === "left"`:
    $$X_{\text{terminal}} = X_{\text{trunk}} - \left(\text{width} \times \frac{\text{xOffsetPct}}{100}\right)$$
  - For `side === "right"`:
    $$X_{\text{terminal}} = X_{\text{trunk}} + \left(\text{width} \times \frac{\text{xOffsetPct}}{100}\right)$$
- **Vertical Placement**:
  $$Y_{\text{terminal}} = \text{height} \times \frac{\text{yOffsetPct}}{100}$$

#### Cubic Bezier Control Point Geometry (Desktop)
A 4-point Cubic Bezier curve ($P_0 \to P_1 \to P_2 \to P_3$) connects trunk to terminal leaf:
- $P_0 = (X_{\text{trunk}}, Y_{\text{start}})$ — Origin on trunk.
- $P_1 = (X_{\text{trunk}} \pm \Delta X \times 0.4, Y_{\text{start}} + \Delta Y \times 0.1)$ — Outward curvature initial control point.
- $P_2 = (X_{\text{terminal}} \mp \Delta X \times 0.2, Y_{\text{terminal}} - \Delta Y \times 0.3)$ — Terminal approach control point.
- $P_3 = (X_{\text{terminal}}, Y_{\text{terminal}})$ — End leaf position.

### 3.3 Mobile Layout Math ($\text{width} < 768\text{px}$)
On mobile screens ($<768\text{px}$), centering the trunk leaves only $\approx 180\text{px}$ on either side, which truncates project labels and tooltips.

- **Trunk Alignment**: Left-aligned at $X_{\text{trunk}} = 32\text{px}$.
- **Branch Direction**: All branches project **rightward** towards the right screen edge regardless of `leafConfig.side`.
- **Terminal Coordinate Calculation**:
  $$X_{\text{terminal}} = X_{\text{trunk}} + \left((\text{width} - 80\text{px}) \times \frac{\text{xOffsetPct}}{100}\right) + 20\text{px}$$
  $$\text{Clamped } X_{\text{terminal}} \in [64\text{px}, \text{width} - 24\text{px}]$$
- **Cubic Bezier Control Point Adjustments (Mobile)**:
  - $P_0 = (32\text{px}, Y_{\text{start}})$
  - $P_1 = (32\text{px} + \Delta X \times 0.5, Y_{\text{start}} + \Delta Y \times 0.2)$ — Sweeps rightward smoothly from vertical trunk line.
  - $P_2 = (X_{\text{terminal}} - 15\text{px}, Y_{\text{terminal}} - \Delta Y \times 0.25)$
  - $P_3 = (X_{\text{terminal}}, Y_{\text{terminal}})$

---

## 4. Topic 3: 60fps Animation Loop, Offscreen Canvas & Path Memoization

### 4.1 60fps `requestAnimationFrame` Loop Architecture
To achieve 60fps scrolling and organic growth without dropped frames:
1. **Scroll Smoothing (Lerp)**: Smoothly interpolate current scroll state towards target scroll position ($S$).
2. **Dirty Frame Skipping**: If $\Delta S < 0.0001$ and no active bioluminescent particle animations are running, pause drawing commands to conserve GPU/CPU cycles.
3. **Delta Time Capping**: Cap maximum frame delta at $33\text{ms}$ (30fps equivalent) to prevent animation jumps when switching browser tabs.

```typescript
// 60fps RAF Loop with Lerp & Dirty Checking
const renderStateRef = useRef({
  currentScroll: 0,
  targetScroll: 0,
  isDirty: true,
  lastTime: performance.now(),
});

useEffect(() => {
  let animId: number;

  const loop = (timestamp: number) => {
    const state = renderStateRef.current;
    state.targetScroll = scrollProgress; // From props

    const deltaScroll = Math.abs(state.targetScroll - state.currentScroll);

    // Lerp scroll position for smooth kinetic branch extension
    if (deltaScroll > 0.0001) {
      state.currentScroll += (state.targetScroll - state.currentScroll) * 0.1;
      state.isDirty = true;
    } else {
      state.currentScroll = state.targetScroll;
    }

    // Always keep animating subtle energy particles if branch is active
    const hasActiveParticles = checkActiveParticles();

    if (state.isDirty || hasActiveParticles) {
      drawCanvasFrame(state.currentScroll);
      state.isDirty = false;
    }

    animId = requestAnimationFrame(loop);
  };

  animId = requestAnimationFrame(loop);
  return () => cancelAnimationFrame(animId);
}, [scrollProgress]);
```

### 4.2 Offscreen Canvas & `Path2D` Memoization
Re-computing complex 4-point Cubic Bezier curves and bioluminescent gradient strokes for 7+ branches every frame is inefficient.

#### Strategy:
1. **`Path2D` Caching**: Compute static branch Bezier paths on container resize and cache them in a `Map<string, Path2D>()`.
2. **Offscreen Static Canvas**: Render the full static trunk and background glow guide lines once to an offscreen canvas (`OffscreenCanvas` or hidden HTML `<canvas>`).
3. **Main Canvas Rendering Strategy**:
   - `ctx.drawImage(offscreenCanvas, 0, 0, displayWidth, displayHeight)` transfers the base tree structure in a single GPU blit operation.
   - Dynamic active branches are drawn over the base layer using trimmed Bezier interpolation.

```typescript
// Path2D Memoization map
const pathCacheRef = useRef<{
  trunkPath: Path2D | null;
  branchPaths: Map<string, Path2D>;
}>({
  trunkPath: null,
  branchPaths: new Map(),
});

function cacheTreePaths(width: number, height: number, projects: Project[]) {
  const layout = getResponsiveLayout(width);
  const cache = pathCacheRef.current;

  // 1. Build trunk Path2D
  const trunk = new Path2D();
  trunk.moveTo(layout.trunkX, 0);
  trunk.lineTo(layout.trunkX, height);
  cache.trunkPath = trunk;

  // 2. Build branch Path2Ds
  cache.branchPaths.clear();
  projects.forEach((proj) => {
    const coords = computeBranchGeometry(proj, layout, width, height);
    const path = new Path2D();
    path.moveTo(coords.p0.x, coords.p0.y);
    path.bezierCurveTo(
      coords.p1.x, coords.p1.y,
      coords.p2.x, coords.p2.y,
      coords.p3.x, coords.p3.y
    );
    cache.branchPaths.set(proj.id, path);
  });
}
```

### 4.3 Minimal Canvas State Resets & Glow Pass Optimization
Setting `ctx.shadowBlur` and `ctx.shadowColor` invokes expensive blur filters on canvas 2D contexts. Doing multi-pass shadowBlur per frame causes frame drops on integrated GPUs.

#### High-Performance Glow Recipe:
1. **Pass 1 (Glow Layer)**: Set `ctx.shadowBlur = 12`, `ctx.shadowColor = accentColor`, `ctx.lineWidth = 4`, `ctx.globalAlpha = 0.4`. Draw active branch paths.
2. **Pass 2 (Core Bright Line)**: Set `ctx.shadowBlur = 0` (turn off shadow engine), `ctx.lineWidth = 2`, `ctx.globalAlpha = 1.0`, `ctx.strokeStyle = "#ffffff"`. Draw core branch line.
3. Batch all operations sharing the same `accentColor` to minimize state changes (`ctx.strokeStyle` assignments).

---

## 5. Topic 4: Terminal Leaf Coordinates Export & `onLeafCoordsUpdate` Callback

### 5.1 Overlay Architecture
The tree canvas component does not render interactive React DOM elements directly inside canvas pixels. Instead, it exports calculated logical terminal leaf coordinates (`x`, `y`) to the parent component via `onLeafCoordsUpdate`.
The parent renders overlay `<LeafNode />` buttons positioned absolutely over the canvas.

### 5.2 Payload Contract Specification
```typescript
export interface TerminalLeafCoord {
  /** Unique project identifier matching Project.id */
  id: string;
  /** Logical X position relative to canvas container (in CSS px) */
  x: number;
  /** Logical Y position relative to canvas container (in CSS px) */
  y: number;
  /** Whether current scroll progress S >= leafConfig.endScroll */
  active: boolean;
  /** Normalized branch growth completion ratio (0.0 to 1.0) */
  progress: number;
  /** Accent color hex code for leaf indicator and preview card */
  accentColor: string;
  /** Layout side for tooltip placement ("left" | "right") */
  side: "left" | "right";
}
```

### 5.3 Calculation & Growth Interpolation Math
For each project leaf node:
$$\text{progress}_i = \text{clamp}\left( \frac{S - \text{startScroll}_i}{\text{endScroll}_i - \text{startScroll}_i}, 0.0, 1.0 \right)$$
$$\text{active}_i = (\text{progress}_i \ge 1.0)$$

Terminal node coordinate at current scroll $S$:
- If $\text{progress}_i == 0$: Branch has not started growing.
- If $0 < \text{progress}_i < 1.0$: Interpolate current tip along Cubic Bezier curve using de CastCasteljau's algorithm:
  $$B(t) = (1-t)^3 P_0 + 3(1-t)^2 t P_1 + 3(1-t) t^2 P_2 + t^3 P_3 \quad \text{where } t = \text{progress}_i$$
  The current tip coordinate is $(X_{B(t)}, Y_{B(t)})$.
- If $\text{progress}_i == 1.0$: Terminal coordinate is $P_3 = (X_{\text{terminal}}, Y_{\text{terminal}})$.

### 5.4 Update Epsilon Throttling (Preventing React Render Loops)
To prevent `onLeafCoordsUpdate` from firing on every micro-scroll frame (which would trigger React state updates and component re-renders at 60Hz), compare newly calculated coordinates with previous emitted values:

```typescript
const lastEmittedCoordsRef = useRef<TerminalLeafCoord[]>([]);

function emitLeafCoordsIfChanged(newCoords: TerminalLeafCoord[], callback?: (coords: TerminalLeafCoord[]) => void) {
  if (!callback) return;

  const lastCoords = lastEmittedCoordsRef.current;
  let hasChanged = false;

  if (lastCoords.length !== newCoords.length) {
    hasChanged = true;
  } else {
    for (let i = 0; i < newCoords.length; i++) {
      const prev = lastCoords[i];
      const next = newCoords[i];
      if (
        prev.active !== next.active ||
        Math.abs(prev.x - next.x) > 0.5 ||
        Math.abs(prev.y - next.y) > 0.5 ||
        Math.abs(prev.progress - next.progress) > 0.01
      ) {
        hasChanged = true;
        break;
      }
    }
  }

  if (hasChanged) {
    lastEmittedCoordsRef.current = newCoords;
    callback(newCoords);
  }
}
```

---

## 6. Implementation Code Blueprint (`components/works-canvas-tree.tsx`)

Below is the complete structural architecture for the production component:

```typescript
"use client";

import React, { useRef, useEffect, useCallback, useMemo } from "react";
import { Project, LeafNodeConfig } from "@/data/projects";

export interface TerminalLeafCoord {
  id: string;
  x: number;
  y: number;
  active: boolean;
  progress: number;
  accentColor: string;
  side: "left" | "right";
}

export interface WorksCanvasTreeProps {
  projects: Project[];
  scrollProgress: number; // Normalized scroll 0.0 to 1.0
  onLeafCoordsUpdate?: (coords: TerminalLeafCoord[]) => void;
  onSelectProject?: (project: Project) => void;
  activeProjectId?: string;
  className?: string;
}

export function WorksCanvasTree({
  projects,
  scrollProgress,
  onLeafCoordsUpdate,
  onSelectProject,
  activeProjectId,
  className = "",
}: WorksCanvasTreeProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Path cache & animation refs
  const pathCacheRef = useRef<{
    layout: { isMobile: boolean; trunkX: number };
    leafCoords: TerminalLeafCoord[];
  }>({
    layout: { isMobile: false, trunkX: 0 },
    leafCoords: [],
  });

  // Render loop & resize handling implementation...
  return (
    <div ref={containerRef} className={`relative w-full h-full min-h-[1200px] ${className}`}>
      <canvas ref={canvasRef} className="block w-full h-full pointer-events-none" />
    </div>
  );
}
```

---

## 7. Verification Method & Performance Benchmarks

### 7.1 Independent Verification Steps
1. **DPR Sharpness Verification**: Inspect canvas rendering on Retina display ($2\text{x}$) vs standard 1080p display ($1\text{x}$). Inspect canvas `width` attribute in DevTools DOM inspector — verify `canvas.width == containerWidth * dpr` while `canvas.style.width == containerWidth + "px"`.
2. **Responsive Breakpoint Verification**: Toggle DevTools device toolbar below $768\text{px}$. Confirm trunk X jumps to $32\text{px}$ and all branch projections curve rightward without horizontal overflow.
3. **60fps Frame Rate Verification**: Open Chrome Performance profiler or FPS meter. Perform long scroll down `/works`. Verify frame time remains under $16.6\text{ms}$ without long-task spikes during Bezier drawing.
4. **DOM Callback Verification**: Monitor `onLeafCoordsUpdate` callback invocations during scroll. Verify callback fires only when coordinates shift $> 0.5\text{px}$ or active state flips, preserving React performance.

---
*Report compiled by Explorer 3 (`teamwork_preview_explorer`). Ready for Milestone 2 implementation.*
