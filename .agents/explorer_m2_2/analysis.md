# Analysis Report: Canvas 2D Bezier Curves, Growth Interpolation & Bioluminescent Glow Math

**Author**: Explorer 2 (`teamwork_preview_explorer`)  
**Milestone**: M2 — Procedural Canvas Tree Engine & Responsive Branch Visualization  
**Target Component**: `components/works-canvas-tree.tsx`  
**Date**: 2026-08-11  

---

## Executive Summary

This report establishes the complete mathematical, geometric, and HTML5 2D Canvas rendering specifications for the interactive procedural tree branch system on the `/works` portfolio page. Key findings include:

1. **Cubic Bezier Geometry**: 4-point parametric curves $B(t)$ for $t \in [0, 1]$ cleanly model organic branch growth from trunk anchors $P_0$ to terminal leaf nodes $P_3$, utilizing directional offset vectors for control points $P_1$ and $P_2$.
2. **De Casteljau Curve Truncation**: Scroll progress $S \in [0, 1]$ is mapped to local branch progress $s_{\text{branch}} \in [0, 1]$. Using **de Casteljau's subdivision algorithm**, the active growing curve is truncated into exact sub-control points $(Q_0, Q_1, Q_2, Q_3)$, enabling native 60fps single-pass `ctx.bezierCurveTo(...)` rendering without expensive line discretization.
3. **Multi-Pass Bioluminescent Glow**: A 2-pass rendering pipeline combining subtle `shadowBlur` / `shadowColor`, linear stroke gradients, and `globalCompositeOperation = 'lighter'` produces luminous glowing energy conduits without dropping below 60fps frame rates.
4. **Terminal Leaf Radial Gradients & Breathing Math**: Terminal leaf nodes feature a 3-stop radial gradient (white-hot core, saturated accent ring, decaying outer aura) with a time-harmonic pulse function $\sin(\omega t_{\text{anim}} + \phi_i)$.
5. **Responsive & DPR Adaptation**: Coordinates adapt dynamically between Desktop (centered trunk $X = 0.50W$, alternating branches) and Mobile (left-aligned trunk $X = 32\text{px}$, rightward branches), maintaining crisp high-DPI rendering up to $\text{DPR} \le 2$.

---

## 1. 4-Point Cubic Bezier Curve Formulation ($P_0 \to P_1 \to P_2 \to P_3$)

### 1.1 Parametric Equation
A 4-point Cubic Bezier curve $B(t) = (X(t), Y(t))$ for $t \in [0, 1]$ is defined by four control points:
- $P_0 = (x_0, y_0)$: Trunk anchor point (where the branch stems from the trunk).
- $P_1 = (x_1, y_1)$: Primary control point defining initial tangent angle as the branch departs the trunk.
- $P_2 = (x_2, y_2)$: Secondary control point governing curvature inflection towards the terminal node.
- $P_3 = (x_3, y_3)$: Terminal leaf node point.

The explicit cubic polynomial matrix equation is:
$$B(t) = (1-t)^3 P_0 + 3(1-t)^2 t P_1 + 3(1-t) t^2 P_2 + t^3 P_3$$

Component-wise:
$$X(t) = (1-t)^3 x_0 + 3(1-t)^2 t x_1 + 3(1-t) t x_2 + t^3 x_3$$
$$Y(t) = (1-t)^3 y_0 + 3(1-t)^2 t y_1 + 3(1-t) t y_2 + t^3 y_3$$

---

### 1.2 Control Point Derivation by Viewport Layout

Let $W$ be the canvas width, $H$ be the canvas height, and project configuration parameters be `side` $\in \{\text{"left"}, \text{"right"}\}$, `startScroll`, `endScroll`, `xOffsetPct`, and `yOffsetPct`.

