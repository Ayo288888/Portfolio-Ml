"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"

const navLinks = [
  { label: "About", href: "/#about", targetId: "about" },
  { label: "Works", href: "/works", targetId: "works" },
  { label: "Contact", href: "/contact", targetId: "contact" },
]

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handleNavClick = (link: (typeof navLinks)[number]) => {
    setIsMenuOpen(false)

    if (link.href === "/works") {
      if (pathname === "/works") {
        window.scrollTo({ top: 0, behavior: "smooth" })
      } else {
        router.push("/works")
      }
      return
    }

    if (link.href === "/contact") {
      if (pathname === "/contact") {
        window.scrollTo({ top: 0, behavior: "smooth" })
      } else {
        router.push("/contact")
      }
      return
    }

    if (pathname === "/") {
      const el = document.getElementById(link.targetId)
      if (el) {
        el.scrollIntoView({ behavior: "smooth" })
        return
      }
    }

    router.push(link.href)
  }

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled ? "bg-background/80 backdrop-blur-md border-b border-border" : ""
        }`}
      >
        <nav className="flex items-center justify-between px-6 py-4 my-0 md:px-12 md:py-5">
          {/* Logo */}
          <Link
            href="/"
            onClick={(e) => {
              if (pathname === "/") {
                e.preventDefault()
                window.scrollTo({ top: 0, behavior: "smooth" })
              }
            }}
            className="group flex items-center gap-2"
          >
            <span className="font-mono text-xs tracking-widest text-muted-foreground">ILORI AYOMIDE</span>
            <span className="w-1.5 h-1.5 rounded-full bg-accent group-hover:scale-150 transition-transform duration-300" />
          </Link>

          {/* Desktop Navigation */}
          <ul className="hidden md:flex items-center gap-8 absolute left-1/2 -translate-x-1/2">
            {navLinks.map((link, index) => (
              <li key={link.label}>
                <button
                  onClick={() => handleNavClick(link)}
                  className={`group relative font-mono text-xs tracking-wider transition-colors duration-300 ${
                    pathname === link.href ? "text-white font-medium" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <span className="text-accent mr-1">0{index + 1}</span>
                  {link.label.toUpperCase()}
                  <span className="absolute -bottom-1 left-0 w-0 h-px bg-foreground group-hover:w-full transition-all duration-300" />
                </button>
              </li>
            ))}
          </ul>

          {/* Status Indicator */}
          <div className="hidden md:flex items-center gap-3">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-accent" />
            </span>
            <span className="font-mono text-xs tracking-wider text-muted-foreground">AVAILABLE FOR WORK</span>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden relative z-[101] w-10 h-10 flex flex-col items-center justify-center gap-1.5 p-2 rounded-lg border border-white/10 bg-black/40 backdrop-blur-md"
            aria-label="Toggle menu"
          >
            <motion.span
              animate={isMenuOpen ? { rotate: 45, y: 3.5 } : { rotate: 0, y: 0 }}
              className="w-5 h-0.5 bg-foreground origin-center"
            />
            <motion.span
              animate={isMenuOpen ? { opacity: 0, x: -10 } : { opacity: 1, x: 0 }}
              className="w-5 h-0.5 bg-foreground"
            />
            <motion.span
              animate={isMenuOpen ? { rotate: -45, y: -3.5 } : { rotate: 0, y: 0 }}
              className="w-5 h-0.5 bg-foreground origin-center"
            />
          </button>
        </nav>
      </motion.header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[100] bg-background/98 backdrop-blur-2xl md:hidden"
          >
            <nav className="flex flex-col items-center justify-center h-full gap-8 px-6">
              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ delay: 0.05 }}
                onClick={() => {
                  setIsMenuOpen(false)
                  if (pathname === "/") {
                    window.scrollTo({ top: 0, behavior: "smooth" })
                  } else {
                    router.push("/")
                  }
                }}
                className="group text-4xl font-sans tracking-tight text-foreground flex items-center"
              >
                <span className="text-accent font-mono text-sm mr-3">00</span>
                <span>Home</span>
              </motion.button>

              {navLinks.map((link, index) => (
                <motion.button
                  key={link.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ delay: (index + 1) * 0.08 }}
                  onClick={() => handleNavClick(link)}
                  className="group text-4xl font-sans tracking-tight text-foreground flex items-center"
                >
                  <span className="text-accent font-mono text-sm mr-3">0{index + 1}</span>
                  <span>{link.label}</span>
                </motion.button>
              ))}

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="flex items-center gap-3 mt-12 p-3 px-5 rounded-full border border-white/10 bg-white/5"
              >
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                </span>
                <span className="font-mono text-xs tracking-wider text-muted-foreground">AVAILABLE FOR WORK</span>
              </motion.div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
