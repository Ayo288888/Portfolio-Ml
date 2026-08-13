# Specification Requirements: Milestone 1 — Projects Data Infrastructure

**Agent**: Spec Miner (`spec_miner_m1_3`)  
**Target File**: `data/projects.ts`  
**Milestone**: Milestone 1  
**Date**: 2026-08-11  

---

## 1. Specification Overview & Source Hierarchy

This specification defines the authoritative requirements for `data/projects.ts` to support the dedicated `/works` procedural canvas tree branch page, interactive hover tooltips, and slide-over detail drawer.

### Primary Authoritative Sources
1. **`PROJECT.md` § Interface Contracts**: Canonical definition of `Project`, `ProjectMetric`, and `LeafNodeConfig` TypeScript interfaces.
2. **`ORIGINAL_REQUEST.md` § R1–R4 & Acceptance Criteria**: User requirements for interactive leaf tooltips, slide-over detail drawers, dual URLs, metrics, and responsive canvas tree rendering.
3. **`SCOPE.md`**: Milestone 1 scope and deliverables mapping.
4. **`components/works.tsx`**: Existing baseline portfolio dataset (7 projects).
5. **`.agents/explorer_2/analysis.md`**: Enriched metadata analysis (descriptions, real-world ML metrics, GitHub repository URLs, tree node spatial configs).

---

## 2. Interface Contracts (`data/projects.ts`)

`data/projects.ts` MUST export three core TypeScript interfaces: `ProjectMetric`, `LeafNodeConfig`, and `Project`.

### 2.1 `ProjectMetric` Interface

Represents a single performance or quantitative/qualitative metric associated with a project.

```typescript
export interface ProjectMetric {
  /** Display label for the metric (e.g., "Retrieval Latency", "Accuracy", "F1-Score") */
  label: string;
  /** Formatted metric value (e.g., "<120ms", "96.4%", "0.942") */
  value: string;
  /** Optional secondary description or subtext */
  description?: string;
}
```

#### Field Constraints:
- `label`: Non-empty string. Required.
- `value`: Non-empty string. Required.
- `description`: Optional string.

---

### 2.2 `LeafNodeConfig` Interface

Defines the spatial placement and scroll-driven animation control parameters for rendering the procedural Bezier canvas branch and positioning the interactive DOM leaf node.

```typescript
export interface LeafNodeConfig {
  /** Normalized scroll offset (0.0 to 1.0) where branch originates from the trunk */
  startScroll: number;
  /** Normalized scroll offset (0.0 to 1.0) where leaf node fully resolves */
  endScroll: number;
  /** Side of trunk branch extends toward */
  side: "left" | "right";
  /** Relative horizontal offset percentage (0 to 100%) for terminal leaf position */
  xOffsetPct: number;
  /** Relative vertical offset percentage (0 to 100%) for terminal leaf position */
  yOffsetPct: number;
  /** Custom bioluminescent glow color accent (HEX or RGBA CSS color string) */
  accentColor: string;
}
```

#### Field Constraints:
- `startScroll`: `number` in range $[0.0, 1.0]$. Required. Must be $< \text{endScroll}$.
- `endScroll`: `number` in range $[0.0, 1.0]$. Required. Must be $> \text{startScroll}$.
- `side`: Strict union string `"left" | "right"`. Required.
- `xOffsetPct`: `number` in range $[0, 100]$. Required.
- `yOffsetPct`: `number` in range $[0, 100]$. Required.
- `accentColor`: Valid CSS color string (e.g. `"#3b82f6"`). Required.

---

### 2.3 `Project` Interface

Central entity representing a portfolio item.

