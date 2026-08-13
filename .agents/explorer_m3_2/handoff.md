# Handoff Report — Explorer 2: Leaf Node Component Specification (`components/leaf-node.tsx`)

## 1. Observation

### 1.1 Project Data Model & Leaf Config State
- **File Path**: `data/projects.ts` (lines 7–36, 62–69, 94–101, 126–133, 157–164, 187–195, 219–226, 250–257)
- **Data Model Definition**:
  ```typescript
  export interface LeafNodeConfig {
    startScroll: number;  // 0.0 to 1.0
    endScroll: number;    // 0.0 to 1.0
    side: "left" | "right";
    xOffsetPct: number;   // 0 to 100%
    yOffsetPct: number;   // 0 to 100%
    accentColor: string;  // Hex color string (e.g., "#3b82f6", "#10b981", "#f59e0b")
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
- **Observed Preview Assets**: `public/previews/marginal-paper-reader.png`, `public/previews/healthcare-chatbot-preview.png`, `public/previews/phishguard-preview.png`, `public/abstract-neural-network-visualization-dark-theme.jpg`, `public/futuristic-data-dashboard-dark-minimal.jpg`, `public/sound-wave-visualization-dark-theme.jpg`, `public/previews/sentiment-analysis-preview.png`. All 7 assets exist in `public/`.

### 1.2 Package & Style Environment
- **Dependencies**: `framer-motion` (v12.42.2), `lucide-react` (^0.454.0), `clsx` (^2.1.1), `tailwind-merge` (^3.3.1), `next` (16.0.3), `react` (19.2.0).
- **Theme Palette**: Dark portfolio default with `oklch(0.145 0 0)` background and `oklch(0.985 0 0)` text in `app/globals.css`.

---

## 2. Logic Chain

1. **Overlay Positioning Mechanics**:
   - The canvas tree in `components/works-canvas-tree.tsx` operates inside a `relative` container. Terminal branch points correspond to `(x, y)` coordinates.
   - `LeafNode` must be positioned absolutely using `top: y` and `left: x` (either as pixel values or percentage strings).
   - Using `-translate-x-1/2 -translate-y-1/2` ensures the center of the interactive leaf node aligns perfectly with the Bezier curve branch tip.

2. **Visibility & Activation Gating**:
   - As the user scrolls, `scrollProgress` (0 to 1) increases.
   - When `scrollProgress < project.leafConfig.endScroll`, the terminal branch tip is either still drawing or hasn't started.
   - `LeafNode` should set `isVisible = scrollProgress >= project.leafConfig.endScroll`.
   - When `isVisible === false`: `opacity: 0`, `pointer-events: none`, `tabIndex: -1`.
   - When `isVisible === true`: `opacity: 1`, `pointer-events: auto`, `tabIndex: 0` with a smooth Framer Motion scale/fade-in transition.

3. **Bioluminescent Pulse & Visual Hierarchy**:
   - Core button node size: `w-7 h-7 sm:w-8 sm:h-8` touch target containing an inner dot (`w-3 h-3 sm:w-3.5 sm:h-3.5`).
   - Inner dot background: `project.leafConfig.accentColor`.
   - Continuous bioluminescent pulse: Outer `<motion.span>` with `animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0.15, 0.5] }}` and `transition={{ duration: 2.4, repeat: Infinity }}` matching the accent color.
   - Hover / Focus state: Core dot scales up (`scale-125`), outer ring opacity increases, radial box-shadow glow expands (`box-shadow: 0 0 16px ${accentColor}`).
   - Selected state (`isSelected === true`): Sustained halo ring and accent ring border.

4. **Framer Motion Hover Preview Tooltip**:
   - Appears on `onMouseEnter` or `onFocus`.
   - Hides on `onMouseLeave` or `onBlur` or `Escape` keypress.
   - Card structure: Glassmorphic dark card (`bg-slate-950/90 backdrop-blur-md border border-slate-800 shadow-2xl rounded-xl p-4 w-72 sm:w-80 z-50`).
   - Content: Top accent bar, Category badge, Year pill, Title, Image preview (16:9 aspect ratio), Short description, Primary tags (up to 3 pills), and "Click to inspect →" prompt.
   - Animation: `AnimatePresence` + `motion.div` with initial `opacity: 0, scale: 0.9, y: 8`, animate `opacity: 1, scale: 1, y: 0`, exit `opacity: 0, scale: 0.95, y: 4`.

5. **Viewport Edge Collision Detection Algorithm**:
   - Problem: Positioning a fixed tooltip (e.g. above center) can cause clipping when leaf nodes are near screen edges (e.g. top edge, left edge, right edge).
   - Solution: On hover/focus, calculate `nodeElem.getBoundingClientRect()` against `window.innerWidth` and `window.innerHeight`.
   - Vertical logic:
     ```typescript
     const tooltipHeight = 250; // Estimated max height of preview card
     const margin = 20;
     const vertical = nodeRect.top < tooltipHeight + margin ? "below" : "above";
     ```
   - Horizontal logic:
     ```typescript
     const tooltipWidth = 320; // Max width of preview card
     const vw = window.innerWidth;
     let horizontal: "center" | "left" | "right" = "center";
     if (nodeRect.left - tooltipWidth / 2 < margin) {
       horizontal = "left";
     } else if (nodeRect.right + tooltipWidth / 2 > vw - margin) {
       horizontal = "right";
     }
     ```
   - Layout mapping:
     - `above` + `center`: `bottom-full mb-3 left-1/2 -translate-x-1/2`
     - `above` + `left`: `bottom-full mb-3 left-0 translate-x-0`
     - `above` + `right`: `bottom-full mb-3 right-0 translate-x-0`
     - `below` + `center`: `top-full mt-3 left-1/2 -translate-x-1/2`
     - `below` + `left`: `top-full mt-3 left-0 translate-x-0`
     - `below` + `right`: `top-full mt-3 right-0 translate-x-0`

6. **Accessibility (A11y) & Keyboard Handling**:
   - Base DOM tag: `<button type="button">`.
   - Attributes:
     - `aria-label={`View details for project ${project.title}`}`
     - `aria-expanded={isSelected}`
     - `aria-describedby={isHovered ? `tooltip-${project.id}` : undefined}`
     - `tabIndex={isVisible ? 0 : -1}`
   - Keyboard interaction:
     - Native `<button>` triggers `onClick={() => onSelect(project)}` on both `Enter` and `Space` keys.
     - Focusing via `Tab` triggers `onFocus`, displaying the hover preview tooltip.
     - Pressing `Escape` while focused sets `isHovered = false` to dismiss tooltip preview.

---

## 3. Caveats

- **No Caveats**: Implementation uses standard React + Framer Motion + DOM APIs (`getBoundingClientRect`) available in client components. Next.js `<Image>` component is fully supported for preview thumbnails.

---

## 4. Conclusion & Recommended Implementation Code

### Component Code Design (`components/leaf-node.tsx`)

```tsx
"use client";