#### A. Trunk Math
The central trunk extends vertically down the canvas:
- In **Desktop mode** ($\ge 768\text{px}$): $X_{\text{trunk}}(y) = 0.50 \cdot W + A_t \cdot \sin(y / \lambda_t)$, where $A_t \approx 8\text{px}$ (organic sway amplitude) and $\lambda_t \approx 150\text{px}$ (wavelength).
- In **Mobile mode** ($< 768\text{px}$): $X_{\text{trunk}}(y) = 32\text{px} + A_t \cdot \sin(y / \lambda_t)$, where $A_t \approx 3\text{px}$.

#### B. Anchor Point $P_0$ (Trunk Origin)
The branch anchor point $P_0$ originates at the trunk coordinate matching `startScroll`:
$$y_0 = H \cdot y_{\text{anchor\_pct}}$$
$$x_0 = X_{\text{trunk}}(y_0)$$
where $y_{\text{anchor\_pct}} = \text{startScroll} + 0.02$ (or derived directly from `yOffsetPct`).

#### C. Terminal Point $P_3$ (Leaf Target)
- **Desktop Mode** ($\ge 768\text{px}$):
  - If `side == "left"`: $x_3 = X_{\text{trunk}}(y_0) - \left(\frac{\text{xOffsetPct}}{100}\right) \cdot (0.42 \cdot W)$
  - If `side == "right"`: $x_3 = X_{\text{trunk}}(y_0) + \left(\frac{\text{xOffsetPct}}{100}\right) \cdot (0.42 \cdot W)$
  - $y_3 = H \cdot \left(\frac{\text{yOffsetPct}}{100}\right)$
- **Mobile Mode** ($< 768\text{px}$):
  - All branches project to the right: $x_3 = X_{\text{trunk}}(y_0) + \left(\frac{\text{xOffsetPct}}{100}\right) \cdot (W - 80\text{px})$
  - $y_3 = H \cdot \left(\frac{\text{yOffsetPct}}{100}\right)$

#### D. Intermediate Control Points $P_1$ and $P_2$
To create natural, organic branch arcs (leaving the trunk almost horizontally/diagonally and bending upward or downward before levelling out at the leaf node):

Let $\Delta x = x_3 - x_0$ and $\Delta y = y_3 - y_0$.
- **Control Point $P_1$**: Leaves trunk at a outward horizontal bias:
  $$x_1 = x_0 + 0.45 \cdot \Delta x$$
  $$y_1 = y_0 + 0.10 \cdot \Delta y$$
- **Control Point $P_2$**: Approaches terminal node with vertical ease:
  $$x_2 = x_0 + 0.80 \cdot \Delta x$$
  $$y_2 = y_3 - 0.25 \cdot \Delta y$$

---

## 2. Scroll Progress Interpolation ($S \in [0, 1]$) & De Casteljau Subdivision

### 2.1 Scroll Mapping & Local Progress Calculation
Global normalized scroll progress $S \in [0, 1]$ (provided by page scroll listener or Lenis smooth scroll) drives branch growth.

For branch $i$ with active scroll bounds $[s_{\text{start}, i}, s_{\text{end}, i}]$:
$$s_{\text{branch}, i} = \text{clamp}\left( \frac{S - s_{\text{start}, i}}{s_{\text{end}, i} - s_{\text{start}, i}}, 0.0, 1.0 \right)$$

where $\text{clamp}(v, a, b) = \max(a, \min(b, v))$.

- If $s_{\text{branch}, i} = 0$: Branch has not started growing yet (hidden).
- If $0 < s_{\text{branch}, i} < 1$: Branch is currently growing along its Bezier path.
- If $s_{\text{branch}, i} = 1$: Branch is fully grown and fully illuminates the leaf node.

---

### 2.2 De Casteljau's Algorithm for Exact Cubic Curve Truncation

To render a partial Bezier curve from parameter $t = 0$ to $t = \tau$ (where $\tau = s_{\text{branch}, i}$), we apply **de Casteljau's subdivision algorithm**. This yields the exact 4 control points $(Q_0, Q_1, Q_2, Q_3)$ for the sub-curve $B|_{[0, \tau]}$.

