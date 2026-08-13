# Technical Analysis: UI References, TypeScript Compilation & Data Model Requirements

**Role**: Explorer 2 (Milestone 1)  
**Target File**: `data/projects.ts`  
**Working Directory**: `c:\Users\wisdo\OneDrive\Documents\GitHub\Portfolio Ml\.agents\explorer_m1_2\`  
**Date**: 2026-08-11  

---

## 1. Executive Summary

This report delivers an exhaustive technical investigation of the repository's UI/component references, TypeScript compilation configuration, and precise type requirements for the upcoming `data/projects.ts` module in Milestone 1.

Key findings:
1. **Existing Component References**: Project data currently exists strictly as an inline array within `components/works.tsx` (55 lines of raw object literals). No centralized `data/projects.ts` module or shared TypeScript interfaces exist yet.
2. **TypeScript Compilation Setup**: The repository operates on Next.js 16.0.3 with React 19.2.0 and TypeScript 5. `tsconfig.json` enforces `"strict": true`, `"moduleResolution": "bundler"`, and alias `@/*` mapping to `./*`.
3. **Verification Command Analysis**: Running `npx tsc --noEmit` revealed two pre-existing TypeScript errors in unrelated components (`sentient-sphere.tsx` missing `@types/three` declaration, and `tech-marquee.tsx` using `WebkitTextStroke`). `data/projects.ts` must be written cleanly so it adds zero new TypeScript errors.
4. **Data Contract Standardization**: `data/projects.ts` must export `ProjectMetric`, `LeafNodeConfig`, `Project`, and `PROJECTS_DATA: Project[]` to satisfy contract requirements specified in `PROJECT.md` for subsequent milestones (M2 Canvas Tree, M3 Leaf Tooltips/Drawer, M4 /works Page).

---

## 2. UI & Component References Investigation

### 2.1 Existing Component References

| File Path | Usage Description | Properties Used | Notes / Constraints |
|---|---|---|---|
| `components/works.tsx` | Homepage "Selected Works" list component | `title`, `tags`, `image`, `year`, `href` | Inline array of 7 projects. `href` is optional (some link to live site, some to GitHub, some undefined). |
| `components/about.tsx` | ML/NLP Specialization marquee statements | Project titles mentioned in strings: *Marginal*, *Healthcare Chatbot*, *PhishGuard*, *Deepfake*, *KITTI* | Textual mentions only; no direct import. |
| `app/page.tsx` | Main Homepage route | Renders `<Works />` from `components/works.tsx` | Homepage must remain untouched as per R3. |

### 2.2 Future Component Consumers (Milestones 2–4)

| Component Path | Planned Role | Consumed Data / Types |
|---|---|---|
| `components/works-canvas-tree.tsx` (M2) | 60fps HTML5 2D Canvas rendering organic branches | `Project[]`, `LeafNodeConfig` (`startScroll`, `endScroll`, `side`, `xOffsetPct`, `yOffsetPct`, `accentColor`) |
| `components/leaf-node.tsx` (M3) | Interactive Leaf DOM overlay & hover preview tooltip | `Project` (`title`, `year`, `category`, `shortDescription`, `tags`, `image`, `leafConfig`) |
| `components/project-detail-drawer.tsx` (M3) | Glassmorphic slide-over sheet drawer | `Project` (`title`, `longDescription`, `metrics`, `highlights`, `liveUrl`, `githubUrl`, `tags`) |
| `app/works/page.tsx` (M4) | Dedicated `/works` route container | `PROJECTS_DATA` from `data/projects.ts` |

---

## 3. TypeScript Compilation Setup & Build Analysis

### 3.1 `tsconfig.json` Configuration

```json
{
  "compilerOptions": {
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "target": "ES6",
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "react-jsx",
    "incremental": true,
    "paths": {
      "@/*": ["./*"]
    }
  }
}
```

Key compiler settings to respect:
- Path alias `@/data/projects` will resolve to `data/projects.ts`.
- `strict: true` requires explicit typing for all interfaces and arrays; optional properties must be marked with `?`.
- `isolatedModules: true` requires all exported types/interfaces to be clean TypeScript types.

### 3.2 Verification Commands & Results

1. **`npx tsc --noEmit`**:
   - Status: Executed.
   - Result: 4 errors reported in existing files:
     - `components/sentient-sphere.tsx(5,27)`: error TS7016 (`three` declaration missing).
     - `components/sentient-sphere.tsx(6,43)`: error TS7016 (`three` declaration missing).
     - `components/tech-marquee.tsx(55,37)`: error TS2551 (`WebkitTextStroke` style property).
     - `components/tech-marquee.tsx(59,37)`: error TS2551 (`WebkitTextStroke` style property).
   - Note for `data/projects.ts`: The file must compile cleanly without introducing any new errors.

2. **`npm run build` (`next build`)**:
   - Status: Executed. Next.js build runs type checks and bundling.
   - Result: `.next/lock` check requires standard execution during build verification.

---

## 4. Required Type Specifications for `data/projects.ts`

To fulfill the project contracts defined in `PROJECT.md` and `SCOPE.md`, `data/projects.ts` must export the following exact TypeScript interfaces and data constant:

```typescript
export interface ProjectMetric {
  label: string;
  value: string;
}

export interface LeafNodeConfig {
  /** Normalized scroll offset (0.0 to 1.0) where branch originates */
  startScroll: number;
  /** Normalized scroll offset (0.0 to 1.0) where leaf node fully resolves */
  endScroll: number;
  /** Side of trunk branch extends toward */
  side: "left" | "right";
  /** Relative offset percentage (0 to 100%) for terminal node position */
  xOffsetPct: number;
  yOffsetPct: number;
  /** Custom glow hue / color accent (e.g. hex or oklch string) */
  accentColor: string;
}

export interface Project {
  id: string;
  title: string;
  shortDescription: string;
  longDescription: string;
  year: string;
  category: string;
  tags: string[];
  image: string;
  liveUrl?: string;
  githubUrl?: string;
  metrics: ProjectMetric[];
  highlights: string[];
  leafConfig: LeafNodeConfig;
}

export const PROJECTS_DATA: Project[] = [ ... ];
```

---

## 5. Concrete Recommendations for Implementation

1. **File Location**: Place module in `data/projects.ts` (root-level `data/` directory).
2. **Exports**: Export `ProjectMetric`, `LeafNodeConfig`, `Project`, and `PROJECTS_DATA`.
3. **Dataset Content**: Populate `PROJECTS_DATA` with 7 enriched items corresponding to the existing project portfolio items:
   - `marginal-paper-reader` (AI Research Paper Reader)
   - `healthcare-chatbot` (Healthcare Diagnosis Chatbot)
   - `phishguard` (Phishing Detector)
   - `deepfake-security` (Deepfake Security System)
   - `kitti-detection` (KITTI Object Detection)
   - `nct-progress-api` (NCT Progress Tracker API)
   - `transformer-sentiment` (Transformer Sentiment Analysis)
4. **Leaf Node Configuration Calibration**:
   - Stagger `startScroll` and `endScroll` across `0.05` to `0.90` scroll progress range.
   - Alternate `side` between `"left"` and `"right"` for balanced visual composition on the procedural tree canvas.
   - Assign distinct accent colors (`#3b82f6`, `#10b981`, `#ec4899`, `#8b5cf6`, `#f59e0b`, `#06b6d4`, `#6366f1`) for bioluminescent canvas branch rendering.
