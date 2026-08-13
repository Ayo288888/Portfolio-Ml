"use client"

import { useEffect, useState, useRef } from "react"
import { motion } from "framer-motion"

interface Point {
  x: number
  y: number
}

export function CustomCursor() {
  const [position, setPosition] = useState<Point>({ x: -100, y: -100 })
  const [trail, setTrail] = useState<Point[]>([])
  const [isHovering, setIsHovering] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const requestRef = useRef<number | null>(null)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const newPoint = { x: e.clientX, y: e.clientY }
      setPosition(newPoint)
      if (!isVisible) setIsVisible(true)

      setTrail((prev) => {
        const updated = [newPoint, ...prev.slice(0, 16)]
        return updated
      })
    }

    const handleMouseEnter = () => setIsVisible(true)
    const handleMouseLeave = () => setIsVisible(false)

    const handleHoverStart = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (target.closest("a, button, [role='button'], input, [data-cursor-hover]")) {
        setIsHovering(true)
      }
    }

    const handleHoverEnd = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (target.closest("a, button, [role='button'], input, [data-cursor-hover]")) {
        setIsHovering(false)
      }
    }

    window.addEventListener("mousemove", handleMouseMove)
    document.addEventListener("mouseenter", handleMouseEnter)
    document.addEventListener("mouseleave", handleMouseLeave)
    document.addEventListener("mouseover", handleHoverStart)
    document.addEventListener("mouseout", handleHoverEnd)

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseenter", handleMouseEnter)
      document.removeEventListener("mouseleave", handleMouseLeave)
      document.removeEventListener("mouseover", handleHoverStart)
      document.removeEventListener("mouseout", handleHoverEnd)
      if (requestRef.current) cancelAnimationFrame(requestRef.current)
    }
  }, [isVisible])

  // Construct a smooth Catmull-Rom / Quad Bezier SVG path string from trail points
  const getSvgPathString = () => {
    if (trail.length < 2) return ""
    let path = `M ${trail[0].x} ${trail[0].y}`
    for (let i = 1; i < trail.length - 1; i++) {
      const xc = (trail[i].x + trail[i + 1].x) / 2
      const yc = (trail[i].y + trail[i + 1].y) / 2
      path += ` Q ${trail[i].x} ${trail[i].y}, ${xc} ${yc}`
    }
    return path
  }

  if (!isVisible) return null

  return (
    <>
      {/* Fluid SVG Line Ribbon Trail */}
      <svg className="fixed inset-0 pointer-events-none z-[99997] w-full h-full">
        <defs>
          <linearGradient id="cursorTrailGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#e4e4e7" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
          </linearGradient>
          <filter id="trailGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="1.5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>
        <path
          d={getSvgPathString()}
          fill="none"
          stroke="url(#cursorTrailGradient)"
          strokeWidth={isHovering ? "3" : "2"}
          strokeLinecap="round"
          strokeLinejoin="round"
          filter="url(#trailGlow)"
        />
      </svg>

      {/* Core Precision Dot */}
      <motion.div
        className="fixed top-0 left-0 w-2.5 h-2.5 bg-white rounded-full pointer-events-none z-[99999] shadow-[0_0_10px_rgba(255,255,255,0.9)]"
        animate={{
          x: position.x - 5,
          y: position.y - 5,
          scale: isHovering ? 0.5 : 1,
          opacity: isVisible ? 1 : 0,
        }}
        transition={{ type: "spring", stiffness: 1200, damping: 40, mass: 0.1 }}
      />

      {/* Trailing Interactive Glass Ring */}
      <motion.div
        className="fixed top-0 left-0 w-9 h-9 border border-white/50 rounded-full pointer-events-none z-[99998] bg-white/[0.03] backdrop-blur-[1px]"
        animate={{
          x: position.x - 18,
          y: position.y - 18,
          scale: isHovering ? 1.5 : 1,
          borderColor: isHovering ? "rgba(255, 255, 255, 0.9)" : "rgba(255, 255, 255, 0.4)",
          opacity: isVisible ? 1 : 0,
        }}
        transition={{ type: "spring", stiffness: 450, damping: 25, mass: 0.4 }}
      />
    </>
  )
}
