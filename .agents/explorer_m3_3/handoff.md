# Milestone 3 Explorer 3 Handoff Report: Slide-Over Project Detail Drawer UI

## 1. Observation

### Codebase & Component State
- **Target Component File**: `components/project-detail-drawer.tsx` (New component to be created).
- **UI Sheet Primitive**: `components/ui/sheet.tsx` is built on Radix UI's Dialog primitive (`@radix-ui/react-dialog`), exporting `Sheet`, `SheetTrigger`, `SheetClose`, `SheetContent`, `SheetHeader`, `SheetFooter`, `SheetTitle`, and `SheetDescription`.
  - Line 4 in `components/ui/sheet.tsx`: `import * as SheetPrimitive from '@radix-ui/react-dialog'`.
  - Line 50-54 in `components/ui/sheet.tsx`: `SheetContent` accepts `side?: 'top' | 'right' | 'bottom' | 'left'`.
  - Line 60-70 in `components/ui/sheet.tsx`: Radix `SheetContent` applies Tailwind animations (`data-[state=open]:animate-in`, `data-[state=closed]:animate-out`, `slide-in-from-right`, `slide-in-from-bottom`).
- **Data Model**: Defined in `data/projects.ts`:
  - `Project` interface: `id`, `title`, `shortDescription`, `longDescription`, `year`, `category`, `tags`, `image`, `liveUrl?`, `githubUrl?`, `metrics: ProjectMetric[]`, `highlights: string[]`, `leafConfig: LeafNodeConfig`.
  - `ProjectMetric` interface: `label`, `value`, `description?`.
  - `LeafNodeConfig` contains `accentColor: string` (e.g. `#3b82f6`, `#10b981`, `#f59e0b`, `#ec4899`, `#8b5cf6`, `#06b6d4`, `#6366f1`).
- **Responsive Hook**: `hooks/use-mobile.ts` exports `useIsMobile()` which dynamically measures `window.innerWidth < 768`.
- **Package Dependencies**: `@radix-ui/react-dialog` v1.1.4, `framer-motion` v12.42.2, `lucide-react` v0.454.0, `next` v16.0.3, `tailwindcss` v4.1.9.

---

## 2. Logic Chain

1. **Sheet Primitive Foundation**:
   - `components/ui/sheet.tsx` wraps `@radix-ui/react-dialog`. Radix UI handles keyboard `ESC` key interception, modal focus trapping, ARIA roles (`role="dialog"`), and automatic `document.body` scroll locking out-of-the-box when `open={isOpen}`.
   - Therefore, `ProjectDetailDrawer` can wrap `Sheet` and `SheetContent` directly without adding custom manual `useEffect` event listeners for `ESC` or scroll locking, preventing redundant or conflicting DOM handlers.

2. **Dark Glassmorphic Styling**:
   - The user request requires a dark glassmorphic slide-over (`backdrop-blur-2xl`, `bg-[#0d0d12]/90`, `border-l border-white/10`).
   - Passing `className` to `SheetContent` overrides default `bg-background` via `tailwind-merge` (`cn(...)`), providing sleek backdrop blur and semi-transparent dark container styling while retaining Radix animation properties.

3. **Data Field Display & Defensive Rendering**:
   - `title`, `category`, `year`, `shortDescription`, `longDescription`, `image`, `metrics`, `highlights`, `tags`, `liveUrl`, `githubUrl`, and `leafConfig.accentColor` are mapped directly to dedicated UI sections.
   - Four out of seven projects in `PROJECTS_DATA` do not specify `liveUrl` (`deepfake-security-system`, `kitti-object-detection`, `nct-progress-tracker-api`, `transformer-sentiment-analysis`).
   - Therefore, `liveUrl` and `githubUrl` buttons must be conditionally rendered. If `liveUrl` is absent, the `githubUrl` button expands smoothly to fill the footer container.
   - Project thumbnail `image` uses Next.js `<Image>` with an `onError` state fallback to a glowing radial gradient card with project title, avoiding broken image boxes if external preview images are missing.

4. **Responsive Mobile Fallback**:
   - Desktop viewports (>= 768px): The drawer opens from the right (`side="right"`) with width `w-full sm:max-w-xl md:max-w-2xl h-full border-l border-white/10`.
   - Mobile viewports (< 768px): The drawer switches to a bottom sheet (`side="bottom"`) with `max-h-[88vh] rounded-t-2xl border-t border-white/10` and a top pill visual handle (`w-12 h-1.5 bg-white/20 rounded-full`).
   - The `useIsMobile()` hook in `hooks/use-mobile.ts` provides clean, reactive viewport evaluation to toggle between `side="bottom"` and `side="right"`.

5. **Exit Animation State Preservation**:
   - When `isOpen` transitions from `true` to `false`, `project` prop may become `null` instantly if the parent clears selected state.
   - To prevent content flashing during Radix's 300ms slide-out animation, `ProjectDetailDrawer` uses internal `displayProject` state updated via `useEffect` whenever a valid `project` is received.

