# Architecture & Codebase Analysis Report

**Date**: 2026-08-11
**Explorer**: Explorer 1 (Codebase & Architecture Explorer)
**Target Project**: Portfolio Ml (`c:\Users\wisdo\OneDrive\Documents\GitHub\Portfolio Ml`)

---

## Executive Summary

The project is a modern, high-performance portfolio web application built with **Next.js 16.0.3** (App Router architecture) and **React 19.2.0**. It uses **Tailwind CSS v4** (`@import "tailwindcss"`, OKLCH CSS variables), **Framer Motion** (`12.42.2`), **Lenis** smooth scrolling (`1.3.15`), and **Radix UI / shadcn/ui** components.

The app defaults to a sleek dark aesthetic featuring custom smooth scrolling, a custom cursor, noise overlays, serif/mono typography, and bioluminescent accent colors (`#2563eb`).

---

## 1. Framework & Core Architecture

| Technology | Version | Location / Details |
|---|---|---|
| **Next.js** | `16.0.3` | App Router (`app/` directory) |
| **React** | `19.2.0` | `react` & `react-dom` |
| **TypeScript** | `^5` | `tsconfig.json`, `@/*` alias mapping to `./*` |
| **Styling** | Tailwind v4 (`^4.1.9`) | `app/globals.css`, `@tailwindcss/postcss` |
| **Animations** | `framer-motion` (`12.42.2`) | Page & component transitions |
| **Smooth Scroll** | `lenis` (`1.3.15`) | `components/smooth-scroll.tsx` |
| **3D Rendering** | Three.js / R3F (`0.181.2` / `9.4.0`) | `components/sentient-sphere.tsx` |
| **UI Primitives** | Radix UI (`@radix-ui/react-*`) | `components/ui/` (`sheet.tsx`, `tooltip.tsx`, `drawer.tsx`, etc.) |
| **Icons** | `lucide-react` (`^0.454.0`) | `components/ui/*.tsx` |

---

## 2. Layout & Global Styles Analysis

### `app/layout.tsx`
- Defines Google Fonts: `Playfair_Display` (`--font-playfair`) and `Geist_Mono` (`--font-geist-mono`).
- Includes `<div className="noise-overlay" />` fixed on body (Z-index 9999, opacity 0.03).
- Imports `./globals.css`.
- Wraps application with Vercel Analytics (`<Analytics />`).
- Standard Next.js `RootLayout` component wrapping all routes.

### `app/globals.css`
- Configured for **Tailwind CSS v4** via `@import "tailwindcss"; @import "tw-animate-css";`.
- Uses OKLCH color system in `:root` and `.dark` defaults:
  - `--background`: `oklch(0.145 0 0)` (Dark gray/black `#0d0d0d`)
  - `--foreground`: `oklch(0.985 0 0)` (Off-white)
  - `--accent`: `oklch(0.546 0.245 262.881)` (Bioluminescent electric blue `#2563eb`)
  - `--border`: `oklch(0.269 0 0)`
  - `--muted-foreground`: `oklch(0.708 0 0)`
- Includes `@theme inline` mapping font variables (`--font-sans`, `--font-mono`) and radius scales.
- Includes global `.noise-overlay`, custom webkit scrollbar styles, `::selection` styles, and CSS keyframe animations for tech marquee (`marquee-left`, `marquee-right`).

---

## 3. Existing Component & UI Patterns

1. **Custom Cursor (`components/custom-cursor.tsx`)**:
   - Fixed top-left spring-animated dot + outer ring tracking mouse position.
   - Detects hover state via `a, button, [data-cursor-hover]`.
   - Uses `mix-blend-difference` for high-contrast visibility.

2. **Smooth Scrolling (`components/smooth-scroll.tsx`)**:
   - Wraps page children in `<ReactLenis root options={{ lerp: 0.1, duration: 1.2, smoothWheel: true }}>`.

