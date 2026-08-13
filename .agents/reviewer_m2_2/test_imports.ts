import React from "react";
import { WorksCanvasTree, truncateCubicBezier, CubicBezier, TerminalLeafCoord, BranchTarget, WorksCanvasTreeProps } from "../../components/works-canvas-tree";
import { projects } from "../../data/projects";

console.log("Testing imports and types...");
console.log("Loaded projects count:", projects.length);

const testCurve: CubicBezier = {
  p0: { x: 0, y: 0 },
  p1: { x: 50, y: 10 },
  p2: { x: 80, y: 90 },
  p3: { x: 100, y: 100 },
};

const truncated = truncateCubicBezier(testCurve, 0.75);
console.log("Truncated curve p3:", truncated.p3);

console.log("Type checking and execution successful!");
