"use client";

import React, { useState, useRef, useCallback, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight, Sparkles } from "lucide-react";
import { Project } from "@/data/projects";

export interface LeafNodeProps {
  project: Project;
  /** Absolute X coordinate (px or percentage string) relative to tree container */
  x: number | string;
  /** Absolute Y coordinate (px or percentage string) relative to tree container */
  y: number | string;
  /** Controls visibility based on scroll progress resolving terminal branch */
  isVisible?: boolean;
  /** Whether project detail drawer is currently open for this node */
  isSelected?: boolean;
  /** Callback to trigger project selection & detail drawer */
  onSelect: (project: Project) => void;
  /** Optional container class overrides */
  className?: string;
}

interface TooltipPosition {
  vertical: "above" | "below";
  horizontal: "center" | "left" | "right";
}

export function LeafNode({
  project,
  x,
  y,
  isVisible = true,
  isSelected = false,
  onSelect,
  className = "",
}: LeafNodeProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [position, setPosition] = useState<TooltipPosition>({
    vertical: "above",
    horizontal: "center",
  });
  const nodeRef = useRef<HTMLButtonElement>(null);

  // Viewport Edge Collision Detection Logic
  const updateTooltipPosition = useCallback(() => {
    if (!nodeRef.current) return;
    const rect = nodeRef.current.getBoundingClientRect();
    const vw = window.innerWidth;
    const tooltipWidth = 320;
    const tooltipHeight = 270;
    const margin = 16;

    const vertical: "above" | "below" =
      rect.top < tooltipHeight + margin ? "below" : "above";

    let horizontal: "center" | "left" | "right" = "center";
    if (rect.left - tooltipWidth / 2 < margin) {
      horizontal = "left";
    } else if (rect.right + tooltipWidth / 2 > vw - margin) {
      horizontal = "right";
    }

    setPosition({ vertical, horizontal });
  }, []);

  const handleMouseEnter = () => {
    updateTooltipPosition();
    setIsHovered(true);
  };

  const handleFocus = () => {
    updateTooltipPosition();
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const handleBlur = () => {
    setIsHovered(false);
  };

  // Close tooltip preview on Escape key press
  useEffect(() => {
    if (!isHovered) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsHovered(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isHovered]);

  const leftStyle = typeof x === "number" ? `${x}px` : x;
  const topStyle = typeof y === "number" ? `${y}px` : y;
  const accentColor = project.leafConfig?.accentColor || "#3b82f6";

  // Calculate dynamic classes for tooltip placement
  const getPositionClasses = () => {
    let classes = "absolute z-50 pointer-events-none ";
    if (position.vertical === "above") {
      classes += "bottom-full mb-3 ";
    } else {
      classes += "top-full mt-3 ";
    }

    if (position.horizontal === "center") {
      classes += "left-1/2 -translate-x-1/2 ";
    } else if (position.horizontal === "left") {
      classes += "left-0 translate-x-0 ";
    } else {
      classes += "right-0 translate-x-0 ";
    }

    return classes;
  };

  return (
    <div
      className={`absolute ${className}`}
      style={{
        left: leftStyle,
        top: topStyle,
        transform: "translate(-50%, -50%)",
        pointerEvents: isVisible ? "auto" : "none",
        opacity: isVisible ? 1 : 0,
        transition: "opacity 0.3s ease-out, transform 0.3s ease-out",
      }}
    >
      {/* Accessible Interactive Leaf Node Button */}
      <button
        ref={nodeRef}
        type="button"
        tabIndex={isVisible ? 0 : -1}
        onClick={() => onSelect(project)}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onKeyDown={(e) => {
          if (e.key === "Escape") {
            setIsHovered(false);
          }
        }}
        aria-label={`View project details for ${project.title}`}
        aria-expanded={isSelected}
        aria-describedby={isHovered ? `tooltip-${project.id}` : undefined}
        className="relative group flex items-center justify-center w-8 h-8 rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 cursor-pointer"
        style={{
          boxShadow: isHovered || isSelected ? `0 0 18px ${accentColor}` : "none",
        }}
      >
        {/* Bioluminescent Outer Pulse Ring */}
        <motion.span
          className="absolute inset-0 rounded-full blur-[2px] pointer-events-none"
          style={{ backgroundColor: accentColor }}
          animate={{
            scale: isHovered || isSelected ? [1.2, 1.8, 1.2] : [1, 1.5, 1],
            opacity: isHovered || isSelected ? [0.8, 0.35, 0.8] : [0.5, 0.15, 0.5],
          }}
          transition={{
            duration: isHovered || isSelected ? 1.5 : 2.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Outer Border Ring */}
        <span
          className={`absolute inset-0 rounded-full border transition-all duration-300 ${
            isSelected || isHovered
              ? "border-white scale-110"
              : "border-white/40 group-hover:border-white/80"
          }`}
          style={{
            borderColor: isSelected || isHovered ? accentColor : undefined,
          }}
        />

        {/* Core Node Dot */}
        <span
          className="w-3.5 h-3.5 rounded-full transition-transform duration-300 group-hover:scale-125 shadow-inner"
          style={{ backgroundColor: accentColor }}
        />
      </button>

      {/* Framer Motion Hover Preview Tooltip Card */}
      <AnimatePresence>
        {isHovered && isVisible && (
          <motion.div
            id={`tooltip-${project.id}`}
            role="tooltip"
            initial={{
              opacity: 0,
              scale: 0.9,
              y: position.vertical === "above" ? 8 : -8,
            }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{
              opacity: 0,
              scale: 0.95,
              y: position.vertical === "above" ? 4 : -4,
            }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className={getPositionClasses()}
          >
            <div className="w-72 sm:w-80 rounded-xl bg-slate-950/90 backdrop-blur-md border border-slate-800 shadow-2xl p-4 text-slate-100 overflow-hidden relative group text-left">
              {/* Accent Color Header Line */}
              <div
                className="absolute top-0 left-0 right-0 h-1"
                style={{ backgroundColor: accentColor }}
              />

              {/* Category & Year */}
              <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5 font-mono">
                <span className="uppercase tracking-wider text-[10px] font-semibold text-slate-300">
                  {project.category}
                </span>
                <span className="bg-slate-800/80 px-2 py-0.5 rounded text-[10px] border border-slate-700/50">
                  {project.year}
                </span>
              </div>

              {/* Title */}
              <h3 className="text-sm font-semibold text-slate-100 line-clamp-1 mb-2">
                {project.title}
              </h3>

              {/* Thumbnail Image Preview */}
              <div className="relative w-full aspect-video rounded-lg overflow-hidden border border-white/10 mb-3 bg-slate-900">
                {!imageError ? (
                  <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 640px) 280px, 320px"
                    onError={() => setImageError(true)}
                  />
                ) : (
                  <div
                    className="w-full h-full flex flex-col items-center justify-center p-3 text-center"
                    style={{
                      background: `radial-gradient(circle at center, ${accentColor}30 0%, #09090b 100%)`,
                    }}
                  >
                    <Sparkles
                      className="w-6 h-6 mb-1 opacity-70"
                      style={{ color: accentColor }}
                    />
                    <span className="text-[11px] font-mono text-slate-300">
                      {project.title}
                    </span>
                  </div>
                )}
              </div>

              {/* Short Description */}
              <p className="text-xs text-slate-300 line-clamp-2 mb-3 leading-relaxed">
                {project.shortDescription}
              </p>

              {/* Primary Tags & Prompt */}
              <div className="flex items-center justify-between border-t border-slate-800/80 pt-2.5 mt-1">
                <div className="flex flex-wrap gap-1">
                  {project.tags.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-800/80 text-slate-300 border border-slate-700/50"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <span className="text-[10px] font-mono text-slate-400 flex items-center gap-0.5 group-hover:text-white transition-colors">
                  Details <ArrowUpRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