#### Step-by-Step Recursive Subdivision Math:
Given initial points $P_0, P_1, P_2, P_3$ and parameter $\tau \in [0, 1]$:

1. First-stage linear interpolations:
   $$P_{01}(\tau) = (1-\tau)P_0 + \tau P_1$$
   $$P_{12}(\tau) = (1-\tau)P_1 + \tau P_2$$
   $$P_{23}(\tau) = (1-\tau)P_2 + \tau P_3$$

2. Second-stage quadratic interpolations:
   $$P_{012}(\tau) = (1-\tau)P_{01}(\tau) + \tau P_{12}(\tau)$$
   $$P_{123}(\tau) = (1-\tau)P_{12}(\tau) + \tau P_{23}(\tau)$$

3. Third-stage cubic interpolation (the point on the curve at $t = \tau$):
   $$P_{0123}(\tau) = (1-\tau)P_{012}(\tau) + \tau P_{123}(\tau)$$

#### Sub-Curve Control Points:
The truncated sub-curve starting at $P_0$ and ending at $P_{0123}(\tau)$ is exactly represented by the cubic Bezier control points:
$$Q_0 = P_0$$
$$Q_1 = P_{01}(\tau)$$
$$Q_2 = P_{012}(\tau)$$
$$Q_3 = P_{0123}(\tau)$$

#### TypeScript Helper Function:
```typescript
export interface Point2D {
  x: number;
  y: number;
}

export interface CubicBezier {
  p0: Point2D;
  p1: Point2D;
  p2: Point2D;
  p3: Point2D;
}

/**
 * Truncates a cubic Bezier curve to parameter tau in [0, 1] using de Casteljau's algorithm.
 */
export function truncateCubicBezier(curve: CubicBezier, tau: number): CubicBezier {
  const { p0, p1, p2, p3 } = curve;
  const t = Math.max(0, Math.min(1, tau));

  const p01 = { x: (1 - t) * p0.x + t * p1.x, y: (1 - t) * p0.y + t * p1.y };
  const p12 = { x: (1 - t) * p1.x + t * p2.x, y: (1 - t) * p1.y + t * p2.y };
  const p23 = { x: (1 - t) * p2.x + t * p3.x, y: (1 - t) * p2.y + t * p3.y };

  const p012 = { x: (1 - t) * p01.x + t * p12.x, y: (1 - t) * p01.y + t * p12.y };
  const p123 = { x: (1 - t) * p12.x + t * p223.x, y: (1 - t) * p12.y + t * p23.y };

  const p0123 = { x: (1 - t) * p012.x + t * p123.x, y: (1 - t) * p012.y + t * p123.y };

  return {
    p0: p0,
    p1: p01,
    p2: p012,
    p3: p0123,
  };
}
```

#### Why De Casteljau Beats Line Segment Discretization:
1. **60fps Performance**: Native `ctx.bezierCurveTo(Q1.x, Q1.y, Q2.x, Q2.y, Q3.x, Q3.y)` executes GPU hardware vector rasterization in 1 draw call vs 50+ line-to calls.
2. **Perfect Smoothness**: Sub-curve remains mathematically continuous regardless of zoom or scale.
3. **Exact Tip Coordinates**: $Q_3$ provides the exact real-time growing tip position $(x_{\text{tip}}, y_{\text{tip}})$ for rendering glowing tip particles and positioning DOM overlay nodes.

---

## 3. Bioluminescent Multi-Pass Glow Rendering Techniques

To achieve a sleek, high-tech bioluminescent neon aesthetic matching dark themes without burning GPU frame time:

