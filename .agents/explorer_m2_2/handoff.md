# Handoff Report: Canvas 2D Bezier Curves, Growth Interpolation & Bioluminescent Glow Math

**Agent**: Explorer 2 (`teamwork_preview_explorer`)  
**Working Directory**: `c:\Users\wisdo\OneDrive\Documents\GitHub\Portfolio Ml\.agents\explorer_m2_2`  
**Target Component**: `components/works-canvas-tree.tsx`  
**Recipient**: Sub-Orchestrator M2 (`d250b762-c676-4bbc-a521-2ae0bb021284`)  
**Date**: 2026-08-11  

---

## 1. Observation

1. **Project Scope (`PROJECT.md:26`)**:
   - `M2`: Procedural Canvas Tree Engine & Responsive Branch Visualization (`components/works-canvas-tree.tsx`).
   - Feature `F4`: Scroll-progress bound Cubic Bezier branch growth with 60fps canvas engine & glow.
   - Feature `F7`: Desktop centered trunk ($X = 50\%$) vs Mobile left-aligned trunk ($X = 32\text{px}$).

2. **Milestone Scope (`.agents/sub_orch_m2/SCOPE.md:15-22`)**:
   - Requirement 1: Render 4-point Cubic Bezier curves ($P_0 \to P_1 \to P_2 \to P_3$) from central trunk to terminal leaf positions.
   - Requirement 2: Smooth scroll progress binding $S \in [0, 1]$.
   - Requirement 3: Bioluminescent multi-pass glow rendering (`shadowBlur`, `shadowColor`, glowing tips/nodes).
   - Requirement 4: DPR scaling up to 2x for high-DPI displays.
   - Requirement 5: Responsive breakpoints (Desktop $X = 50\%W$ vs Mobile $X = 32\text{px}$).
   - Requirement 7: Terminal leaf coordinate export callback (`TerminalLeafCoord[]`).

3. **Existing Dataset Interface (`data/projects.ts:7-20`)**:
   - `LeafNodeConfig` defines: `startScroll`, `endScroll`, `side`, `xOffsetPct`, `yOffsetPct`, `accentColor`.

---

## 2. Logic Chain

1. **4-Point Cubic Bezier Formulation**:
   - Given project anchor points $(x_0, y_0)$ on trunk and terminal target $(x_3, y_3)$, control points $P_1 = (x_0 + 0.45\Delta x, y_0 + 0.10\Delta y)$ and $P_2 = (x_0 + 0.80\Delta x, y_3 - 0.25\Delta y)$ guarantee smooth, natural organic departure from the central trunk and upward easing into the leaf node.

2. **De Casteljau Growth Interpolation**:
   - Mapping scroll $S \in [0, 1]$ to local branch progress $s_{\text{branch}} = \text{clamp}\left(\frac{S - \text{startScroll}}{\text{endScroll} - \text{startScroll}}, 0, 1\right)$.
   - De Casteljau's algorithm recursively subdivides the 4 control points $(P_0, P_1, P_2, P_3)$ at $t = s_{\text{branch}}$ to produce exact sub-curve control points $(Q_0, Q_1, Q_2, Q_3)$.
   - This allows native HTML5 2D Canvas `ctx.bezierCurveTo(Q1.x, Q1.y, Q2.x, Q2.y, Q3.x, Q3.y)` execution in a single hardware GPU call, maintaining 60fps performance without expensive arc-length segment approximation.

3. **Multi-Pass Bioluminescent Glow**:
   - Pass 1 renders wide diffuse glow using `globalCompositeOperation = 'lighter'`, `strokeStyle = accentColor`, and `shadowBlur = 16..18`.
   - Pass 2 renders sharp luminous filament core using `globalCompositeOperation = 'source-over'`, `strokeStyle = '#ffffff'`, and `shadowBlur = 4`.
   - Pass 3 renders terminal leaf tip aura using a 3-stop radial gradient with a harmonic time-based breathing pulse $r_{\text{outer}}(t) = r_{\text{base}} + A_{\text{pulse}} \cdot \sin(\omega t_{\text{anim}} + \phi_i)$.

4. **Responsive & DPR Adaptation**:
   - Desktop ($\ge 768\text{px}$) sets trunk base at $X = 0.50 \cdot W$ with alternating left/right branches.
   - Mobile ($< 768\text{px}$) sets trunk base at $X = 32\text{px}$ with rightward branches.
   - Canvas backing store is scaled by $\text{dpr} = \min(\text{window.devicePixelRatio}, 2)$ with CSS pixel dimensions preserved.

5. **DOM Coordinate Export**:
   - Callback `onLeafCoordsUpdate` emits array of active terminal coordinates $(x_3, y_3, \text{active}, \text{progress})$ so Framer Motion tooltips and interactive DOM leaf nodes align with zero jitter.

---

## 3. Caveats

- **Software Rendering Fallback**: On low-end mobile devices without hardware canvas acceleration, extensive `shadowBlur` can incur canvas rasterization costs. The proposed design mitigates this by restricting `shadowBlur` to low values ($4\text{px} - 18\text{px}$) and relying primarily on additive blending (`lighter`) with layered strokes.
- **Scroll Syncing**: `scrollProgress` must be supplied as a smooth continuous normalized value (0.0 to 1.0) from the parent page component (e.g. using Lenis smooth scroll or React scroll handlers).

---

## 4. Conclusion

The mathematical models, de Casteljau truncation algorithms, multi-pass glow techniques, and responsive layout scaling outlined in `analysis.md` provide a complete, performant, and zero-dependency blueprint for `components/works-canvas-tree.tsx`. Implementers can directly adopt the provided code architecture to fulfill all M2 visual and technical requirements.

---

## 5. Verification Method

1. **Mathematical Verification**:
   - Inspect `analysis.md` sections 1 and 2 for de Casteljau polynomial subdivision correctness. Verify $Q_3(t=1.0) = P_3$ and $Q_0 = P_0$.
2. **Code & Interface Compliance**:
   - Inspect `analysis.md` Section 7 blueprint against `WorksCanvasTreeProps` in `.agents/sub_orch_m2/SCOPE.md`.
3. **Build & Type Check**:
   - Once implemented by Worker 1, run `npx tsc --noEmit` or `npm run build` to confirm TypeScript type safety.
