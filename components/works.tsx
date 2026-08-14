"use client"

import type React from "react"

import { useState, useRef } from "react"
import { motion, useMotionValue, useSpring } from "framer-motion"

const projects = [
  {
    title: "Marginal: AI Research Paper Reader",
    tags: ["FastAPI", "Python", "NLP", "RAG", "Uvicorn"],
    image: "/previews/marginal-paper-reader.png",
    year: "2026",
    href: "https://marginal-paper-reader.onrender.com/",
  },
  {
    title: "Healthcare Diagnosis Chatbot",
    tags: ["MedBERT", "ClinicalBERT", "NLP", "Flask API"],
    image: "/previews/healthcare-chatbot-preview.png",
    year: "2025",
    href: "https://avasoft-health.onrender.com/",
  },
  {
    title: "PhishGuard: Phishing Detector",
    tags: ["Python", "XGBoost", "NLP", "Cybersecurity"],
    image: "/previews/phishguard-preview.png",
    year: "2026",
    href: "https://phish-guard-ebon.vercel.app/",
  },
  {
    title: "TruthLens: Deepfake Security System",
    tags: ["PyTorch", "Wav2Vec2", "YOLO", "Audio/Vision Forensics"],
    image: "/previews/truthlens-preview.png",
    year: "2026",
    href: "https://iris-rust-five.vercel.app/",
  },
  {
    title: "Object Detection",
    tags: ["PyTorch", "Faster R-CNN", "ResNet-50", "Computer Vision"],
    image: "/futuristic-data-dashboard-dark-minimal.jpg",
    year: "2026",
    href: "https://colab.research.google.com/drive/1LKgaoh4rq3qIScK_-YH52c5qENmStNF_",
  },

  {
    title: "Transformer Sentiment Analysis",
    tags: ["PyTorch", "BERT", "DistilBERT", "NLP", "Transformers"],
    image: "/previews/sentiment-analysis-preview.png",
    year: "2026",
    href: "https://github.com/Ayo288888/sentiment_analysis",
  },
]

export function Works() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  const springX = useSpring(mouseX, { stiffness: 150, damping: 20 })
  const springY = useSpring(mouseY, { stiffness: 150, damping: 20 })

  const handleMouseMove = (e: React.MouseEvent) => {
    mouseX.set(e.clientX)
    mouseY.set(e.clientY)
  }

  return (
    <section id="works" className="relative py-16 px-6 sm:py-24 md:px-12 md:py-24">
      {/* Section Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="mb-12 md:mb-24"
      >
        <p className="font-mono text-xs tracking-[0.3em] text-muted-foreground mb-3">04 — SELECTED WORKS</p>
        <h2 className="font-sans text-3xl md:text-5xl font-light italic">Highlighted Works</h2>
      </motion.div>

      {/* Projects List */}
      <div ref={containerRef} onMouseMove={handleMouseMove} className="relative">
        {projects.map((project, index) => (
          <motion.div
            key={project.title}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: index * 0.1 }}
            className="relative border-t border-white/10 py-6 md:py-12"
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            <a
              href={project.href || "#"}
              target={project.href ? "_blank" : undefined}
              rel={project.href ? "noopener noreferrer" : undefined}
              data-cursor-hover
              className="group flex flex-col md:flex-row md:items-center justify-between gap-3 md:gap-4"
            >
              {/* Year */}
              <span className="font-mono text-xs text-muted-foreground tracking-widest order-1 md:order-none">
                {project.year}
              </span>

              {/* Title */}
              <motion.h3
                className="font-sans text-2xl sm:text-4xl md:text-6xl lg:text-7xl font-light tracking-tight group-hover:text-white/70 transition-colors duration-300 flex-1"
                animate={{
                  x: hoveredIndex === index ? 20 : 0,
                }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                {project.title}
              </motion.h3>

              {/* Tags */}
              <div className="flex gap-2 flex-wrap order-2 md:order-none">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="font-mono text-[10px] tracking-wider px-2.5 py-0.5 sm:px-3 sm:py-1 border border-white/20 rounded-full text-muted-foreground"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </a>
          </motion.div>
        ))}

        {/* Floating Image Preview (Desktop Only) */}
        <motion.div
          className="fixed pointer-events-none z-[9999] hidden lg:block w-72 h-44 md:w-96 md:h-56 overflow-hidden rounded-xl border border-white/30 bg-black/90 backdrop-blur-md shadow-2xl"
          style={{
            left: springX,
            top: springY,
            translateX: "24px",
            translateY: "-50%",
          }}
          animate={{
            opacity: hoveredIndex !== null ? 1 : 0,
            scale: hoveredIndex !== null ? 1 : 0.8,
          }}
          transition={{ duration: 0.15 }}
        >
          {hoveredIndex !== null && (
            <>
              <motion.img
                src={projects[hoveredIndex].image}
                alt={projects[hoveredIndex].title}
                className="w-full h-full object-cover object-top"
                initial={{ scale: 1.1 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.3 }}
              />
              {projects[hoveredIndex].href && (
                <div className="absolute top-3 right-3 z-10 bg-[#2563eb] text-white text-[10px] font-mono font-medium px-2.5 py-1 rounded-full shadow-lg flex items-center gap-1">
                  <span>LIVE SITE</span>
                  <span>↗</span>
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
            </>
          )}
        </motion.div>
      </div>

      {/* Bottom Border */}
      <div className="border-t border-white/10" />
    </section>
  )
}
