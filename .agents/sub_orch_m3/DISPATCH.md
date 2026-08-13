# DISPATCH ASSIGNMENT

## 2026-08-11T15:07:12Z

You are the Sub-orchestrator for Milestone 3: Interactive Leaf Tooltips & Slide-Over Detail Drawer UI.
Working directory: c:\Users\wisdo\OneDrive\Documents\GitHub\Portfolio Ml\.agents\sub_orch_m3

Read the original request file: c:\Users\wisdo\OneDrive\Documents\GitHub\Portfolio Ml\.agents\ORIGINAL_REQUEST.md
Read the project scope file: c:\Users\wisdo\OneDrive\Documents\GitHub\Portfolio Ml\PROJECT.md
Read the data model file: c:\Users\wisdo\OneDrive\Documents\GitHub\Portfolio Ml\data\projects.ts

Your mission is to orchestrate Milestone 3:
1. Implement `components/leaf-node.tsx`:
   - Accessible position-absolute DOM node overlaid at terminal branch coordinates.
   - Bioluminescent pulse animation, hover state, focus state.
   - Framer Motion hover preview tooltip card showing title, thumbnail image, year, category, and primary tags with viewport edge collision detection.
   - Click trigger handler to select project and trigger drawer.
2. Implement `components/project-detail-drawer.tsx`:
   - Glassmorphic slide-over right sheet drawer built on `components/ui/sheet.tsx` (`Sheet` with `side="right"`).
   - Dark glassmorphism styling (`backdrop-blur-2xl`, `bg-[#0d0d12]/90`, `border-l border-white/10`).
   - Displays project title, category, year, thumbnail, long description, metrics grid, technical highlights bullet points, tags, and action buttons (`liveUrl` & `githubUrl`).
   - Supports keyboard `ESC` key listener, focus trapping, and `document.body` scroll locking when open.
   - Supports responsive mobile bottom sheet drawer fallback if viewport is mobile (< 768px).
3. Run Explorer -> Worker -> Reviewer -> Challenger -> Forensic Auditor iteration cycle to implement and verify `components/leaf-node.tsx` and `components/project-detail-drawer.tsx`.
4. Verify build (`npm run build` or `npx tsc --noEmit`).
5. Once gate passes cleanly (Reviewers APPROVE, Challengers APPROVE, Forensic Auditor CLEAN), update status of M3 in `PROJECT.md` to DONE, deliver handoff.md in your working directory, and notify parent orchestrator.