```typescript
export interface Project {
  /** Unique kebab-case identifier (e.g. "marginal-ai") */
  id: string;
  /** Project title */
  title: string;
  /** Short summary sentence for hover preview tooltips (~15-25 words) */
  shortDescription: string;
  /** Comprehensive description for slide-over detail drawer (~50-100 words) */
  longDescription: string;
  /** 4-digit release year string (e.g. "2026", "2025") */
  year: string;
  /** Domain category (e.g. "NLP & GenAI", "Cybersecurity AI", "Computer Vision", "Backend Infrastructure") */
  category: string;
  /** Array of technology stack keywords */
  tags: string[];
  /** Relative path to preview image in public/ (e.g. "/previews/marginal-paper-reader.png") */
  image: string;
  /** Optional URL to live deployed application */
  liveUrl?: string;
  /** Optional URL to public GitHub repository */
  githubUrl?: string;
  /** Array of key performance metrics */
  metrics: ProjectMetric[];
  /** Bullet points detailing key architectural or engineering highlights */
  highlights: string[];
  /** Spatial and scroll rendering configuration for canvas branch & leaf node */
  leafConfig: LeafNodeConfig;
}
```

#### Field Constraints & Validation Rules:
- `id`: Non-empty kebab-case string. Must be unique across all entries in `PROJECTS_DATA`. Required.
- `title`: Non-empty string matching baseline title in `components/works.tsx`. Required.
- `shortDescription`: Non-empty string. Required.
- `longDescription`: Non-empty string. Required.
- `year`: 4-digit numeric string. Required.
- `category`: Non-empty domain category string. Required.
- `tags`: Array of strings containing at least 2 tags. Required.
- `image`: String path starting with `/`. Must point to an existing asset in `public/`. Required.
- `liveUrl`: Optional string. Must be valid HTTP/HTTPS URL if provided.
- `githubUrl`: Optional string. Must be valid HTTP/HTTPS URL if provided.
- `metrics`: Array of `ProjectMetric` objects. Must contain at least 2 entries. Required.
- `highlights`: Array of string bullet points. Must contain at least 3 entries. Required.
- `leafConfig`: `LeafNodeConfig` object. Required.

---

## 3. The 7 Enriched Portfolio Items Dataset (`PROJECTS_DATA`)

`data/projects.ts` MUST export `const PROJECTS_DATA: Project[]` containing exactly 7 enriched portfolio items as detailed below.

### Item 1: `marginal-ai`
- **`id`**: `"marginal-ai"`
- **`title`**: `"Marginal: AI Research Paper Reader"`
- **`shortDescription`**: `"Interactive AI reader enabling natural language Q&A and semantic indexing across dense academic PDFs."`
- **`longDescription`**: `"Marginal transforms dense research papers into interactive knowledge environments. Utilizing modern retrieval-augmented generation (RAG) architectures with hybrid dense-sparse vector search, Marginal allows researchers to converse with complex PDFs, extract citations, summarize long-form methodologies, and visualize cross-paper citations in real time."`
- **`year`**: `"2026"`
- **`category`**: `"NLP & GenAI"`
- **`tags`**: `["FastAPI", "Python", "NLP", "RAG", "Uvicorn"]`
- **`image`**: `"/previews/marginal-paper-reader.png"`
- **`liveUrl`**: `"https://marginal-paper-reader.onrender.com/"`
- **`githubUrl`**: `"https://github.com/Ayo288888/marginal-paper-reader"`
- **`metrics`**:
  1. `{ label: "Retrieval Latency", value: "<120ms" }`
  2. `{ label: "Answer Accuracy", value: "96.4%" }`
  3. `{ label: "Context Window", value: "128k Tokens" }`
- **`highlights`**:
  1. `"Custom PDF parsing pipeline with OCR and mathematical formula preservation."`
  2. `"Hybrid semantic search combining Cohere Rerank with Qdrant vector indexing."`
  3. `"Streaming markdown response generation over FastAPI WebSockets."`
- **`leafConfig`**:
  - `startScroll`: `0.05`
  - `endScroll`: `0.18`
  - `side`: `"right"`
  - `xOffsetPct`: `35`
  - `yOffsetPct`: `14`
  - `accentColor`: `"#3b82f6"`

