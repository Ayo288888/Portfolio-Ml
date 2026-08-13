"use client";

import React, { useEffect, useRef, useState } from "react";
import type { Project, LeafNodeConfig } from "@/data/projects";
import { cn } from "@/lib/utils";

export interface BranchTarget {
  id: string;
  title: string;
  category: string;
  leafConfig?: LeafNodeConfig;
}

export interface TerminalLeafCoord {
  id: string;
  x: number; // CSS pixel X position relative to canvas container
  y: number; // CSS pixel Y position relative to canvas container
  active: boolean; // True if current scrollProgress >= leafConfig.endScroll
  progress: number; // Local branch growth progress in [0, 1]
  accentColor: string;
  side: "left" | "right";
}

export interface WorksCanvasTreeProps {
  scrollProgress: number; // Normalized scroll progress S in [0, 1]
  projects: Project[]; // Array of project items with leafConfig from data/projects.ts
  onLeafCoordsUpdate?: (coords: TerminalLeafCoord[]) => void;
  onSelectProject?: (project: Project) => void;
  activeProjectId?: string;
  className?: string;
}

export interface Point {
  x: number;
  y: number;
}

export interface CubicBezier {
  p0: Point;
  p1: Point;
  p2: Point;
  p3: Point;
}

/**
 * Truncates a 4-point cubic Bezier curve at parameter tau in [0, 1] using the de Casteljau algorithm.
 * Returns sub-curve control points (Q0, Q1, Q2, Q3) for single-pass ctx.bezierCurveTo(...) rendering.
 */
export function truncateCubicBezier(curve: CubicBezier, tau: number): CubicBezier {
  const t = Math.max(0, Math.min(1, tau));
  const { p0, p1, p2, p3 } = curve;

  const p01 = { x: (1 - t) * p0.x + t * p1.x, y: (1 - t) * p0.y + t * p1.y };
  const p12 = { x: (1 - t) * p1.x + t * p2.x, y: (1 - t) * p1.y + t * p2.y };
  const p23 = { x: (1 - t) * p2.x + t * p3.x, y: (1 - t) * p2.y + t * p3.y };

  const p012 = { x: (1 - t) * p01.x + t * p12.x, y: (1 - t) * p01.y + t * p12.y };
  const p123 = { x: (1 - t) * p12.x + t * p23.x, y: (1 - t) * p12.y + t * p23.y };

  const p0123 = { x: (1 - t) * p012.x + t * p123.x, y: (1 - t) * p012.y + t * p123.y };

  return { p0, p1: p01, p2: p012, p3: p0123 };
}