import React, { useState, useRef, useCallback, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { Project } from "@/data/projects";

export interface LeafNodeProps {
  project: Project;
  /** Absolute X coordinate (px or percentage string) relative to tree container */
  x: number | string;
  /** Absolute Y coordinate (px or percentage string) relative to tree container */
  y: number | string;
  /** Controls visibility based on scroll progress resolving terminal branch */
  isVisible?: boolean;
  /** Whether project detail drawer is currently open for this node */
  isSelected?: boolean;
  /** Callback to trigger project selection & detail drawer */
  onSelect: (project: Project) => void;
  /** Optional container class overrides */
  className?: string;
}

interface TooltipPosition {
  vertical: "above" | "below";
  horizontal: "center" | "left" | "right";
}

export function LeafNode({
  project,
  x,
  y,
  isVisible = true,
  isSelected = false,
  onSelect,
  className = "",
}: LeafNodeProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [position, setPosition] = useState<TooltipPosition>({
    vertical: "above",
    horizontal: "center",
  });
  const nodeRef = useRef<HTMLButtonElement>(null);

  // Viewport Edge Collision Detection Logic
  const updateTooltipPosition = useCallback(() => {
    if (!nodeRef.current) return;
    const rect = nodeRef.current.getBoundingClientRect();
    const vw = window.innerWidth;
    const tooltipWidth = 320;
    const tooltipHeight = 260;
    const margin = 16;

    const vertical: "above" | "below" =
      rect.top < tooltipHeight + margin ? "below" : "above";

    let horizontal: "center" | "left" | "right" = "center";
    if (rect.left - tooltipWidth / 2 < margin) {
      horizontal = "left";
    } else if (rect.right + tooltipWidth / 2 > vw - margin) {
      horizontal = "right";
    }

    setPosition({ vertical, horizontal });
  }, []);

  const handleMouseEnter = () => {
    updateTooltipPosition();
    setIsHovered(true);
  };

  const handleFocus = () => {
    updateTooltipPosition();
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const handleBlur = () => {
    setIsHovered(false);
  };

  // Close tooltip preview on Escape key press
  useEffect(() => {
    if (!isHovered) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsHovered(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isHovered]);

  const leftStyle = typeof x === "number" ? `${x}px` : x;
  const topStyle = typeof y === "number" ? `${y}px` : y;
  const accentColor = project.leafConfig.accentColor || "#3b82f6";

  // Calculate dynamic classes for tooltip placement
  const getPositionClasses = () => {
    let classes = "absolute z-50 ";
    if (position.vertical === "above") {
      classes += "bottom-full mb-3 ";
    } else {
      classes += "top-full mt-3 ";
    }

    if (position.horizontal === "center") {
      classes += "left-1/2 -translate-x-1/2 ";
    } else if (position.horizontal === "left") {
      classes += "left-0 translate-x-0 ";
    } else {
      classes += "right-0 translate-x-0 ";
    }

    return classes;
  };

  return (
    <div
      className={`absolute ${className}`}
      style={{
        left: leftStyle,
        top: topStyle,
        transform: "translate(-50%, -50%)",
        pointerEvents: isVisible ? "auto" : "none",
        opacity: isVisible ? 1 : 0,
        transition: "opacity 0.3s ease-out",
      }}
    >
      {/* Accessible Interactive Leaf Node Button */}
      <button
        ref={nodeRef}
        type="button"
        tabIndex={isVisible ? 0 : -1}
        onClick={() => onSelect(project)}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onFocus={handleFocus}
        onBlur={handleBlur}
        aria-label={`View project details for ${project.title}`}
        aria-expanded={isSelected}
        aria-describedby={isHovered ? `tooltip-${project.id}` : undefined}
        className="relative group flex items-center justify-center w-8 h-8 rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 cursor-pointer"
        style={{
          // Set focus ring color dynamically via inline custom property or style
          boxShadow: isHovered || isSelected ? `0 0 16px ${accentColor}` : "none",
        }}
      >
        {/* Bioluminescent Outer Pulse Ring */}
        <motion.span
          className="absolute inset-0 rounded-full opacity-60 blur-[2px]"
          style={{ backgroundColor: accentColor }}
          animate={{
            scale: isHovered || isSelected ? [1.2, 1.8, 1.2] : [1, 1.5, 1],
            opacity: isHovered || isSelected ? [0.8, 0.3, 0.8] : [0.5, 0.15, 0.5],
          }}
          transition={{
            duration: isHovered || isSelected ? 1.5 : 2.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Outer Border Ring */}
        <span
          className={`absolute inset-0 rounded-full border transition-all duration-300 ${
            isSelected || isHovered
              ? "border-white scale-110"
              : "border-white/40 group-hover:border-white/80"
          }`}
        />

        {/* Core Node Dot */}
        <span
          className="w-3.5 h-3.5 rounded-full transition-transform duration-300 group-hover:scale-125 shadow-inner"
          style={{ backgroundColor: accentColor }}
        />
      </button>

      {/* Framer Motion Hover Preview Tooltip Card */}
      <AnimatePresence>
        {isHovered && isVisible && (
          <motion.div
            id={`tooltip-${project.id}`}
            role="tooltip"
            initial={{ opacity: 0, scale: 0.9, y: position.vertical === "above" ? 8 : -8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: position.vertical === "above" ? 4 : -4 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className={getPositionClasses()}
          >
            <div className="w-72 sm:w-80 rounded-xl bg-slate-950/90 backdrop-blur-md border border-slate-800 shadow-2xl p-4 text-slate-100 overflow-hidden relative group">
              {/* Accent Color Header Line */}
              <div
                className="absolute top-0 left-0 right-0 h-1"
                style={{ backgroundColor: accentColor }}
              />

              {/* Category & Year */}
              <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5 font-mono">
                <span className="uppercase tracking-wider text-[10px] font-semibold text-slate-300">
                  {project.category}
                </span>
                <span className="bg-slate-800/80 px-2 py-0.5 rounded text-[10px]">
                  {project.year}
                </span>
              </div>

              {/* Title */}
              <h3 className="text-sm font-semibold text-slate-100 line-clamp-1 mb-2">
                {project.title}
              </h3>

              {/* Thumbnail Image Preview */}
              <div className="relative w-full aspect-video rounded-lg overflow-hidden border border-white/10 mb-3 bg-slate-900">
                <Image
                  src={project.image}
                  alt={project.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 640px) 280px, 320px"
                />
              </div>

              {/* Short Description */}
              <p className="text-xs text-slate-300 line-clamp-2 mb-3 leading-relaxed">
                {project.shortDescription}
              </p>

              {/* Primary Tags & Prompt */}
              <div className="flex items-center justify-between border-t border-slate-800/80 pt-2.5 mt-1">
                <div className="flex flex-wrap gap-1">
                  {project.tags.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-800/80 text-slate-300 border border-slate-700/50"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <span className="text-[10px] font-mono text-slate-400 flex items-center gap-0.5 group-hover:text-white transition-colors">
                  Details <ArrowUpRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
```

---

## 5. Verification Method

To verify the implementation of `components/leaf-node.tsx`:
1. Check component exports: Ensure `LeafNode` and `LeafNodeProps` are cleanly exported.
2. Build Verification: Run `npm run build` or `npx tsc --noEmit` to verify type compliance against `data/projects.ts` and `Project` model.
3. Interactive Testing:
   - Hovering over a leaf node must trigger the preview tooltip card.
   - Scrolling to window edges must adjust tooltip positioning (`above`/`below`, `left`/`right`) without viewport overflow.
   - Keyboard `Tab` navigation must land on the button (`tabIndex=0`), show focus ring and tooltip, and trigger `onSelect` upon pressing `Enter` or `Space`.
   - Pressing `Escape` while focused must dismiss the preview tooltip.
