"use client"

import { useEffect, useState, useRef } from "react"
import { motion } from "framer-motion"

interface Spark {
  id: number
  x: number
  y: number
  vx: number
  vy: number
  size: number
  alpha: number
  maxAlpha: number
}

export function CustomCursor() {
  const [position, setPosition] = useState({ x: -100, y: -100 })
  const [isHovering, setIsHovering] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const [isTouchDevice, setIsTouchDevice] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const sparksRef = useRef<Spark[]>([])
  const animFrameRef = useRef<number | null>(null)
  const sparkIdCounter = useRef(0)

  useEffect(() => {
    // Detect touch device
    if (typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches) {
      setIsTouchDevice(true)
      return
    }

    const handleMouseMove = (e: MouseEvent) => {
      const x = e.clientX
      const y = e.clientY
      setPosition({ x, y })
      if (!isVisible) setIsVisible(true)

      // Spawn stardust sparks on mouse movement
      const count = isHovering ? 4 : 2
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2
        const speed = 0.4 + Math.random() * 1.6
        sparksRef.current.push({
          id: sparkIdCounter.current++,
          x: x + (Math.random() - 0.5) * 6,
          y: y + (Math.random() - 0.5) * 6,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed + 0.2,
          size: 1.2 + Math.random() * 2.2,
          alpha: 0.8 + Math.random() * 0.2,
          maxAlpha: 0.8 + Math.random() * 0.2,
        })
      }

      if (sparksRef.current.length > 80) {
        sparksRef.current = sparksRef.current.slice(-80)
      }
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
    }
  }, [isVisible, isHovering])

  // Canvas render loop for stardust micro-sparks
  useEffect(() => {
    if (isTouchDevice) return

    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener("resize", resize)

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      for (let i = sparksRef.current.length - 1; i >= 0; i--) {
        const s = sparksRef.current[i]
        s.x += s.vx
        s.y += s.vy
        s.vx *= 0.95
        s.vy *= 0.95
        s.alpha -= 0.022

        if (s.alpha <= 0) {
          sparksRef.current.splice(i, 1)
          continue
        }

        ctx.save()
        ctx.beginPath()
        ctx.arc(s.x, s.y, s.size * (s.alpha / s.maxAlpha), 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255, 255, 255, ${s.alpha})`
        ctx.shadowColor = "#ffffff"
        ctx.shadowBlur = s.size * 3
        ctx.fill()
        ctx.restore()
      }

      animFrameRef.current = requestAnimationFrame(render)
    }

    render()

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current)
      window.removeEventListener("resize", resize)
    }
  }, [isTouchDevice])

  if (isTouchDevice || !isVisible) return null

  return (
    <>
      {/* Bioluminescent Stardust Burst Canvas */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none z-[99997] w-full h-full hidden md:block"
      />

      {/* Core Precision Dot */}
      <motion.div
        className="fixed top-0 left-0 w-2.5 h-2.5 bg-white rounded-full pointer-events-none z-[99999] shadow-[0_0_10px_rgba(255,255,255,0.9)] hidden md:block"
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
        className="fixed top-0 left-0 w-9 h-9 border border-white/50 rounded-full pointer-events-none z-[99998] bg-white/[0.03] backdrop-blur-[1px] hidden md:block"
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