```
+-------------------------------------------------------------------+
| Multi-Pass Render Pipeline                                        |
+-------------------------------------------------------------------+
|  Pass 1: Outer Ambient Glow                                       |
|    - strokeStyle: accentColor gradient with alpha                |
|    - shadowColor: accentColor | shadowBlur: 16px                    |
|    - globalCompositeOperation: 'lighter'                          |
|    - lineWidth: 5px                                               |
+-------------------------------------------------------------------+
|  Pass 2: Sharp Luminous Core                                      |
|    - strokeStyle: #ffffff / bright accent gradient                |
|    - shadowColor: #ffffff | shadowBlur: 4px                         |
|    - globalCompositeOperation: 'source-over'                      |
|    - lineWidth: 2px                                               |
+-------------------------------------------------------------------+
|  Pass 3: Tip Glow Particle / Radial Leaf Aura                     |
|    - Radial Gradient: #ffffff (0px) -> accentColor -> transparent |
|    - Sine Breathing Pulse: r_outer(t) = r_base + A * sin(...)     |
+-------------------------------------------------------------------+
```

---

### 3.1 Linear Stroke Gradient Along Branch Path
For each branch, create a linear gradient along the bounding vector from anchor $P_0$ to terminal $P_3$:

```typescript
const grad = ctx.createLinearGradient(curve.p0.x, curve.p0.y, curve.p3.x, curve.p3.y);
// Color stops: Trunk base color -> Luminous accent -> White-hot tip
grad.addColorStop(0.0, "rgba(59, 130, 246, 0.4)"); // Muted base
grad.addColorStop(0.7, accentColor);               // Vibrant accent
grad.addColorStop(1.0, "#ffffff");                  // Luminous tip
```

---

### 3.2 2-Pass Canvas Glow Layering

#### Pass 1: Diffuse Ambient Aura (Wide Luminous Glow)
```typescript
ctx.save();
ctx.beginPath();
ctx.moveTo(q.p0.x, q.p0.y);
ctx.bezierCurveTo(q.p1.x, q.p1.y, q.p2.x, q.p2.y, q.p3.x, q.p3.y);

ctx.globalCompositeOperation = "lighter"; // Additive blending for bioluminescence
ctx.strokeStyle = accentColor;
ctx.lineWidth = isMobile ? 3.5 : 5.0;
ctx.shadowColor = accentColor;
ctx.shadowBlur = 18; // Wide soft glow
ctx.stroke();
ctx.restore();
```

#### Pass 2: High-Intensity Core Filament
```typescript
ctx.save();
ctx.beginPath();
ctx.moveTo(q.p0.x, q.p0.y);
ctx.bezierCurveTo(q.p1.x, q.p1.y, q.p2.x, q.p2.y, q.p3.x, q.p3.y);

ctx.globalCompositeOperation = "source-over";
ctx.strokeStyle = "#ffffff";
ctx.lineWidth = isMobile ? 1.2 : 1.8;
ctx.shadowColor = accentColor;
ctx.shadowBlur = 4; // Crisp core focus
ctx.stroke();
ctx.restore();
```

---

### 3.3 Terminal Leaf Node Radial Gradient & Harmonic Breathing Pulse

When a branch is growing ($s_{\text{branch}} > 0$), a glowing energy tip or leaf node is rendered at the active tip coordinate $Q_3 = (x_{\text{tip}}, y_{\text{tip}})$.

#### Harmonic Pulse Formula:
To create a subtle breathing bioluminescence, the outer radius is modulated by time $t_{\text{anim}}$ (in seconds, derived from `performance.now() / 1000`):
$$r_{\text{outer}}(t_{\text{anim}}, i) = r_{\text{base}} + A_{\text{pulse}} \cdot \sin(\omega \cdot t_{\text{anim}} + \phi_i)$$