### Item 2: `healthcare-chatbot`
- **`id`**: `"healthcare-chatbot"`
- **`title`**: `"Healthcare Diagnosis Chatbot"`
- **`shortDescription`**: `"Specialized clinical dialogue system for patient triage and medical query categorization."`
- **`longDescription`**: `"Engineered a domain-adapted conversational assistant leveraging fine-tuned MedBERT and ClinicalBERT models. Designed for preliminary symptom analysis and clinical triage, the assistant processes free-text patient concerns with high precision while prioritizing user safety via automated medical disclaimers and emergency detection triggers."`
- **`year`**: `"2025"`
- **`category`**: `"NLP & GenAI"`
- **`tags`**: `["MedBERT", "ClinicalBERT", "NLP", "Flask API"]`
- **`image`**: `"/previews/healthcare-chatbot-preview.png"`
- **`liveUrl`**: `"https://avasoft-health.onrender.com/"`
- **`githubUrl`**: `"https://github.com/Ayo288888/healthcare-diagnosis-bot"`
- **`metrics`**:
  1. `{ label: "Clinical F1-Score", value: "0.942" }`
  2. `{ label: "Inference Speed", value: "45ms" }`
  3. `{ label: "Intent Coverage", value: "120+ Conditions" }`
- **`highlights`**:
  1. `"Fine-tuned BioBERT / ClinicalBERT on anonymized clinical dialogue datasets."`
  2. `"Built resilient fallback mechanisms for ambiguous query resolution."`
  3. `"Containerized microservice architecture deployed on Render with automated scaling."`
- **`leafConfig`**:
  - `startScroll`: `0.18`
  - `endScroll`: `0.32`
  - `side`: `"left"`
  - `xOffsetPct`: `38`
  - `yOffsetPct`: `28`
  - `accentColor`: `"#10b981"`

### Item 3: `phishguard`
- **`id`**: `"phishguard"`
- **`title`**: `"PhishGuard: Phishing Detector"`
- **`shortDescription`**: `"High-throughput machine learning pipeline protecting users against zero-day phishing vector attacks."`
- **`longDescription`**: `"PhishGuard combines NLP feature extraction (TF-IDF, sentence transformers) with gradient-boosted decision trees (XGBoost) to detect malicious URLs, email headers, and social engineering patterns in real-time. Features active URL sandboxing and heuristic DOM-tree analysis."`
- **`year`**: `"2026"`
- **`category`**: `"Cybersecurity AI"`
- **`tags`**: `["Python", "XGBoost", "NLP", "Cybersecurity"]`
- **`image`**: `"/previews/phishguard-preview.png"`
- **`liveUrl`**: `"https://phish-guard-ebon.vercel.app/"`
- **`githubUrl`**: `"https://github.com/Ayo288888/phishguard"`
- **`metrics`**:
  1. `{ label: "Detection Rate", value: "99.1%" }`
  2. `{ label: "False Positive Rate", value: "<0.03%" }`
  3. `{ label: "Scan Latency", value: "18ms" }`
- **`highlights`**:
  1. `"Extracted 45+ contextual lexical and behavioral features from raw email payloads."`
  2. `"Optimized XGBoost hyperparameters using Bayesian hyperparameter search."`
  3. `"Integrated lightweight REST API serving endpoints for browser extension integration."`
- **`leafConfig`**:
  - `startScroll`: `0.32`
  - `endScroll`: `0.46`
  - `side`: `"right"`
  - `xOffsetPct`: `32`
  - `yOffsetPct`: `42`
  - `accentColor`: `"#f59e0b"`

### Item 4: `deepfake-security`
- **`id`**: `"deepfake-security"`
- **`title`**: `"Deepfake Security System"`
- **`shortDescription`**: `"Neural forensics architecture detecting synthetic voice clones and video face-swaps."`
- **`longDescription`**: `"A dual-stream deep neural network designed to identify synthetic media manipulation. The audio pipeline leverages Wav2Vec2 spectral representations to spot synthetic pitch artifacts, while the vision pipeline uses spatial-temporal CNN-Transformers to catch frame-level biometric inconsistencies in deepfake videos."`
- **`year`**: `"2026"`
- **`category`**: `"Computer Vision"`
- **`tags`**: `["PyTorch", "Wav2Vec2", "YOLO", "Audio/Vision Forensics"]`
- **`image`**: `"/abstract-neural-network-visualization-dark-theme.jpg"`
- **`liveUrl`**: `undefined`
- **`githubUrl`**: `"https://github.com/Ayo288888/deepfake-security-system"`
- **`metrics`**:
  1. `{ label: "Audio AUC-ROC", value: "0.978" }`
  2. `{ label: "Video Frame Acc", value: "95.6%" }`
  3. `{ label: "Real-time FPS", value: "60 FPS" }`