3. **Navbar (`components/navbar.tsx`)**:
   - Header fixed at `top-0`, transitions to `bg-background/80 backdrop-blur-md border-b border-border` when scrolled (`window.scrollY > 50`).
   - Links: `About (#about)`, `Works (#works)`, `Contact (#contact)`.
   - Current implementation uses `scrollToSection` helper with `document.querySelector(href).scrollIntoView()`.
   - **Recommendation**: For navigating between pages (e.g., from `/works` back to homepage or clicking `Works` from any route), link handlers should support Next.js navigation (`Link` or `router.push('/works')` / `router.push('/#works')`).

4. **Shadcn/Radix Primitives (`components/ui/`)**:
   - `components/ui/sheet.tsx`: Radix UI Dialog-based slide-over container (supports right/left/top/bottom sides with smooth entrance/exit animations).
   - `components/ui/tooltip.tsx`: Radix UI Tooltip-based floating popup.
   - `components/ui/drawer.tsx`: Vaul drawer wrapper.

---

## 4. Route Architecture & Isolation Plan for `/works`

- **App Router Route**: Create `app/works/page.tsx`.
- **Homepage Isolation**: `app/page.tsx` remains 100% untouched.
- **Route Composition**: `app/works/page.tsx` will render within `RootLayout` (`app/layout.tsx`), inheriting the root fonts, dark theme, noise overlay, and analytics. It should wrap its content with `<SmoothScroll>`, `<CustomCursor>`, and `<Navbar>`.
- **Navbar Integration**:
  - Update `components/navbar.tsx` so "Works" links to `/works` or navigates seamlessly between home anchors and `/works`.

---

## 5. Existing Projects Inventory

Found in `components/works.tsx`:

| ID | Title | Year | Primary Tags | Live / Repo Link |
|---|---|---|---|---|
| 1 | Marginal: AI Research Paper Reader | 2026 | FastAPI, Python, NLP, RAG, Uvicorn | https://marginal-paper-reader.onrender.com/ |
| 2 | Healthcare Diagnosis Chatbot | 2025 | MedBERT, ClinicalBERT, NLP, Flask API | https://avasoft-health.onrender.com/ |
| 3 | PhishGuard: Phishing Detector | 2026 | Python, XGBoost, NLP, Cybersecurity | https://phish-guard-ebon.vercel.app/ |
| 4 | Deepfake Security System | 2026 | PyTorch, Wav2Vec2, YOLO, Audio/Vision Forensics | N/A |
| 5 | KITTI Object Detection | 2026 | PyTorch, Faster R-CNN, ResNet-50, Computer Vision | N/A |
| 6 | NCT Progress Tracker API | 2026 | Node.js, Express, TypeScript, Prisma, PostgreSQL | N/A |
| 7 | Transformer Sentiment Analysis | 2026 | PyTorch, BERT, DistilBERT, NLP, Transformers | https://github.com/Ayo288888/sentiment_analysis |

---

## 6. Recommendations for Implementation Stage

1. **Procedural 2D/Canvas Scroll Branch Architecture**:
   - Render an HTML5 `<canvas>` element in `app/works/page.tsx` (or a dedicated component `components/works-tree-canvas.tsx`).
   - Sync canvas height with scroll height. Use `requestAnimationFrame` and scroll listeners (or Lenis scroll callback) to update branch growth path algorithms.
   - Use bioluminescent stroke styling (`ctx.strokeStyle = '#2563eb'`, `ctx.shadowColor = '#2563eb'`, `ctx.shadowBlur = 12`).
2. **Interactive Leaf Nodes & Tooltip/Drawer**:
   - Compute leaf node standard coordinates (relative to viewport/canvas) to render leaf targets.
   - Use `Sheet` (`components/ui/sheet.tsx`) for the right slide-over detail drawer on leaf node click.
   - Use custom Framer Motion cards or `components/ui/tooltip.tsx` for hover preview tooltips.