---

## 3. Caveats

- **Hydration / SSR Warning on `useIsMobile()`**: During server rendering, `useIsMobile()` returns `false` (or `undefined` initially until mounted). This is standard for client components (`'use client'`), but drawer rendering should take care not to trigger layout shifts before client hydration completes.
- **Scrollbar Styling**: Custom scrollbar styling (`custom-scrollbar` or Tailwind scrollbar utilities) should be applied to the inner scroll container to keep scrollbars thin and dark (`width: 6px`).
- **Radix ARIA Accessibility Requirement**: `@radix-ui/react-dialog` issues a console warning if `SheetContent` does not contain a `SheetTitle` or `VisuallyHidden` title. We explicitly include `<SheetTitle>` and `<SheetDescription>` inside `<SheetHeader>` to guarantee 100% ARIA compliance.

---

## 4. Conclusion & Recommended Implementation Design

`components/project-detail-drawer.tsx` should be implemented as a client component (`'use client'`) adhering to the interface contract specified in `PROJECT.md`:

```typescript
export interface ProjectDetailDrawerProps {
  project: Project | null;
  isOpen: boolean;
  onClose: () => void;
}
```

### Proposed Component Code (`components/project-detail-drawer.tsx`)

```tsx
'use client'

import * as React from 'react'
import Image from 'next/image'
import {
  ExternalLink,
  Github,
  CheckCircle2,
  Calendar,
  Tag,
  Sparkles,
  BarChart3,
  Layers,
} from 'lucide-react'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet'
import { useIsMobile } from '@/hooks/use-mobile'
import { Project } from '@/data/projects'

export interface ProjectDetailDrawerProps {
  project: Project | null
  isOpen: boolean
  onClose: () => void
}

export function ProjectDetailDrawer({
  project,
  isOpen,
  onClose,
}: ProjectDetailDrawerProps) {
  const isMobile = useIsMobile()
  const [imageError, setImageError] = React.useState(false)

  // Preserve last valid project during Radix slide-out exit animation
  const [displayProject, setDisplayProject] = React.useState<Project | null>(project)

  React.useEffect(() => {
    if (project) {
      setDisplayProject(project)
      setImageError(false)
    }
  }, [project])

  if (!displayProject) return null

  const currentProject = displayProject
  const accentColor = currentProject.leafConfig?.accentColor || '#3b82f6'
  const side = isMobile ? 'bottom' : 'right'

  return (
    <Sheet open={isOpen} onOpenChange={(open) => { if (!open) onClose() }}>
      <SheetContent
        side={side}
        className={
          isMobile
            ? "bg-[#0d0d12]/95 backdrop-blur-2xl border-t border-white/10 text-white p-0 gap-0 max-h-[88vh] rounded-t-2xl focus:outline-none flex flex-col z-[100]"
            : "bg-[#0d0d12]/90 backdrop-blur-2xl border-l border-white/10 text-white p-0 gap-0 w-full sm:max-w-xl md:max-w-2xl h-full focus:outline-none flex flex-col z-[100]"
        }
      >
        {/* Mobile Visual Drag Handle */}
        {isMobile && (
          <div className="w-12 h-1.5 bg-white/20 rounded-full mx-auto mt-3 mb-1 shrink-0" />
        )}

        {/* Inner Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
          {/* Header Info */}
          <SheetHeader className="p-0 space-y-3">
            <div className="flex items-center gap-2 flex-wrap">
              {/* Category Badge */}
              <span
                className="px-3 py-1 rounded-full text-xs font-mono font-medium border transition-colors"
                style={{
                  backgroundColor: `${accentColor}15`,
                  borderColor: `${accentColor}40`,
                  color: accentColor,
                }}
              >
                {currentProject.category}
              </span>

              {/* Year Badge */}
              <span className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-mono bg-white/5 border border-white/10 text-white/70">
                <Calendar className="w-3 h-3" />
                {currentProject.year}
              </span>
            </div>

            {/* Project Title */}
            <SheetTitle className="text-2xl sm:text-3xl font-bold text-white tracking-tight leading-tight">
              {currentProject.title}
            </SheetTitle>

            {/* Tagline / Short Description */}
            <SheetDescription className="text-sm text-white/70 leading-relaxed">
              {currentProject.shortDescription}
            </SheetDescription>
          </SheetHeader>

          {/* Project Image Preview */}
          <div className="relative w-full aspect-video rounded-xl overflow-hidden border border-white/10 bg-black/40 shadow-2xl group">
            {!imageError ? (
              <Image
                src={currentProject.image}
                alt={currentProject.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, 600px"
                onError={() => setImageError(true)}
              />
            ) : (
              <div
                className="w-full h-full flex flex-col items-center justify-center p-6 text-center"
                style={{
                  background: `radial-gradient(circle at center, ${accentColor}20 0%, #0d0d12 100%)`,
                }}
              >
                <Sparkles className="w-10 h-10 mb-2 opacity-60" style={{ color: accentColor }} />
                <span className="text-sm font-mono text-white/60">{currentProject.title}</span>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d12]/90 via-transparent to-transparent pointer-events-none" />
          </div>

          {/* Long Description */}
          <div className="space-y-2">
            <h4 className="text-xs uppercase tracking-wider text-white/50 font-mono flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5" style={{ color: accentColor }} />
              Overview
            </h4>
            <p className="text-sm text-white/80 leading-relaxed font-sans">
              {currentProject.longDescription}
            </p>
          </div>

          {/* Key Metrics Grid */}
          {currentProject.metrics && currentProject.metrics.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-xs uppercase tracking-wider text-white/50 font-mono flex items-center gap-1.5">
                <BarChart3 className="w-3.5 h-3.5" style={{ color: accentColor }} />
                Performance Metrics
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {currentProject.metrics.map((metric, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10 flex flex-col justify-between backdrop-blur-md transition-colors hover:border-white/20"
                  >
                    <span className="text-xs text-white/60 font-sans">{metric.label}</span>
                    <span
                      className="text-lg font-bold font-mono mt-1"
                      style={{ color: accentColor }}
                    >
                      {metric.value}
                    </span>
                    {metric.description && (
                      <span className="text-[10px] text-white/40 mt-1 line-clamp-1">
                        {metric.description}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Technical Highlights */}
          {currentProject.highlights && currentProject.highlights.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-xs uppercase tracking-wider text-white/50 font-mono flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" style={{ color: accentColor }} />
                Technical Highlights
              </h4>
              <ul className="space-y-2.5">
                {currentProject.highlights.map((highlight, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-sm text-white/80 leading-snug">
                    <CheckCircle2
                      className="w-4 h-4 shrink-0 mt-0.5"
                      style={{ color: accentColor }}
                    />
                    <span>{highlight}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Tags */}
          {currentProject.tags && currentProject.tags.length > 0 && (
            <div className="space-y-2.5">
              <h4 className="text-xs uppercase tracking-wider text-white/50 font-mono flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5" style={{ color: accentColor }} />
                Technologies & Tools
              </h4>
              <div className="flex flex-wrap gap-2">
                {currentProject.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 text-xs font-mono rounded-lg bg-white/5 text-white/80 border border-white/10 hover:border-white/20 transition-colors"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sticky Action Buttons Footer */}
        <div className="p-4 sm:p-6 border-t border-white/10 bg-[#0d0d12]/95 shrink-0 flex flex-col sm:flex-row gap-3">
          {currentProject.liveUrl && (
            <a
              href={currentProject.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white text-black font-semibold text-sm hover:bg-white/90 transition-all shadow-lg hover:shadow-white/10 active:scale-[0.98]"
            >
              <span>Live Application</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          )}

          {currentProject.githubUrl && (
            <a
              href={currentProject.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 text-white border border-white/15 font-semibold text-sm hover:bg-white/15 hover:border-white/25 transition-all active:scale-[0.98]"
            >
              <Github className="w-4 h-4" />
              <span>Source Code</span>
            </a>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}
```

---

## 5. Verification Method

1. **Component Verification**:
   - Inspect `components/project-detail-drawer.tsx` to verify standard React client component structure.
   - Verify TypeScript compilation without errors: `npx tsc --noEmit` or `npm run build`.

2. **Accessibility & Keyboard Verification**:
   - Render `ProjectDetailDrawer` with `isOpen={true}` and a sample project (e.g. `PROJECTS_DATA[0]`).
   - Press `ESC` key: Radix UI dialog primitive must intercept keydown and call `onClose()`.
   - Verify Tab navigation traps focus strictly within drawer close button, scroll content links, and action buttons.
   - Verify `document.body.style.overflow` is set to `hidden` when open and restored upon closing.

3. **Data Field Rendering Inspection**:
   - Test drawer with projects containing `liveUrl` (e.g. `marginal-ai-reader`) -> verify both "Live Application" and "Source Code" buttons render.
   - Test drawer with projects without `liveUrl` (e.g. `deepfake-security-system`) -> verify "Source Code" button renders full-width cleanly.
   - Verify all 3 metrics and 3 highlights render with the project's accent color (`accentColor`).

4. **Responsive Mobile Fallback Inspection**:
   - Emulate viewport `< 768px` in browser dev tools or Playwright: verify drawer displays as bottom sheet (`side="bottom"`, top rounded corners, max height 88vh).
   - Emulate viewport `>= 768px`: verify drawer displays as right slide-over (`side="right"`, full height, max-w-2xl).

5. **Invalidation Conditions**:
   - Any omission of `<SheetTitle>` or `<SheetDescription>` that triggers Radix accessibility warnings.
   - Hardcoding colors instead of respecting `project.leafConfig.accentColor`.
   - Failing to lock body scroll or trap focus when open.
