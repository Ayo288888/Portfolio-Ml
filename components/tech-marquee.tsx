"use client"

import { useState } from "react"
import { motion } from "framer-motion"

const techItems = [
  "MACHINE LEARNING",
  "NATURAL LANGUAGE PROCESSING",
  "PYTHON",
  "PYTORCH",
  "TRANSFORMERS",
  "LANGCHAIN",
  "RAG",
  "BERT & MEDBERT",
  "SCIKIT-LEARN",
  "HUGGING FACE",
  "FLASK API",
  "GENERATIVE AI",
]

const concepts = [
  "NLP ARCHITECTURE",
  "RETRIEVAL-AUGMENTED GENERATION",
  "AUDIO FORENSICS",
  "COMPUTER VISION",
  "WAV2VEC2 & YOLO",
  "XGBOOST",
  "VECTOR DATABASES",
  "TRANSFORMER FINE-TUNING",
  "NEXT.JS & TYPESCRIPT",
  "NODE.JS & PRISMA",
  "AGILE METHODOLOGIES",
  "DEEP LEARNING PIPELINES",
]

function MarqueeRow({
  items,
  direction = "left",
  isAccelerated = false,
}: {
  items: string[]
  direction?: "left" | "right"
  isAccelerated?: boolean
}) {
  const duplicatedItems = [...items, ...items, ...items, ...items]

  return (
    <div className="relative overflow-hidden py-4">
      <motion.div
        className={`flex gap-8 ${direction === "left" ? "animate-marquee-left" : "animate-marquee-right"}`}
        style={{
          width: "fit-content",
          animationDuration: isAccelerated ? "18s" : "45s",
          transition: "animation-duration 0.5s ease",
        }}
      >
        {duplicatedItems.map((item, index) => (
          <span
            key={index}
            className="group font-sans text-5xl md:text-7xl lg:text-8xl font-light tracking-tight whitespace-nowrap cursor-default"
            style={{
              WebkitTextStroke: "1px rgba(255,255,255,0.3)",
              color: isAccelerated ? "white" : "transparent",
              transition: "all 0.4s ease",
            }}
          >
            {item}
            <span className="mx-8 text-white/20">•</span>
          </span>
        ))}
      </motion.div>
    </div>
  )
}

export function TechMarquee() {
  const [isSectionHovered, setIsSectionHovered] = useState(false)

  return (
    <section
      onMouseEnter={() => setIsSectionHovered(true)}
      onMouseLeave={() => setIsSectionHovered(false)}
      className="relative py-24 overflow-hidden md:py-32 cursor-pointer"
    >
      {/* Section Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="px-8 md:px-12 mb-16 flex items-center justify-between"
      >
        <p className="font-mono text-xs tracking-[0.3em] text-muted-foreground">05 — ML & NLP SPECIALIZATION</p>
        <span className="font-mono text-[10px] tracking-widest text-zinc-500 uppercase">
          {isSectionHovered ? "AUTOMATIC FAST MOTION ACTIVE" : "HOVER TO ACCELERATE MARQUEE"}
        </span>
      </motion.div>

      {/* Marquee Rows */}
      <div className="space-y-4">
        <MarqueeRow items={techItems} direction="left" isAccelerated={isSectionHovered} />
        <MarqueeRow items={concepts} direction="right" isAccelerated={isSectionHovered} />
      </div>
    </section>
  )
}