export function WorksCanvasTree({
  scrollProgress,
  projects,
  onLeafCoordsUpdate,
  onSelectProject,
  activeProjectId,
  className,
}: WorksCanvasTreeProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [dimensions, setDimensions] = useState<{ width: number; height: number }>({
    width: 0,
    height: 0,
  });

  const smoothScrollRef = useRef<number>(scrollProgress);
  const lastEmittedCoordsRef = useRef<TerminalLeafCoord[] | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  // ResizeObserver to track container dimensions
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const updateDimensions = () => {
      const rect = container.getBoundingClientRect();
      const w = Math.floor(rect.width);
      const h = Math.floor(rect.height);
      if (w > 0 && h > 0) {
        setDimensions((prev) => (prev.width === w && prev.height === h ? prev : { width: w, height: h }));
      }
    };

    updateDimensions();

    const observer = new ResizeObserver(() => {
      updateDimensions();
    });

    observer.observe(container);

    return () => {
      observer.disconnect();
    };
  }, []);

  // Main 60fps render loop
  useEffect(() => {
    const render = (timestamp: number) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const { width, height } = dimensions;
      if (width === 0 || height === 0) {
        animationFrameRef.current = requestAnimationFrame(render);
        return;
      }

      const dpr = Math.min(typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1, 2);

      const targetCanvasWidth = Math.floor(width * dpr);
      const targetCanvasHeight = Math.floor(height * dpr);

      if (canvas.width !== targetCanvasWidth || canvas.height !== targetCanvasHeight) {
        canvas.width = targetCanvasWidth;
        canvas.height = targetCanvasHeight;
        canvas.style.width = `${width}px`;
        canvas.style.height = `${height}px`;
      }

      ctx.save();
      ctx.scale(dpr, dpr);
      ctx.clearRect(0, 0, width, height);

      // Lerp smooth scroll progress towards target prop
      smoothScrollRef.current += (scrollProgress - smoothScrollRef.current) * 0.12;
      const currentS = smoothScrollRef.current;

      const isDesktop = width >= 768;
      const X_trunk = isDesktop ? width * 0.5 : 32;

      // 1. Draw Trunk
      const trunkProgressY = Math.min(height, Math.max(40, height * (currentS * 1.05 + 0.02)));

      // Trunk Pass 1: Diffuse Ambient Glow
      ctx.save();
      ctx.globalCompositeOperation = "lighter";
      ctx.strokeStyle = "#3b82f6";
      ctx.lineWidth = isDesktop ? 5 : 3;
      ctx.shadowColor = "#3b82f6";
      ctx.shadowBlur = 12;
      ctx.beginPath();
      ctx.moveTo(X_trunk, 0);
      ctx.lineTo(X_trunk, trunkProgressY);
      ctx.stroke();
      ctx.restore();

      // Trunk Pass 2: Core White Filament
      ctx.save();
      ctx.globalCompositeOperation = "source-over";
      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = isDesktop ? 2 : 1.2;
      ctx.shadowColor = "#3b82f6";
      ctx.shadowBlur = 4;
      ctx.beginPath();
      ctx.moveTo(X_trunk, 0);
      ctx.lineTo(X_trunk, trunkProgressY);
      ctx.stroke();
      ctx.restore();

      // 2. Draw Bezier Branches and Terminal Nodes
      const timeSec = timestamp / 1000;

      projects.forEach((project, idx) => {
        const leafConfig: LeafNodeConfig = project.leafConfig || {
          startScroll: idx * 0.12,
          endScroll: idx * 0.12 + 0.11,
          side: idx % 2 === 0 ? "left" : "right",
          xOffsetPct: 30,
          yOffsetPct: (idx + 1) * 12,
          accentColor: "#3b82f6",
        };

        const startScroll = leafConfig.startScroll;
        const endScroll = leafConfig.endScroll;
        const side = leafConfig.side;
        const xOffsetPct = leafConfig.xOffsetPct;
        const yOffsetPct = leafConfig.yOffsetPct;
        const accentColor = leafConfig.accentColor || "#3b82f6";

        const sBranch = Math.max(0, Math.min(1, (currentS - startScroll) / (endScroll - startScroll)));

        if (sBranch <= 0) return; // Branch has not sprouted yet

        let X3: number;
        if (isDesktop) {
          if (side === "left") {
            X3 = X_trunk - (xOffsetPct / 100) * (width * 0.42);
          } else {
            X3 = X_trunk + (xOffsetPct / 100) * (width * 0.42);
          }
        } else {
          // Mobile mode (< 768px): left-aligned trunk X=32px, rightward branches
          const rawX3 = X_trunk + (xOffsetPct / 100) * (width - 80);
          X3 = Math.max(64, Math.min(width - 24, rawX3));
        }

        const Y3 = height * (yOffsetPct / 100);
        const X0 = X_trunk;
        const Y0 = Y3 * 0.95;

        const fullCurve: CubicBezier = {
          p0: { x: X0, y: Y0 },
          p1: { x: X0 + 0.45 * (X3 - X0), y: Y0 + 0.1 * (Y3 - Y0) },
          p2: { x: X0 + 0.8 * (X3 - X0), y: Y3 - 0.25 * (Y3 - Y0) },
          p3: { x: X3, y: Y3 },
        };

        const subCurve = truncateCubicBezier(fullCurve, sBranch);
        const { p0, p1, p2, p3 } = subCurve;

        // Branch Pass 1 (Diffuse Aura)
        ctx.save();
        ctx.globalCompositeOperation = "lighter";
        ctx.strokeStyle = accentColor;
        ctx.shadowColor = accentColor;
        ctx.shadowBlur = 16;
        ctx.lineWidth = isDesktop ? 5 : 3.5;
        ctx.beginPath();
        ctx.moveTo(p0.x, p0.y);
        ctx.bezierCurveTo(p1.x, p1.y, p2.x, p2.y, p3.x, p3.y);
        ctx.stroke();
        ctx.restore();

        // Branch Pass 2 (Crisp Core Filament)
        ctx.save();
        ctx.globalCompositeOperation = "source-over";
        ctx.strokeStyle = "#ffffff";
        ctx.shadowColor = accentColor;
        ctx.shadowBlur = 4;
        ctx.lineWidth = isDesktop ? 1.8 : 1.2;
        ctx.beginPath();
        ctx.moveTo(p0.x, p0.y);
        ctx.bezierCurveTo(p1.x, p1.y, p2.x, p2.y, p3.x, p3.y);
        ctx.stroke();
        ctx.restore();

        // Terminal Node Glow Pulse
        const isSelected = activeProjectId === project.id;
        const rBase = sBranch >= 0.99 ? (isSelected ? 9 : 7) : 5;
        const rPulse = rBase + 3 * Math.sin(2.5 * timeSec + idx * 0.8);
        const radius = Math.max(2, rPulse);
        const outerRadius = Math.max(4, radius * 2.5);

        const grad = ctx.createRadialGradient(p3.x, p3.y, 0, p3.x, p3.y, outerRadius);
        grad.addColorStop(0, "#ffffff");
        grad.addColorStop(0.3, accentColor);
        grad.addColorStop(1.0, "rgba(0, 0, 0, 0)");

        ctx.save();
        ctx.globalCompositeOperation = "lighter";
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(p3.x, p3.y, outerRadius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        // Core White Node Dot
        ctx.save();
        ctx.globalCompositeOperation = "source-over";
        ctx.fillStyle = "#ffffff";
        ctx.shadowColor = accentColor;
        ctx.shadowBlur = isSelected ? 12 : 8;
        ctx.beginPath();
        ctx.arc(p3.x, p3.y, Math.max(1.5, radius * 0.6), 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      ctx.restore();

      // Throttled onLeafCoordsUpdate callback emit
      if (onLeafCoordsUpdate) {
        const coords: TerminalLeafCoord[] = projects.map((project, idx) => {
          const leafConfig: LeafNodeConfig = project.leafConfig || {
            startScroll: idx * 0.12,
            endScroll: idx * 0.12 + 0.11,
            side: idx % 2 === 0 ? "left" : "right",
            xOffsetPct: 30,
            yOffsetPct: (idx + 1) * 12,
            accentColor: "#3b82f6",
          };

          const startScroll = leafConfig.startScroll;
          const endScroll = leafConfig.endScroll;
          const side = leafConfig.side;
          const xOffsetPct = leafConfig.xOffsetPct;
          const yOffsetPct = leafConfig.yOffsetPct;
          const accentColor = leafConfig.accentColor || "#3b82f6";

          const sBranch = Math.max(0, Math.min(1, (currentS - startScroll) / (endScroll - startScroll)));

          let X3: number;
          if (isDesktop) {
            if (side === "left") {
              X3 = X_trunk - (xOffsetPct / 100) * (width * 0.42);
            } else {
              X3 = X_trunk + (xOffsetPct / 100) * (width * 0.42);
            }
          } else {
            const rawX3 = X_trunk + (xOffsetPct / 100) * (width - 80);
            X3 = Math.max(64, Math.min(width - 24, rawX3));
          }

          const Y3 = height * (yOffsetPct / 100);

          return {
            id: project.id,
            x: Math.round(X3 * 10) / 10,
            y: Math.round(Y3 * 10) / 10,
            active: currentS >= endScroll - 0.001,
            progress: Math.round(sBranch * 1000) / 1000,
            accentColor: accentColor,
            side: side,
          };
        });

        const prev = lastEmittedCoordsRef.current;
        let shouldEmit = false;
        if (!prev || prev.length !== coords.length) {
          shouldEmit = true;
        } else {
          for (let i = 0; i < coords.length; i++) {
            const c = coords[i];
            const p = prev[i];
            if (
              Math.abs(c.x - p.x) > 0.5 ||
              Math.abs(c.y - p.y) > 0.5 ||
              Math.abs(c.progress - p.progress) > 0.01 ||
              c.active !== p.active
            ) {
              shouldEmit = true;
              break;
            }
          }
        }

        if (shouldEmit) {
          lastEmittedCoordsRef.current = coords;
          onLeafCoordsUpdate(coords);
        }
      }

      animationFrameRef.current = requestAnimationFrame(render);
    };

    animationFrameRef.current = requestAnimationFrame(render);

    return () => {
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [scrollProgress, projects, dimensions, onLeafCoordsUpdate, activeProjectId]);

  // Direct canvas click handler for project selection
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!onSelectProject || dimensions.width === 0 || dimensions.height === 0) return;

    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    const isDesktop = dimensions.width >= 768;
    const X_trunk = isDesktop ? dimensions.width * 0.5 : 32;

    let closestProject: Project | null = null;
    let minDistance = 28; // Click threshold distance in px

    projects.forEach((project, idx) => {
      const leafConfig: LeafNodeConfig = project.leafConfig || {
        startScroll: idx * 0.12,
        endScroll: idx * 0.12 + 0.11,
        side: idx % 2 === 0 ? "left" : "right",
        xOffsetPct: 30,
        yOffsetPct: (idx + 1) * 12,
        accentColor: "#3b82f6",
      };

      let X3: number;
      if (isDesktop) {
        if (leafConfig.side === "left") {
          X3 = X_trunk - (leafConfig.xOffsetPct / 100) * (dimensions.width * 0.42);
        } else {
          X3 = X_trunk + (leafConfig.xOffsetPct / 100) * (dimensions.width * 0.42);
        }
      } else {
        const rawX3 = X_trunk + (leafConfig.xOffsetPct / 100) * (dimensions.width - 80);
        X3 = Math.max(64, Math.min(dimensions.width - 24, rawX3));
      }
      const Y3 = dimensions.height * (leafConfig.yOffsetPct / 100);

      const dist = Math.hypot(clickX - X3, clickY - Y3);
      if (dist < minDistance) {
        minDistance = dist;
        closestProject = project;
      }
    });

    if (closestProject) {
      onSelectProject(closestProject);
    }
  };

  return (
    <div
      ref={containerRef}
      className={cn("relative w-full h-full min-h-[600px] overflow-hidden pointer-events-auto", className)}
    >
      <canvas
        ref={canvasRef}
        onClick={handleCanvasClick}
        className="absolute inset-0 block w-full h-full cursor-pointer"
      />
    </div>
  );
}
