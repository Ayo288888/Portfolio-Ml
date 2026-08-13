## 2026-08-11T15:10:21Z

You are Worker 1 (`teamwork_preview_worker`) for Milestone 2: Procedural Canvas Tree Engine & Responsive Branch Visualization.
Your working directory is `c:\Users\wisdo\OneDrive\Documents\GitHub\Portfolio Ml\.agents\worker_m2_1`.
Please create your working directory and `BRIEFING.md` / `progress.md` inside `c:\Users\wisdo\OneDrive\Documents\GitHub\Portfolio Ml\.agents\worker_m2_1`.

Read the original request file: `c:\Users\wisdo\OneDrive\Documents\GitHub\Portfolio Ml\.agents\ORIGINAL_REQUEST.md`
Read the project scope file: `c:\Users\wisdo\OneDrive\Documents\GitHub\Portfolio Ml\PROJECT.md`
Read the milestone scope file: `c:\Users\wisdo\OneDrive\Documents\GitHub\Portfolio Ml\.agents\sub_orch_m2\SCOPE.md`
Read the implementation specification: `c:\Users\wisdo\OneDrive\Documents\GitHub\Portfolio Ml\.agents\sub_orch_m2\IMPLEMENTATION_SPEC.md`
Read the project data model: `c:\Users\wisdo\OneDrive\Documents\GitHub\Portfolio Ml\data\projects.ts`

### Exclusive Write Ownership
You own `components/works-canvas-tree.tsx`. Do NOT edit files outside your assigned boundary.

### Your Mission
Implement `components/works-canvas-tree.tsx` according to `IMPLEMENTATION_SPEC.md`:
1. Client component (`"use client"`) rendering a 2D HTML5 Canvas procedural bioluminescent tree trunk and Bezier branch network.
2. Export required types and interfaces:
   - `BranchTarget`
   - `TerminalLeafCoord`
   - `WorksCanvasTreeProps`
3. Implement 4-point Cubic Bezier curves ($P_0 \to P_1 \to P_2 \to P_3$) connecting trunk anchor points to terminal branch coordinates.
4. Smooth scroll progress binding $S \in [0, 1]$ mapped to local branch progress $s_{\text{branch}} = \text{clamp}((S - \text{startScroll}) / (\text{endScroll} - \text{startScroll}), 0, 1)$.
5. Use de Casteljau subdivision algorithm (`truncateCubicBezier`) to compute sub-curve control points $(Q_0, Q_1, Q_2, Q_3)$ for single-pass `ctx.bezierCurveTo(...)` rendering.
6. Multi-pass bioluminescent glow pipeline:
   - Diffuse ambient glow (`shadowBlur`, `shadowColor`, `globalCompositeOperation = 'lighter'`).
   - High-intensity core filament (`#ffffff`, `shadowBlur = 4`).
   - Terminal leaf radial gradient with harmonic sine breathing pulse $R(t) = R_{\text{base}} + 3 \sin(2.5 t + \phi_i)$.
7. DPR scaling capped at `Math.min(window.devicePixelRatio || 1, 2)` and `ResizeObserver` setup.
8. Responsive breakpoints: Desktop ($\ge 768\text{px}$) centered trunk at $X = 50\%$ vs Mobile ($< 768\text{px}$) left-aligned trunk at $X = 32\text{px}$ with rightward branch projections.
9. 60fps `requestAnimationFrame` loop with smooth lerping, clean unmount cleanup, and `onLeafCoordsUpdate` callback throttling ($> 0.5\text{px}$ position delta or active state change).

### Verification
Run `npx tsc --noEmit` or `npm run build` to confirm clean compilation with ZERO errors.

### Delivery
Deliver your handoff report in `c:\Users\wisdo\OneDrive\Documents\GitHub\Portfolio Ml\.agents\worker_m2_1\handoff.md` and send a message back to the parent orchestrator (conversation ID: `d250b762-c676-4bbc-a521-2ae0bb021284`).
