"use client"

import { motion } from "framer-motion"

const statements = [
  "Machine Learning Developer at Neo Cloud Technologies specializing in NLP & Generative AI.",
  "Architecting Multilingual RAG systems, LangChain chatbots, and Transformer models (BERT / MedBERT).",
  "Engineered PhishGuard cybersecurity pipelines, Deepfake Audio/Vision detectors, and KITTI Tracking models.",
  "Computer Science graduate from Landmark University skilled in PyTorch, Scikit-Learn, and Vector Databases.",
  "Deploying production-ready ML architectures via Flask & Node.js microservices.",
]

export function About() {
  const duplicatedStatements = [...statements, ...statements, ...statements]

  return (
    <section id="about" className="relative py-16 sm:py-24 overflow-hidden md:py-32">
      {/* Section Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="px-6 md:px-12 mb-8 md:mb-12"
      >
        <p className="font-mono text-xs tracking-[0.3em] text-muted-foreground mb-3">03 — ML & NLP SPECIALIZATION</p>
        <h2 className="font-sans text-2xl sm:text-3xl md:text-5xl font-light italic">
          Machine Learning & Natural Language Processing Specialist
        </h2>
      </motion.div>

      {/* Automatic Smooth Auto-Scrolling Marquee Container */}
      <div className="relative flex items-center overflow-hidden py-4">
        <motion.div
          className="flex gap-8 sm:gap-16 md:gap-24 animate-marquee-left whitespace-nowrap"
          style={{ width: "fit-content", animationDuration: "50s" }}
        >
          {duplicatedStatements.map((statement, index) => (
            <span
              key={index}
              className="text-xl sm:text-3xl md:text-5xl lg:text-6xl font-sans font-light tracking-tight text-white/90 inline-block"
              style={{
                WebkitTextStroke: index % 2 === 0 ? "none" : "1px rgba(255,255,255,0.3)",
                color: index % 2 === 0 ? "inherit" : "transparent",
              }}
            >
              {statement}
              <span className="mx-4 sm:mx-8 text-white/20">•</span>
            </span>
          ))}
        </motion.div>
      </div>

      {/* Decorative Line */}
      <motion.div
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.5, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="mt-16 mx-8 md:mx-12 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent origin-left"
      />
    </section>
  )
}