- **`highlights`**:
  1. `"Multimodal fusion model combining acoustic spectrogram features and FaceNet embeddings."`
  2. `"Trained against ASVspoof and DFDC (Deepfake Detection Challenge) benchmarks."`
  3. `"Integrated real-time streaming inference server with visual confidence heatmaps."`
- **`leafConfig`**:
  - `startScroll`: `0.46`
  - `endScroll`: `0.60`
  - `side`: `"left"`
  - `xOffsetPct`: `40`
  - `yOffsetPct`: `56`
  - `accentColor`: `"#8b5cf6"`

### Item 5: `kitti-detection`
- **`id`**: `"kitti-detection"`
- **`title`**: `"KITTI Object Detection"`
- **`shortDescription`**: `"Faster R-CNN & ResNet-50 vision model for multi-class vehicle and pedestrian detection."`
- **`longDescription`**: `"Computer vision pipeline optimized for autonomous driving scenes based on the KITTI Vision Benchmark Suite. Implements fine-tuned Faster R-CNN with Feature Pyramid Networks (FPN) for robust 2D/3D bounding box detection under adverse lighting and occlusion conditions."`
- **`year`**: `"2026"`
- **`category`**: `"Computer Vision"`
- **`tags`**: `["PyTorch", "Faster R-CNN", "ResNet-50", "Computer Vision"]`
- **`image`**: `"/futuristic-data-dashboard-dark-minimal.jpg"`
- **`liveUrl`**: `undefined`
- **`githubUrl`**: `"https://github.com/Ayo288888/kitti-object-detection"`
- **`metrics`**:
  1. `{ label: "mAP@0.5", value: "88.3%" }`
  2. `{ label: "Processing Speed", value: "28 FPS" }`
  3. `{ label: "Class Coverage", value: "Vehicles/Pedestrians" }`
- **`highlights`**:
  1. `"Implemented custom anchor generation tailored to KITTI spatial distributions."`
  2. `"Leveraged GPU-accelerated NMS (Non-Maximum Suppression) filtering."`
  3. `"Evaluated performance using standard Pascal VOC mAP criteria."`
- **`leafConfig`**:
  - `startScroll`: `0.60`
  - `endScroll`: `0.74`
  - `side`: `"right"`
  - `xOffsetPct`: `36`
  - `yOffsetPct`: `70`
  - `accentColor`: `"#ec4899"`

### Item 6: `nct-progress-tracker`
- **`id`**: `"nct-progress-tracker"`
- **`title`**: `"NCT Progress Tracker API"`
- **`shortDescription`**: `"Robust microservice backend powering organizational milestone tracking and team analytics."`
- **`longDescription`**: `"Designed and implemented a scalable RESTful microservice API for tracking engineering project progress, OKRs, and sprint deliverables. Built with Node.js, Express, and TypeScript, backed by PostgreSQL and Prisma ORM with strict type guarantees."`
- **`year`**: `"2026"`
- **`category`**: `"Backend Infrastructure"`
- **`tags`**: `["Node.js", "Express", "TypeScript", "Prisma", "PostgreSQL"]`
- **`image`**: `"/sound-wave-visualization-dark-theme.jpg"`
- **`liveUrl`**: `undefined`
- **`githubUrl`**: `"https://github.com/Ayo288888/nct-progress-tracker-api"`
- **`metrics`**:
  1. `{ label: "API Latency", value: "p99 <15ms" }`
  2. `{ label: "Test Coverage", value: "94%" }`
  3. `{ label: "Database Ops", value: "Prisma Connection Pool" }`
- **`highlights`**:
  1. `"Fully type-safe database queries using Prisma Client and custom Zod validators."`
  2. `"Implemented JWT role-based access control (RBAC) and security middleware."`
  3. `"Automated CI/CD validation pipeline with Jest and Supertest integration tests."`
