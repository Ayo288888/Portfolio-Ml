"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence, useScroll, useSpring } from "framer-motion"
import { ArrowUpRight, Github, ExternalLink, X, Sparkles, Filter, Layers, Cpu, Code } from "lucide-react"
import { PROJECTS, type Project } from "@/lib/projects-data"

const categories = ["All", "AI & NLP", "Security", "Computer Vision", "Full-Stack"] as const

export function BranchWorks() {
  const [selectedCategory, setSelectedCategory] = useState<string>("All")
  const [activeProject, setActiveProject] = useState<Project | null>(null)
  const [hoveredId, setHoveredId] = useState<string | null>(null)
  const [mousePos, setMousePos] = useState<{ x: number; y: number }>({ x: 0, y: 0 })

  const sectionRef = useRef<HTMLDivElement>(null)
  const treeContainerRef = useRef<HTMLDivElement>(null)
  const windingPathRef = useRef<SVGPathElement>(null)

  // Scroll progress for drawing the organic SVG trunk & branches
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  })

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  })

  const handleMouseMove = (e: React.MouseEvent) => {
    setMousePos({ x: e.clientX, y: e.clientY })
  }

  // Handle Escape key to close drawer
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setActiveProject(null)
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])

  return (
    <section
      ref={sectionRef}
      onMouseMove={handleMouseMove}
      className="relative min-h-screen pt-32 pb-36 px-6 md:px-12 bg-background text-foreground overflow-hidden"
    >
      {/* Background Ambient Monochromatic Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-white/[0.03] rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute bottom-1/3 right-10 w-[400px] h-[400px] bg-white/[0.02] rounded-full blur-[140px] pointer-events-none" />

      {/* Header */}
      <div className="max-w-6xl mx-auto mb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-white/10"
        >
          <div>
            <div className="flex items-center gap-2 font-mono text-xs tracking-[0.3em] text-zinc-400 mb-3 uppercase">
              <Sparkles className="w-3.5 h-3.5 text-white" />
              <span>04 — PORTFOLIO ARBOR</span>
            </div>
            <h1 className="font-sans text-4xl md:text-6xl lg:text-7xl font-light tracking-tight">
              Selected <span className="italic font-normal">Works & Branches</span>
            </h1>
          </div>
          <p className="font-mono text-xs text-muted-foreground max-w-sm leading-relaxed">
            Scroll down to explore project leaves growing off the central serpentine branch network. Click any node to inspect system details.
          </p>
        </motion.div>

        {/* Category Filters */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex flex-wrap items-center gap-2 pt-6"
        >
          <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground mr-2">
            <Filter className="w-3.5 h-3.5" />
            <span>FILTER BY:</span>
          </div>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`font-mono text-xs px-4 py-1.5 rounded-full border transition-all duration-300 ${
                selectedCategory === cat
                  ? "bg-white text-black border-white shadow-[0_0_20px_rgba(255,255,255,0.2)] font-semibold"
                  : "border-white/10 text-muted-foreground hover:border-white/30 hover:text-white"
              }`}
            >
              {cat}
            </button>
          ))}
        </motion.div>
      </div>

      {/* Main Organic Tree Container */}
      <div ref={treeContainerRef} className="relative max-w-6xl mx-auto py-12">
        {/* Serpentine Organic SVG Tree Trunk Path (Desktop & Mobile) */}
        <div className="absolute inset-0 pointer-events-none z-0">
          <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 1000 2400">
            <defs>
              <linearGradient id="trunkGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
                <stop offset="50%" stopColor="#e4e4e7" stopOpacity="0.85" />
                <stop offset="100%" stopColor="#71717a" stopOpacity="0.6" />
              </linearGradient>
              <filter id="whiteGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* Background Faint Guide Path */}
            <path
              d="M 500 0 C 250 150, 220 300, 240 380 C 270 480, 750 500, 760 680 C 770 820, 220 850, 240 980 C 260 1120, 750 1150, 760 1280 C 770 1420, 220 1450, 240 1580 C 260 1720, 750 1750, 760 1880 C 770 2020, 220 2050, 240 2180 C 260 2300, 500 2380, 500 2400"
              fill="none"
              stroke="rgba(255,255,255,0.15)"
              strokeWidth="2"
              strokeDasharray="6 6"
            />

            {/* Scroll-Driven Winding Organic Serpentine Trunk Line */}
            <motion.path
              ref={windingPathRef}
              d="M 500 0 C 250 150, 220 300, 240 380 C 270 480, 750 500, 760 680 C 770 820, 220 850, 240 980 C 260 1120, 750 1150, 760 1280 C 770 1420, 220 1450, 240 1580 C 260 1720, 750 1750, 760 1880 C 770 2020, 220 2050, 240 2180 C 260 2300, 500 2380, 500 2400"
              fill="none"
              stroke="url(#trunkGradient)"
              strokeWidth="4.5"
              filter="url(#whiteGlow)"
              style={{
                pathLength: smoothProgress,
              }}
            />
          </svg>
        </div>

        {/* Tree Nodes List */}
        <div className="relative z-10 flex flex-col gap-24 md:gap-32">
          {PROJECTS.map((project, index) => {
            const isLeft = index % 2 === 0
            const isHovered = hoveredId === project.id
            const isFilteredOut = selectedCategory !== "All" && project.category !== selectedCategory

            return (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.7, delay: index * 0.1 }}
                className={`relative flex flex-col md:flex-row items-center justify-between gap-8 transition-opacity duration-500 ${
                  isFilteredOut ? "opacity-20 grayscale pointer-events-none" : "opacity-100"
                }`}
                onMouseEnter={() => setHoveredId(project.id)}
                onMouseLeave={() => setHoveredId(null)}
              >
                {/* Branch Connector Apex Node (Desktop) */}
                <div
                  className={`absolute top-1/2 -translate-y-1/2 hidden md:flex items-center justify-center z-20 ${
                    isLeft ? "left-[24%]" : "right-[24%]"
                  }`}
                >
                  <motion.button
                    onClick={() => setActiveProject(project)}
                    animate={{
                      scale: isHovered ? 1.3 : 1,
                    }}
                    transition={{ type: "spring", stiffness: 300 }}
                    className="relative w-6 h-6 rounded-full bg-background border-2 border-white flex items-center justify-center cursor-pointer shadow-[0_0_15px_rgba(255,255,255,0.4)] group"
                  >
                    <span className="w-2 h-2 rounded-full bg-white group-hover:bg-zinc-200 transition-colors" />
                  </motion.button>
                </div>

                {/* Left Side Content (Desktop: Alternate) */}
                <div
                  className={`w-full md:w-[45%] pl-12 md:pl-0 ${
                    isLeft ? "md:text-right md:order-1" : "md:order-3"
                  }`}
                >
                  <div
                    onClick={() => setActiveProject(project)}
                    className="group relative p-6 md:p-8 rounded-2xl border border-white/10 bg-white/[0.02] hover:bg-white/[0.05] backdrop-blur-md transition-all duration-500 cursor-pointer shadow-lg hover:border-white/40 hover:shadow-[0_0_30px_rgba(255,255,255,0.08)]"
                  >
                    {/* Mobile Leaf Dot */}
                    <div className="absolute -left-9 top-8 md:hidden flex items-center justify-center">
                      <span className="w-4 h-4 rounded-full border-2 border-white bg-background flex items-center justify-center">
                        <span className="w-1.5 h-1.5 rounded-full bg-white" />
                      </span>
                    </div>

                    {/* Meta info header */}
                    <div
                      className={`flex items-center gap-3 font-mono text-[11px] text-muted-foreground mb-3 ${
                        isLeft ? "md:justify-end" : "justify-start"
                      }`}
                    >
                      <span className="px-2.5 py-0.5 rounded-full border border-white/15 bg-white/10 text-white font-medium">
                        {project.year}
                      </span>
                      <span>•</span>
                      <span className="tracking-wider uppercase text-zinc-400">{project.category}</span>
                    </div>

                    {/* Title */}
                    <h3 className="font-sans text-2xl md:text-3xl font-light text-foreground group-hover:text-white transition-colors mb-2">
                      {project.title}
                    </h3>

                    {/* Subtitle */}
                    <p className="font-mono text-xs text-muted-foreground mb-4 line-clamp-2 leading-relaxed">
                      {project.subtitle}
                    </p>

                    {/* Tech Tags */}
                    <div
                      className={`flex flex-wrap gap-1.5 ${
                        isLeft ? "md:justify-end" : "justify-start"
                      }`}
                    >
                      {project.tags.map((tag) => (
                        <span
                          key={tag}
                          className="font-mono text-[10px] tracking-wider px-2.5 py-1 rounded-md border border-white/10 bg-black/40 text-muted-foreground group-hover:border-white/20 transition-colors"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* Action Indicator */}
                    <div
                      className={`mt-6 pt-4 border-t border-white/10 flex items-center gap-2 font-mono text-[11px] text-zinc-300 font-medium group-hover:text-white transition-colors ${
                        isLeft ? "md:justify-end" : "justify-start"
                      }`}
                    >
                      <span>INSPECT PROJECT LEAF</span>
                      <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </div>
                  </div>
                </div>

                {/* Right Side Empty Spacer for Grid Alignment (Desktop) */}
                <div className={`hidden md:block w-full md:w-[45%] ${isLeft ? "md:order-3" : "md:order-1"}`} />
              </motion.div>
            )
          })}
        </div>
      </div>

      {/* Floating Mouse Cursor Image Tooltip Preview */}
      <AnimatePresence>
        {hoveredId && !activeProject && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.15 }}
            className="fixed pointer-events-none z-50 hidden lg:block w-72 h-44 rounded-xl border border-white/20 bg-black/90 backdrop-blur-xl shadow-2xl overflow-hidden"
            style={{
              left: mousePos.x + 20,
              top: mousePos.y - 90,
            }}
          >
            {(() => {
              const proj = PROJECTS.find((p) => p.id === hoveredId)
              if (!proj) return null
              return (
                <div className="relative w-full h-full">
                  <img
                    src={proj.image}
                    alt={proj.title}
                    className="w-full h-full object-cover object-top"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent p-4 flex flex-col justify-end">
                    <span className="font-mono text-[10px] text-zinc-400 uppercase tracking-widest">{proj.category}</span>
                    <h4 className="font-sans text-sm font-medium text-white truncate">{proj.title}</h4>
                  </div>
                </div>
              )
            })()}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Slide-Over Detail Drawer (Modal) */}
      <AnimatePresence>
        {activeProject && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveProject(null)}
              className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md"
            />

            {/* Right Slide-Over Panel */}
            <motion.aside
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 z-50 w-full max-w-2xl h-full bg-[#09090b]/95 border-l border-white/15 backdrop-blur-2xl shadow-2xl overflow-y-auto flex flex-col justify-between"
            >
              <div>
                {/* Header */}
                <div className="sticky top-0 z-20 flex items-center justify-between px-8 py-6 bg-[#09090b]/80 backdrop-blur-md border-b border-white/10">
                  <div className="flex items-center gap-3 font-mono text-xs">
                    <span className="px-3 py-1 rounded-full border border-white/20 bg-white/10 text-white font-medium">
                      LEAF NODE #{activeProject.id.toUpperCase()}
                    </span>
                    <span className="text-muted-foreground">{activeProject.year}</span>
                  </div>
                  <button
                    onClick={() => setActiveProject(null)}
                    className="p-2 rounded-full border border-white/10 hover:border-white/30 text-muted-foreground hover:text-white transition-colors"
                    aria-label="Close drawer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Banner Image */}
                <div className="relative w-full h-64 md:h-80 overflow-hidden bg-black border-b border-white/10">
                  <img
                    src={activeProject.image}
                    alt={activeProject.title}
                    className="w-full h-full object-cover object-top"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#09090b] via-transparent to-black/30" />
                  {activeProject.metrics && (
                    <div className="absolute bottom-4 left-8 bg-black/90 border border-white/20 backdrop-blur-md px-3.5 py-1.5 rounded-full font-mono text-xs text-zinc-200 flex items-center gap-2 shadow-lg">
                      <Sparkles className="w-3.5 h-3.5 text-white" />
                      <span>{activeProject.metrics}</span>
                    </div>
                  )}
                </div>

                {/* Content Details */}
                <div className="px-8 py-8 space-y-8">
                  {/* Title & Category */}
                  <div>
                    <span className="font-mono text-xs tracking-widest uppercase text-zinc-400 mb-2 block">
                      {activeProject.category}
                    </span>
                    <h2 className="font-sans text-3xl md:text-4xl font-light tracking-tight text-white mb-2">
                      {activeProject.title}
                    </h2>
                    <p className="font-mono text-sm text-zinc-400">{activeProject.subtitle}</p>
                  </div>

                  {/* Description */}
                  <div className="space-y-3">
                    <h4 className="font-mono text-xs tracking-wider uppercase text-muted-foreground flex items-center gap-2">
                      <Layers className="w-3.5 h-3.5 text-white" />
                      <span>System Overview</span>
                    </h4>
                    <p className="font-sans text-base leading-relaxed text-zinc-300 font-light">
                      {activeProject.description}
                    </p>
                  </div>

                  {/* Architecture Breakdown */}
                  <div className="space-y-4">
                    <h4 className="font-mono text-xs tracking-wider uppercase text-muted-foreground flex items-center gap-2">
                      <Cpu className="w-3.5 h-3.5 text-white" />
                      <span>Architectural Highlights</span>
                    </h4>
                    <div className="grid grid-cols-1 gap-2.5">
                      {activeProject.architecture.map((item, idx) => (
                        <div
                          key={idx}
                          className="flex items-start gap-3 p-3.5 rounded-xl border border-white/10 bg-white/[0.02]"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-white mt-2 flex-shrink-0" />
                          <span className="font-mono text-xs text-zinc-300 leading-relaxed">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Technologies */}
                  <div className="space-y-3">
                    <h4 className="font-mono text-xs tracking-wider uppercase text-muted-foreground flex items-center gap-2">
                      <Code className="w-3.5 h-3.5 text-white" />
                      <span>Tech Stack & Libraries</span>
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {activeProject.tags.map((tag) => (
                        <span
                          key={tag}
                          className="font-mono text-xs px-3 py-1.5 rounded-lg border border-white/15 bg-white/5 text-zinc-200"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Drawer Footer Actions */}
              <div className="sticky bottom-0 z-20 px-8 py-6 bg-[#09090b]/90 backdrop-blur-md border-t border-white/10 flex flex-wrap items-center gap-4">
                {activeProject.href && (
                  <a
                    href={activeProject.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-white text-black font-mono text-xs font-semibold tracking-wider hover:bg-zinc-200 transition-colors shadow-[0_0_25px_rgba(255,255,255,0.15)]"
                  >
                    <span>LAUNCH LIVE SITE</span>
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}
                {activeProject.github && (
                  <a
                    href={activeProject.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl border border-white/20 bg-white/5 text-white font-mono text-xs font-semibold tracking-wider hover:border-white/40 transition-colors"
                  >
                    <span>VIEW REPOSITORY</span>
                    <Github className="w-4 h-4" />
                  </a>
                )}
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </section>
  )
}
