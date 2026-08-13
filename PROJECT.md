# Project: Interactive Works Page & Procedural Canvas Tree UI

## Architecture
The dedicated `/works` page architecture uses a **Hybrid 2D Canvas + React DOM Overlay System**:
- **Canvas Rendering Engine**: HTML5 `<canvas>` context renders organic Bezier curve branches, scroll-driven tip progress interpolation, glowing energy particles, and multi-pass bioluminescent glow at 60fps.
- **DOM Overlay Layer**: Position-absolute React DOM buttons overlaid at terminal branch coordinates provide 100% accessible focus, keyboard navigation, and Framer Motion hover preview tooltips.
- **Drawer State Controller**: Global/component state manages the active selected project, opening a glassmorphic slide-over right drawer (`components/ui/sheet.tsx`) for comprehensive project details.
- **Route Isolation**: `/works` is a standalone Next.js App Router route (`app/works/page.tsx`), maintaining complete isolation from `app/page.tsx`. `components/navbar.tsx` is updated to support client navigation.

## Feature Inventory
| # | Feature | Description | Milestone | Source |
|---|---------|-------------|-----------|--------|
| F1 | Projects Data Model | Centralized TypeScript `Project` interface & 7 enriched portfolio items dataset | M1 | Survey (Explorer 2) |
| F2 | Dedicated `/works` Route | `app/works/page.tsx` with metadata, dark aesthetic, Lenis smooth scroll | M4 | ORIGINAL_REQUEST R3 |
| F3 | Navbar Integration | Route-aware navbar links in `components/navbar.tsx` navigating to `/works` | M4 | ORIGINAL_REQUEST R3 |
| F4 | Procedural 2D Canvas Scroll Tree | Scroll-progress bound Cubic Bezier branch growth with 60fps canvas engine & glow | M2 | ORIGINAL_REQUEST R1 |
| F5 | Interactive Leaf Tooltips | Leaf DOM nodes with hover preview cards (thumbnail, year, title, tags) | M3 | ORIGINAL_REQUEST R2 |
| F6 | Slide-Over Detail Drawer | Glassmorphic right sheet drawer with full description, metrics, highlights, URLs | M3 | ORIGINAL_REQUEST R2 |
| F7 | Responsive Mobile/Desktop Adaptations | Desktop centered trunk vs Mobile left-aligned trunk & bottom drawer | M2 | ORIGINAL_REQUEST R4 |
| F8 | E2E Test Suite & Hardening | Opaque-box E2E test suite (Tiers 1-4) & adversarial test hardening (Tier 5) | M5 | ORIGINAL_REQUEST AC |

## Milestones
| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| M1 | Projects Data Infrastructure | `data/projects.ts` interface & 7-project dataset | None | DONE |
| M2 | Procedural Canvas Tree Engine | `components/works-canvas-tree.tsx` 60fps canvas scroll rendering & responsive layout | M1 | IN_PROGRESS (d250b762-c676-4bbc-a521-2ae0bb021284) |
| M3 | Leaf Tooltips & Slide-Over Drawer UI | `components/leaf-node.tsx`, `components/project-detail-drawer.tsx` | M1 | IN_PROGRESS (67c52539-02bc-40db-9a5d-fe28c682d556) |
| M4 | `/works` Page & Navbar Navigation | `app/works/page.tsx`, `components/navbar.tsx` route integration | M2, M3 | PLANNED |
| M5 | E2E Testing & Final Hardening | E2E test suite pass (Tiers 1-4), Tier 5 adversarial tests, Forensic Audit CLEAN | M4 | PLANNED |

## Interface Contracts

### Data Model (`data/projects.ts`)
```typescript
export interface ProjectMetric {
  label: string;
  value: string;
}

export interface LeafNodeConfig {
  /** Normalized scroll offset (0 to 1) where branch originates */
  startScroll: number;
  /** Normalized scroll offset (0 to 1) where leaf node fully resolves */
  endScroll: number;
  /** Side of trunk branch extends toward */
  side: "left" | "right";
  /** Relative offset (0 to 100%) for terminal node position */
  xOffsetPct: number;
  yOffsetPct: number;
  /** Custom glow hue/color accent */
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
```

### Canvas Tree Props (`components/works-canvas-tree.tsx`)
```typescript
export interface WorksCanvasTreeProps {
  projects: Project[];
  scrollProgress: number; // Normalized 0 to 1
  onSelectProject: (project: Project) => void;
  activeProjectId?: string;
}
```

### Slide-Over Drawer Props (`components/project-detail-drawer.tsx`)
```typescript
export interface ProjectDetailDrawerProps {
  project: Project | null;
  isOpen: boolean;
  onClose: () => void;
}
```

## Code Layout
- `data/projects.ts` — Shared projects data and types
- `components/works-canvas-tree.tsx` — HTML5 2D Canvas rendering engine
- `components/leaf-node.tsx` — Interactive leaf DOM node with Framer Motion tooltip
- `components/project-detail-drawer.tsx` — Glassmorphic right slide-over drawer
- `app/works/page.tsx` — Dedicated `/works` page
- `components/navbar.tsx` — Updated navbar supporting route navigation
