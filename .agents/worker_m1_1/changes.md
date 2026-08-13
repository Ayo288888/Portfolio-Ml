# Changes Implemented by Worker 1 (Milestone 1)

## Summary of Changes

### 1. Created `data/projects.ts`
- Implemented and exported TypeScript interfaces:
  - `ProjectMetric`: Quantitative/qualitative performance metrics (`label: string`, `value: string`, `description?: string`).
  - `LeafNodeConfig`: Scroll interpolation and canvas tree node spatial metadata (`startScroll`, `endScroll`, `side: "left" | "right"`, `xOffsetPct`, `yOffsetPct`, `accentColor`).
  - `Project`: Full portfolio item model (`id`, `title`, `shortDescription`, `longDescription`, `year`, `category`, `tags`, `image`, `liveUrl?`, `githubUrl?`, `metrics`, `highlights`, `leafConfig`).
- Implemented and exported `PROJECTS_DATA: Project[]` array with 7 enriched, production-grade portfolio items:
  1. `marginal-ai-reader` (Generative AI & RAG) — RAG paper reader, FastAPI/Uvicorn, live URL on Render.
  2. `healthcare-diagnosis-chatbot` (Medical NLP) — MedBERT/ClinicalBERT triage, Flask API, live URL on Render.
  3. `phishguard-detector` (Cybersecurity AI) — XGBoost phishing detector, live URL on Vercel.
  4. `deepfake-security-system` (Audio & Vision Forensics) — Wav2Vec2/YOLO deepfake detection, GitHub repository.
  5. `kitti-object-detection` (Computer Vision) — Faster R-CNN/ResNet-50 3D bounding box detection, GitHub repository.
  6. `nct-progress-tracker-api` (Backend Microservices) — Node.js/Express/Prisma REST API, GitHub repository.
  7. `transformer-sentiment-analysis` (Deep Learning & NLP) — DistilBERT aspect-based sentiment classification, GitHub repository.
- Implemented and exported `getProjectById(id: string): Project | undefined` helper function.

### 2. Verified Asset & Contract Compatibility
- All referenced image paths (`/previews/...` and `/...jpg`) exist in `public/`.
- Scroll ranges for leaf nodes span monotonically from `0.05` to `0.94` with alternating `"left"` / `"right"` trunk sides.
