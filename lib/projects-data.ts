export interface Project {
  id: string
  title: string
  subtitle: string
  category: "AI & NLP" | "Security" | "Computer Vision" | "Full-Stack"
  tags: string[]
  image: string
  year: string
  description: string
  architecture: string[]
  metrics?: string
  href?: string
  github?: string
}

export const PROJECTS: Project[] = [
  {
    id: "marginal",
    title: "Marginal: AI Research Paper Reader",
    subtitle: "RAG-powered PDF analysis & context-aware scientific Q&A engine",
    category: "AI & NLP",
    tags: ["FastAPI", "Python", "NLP", "RAG", "Uvicorn"],
    image: "/previews/marginal-paper-reader.png",
    year: "2026",
    description:
      "An intelligent PDF research paper reader utilizing Retrieval-Augmented Generation (RAG) and NLP to extract, summarize, and query complex scientific publications with instant context-aware citations.",
    architecture: [
      "FastAPI Asynchronous Backend Engine",
      "LangChain RAG Pipeline & Vector Storage",
      "PDF Tokenizer & Smart Chunking Parser",
      "Interactive Contextual Citation Mapping",
    ],
    metrics: "Sub-2s Query Response Time",
    href: "https://marginal-paper-reader.onrender.com/",
  },
  {
    id: "healthcare-chatbot",
    title: "Healthcare Diagnosis Chatbot",
    subtitle: "Clinical decision support engine using MedBERT & ClinicalBERT",
    category: "AI & NLP",
    tags: ["MedBERT", "ClinicalBERT", "NLP", "Flask API"],
    image: "/previews/healthcare-chatbot-preview.png",
    year: "2025",
    description:
      "Clinical decision support chatbot powered by domain-tuned MedBERT and ClinicalBERT transformers to analyze patient symptoms, suggest differential diagnoses, and provide evidence-based medical summaries.",
    architecture: [
      "Domain-Specific MedBERT Model Fine-Tuning",
      "ClinicalBERT Sequence Classification Engine",
      "Flask REST API with Medical Terminology Normalization",
      "Symptom Parsing & Differential Risk Scoring",
    ],
    metrics: "94.2% Diagnostic Accuracy",
    href: "https://avasoft-health.onrender.com/",
  },
  {
    id: "phishguard",
    title: "PhishGuard: Phishing Detector",
    subtitle: "Real-time cyber threat detection using gradient-boosted ML",
    category: "Security",
    tags: ["Python", "XGBoost", "NLP", "Cybersecurity"],
    image: "/previews/phishguard-preview.png",
    year: "2026",
    description:
      "Real-time cybersecurity URL and email phishing threat detector built using gradient-boosted XGBoost classifiers and natural language feature extraction to protect users against malicious attacks.",
    architecture: [
      "XGBoost Gradient Boosted Classifier",
      "Lexical Feature Extraction & TF-IDF Vectorization",
      "Python ML Threat Evaluation Service",
      "Vercel Edge Web Interface",
    ],
    metrics: "98.7% Detection Precision",
    href: "https://phish-guard-ebon.vercel.app/",
  },
  {
    id: "truthlens-deepfake",
    title: "TruthLens: Deepfake Security System",
    subtitle: "AI-Powered Deepfake Detection & Media Forensics System",
    category: "Security",
    tags: ["PyTorch", "Wav2Vec2", "YOLO", "Audio/Vision Forensics"],
    image: "/previews/truthlens-preview.png",
    year: "2026",
    description:
      "TruthLens is an AI-powered deepfake detection and media forensics system integrating audio analysis via Wav2Vec2 and visual artifact detection with YOLO & PyTorch to verify manipulated facial & vocal media in real time.",
    architecture: [
      "Wav2Vec2 Audio Transformer for Vocal Manipulation Detection",
      "YOLOv8 Spatial-Temporal Visual Forensics",
      "PyTorch Multi-Modal Fusion Pipeline",
      "OpenCV Artifact Feature Extraction",
    ],
    metrics: "Real-Time AI Forensic Verification",
    href: "https://iris-rust-five.vercel.app/",
  },
  {
    id: "kitti-detection",
    title: "Object Detection",
    subtitle: "Autonomous perception using Faster R-CNN & ResNet-50",
    category: "Computer Vision",
    tags: ["PyTorch", "Faster R-CNN", "ResNet-50", "Computer Vision"],
    image: "/futuristic-data-dashboard-dark-minimal.jpg",
    year: "2026",
    description:
      "Autonomous driving perception model trained on the KITTI dataset using Faster R-CNN with a ResNet-50 backbone for precise 2D/3D bounding box detection of vehicles, pedestrians, and cyclists.",
    architecture: [
      "Faster R-CNN Architecture with Feature Pyramid Networks",
      "ResNet-50 Deep Feature Backbone",
      "PyTorch Torchvision Computer Vision Engine",
      "CUDA Accelerated Inference Pipeline",
    ],
    metrics: "High-mAP Autonomous Perception",
    href: "https://colab.research.google.com/drive/1LKgaoh4rq3qIScK_-YH52c5qENmStNF_",
  },

  {
    id: "sentiment-analysis",
    title: "Transformer Sentiment Analysis",
    subtitle: "Benchmarked Transformer models for text sentiment evaluation",
    category: "AI & NLP",
    tags: ["PyTorch", "BERT", "DistilBERT", "NLP", "Transformers"],
    image: "/previews/sentiment-analysis-preview.png",
    year: "2026",
    description:
      "End-to-end sentiment classification model benchmarking BERT, DistilBERT, and RoBERTa architectures on large-scale text corpora with custom PyTorch training loops and evaluation matrices.",
    architecture: [
      "Hugging Face Transformers Fine-Tuning",
      "PyTorch Custom Training Loop & Learning Rate Schedulers",
      "BERT, DistilBERT, and RoBERTa Model Benchmarking",
      "TensorBoard Performance Tracking",
    ],
    metrics: "92.5% Evaluation F1-Score",
    github: "https://github.com/Ayo288888/sentiment_analysis",
  },
]