where:
- $r_{\text{base}} = 12\text{px}$ (desktop) or $9\text{px}$ (mobile)
- $A_{\text{pulse}} = 3\text{px}$
- $\omega = 2.5\text{ rad/s}$ (gentle 2.5 Hz oscillation)
- $\phi_i = i \cdot 0.8\text{ rad}$ (phase offset so nodes don't pulse in lockstep)

#### Radial Gradient Construction:
```typescript
const tipX = q.p3.x;
const tipY = q.p3.y;
const rInner = 0;
const rOuter = rBase + 3 * Math.sin(2.5 * timeSec + index * 0.8);

const radialGrad = ctx.createRadialGradient(tipX, tipY, rInner, tipX, tipY, Math.max(1, rOuter));
radialGrad.addColorStop(0.00, "#ffffff");                           // Hotspot core
radialGrad.addColorStop(0.25, accentColor);                         // Vibrant glow ring
radialGrad.addColorStop(0.60, hexToRgba(accentColor, 0.35));       // Soft aura
radialGrad.addColorStop(1.00, "rgba(0, 0, 0, 0.0)");               // Decay to transparent

ctx.save();
ctx.globalCompositeOperation = "lighter";
ctx.fillStyle = radialGrad;
ctx.beginPath();
ctx.arc(tipX, tipY, Math.max(1, rOuter), 0, Math.PI * 2);
ctx.fill();
ctx.restore();
```

---

## 4. Responsive Coordinate System & DPR Scaling

### 4.1 Device Pixel Ratio (DPR) Handling
High-DPI screens (Retina displays) render blurry canvas lines if not scaled properly.
- Device Pixel Ratio: $\text{dpr} = \min(\text{window.devicePixelRatio} \parallel 1, 2)$.
- Set physical canvas buffer size: `canvas.width = Math.floor(width * dpr)`, `canvas.height = Math.floor(height * dpr)`.
- Set CSS display size: `canvas.style.width = width + 'px'`, `canvas.style.height = height + 'px'`.
- Scale drawing context once per frame: `ctx.scale(dpr, dpr)`.

### 4.2 Breakpoint Adaptation Matrix
| Dimension / Element | Desktop Layout ($\ge 768\text{px}$) | Mobile Layout ($< 768\text{px}$) |
|---|---|---|
| Trunk Position ($X_{\text{base}}$) | $0.50 \cdot W$ (Centered) | $32\text{px}$ (Left-aligned) |
| Branch Direction | Alternating Left & Right | All Rightward |
| Trunk Stroke Width | $4.0\text{px}$ core / $10.0\text{px}$ glow | $2.5\text{px}$ core / $6.0\text{px}$ glow |
| Branch Stroke Width | $1.8\text{px}$ core / $5.0\text{px}$ glow | $1.2\text{px}$ core / $3.5\text{px}$ glow |
| Leaf Node Radius | $12\text{px} \pm 3\text{px}$ pulse | $9\text{px} \pm 2\text{px}$ pulse |
| Responsive X-Extent | Up to $0.42 \cdot W$ left/right | Up to $(W - 80\text{px})$ right |

---

## 5. Coordinate Export & DOM Overlay Interface Contract

To allow React DOM elements (interactive leaf tooltips, hover trigger zones, slide-over drawer targets) to align 100% accurately over the canvas rendering:

### Interface Export Data Structure
```typescript
export interface TerminalLeafCoord {
  id: string;
  x: number;          // Canvas container-relative X (in CSS pixels)
  y: number;          // Canvas container-relative Y (in CSS pixels)
  active: boolean;     // True if s_branch >= 1.0 (fully drawn)
  progress: number;   // Current s_branch in [0, 1]
  accentColor: string;
}
```

### Calculation & Emission Strategy
At the end of every animation frame draw pass in `components/works-canvas-tree.tsx`:
1. Iterate over all project branch curves $i=0..N-1$.
2. Compute full Bezier curve and truncated sub-curve $Q(s_{\text{branch}, i})$.
3. Extract terminal leaf target position $P_3 = (x_3, y_3)$ and current tip position $Q_3 = (q_{3.x}, q_{3.y})$.
4. Check if coordinates changed significantly ($> 0.5\text{px}$) or if active status flipped.
5. Invoke `onLeafCoordsUpdate(coords)` callback with updated array.

---

## 6. Performance & 60FPS Optimization Strategy

1. **Frame Budget Guard**: Canvas redraw must complete in under $\mathbf{16.67\text{ms}}$ (preferably $< 4\text{ms}$).
2. **Context State Isolation**: Wrap all multi-pass glow calls in `ctx.save()` / `ctx.restore()` to prevent state leakage and avoid unnecessary context resets.
3. **Selective ShadowBlur**: `shadowBlur` can be computationally expensive on low-end hardware. Combining a light `shadowBlur` ($4\text{px} - 18\text{px}$) with `globalCompositeOperation = 'lighter'` delivers maximum luminous effect with minimal GPU load.
4. **RAF Loop Optimization**: Use single `requestAnimationFrame` loop that checks scroll progress deltas and time animation deltas. If scroll hasn't changed and no pulse animation is active, skip off-screen redraws.
5. **Clean Dismount**: Cancel `requestAnimationFrame` and unbind `ResizeObserver` on React component unmount to prevent memory leaks.

---

## 7. Recommended Implementation Blueprint (`components/works-canvas-tree.tsx`)

Below is the complete architectural implementation blueprint for the React 2D Canvas component:

```tsx
"use client";

import React, { useEffect, useRef } from "react";
import { Project } from "@/data/projects";

export interface BranchTarget {
  id: string;
  title: string;
  category: string;
  leafConfig: {
    startScroll: number;
    endScroll: number;
    side: "left" | "right";
    xOffsetPct: number;
    yOffsetPct: number;
    accentColor: string;
  };
}

export interface TerminalLeafCoord {
  id: string;
  x: number;
  y: number;
  active: boolean;
  progress: number;
}

export interface WorksCanvasTreeProps {
  scrollProgress: number; // S in [0, 1]
  projects: Project[];
  onLeafCoordsUpdate?: (coords: TerminalLeafCoord[]) => void;
  className?: string;
}

interface Point2D {
  x: number;
  y: number;
}

interface CubicBezier {
  p0: Point2D;
  p1: Point2D;
  p2: Point2D;
  p3: Point2D;
}

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

export const WorksCanvasTree: React.FC<WorksCanvasTreeProps> = ({
  scrollProgress,
  projects,
  onLeafCoordsUpdate,
  className,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const animFrameRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = container.clientWidth;
    let height = container.clientHeight;

    const handleResize = () => {
      if (!container || !canvas) return;
      width = container.clientWidth;
      height = container.clientHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);

      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
    };

    const resizeObserver = new ResizeObserver(() => handleResize());
    resizeObserver.observe(container);
    handleResize();

    const render = (timeMs: number) => {
      const timeSec = timeMs / 1000;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);

      ctx.save();
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.scale(dpr, dpr);

      const isMobile = width < 768;
      const trunkXBase = isMobile ? 32 : width * 0.5;

      // 1. Draw Main Central Trunk
      const trunkYMax = height * Math.min(1.0, scrollProgress * 1.1);
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(trunkXBase, 0);
      for (let y = 0; y <= trunkYMax; y += 10) {
        const organicX = trunkXBase + (isMobile ? 3 : 8) * Math.sin(y / 150);
        ctx.lineTo(organicX, y);
      }
      ctx.globalCompositeOperation = "lighter";
      ctx.strokeStyle = "#3b82f6";
      ctx.lineWidth = isMobile ? 3 : 5;
      ctx.shadowColor = "#3b82f6";
      ctx.shadowBlur = 12;
      ctx.stroke();
      ctx.restore();

      // Core Trunk Line
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(trunkXBase, 0);
      for (let y = 0; y <= trunkYMax; y += 10) {
        const organicX = trunkXBase + (isMobile ? 3 : 8) * Math.sin(y / 150);
        ctx.lineTo(organicX, y);
      }
      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = isMobile ? 1.2 : 2;
      ctx.stroke();
      ctx.restore();

      // 2. Draw Branches & Leaf Nodes
      const coordsUpdate: TerminalLeafCoord[] = [];

      projects.forEach((project, idx) => {
        const { leafConfig } = project;
        const { startScroll, endScroll, side, xOffsetPct, yOffsetPct, accentColor } = leafConfig;

        // Local branch progress
        const sBranch = Math.max(0, Math.min(1, (scrollProgress - startScroll) / (endScroll - startScroll)));

        const y0 = height * yOffsetPct * 0.95;
        const x0 = trunkXBase + (isMobile ? 3 : 8) * Math.sin(y0 / 150);

        let x3: number;
        let y3 = height * yOffsetPct;

        if (isMobile) {
          x3 = trunkXBase + (xOffsetPct / 100) * (width - 80);
        } else {
          x3 = side === "left"
            ? trunkXBase - (xOffsetPct / 100) * (width * 0.42)
            : trunkXBase + (xOffsetPct / 100) * (width * 0.42);
        }

        const dx = x3 - x0;
        const dy = y3 - y0;

        const p1 = { x: x0 + 0.45 * dx, y: y0 + 0.10 * dy };
        const p2 = { x: x0 + 0.80 * dx, y: y3 - 0.25 * dy };

        const fullCurve: CubicBezier = { p0: { x: x0, y: y0 }, p1, p2, p3: { x: x3, y: y3 } };

        coordsUpdate.push({
          id: project.id,
          x: x3,
          y: y3,
          active: sBranch >= 0.98,
          progress: sBranch,
        });

        if (sBranch <= 0) return;

        const q = truncateCubicBezier(fullCurve, sBranch);

        // Pass 1: Diffuse Luminous Glow
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(q.p0.x, q.p0.y);
        ctx.bezierCurveTo(q.p1.x, q.p1.y, q.p2.x, q.p2.y, q.p3.x, q.p3.y);
        ctx.globalCompositeOperation = "lighter";
        ctx.strokeStyle = accentColor;
        ctx.lineWidth = isMobile ? 3.5 : 5;
        ctx.shadowColor = accentColor;
        ctx.shadowBlur = 16;
        ctx.stroke();
        ctx.restore();

        // Pass 2: High Intensity Core
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(q.p0.x, q.p0.y);
        ctx.bezierCurveTo(q.p1.x, q.p1.y, q.p2.x, q.p2.y, q.p3.x, q.p3.y);
        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = isMobile ? 1.2 : 1.8;
        ctx.shadowColor = accentColor;
        ctx.shadowBlur = 4;
        ctx.stroke();
        ctx.restore();

        // Pass 3: Growing Leaf Glow Head
        const tipX = q.p3.x;
        const tipY = q.p3.y;
        const baseR = isMobile ? 8 : 12;
        const pulseR = baseR + 3 * Math.sin(2.5 * timeSec + idx * 0.8);

        const radialGrad = ctx.createRadialGradient(tipX, tipY, 0, tipX, tipY, Math.max(1, pulseR));
        radialGrad.addColorStop(0, "#ffffff");
        radialGrad.addColorStop(0.3, accentColor);
        radialGrad.addColorStop(1, "rgba(0, 0, 0, 0)");

        ctx.save();
        ctx.globalCompositeOperation = "lighter";
        ctx.fillStyle = radialGrad;
        ctx.beginPath();
        ctx.arc(tipX, tipY, Math.max(1, pulseR), 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      if (onLeafCoordsUpdate) {
        onLeafCoordsUpdate(coordsUpdate);
      }

      ctx.restore();
      animFrameRef.current = requestAnimationFrame(render);
    };

    animFrameRef.current = requestAnimationFrame(render);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      resizeObserver.disconnect();
    };
  }, [scrollProgress, projects, onLeafCoordsUpdate]);

  return (
    <div ref={containerRef} className={`relative w-full h-full ${className || ""}`}>
      <canvas ref={canvasRef} className="block w-full h-full pointer-events-none" />
    </div>
  );
};
```
