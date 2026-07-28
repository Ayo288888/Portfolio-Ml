# Portfolio CV Integration Design Document

**Date**: 2026-07-28  
**Author**: Ilori Ayomide Wisdom & AI Assistant  
**Status**: Approved  

---

## 1. Overview

Transform the portfolio website into a high-impact, personalized showcase matching the full CV of **Ilori Ayomide Wisdom** — *Front-End Developer & AI Engineer*. All placeholder texts, mock projects, and generic links will be replaced with verified details, experience, skills, and projects from the user's CV.

---

## 2. Component Design & Changes

### 2.1 Hero & Navigation (`components/navbar.tsx` & `components/hero.tsx`)
- **Branding**: Update logo from "PORTFOLIO" to "ILORI AYOMIDE".
- **Status Indicator**: "AVAILABLE FOR WORK — ABUJA, NIGERIA".
- **Hero Headings**:
  - Top Left: `01 — DISCIPLINE` / `FRONT-END DEVELOPER`
  - Bottom Right: `02 — SPECIALIZATION` / `AI ENGINEER`
- **Center Action**: "Initialize CV" button smooth scrolling to projects or launching email contact.

### 2.2 Profile & Philosophy Stream (`components/about.tsx`)
- **Header**: "03 — PROFILE & PHILOSOPHY" / "Computer Science Graduate & Developer"
- **Stream Statements**:
  1. "Computer Science graduate from Landmark University."
  2. "Founding Engineer & Team Lead architecting web apps with Next.js & TypeScript."
  3. "Hands-on experience in NLP, RAG architectures, and Transformer models."
  4. "Deploying AI-powered solutions via Flask & Node.js APIs."
  5. "Building intelligent interfaces that adapt and empower."

### 2.3 Selected Works (`components/works.tsx`)
Replace current 4 placeholder items with Ayomide's 7 real projects:
1. **PhishGuard** (2026): URL-Based Phishing Detection Model using XGBoost & NLP.
   - *Tags*: `Python`, `XGBoost`, `NLP`, `Cybersecurity`
2. **Deepfake Security System** (2026): Multi-Layered Multimedia Classifier with YOLO, EfficientNet, Wav2Vec2.
   - *Tags*: `PyTorch`, `YOLO`, `Wav2Vec2`, `Computer Vision`
3. **Multilingual RAG Bot** (2026): Enterprise Q&A Platform using LangChain & RAG.
   - *Tags*: `LangChain`, `RAG`, `Python`, `Next.js`
4. **KITTI Object Detection** (2026): Autonomous Vehicle Tracking via ResNet-50 FPN & Faster R-CNN.
   - *Tags*: `PyTorch`, `Faster R-CNN`, `KITTI`, `OpenCV`
5. **NCT Progress Tracker API** (2026): Milestone Tracking Backend API with JWT Auth & Prisma/PostgreSQL.
   - *Tags*: `Node.js`, `Express`, `TypeScript`, `Prisma`, `PostgreSQL`
6. **Healthcare Diagnosis Chatbot** (2025): Symptom Assessment Assistant built with MedBERT/ClinicalBERT and Flask API.
   - *Tags*: `MedBERT`, `Flask API`, `NLP`, `MedQuAD`
7. **Peerlaw Platform** (2025): Legal Resource & Peer Discussion Web Application.
   - *Tags*: `React.js`, `Tailwind CSS`, `Frontend`

### 2.4 Technical Arsenal (`components/tech-marquee.tsx`)
- **Row 1 (Skills)**: `PYTHON`, `NEXT.JS`, `TYPESCRIPT`, `REACT.JS`, `TAILWIND CSS`, `TRANSFORMERS`, `SCIKIT-LEARN`, `LANGCHAIN`, `NODE.JS`, `FLASK API`
- **Row 2 (Domain Concepts)**: `RAG`, `NLP`, `BERT`, `MEDBERT`, `YOLO`, `WAV2VEC2`, `XGBOOST`, `PRISMA`, `POSTGRESQL`, `PYTORCH`, `AGILE`

### 2.5 Contact & Footer (`components/footer.tsx`)
- **CTA Target**: `mailto:wisdomilori0@gmail.com`
- **Contact Details**: Phone `+234 816 379 7443`, Location `Abuja, Nigeria`
- **Social Links**:
  - **LinkedIn**: `https://www.linkedin.com/in/ayomide-ilori-33318a270/`
  - **GitHub**: `https://github.com/Ayo288888`
  - **Email**: `mailto:wisdomilori0@gmail.com`
- **Copyright**: `© 2026 Ilori Ayomide Wisdom`

---

## 3. Verification Plan

- Run `npm run build` to ensure all React components compile without TypeScript errors or broken imports.
- Confirm all links, mailto targets, project tags, and text strings render cleanly.
