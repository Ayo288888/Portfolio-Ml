"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowUpRight, ExternalLink } from "lucide-react"

export function Footer() {
  const [time, setTime] = useState("")
  const [isCollabHovered, setIsCollabHovered] = useState(false)
  const [isFrontendHovered, setIsFrontendHovered] = useState(false)

  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      const hours = now.getHours().toString().padStart(2, "0")
      const minutes = now.getMinutes().toString().padStart(2, "0")
      const seconds = now.getSeconds().toString().padStart(2, "0")
      const milliseconds = now.getMilliseconds().toString().padStart(3, "0")
      setTime(`${hours}:${minutes}:${seconds}.${milliseconds}`)
    }

    updateTime()
    const interval = setInterval(updateTime, 10)
    return () => clearInterval(interval)
  }, [])

  return (
    <footer id="contact" className="relative bg-[#050505] border-t border-white/10">
      {/* Primary CTA 1: Let's Collaborate (Links to /contact) */}
      <Link
        href="/contact"
        data-cursor-hover
        className="relative block overflow-hidden border-b border-white/10"
        onMouseEnter={() => setIsCollabHovered(true)}
        onMouseLeave={() => setIsCollabHovered(false)}
      >
        {/* Background Curtain */}
        <motion.div
          className="absolute inset-0 bg-[#2563eb]"
          initial={{ y: "100%" }}
          animate={{ y: isCollabHovered ? "0%" : "100%" }}
          transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
        />

        {/* Content */}
        <div className="relative py-16 md:py-24 px-8 md:px-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div>
              <p className="font-mono text-xs tracking-[0.3em] text-muted-foreground mb-3 uppercase">06 — GET IN TOUCH</p>
              <motion.h2
                className="font-sans text-4xl md:text-6xl lg:text-7xl font-light tracking-tight text-center md:text-left"
                animate={{
                  color: isCollabHovered ? "#050505" : "#fafafa",
                }}
                transition={{ duration: 0.3 }}
              >
                Let's <span className="italic">Collaborate</span>
              </motion.h2>
            </div>

            <motion.div
              animate={{
                rotate: isCollabHovered ? 45 : 0,
                color: isCollabHovered ? "#050505" : "#fafafa",
              }}
              transition={{ duration: 0.3 }}
            >
              <ArrowUpRight className="w-12 h-12 md:w-16 md:h-16" />
            </motion.div>
          </div>
        </div>
      </Link>

      {/* Secondary CTA 2: View My Frontend Portfolio */}
      <a
        href="https://portfoliowebsite-pi-two.vercel.app/"
        target="_blank"
        rel="noopener noreferrer"
        data-cursor-hover
        className="relative block overflow-hidden border-b border-white/10"
        onMouseEnter={() => setIsFrontendHovered(true)}
        onMouseLeave={() => setIsFrontendHovered(false)}
      >
        {/* Background Curtain */}
        <motion.div
          className="absolute inset-0 bg-white"
          initial={{ y: "100%" }}
          animate={{ y: isFrontendHovered ? "0%" : "100%" }}
          transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
        />

        {/* Content */}
        <div className="relative py-14 md:py-20 px-8 md:px-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div>
              <p className="font-mono text-xs tracking-[0.3em] text-muted-foreground mb-3 uppercase">07 — EXPLORE MORE</p>
              <motion.h3
                className="font-sans text-3xl md:text-5xl lg:text-6xl font-light tracking-tight text-center md:text-left"
                animate={{
                  color: isFrontendHovered ? "#050505" : "#e4e4e7",
                }}
                transition={{ duration: 0.3 }}
              >
                View My <span className="italic font-normal">Frontend Portfolio</span>
              </motion.h3>
            </div>

            <motion.div
              animate={{
                scale: isFrontendHovered ? 1.2 : 1,
                color: isFrontendHovered ? "#050505" : "#e4e4e7",
              }}
              transition={{ duration: 0.3 }}
              className="flex items-center gap-2 font-mono text-xs font-semibold uppercase tracking-wider"
            >
              <span>VISIT PORTFOLIO</span>
              <ExternalLink className="w-8 h-8 md:w-10 md:h-10" />
            </motion.div>
          </div>
        </div>
      </a>

      {/* Footer Info */}
      <div className="px-8 md:px-12 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Local Time */}
          <div className="font-mono text-xs tracking-widest text-muted-foreground">
            <span className="mr-2">LOCAL TIME</span>
            <span className="text-white tabular-nums">{time}</span>
          </div>

          {/* Links */}
          <div className="flex gap-8">
            {[
              { label: "LinkedIn", href: "https://www.linkedin.com/in/ayomide-ilori-33318a270/" },
              { label: "GitHub", href: "https://github.com/Ayo288888" },
              { label: "Frontend Site", href: "https://portfoliowebsite-pi-two.vercel.app/" },
              { label: "Email", href: "mailto:wisdomilori0@gmail.com" },
            ].map((link) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                data-cursor-hover
                className="font-mono text-xs tracking-widest text-muted-foreground hover:text-white transition-colors duration-300"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Copyright */}
          <p className="font-mono text-xs tracking-widest text-muted-foreground">© {new Date().getFullYear()} Ilori Ayomide Wisdom</p>
        </div>
      </div>
    </footer>
  )
}
