# CV Portfolio Integration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Update the portfolio website components to display the real CV information of Ilori Ayomide Wisdom (Front-End Developer & AI Engineer).

**Architecture:** Update individual React client components in `components/` (`navbar.tsx`, `hero.tsx`, `about.tsx`, `works.tsx`, `tech-marquee.tsx`, `footer.tsx`) with structured CV data while preserving existing Tailwind CSS styles, Framer Motion animations, and custom UI components.

**Tech Stack:** Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS, Framer Motion, Lucide React.

## Global Constraints

- Preserve all Framer Motion scroll and hover animation logic.
- Keep exact contact info: Email `wisdomilori0@gmail.com`, Phone `+234 816 379 7443`, Location `Abuja, Nigeria`.
- Maintain dark aesthetic theme (`#050505`, `#2563eb` accents, glassmorphism overlays).

---

### Task 1: Update Personal Branding in Navbar & Hero

**Files:**
- Modify: [navbar.tsx](file:///c:/Users/wisdo/OneDrive/Documents/GitHub/Portfolio%20Ml/components/navbar.tsx)
- Modify: [hero.tsx](file:///c:/Users/wisdo/OneDrive/Documents/GitHub/Portfolio%20Ml/components/hero.tsx)

**Interfaces:**
- Consumes: Navbar and Hero components in `app/page.tsx`.
- Produces: Header branding "ILORI AYOMIDE" and Hero titles for "FRONT-END DEVELOPER" and "AI ENGINEER".

- [ ] **Step 1: Update `components/navbar.tsx` branding and location**

Update logo text to `"ILORI AYOMIDE"` and status indicator text to `"AVAILABLE FOR WORK — ABUJA, NIGERIA"`.

- [ ] **Step 2: Update `components/hero.tsx` headings**

Update top-left section to:
- Tag: `01 — DISCIPLINE`
- Heading: `FRONT-END DEVELOPER`

Update bottom-right section to:
- Tag: `02 — SPECIALIZATION`
- Heading: `AI ENGINEER`

- [ ] **Step 3: Commit Task 1 changes**

```bash
git add components/navbar.tsx components/hero.tsx
git commit -m "feat(hero): update personal branding and titles for Ilori Ayomide"
```

---

### Task 2: Update Profile & Philosophy Stream

**Files:**
- Modify: [about.tsx](file:///c:/Users/wisdo/OneDrive/Documents/GitHub/Portfolio%20Ml/components/about.tsx)

**Interfaces:**
- Consumes: `About` component in `app/page.tsx`.
- Produces: Horizontal marquee statements summarizing Ayomide's background and engineering philosophy.

- [ ] **Step 1: Update statements array in `components/about.tsx`**

Replace generic statements with:
```typescript
const statements = [
  "Computer Science graduate from Landmark University.",
  "Founding Engineer & Team Lead architecting Next.js & TypeScript apps.",
  "Hands-on experience in NLP, RAG architectures, and Transformer models.",
  "Deploying AI-powered solutions via Flask & Node.js APIs.",
  "Building intelligent interfaces that adapt and empower.",
]
```

- [ ] **Step 2: Update section header text**

Set tag to `03 — PROFILE & PHILOSOPHY` and title to `Computer Science Graduate & Developer`.

- [ ] **Step 3: Commit Task 2 changes**

```bash
git add components/about.tsx
git commit -m "feat(about): update profile statements and philosophy from CV"
```

---

### Task 3: Update Selected Works with CV Projects

**Files:**
- Modify: [works.tsx](file:///c:/Users/wisdo/OneDrive/Documents/GitHub/Portfolio%20Ml/components/works.tsx)

**Interfaces:**
- Consumes: `Works` component in `app/page.tsx`.
- Produces: 7 interactive project rows for PhishGuard, Deepfake Security, Multilingual RAG, KITTI Object Detection, NCT Progress Tracker API, Healthcare Diagnosis Chatbot, and Peerlaw.

- [ ] **Step 1: Update `projects` array in `components/works.tsx`**

Replace `projects` with:
```typescript
const projects = [
  {
    title: "PhishGuard: Phishing Detector",
    tags: ["Python", "XGBoost", "NLP", "Cybersecurity"],
    image: "/futuristic-data-dashboard-dark-minimal.jpg",
    year: "2026",
  },
  {
    title: "Deepfake Security System",
    tags: ["PyTorch", "YOLO", "Wav2Vec2", "EfficientNet"],
    image: "/abstract-neural-network-visualization-dark-theme.jpg",
    year: "2026",
  },
  {
    title: "Multilingual RAG Q&A Bot",
    tags: ["LangChain", "RAG", "Python", "Next.js"],
    image: "/abstract-memory-storage-visualization.jpg",
    year: "2026",
  },
  {
    title: "KITTI Object Detection",
    tags: ["PyTorch", "Faster R-CNN", "KITTI", "OpenCV"],
    image: "/futuristic-data-dashboard-dark-minimal.jpg",
    year: "2026",
  },
  {
    title: "NCT Progress Tracker API",
    tags: ["Node.js", "Express", "TypeScript", "Prisma", "PostgreSQL"],
    image: "/sound-wave-visualization-dark-theme.jpg",
    year: "2026",
  },
  {
    title: "Healthcare Diagnosis Chatbot",
    tags: ["MedBERT", "Flask API", "NLP", "MedQuAD"],
    image: "/abstract-neural-network-visualization-dark-theme.jpg",
    year: "2025",
  },
  {
    title: "Peerlaw Legal Platform",
    tags: ["React.js", "Tailwind CSS", "Frontend"],
    image: "/abstract-memory-storage-visualization.jpg",
    year: "2025",
  },
]
```

- [ ] **Step 2: Commit Task 3 changes**

```bash
git add components/works.tsx
git commit -m "feat(works): replace placeholder projects with 7 real CV projects"
```

---

### Task 4: Update Technical Arsenal Marquee

**Files:**
- Modify: [tech-marquee.tsx](file:///c:/Users/wisdo/OneDrive/Documents/GitHub/Portfolio%20Ml/components/tech-marquee.tsx)

**Interfaces:**
- Consumes: `TechMarquee` component in `app/page.tsx`.
- Produces: Dual animated marquee rows featuring AI/ML & Web Development technologies from the CV.

- [ ] **Step 1: Update `techItems` and `concepts` arrays in `components/tech-marquee.tsx`**

```typescript
const techItems = [
  "PYTHON",
  "NEXT.JS",
  "TYPESCRIPT",
  "REACT.JS",
  "TAILWIND CSS",
  "TRANSFORMERS",
  "SCIKIT-LEARN",
  "LANGCHAIN",
  "NODE.JS",
  "FLASK API",
  "POSTGRESQL",
  "PYTORCH",
]

const concepts = [
  "RAG",
  "NLP",
  "BERT",
  "MEDBERT",
  "YOLO",
  "WAV2VEC2",
  "XGBOOST",
  "PRISMA",
  "AGILE",
  "DEEP LEARNING",
  "COMPUTER VISION",
  "SYSTEM ARCHITECTURE",
]
```

- [ ] **Step 2: Commit Task 4 changes**

```bash
git add components/tech-marquee.tsx
git commit -m "feat(tech-marquee): update technology and domain keywords from CV"
```

---

### Task 5: Update Footer & Contact Details

**Files:**
- Modify: [footer.tsx](file:///c:/Users/wisdo/OneDrive/Documents/GitHub/Portfolio%20Ml/components/footer.tsx)

**Interfaces:**
- Consumes: `Footer` component in `app/page.tsx`.
- Produces: Contact section with mailto link to `wisdomilori0@gmail.com`, phone number, location, and social links.

- [ ] **Step 1: Update CTA mailto link and links list in `components/footer.tsx`**

- Update `href` on line 30 to `"mailto:wisdomilori0@gmail.com"`.
- Update social links array to include LinkedIn URL (`https://www.linkedin.com/in/ayomide-ilori-33318a270/`), GitHub (`https://github.com/Ayo288888`), and Email (`mailto:wisdomilori0@gmail.com`).
- Add phone number `+234 816 379 7443` and location `Abuja, Nigeria` display.
- Update copyright string to `© ${new Date().getFullYear()} Ilori Ayomide Wisdom`.

- [ ] **Step 2: Commit Task 5 changes**

```bash
git add components/footer.tsx
git commit -m "feat(footer): update contact mailto, phone, social links, and copyright"
```

---

### Task 6: Verify Build & Compile Cleanly

- [ ] **Step 1: Execute `npm run build`**

Run: `npm run build`
Expected: Production build compiles successfully with 0 errors.