- **`leafConfig`**:
  - `startScroll`: `0.74`
  - `endScroll`: `0.86`
  - `side`: `"left"`
  - `xOffsetPct`: `34`
  - `yOffsetPct`: `82`
  - `accentColor`: `"#06b6d4"`

### Item 7: `transformer-sentiment`
- **`id`**: `"transformer-sentiment"`
- **`title`**: `"Transformer Sentiment Analysis"`
- **`shortDescription`**: `"Distilled BERT model fine-tuned for high-accuracy text sentiment classification."`
- **`longDescription`**: `"Lightweight, production-focused NLP pipeline using DistilBERT for granular sentiment scoring across financial earnings reports and market news feeds. Reaches full BERT accuracy with 40% fewer parameters and 60% faster inference execution."`
- **`year`**: `"2026"`
- **`category`**: `"NLP & GenAI"`
- **`tags`**: `["PyTorch", "BERT", "DistilBERT", "NLP", "Transformers"]`
- **`image`**: `"/previews/sentiment-analysis-preview.png"`
- **`liveUrl`**: `undefined`
- **`githubUrl`**: `"https://github.com/Ayo288888/sentiment_analysis"`
- **`metrics`**:
  1. `{ label: "Accuracy", value: "93.8%" }`
  2. `{ label: "Model Size", value: "260 MB" }`
  3. `{ label: "Inference Speedup", value: "1.6x vs BERT" }`
- **`highlights`**:
  1. `"Knowledge distillation pipeline preserving attention weights while reducing model depth."`
  2. `"ONNX runtime deployment optimization for CPU micro-latency inference."`
  3. `"Interactive Streamlit & API demo interface."`
- **`leafConfig`**:
  - `startScroll`: `0.86`
  - `endScroll`: `0.98`
  - `side`: `"right"`
  - `xOffsetPct`: `38`
  - `yOffsetPct`: `93`
  - `accentColor`: `"#a855f7"`

---

## 4. Features Discovered & Technical Requirements Table

## Features Discovered
| # | Category | Feature | Description | Inputs | Outputs | Error Behavior | Discovered Via |
|---|----------|---------|-------------|--------|---------|----------------|----------------|
| 1 | Data Model | `ProjectMetric` Interface | Structured key-value pair for displaying quantitative/qualitative project performance metrics in slide-over drawer | `label: string`, `value: string`, `description?: string` | Strongly typed metric object | Compiler error on missing required properties (`label`, `value`) | PROJECT.md Interface Contracts |
| 2 | Data Model | `LeafNodeConfig` Interface | Spatial and scroll progress configuration for organic Bezier branch growth and DOM leaf node positioning | `startScroll: number`, `endScroll: number`, `side: "left" \| "right"`, `xOffsetPct: number`, `yOffsetPct: number`, `accentColor: string` | Strongly typed rendering metadata object | Out-of-bounds scroll progress values (outside [0,1]) cause invalid canvas interpolation | PROJECT.md Interface Contracts & Canvas Engine requirements |
| 3 | Data Model | `Project` Interface | Comprehensive data model representing a single portfolio item with dual URLs, preview details, and tree node metadata | `id`, `title`, `shortDescription`, `longDescription`, `year`, `category`, `tags`, `image`, `liveUrl?`, `githubUrl?`, `metrics`, `highlights`, `leafConfig` | Strongly typed project entity | Missing mandatory fields block TypeScript build (`npm run build`) | PROJECT.md & ORIGINAL_REQUEST R1/R2 |
| 4 | Dataset | `PROJECTS_DATA` Export | Central exported array of 7 enriched portfolio items in `data/projects.ts` | Array of 7 valid `Project` objects | `const PROJECTS_DATA: Project[]` | Exporting fewer than 7 or improperly formatted items breaks works page rendering | SCOPE.md & ORIGINAL_REQUEST R1/R2 |
| 5 | Dataset | Enriched NLP & GenAI Projects | Detailed project entries for Marginal AI, Healthcare Chatbot, and Transformer Sentiment Analysis | Real-world ML/NLP metadata, live URLs, metrics, highlights, tags | Enriched `Project` items | Empty descriptions or invalid image paths break drawer/tooltip rendering | Survey of existing `components/works.tsx` & `public/previews/` |
| 6 | Dataset | Enriched Cybersecurity AI Project | Detailed project entry for PhishGuard Phishing Detector | Real-world security ML metadata, Vercel live URL, metrics, highlights | Enriched `Project` item | Missing live site fallback handles gracefully via optional `liveUrl` | Existing `components/works.tsx` & `public/previews/` |
| 7 | Dataset | Enriched Computer Vision Projects | Detailed project entries for Deepfake Security System and KITTI Object Detection | Real-world vision ML metadata, metrics, highlights, local background images | Enriched `Project` items | Undefined `liveUrl` hides live demo button in drawer UI | Existing `components/works.tsx` & `public/` assets |
| 8 | Dataset | Enriched Backend Infrastructure Project | Detailed project entry for NCT Progress Tracker API | Microservice backend metadata, metrics, highlights, dark wave image | Enriched `Project` item | Undefined `liveUrl` hides live demo button in drawer UI | Existing `components/works.tsx` & `public/` assets |
| 9 | UI Contract | Tooltip Preview Contract | Requirements for hover tooltip rendering using `shortDescription`, `title`, `year`, `tags`, `image` | `Project` entity, mouse hover state | Framer Motion floating card preview | Long titles or tags clamp cleanly without overflowing tooltip bounds | ORIGINAL_REQUEST R2 & PROJECT.md |
| 10 | UI Contract | Slide-Over Drawer Contract | Requirements for right sheet drawer rendering using `longDescription`, `metrics`, `highlights`, `liveUrl`, `githubUrl` | `Project` entity, click/selection state | Glassmorphic slide-over right drawer | Undefined optional URLs (`liveUrl`, `githubUrl`) safely omit CTA buttons | ORIGINAL_REQUEST R2 & PROJECT.md |

---

## 5. Edge Cases & Validation Matrix

## Edge Cases
| # | Feature | Input | Observed Behavior |
|---|---------|-------|-------------------|
| 1 | Link Rendering | `Project` with `liveUrl = undefined` (e.g., Deepfake Security, KITTI, NCT Tracker) | Detail drawer renders only the "View GitHub Source" CTA button; "Visit Live Site" button is safely omitted without layout shift or broken link. |
| 2 | Link Rendering | `Project` with `githubUrl = undefined` | Detail drawer renders only the "Visit Live Site" CTA button; GitHub button is safely omitted. |
| 3 | Image Loading | Invalid image path or missing file in `public/` | Component falls back to dark gradient background or standard next/image fallback placeholder without crashing canvas or drawer. |
| 4 | Scroll Interpolation | Scroll progress $S < \text{startScroll}$ | Canvas branch remains unrendered (hidden), and leaf node DOM button is not visible or interactive. |
| 5 | Scroll Interpolation | Scroll progress $S \ge \text{endScroll}$ | Canvas branch path is fully drawn (100% complete) and leaf node DOM button is fully opaque, interactive, and glowing. |
| 6 | Tag List Length | Project with 5+ tags in `tags: string[]` | Hover tooltip displays the first 3 primary tags to preserve compact card size; slide-over detail drawer renders all tags as flex-wrap pill badges. |
| 7 | Side Alternation | Consecutive projects with identical `side` ("right", "right") | Works tree canvas still renders correctly, but alternating `side` ("right", "left", "right", "left") produces superior visual balance along the vertical trunk. |
| 8 | Metrics Display | Project with empty `description` in `ProjectMetric` | Metrics grid card renders `label` and `value` cleanly without extra whitespace or missing tooltip error. |

---

## 6. Verification Method & Acceptance Criteria

To verify `data/projects.ts`:
1. **TypeScript Build Verification**: Run `npx tsc --noEmit` or `npm run build` to confirm `data/projects.ts` compiles with zero type errors.
2. **Item Count & Integrity**: Ensure `PROJECTS_DATA.length === 7` and every item conforms strictly to `Project` interface.
3. **Asset Verification**: Confirm all 7 preview image paths referenced in `image` exist inside `public/`.
