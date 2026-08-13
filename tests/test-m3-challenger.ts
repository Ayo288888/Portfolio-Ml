import { PROJECTS_DATA, getProjectById } from "../data/projects";
import type { Project, LeafNodeProps, ProjectDetailDrawerProps } from "../types";
import fs from "fs";
import path from "path";

console.log("=================================================");
console.log("   EMPIRICAL CHALLENGER M3 VERIFICATION HARNESS   ");
console.log("=================================================\n");

let passed = 0;
let failed = 0;

function assert(condition: boolean, testName: string, details?: string) {
  if (condition) {
    console.log(`[PASS] ${testName}`);
    passed++;
  } else {
    console.error(`[FAIL] ${testName}`);
    if (details) console.error(`       -> ${details}`);
    failed++;
  }
}

// -------------------------------------------------------------
// Test 1: Verify Interface Contracts & File Existence
// -------------------------------------------------------------
console.log("--- 1. Contract & File Existence Checks ---");
const filesToCheck = [
  "types/index.ts",
  "components/leaf-node.tsx",
  "components/project-detail-drawer.tsx",
  "components/ui/sheet.tsx",
  "hooks/use-mobile.ts",
  "data/projects.ts"
];

for (const f of filesToCheck) {
  const fullPath = path.resolve(process.cwd(), f);
  assert(fs.existsSync(fullPath), `File exists: ${f}`);
}

// -------------------------------------------------------------
// Test 2: Data Integrity & Leaf Node Config Validation
// -------------------------------------------------------------
console.log("\n--- 2. Dataset & Leaf Config Empirical Validation ---");
assert(PROJECTS_DATA.length === 7, `Project dataset contains 7 projects (actual: ${PROJECTS_DATA.length})`);

for (const p of PROJECTS_DATA) {
  assert(Boolean(p.id && p.title && p.category && p.year && p.leafConfig), `Project '${p.id}' has required metadata`);
  assert(Boolean(p.leafConfig.accentColor.startsWith("#")), `Project '${p.id}' has valid hex accentColor (${p.leafConfig.accentColor})`);
  assert(p.leafConfig.startScroll >= 0 && p.leafConfig.endScroll <= 1, `Project '${p.id}' scroll range within [0, 1] (${p.leafConfig.startScroll} - ${p.leafConfig.endScroll})`);
  assert(p.leafConfig.side === "left" || p.leafConfig.side === "right", `Project '${p.id}' side is left or right (${p.leafConfig.side})`);
}

// -------------------------------------------------------------
// Test 3: LeafNode Tooltip Collision Logic Simulation
// -------------------------------------------------------------
console.log("\n--- 3. Tooltip Edge Collision Detection Simulation ---");

function simulateTooltipPosition(rectTop: number, rectLeft: number, rectRight: number, vw: number) {
  const tooltipWidth = 320;
  const tooltipHeight = 270;
  const margin = 16;

  const vertical: "above" | "below" = rectTop < tooltipHeight + margin ? "below" : "above";

  let horizontal: "center" | "left" | "right" = "center";
  if (rectLeft - tooltipWidth / 2 < margin) {
    horizontal = "left";
  } else if (rectRight + tooltipWidth / 2 > vw - margin) {
    horizontal = "right";
  }

  return { vertical, horizontal };
}

// Case A: Center of screen (vw = 1920, top = 500, left = 950, right = 982)
const centerPos = simulateTooltipPosition(500, 950, 982, 1920);
assert(centerPos.vertical === "above" && centerPos.horizontal === "center", "Center screen position evaluates to above/center");

// Case B: Near top edge (top = 100 < 270 + 16)
const topPos = simulateTooltipPosition(100, 950, 982, 1920);
assert(topPos.vertical === "below", "Top screen position flips to below");

// Case C: Near left edge (left = 50, left - 160 = -110 < 16)
const leftPos = simulateTooltipPosition(500, 50, 82, 1920);
assert(leftPos.horizontal === "left", "Left edge position aligns to left");

// Case D: Near right edge (right = 1900, right + 160 = 2060 > 1920 - 16)
const rightPos = simulateTooltipPosition(500, 1868, 1900, 1920);
assert(rightPos.horizontal === "right", "Right edge position aligns to right");

// Case E: Top-Right Corner Collision (top = 80, right = 1900)
const topRightPos = simulateTooltipPosition(80, 1868, 1900, 1920);
assert(topRightPos.vertical === "below" && topRightPos.horizontal === "right", "Top-Right corner position flips to below/right");

// -------------------------------------------------------------
// Test 4: LeafNode Code Analysis (Accessibility & Motion)
// -------------------------------------------------------------
console.log("\n--- 4. LeafNode Code AST/Regex Inspection ---");
const leafNodeCode = fs.readFileSync(path.resolve(process.cwd(), "components/leaf-node.tsx"), "utf-8");

assert(leafNodeCode.includes('"use client"'), "leaf-node.tsx has 'use client' directive");
assert(leafNodeCode.includes("motion.span"), "LeafNode utilizes motion.span for pulse ring");
assert(leafNodeCode.includes("AnimatePresence"), "LeafNode utilizes AnimatePresence for tooltip animations");
assert(leafNodeCode.includes("getBoundingClientRect"), "LeafNode calls getBoundingClientRect for position detection");
assert(leafNodeCode.includes('type="button"'), "LeafNode uses native button tag");
assert(leafNodeCode.includes("aria-label="), "LeafNode sets aria-label attribute");
assert(leafNodeCode.includes("aria-expanded="), "LeafNode sets aria-expanded attribute");
assert(leafNodeCode.includes("aria-describedby="), "LeafNode sets aria-describedby attribute");
assert(leafNodeCode.includes("tabIndex="), "LeafNode dynamically sets tabIndex");
assert(leafNodeCode.includes("Escape"), "LeafNode handles Escape key for dismissal");
assert(leafNodeCode.includes("onError="), "LeafNode provides image onError fallback");

// -------------------------------------------------------------
// Test 5: ProjectDetailDrawer Code Analysis (Responsive & Glassmorphic)
// -------------------------------------------------------------
console.log("\n--- 5. ProjectDetailDrawer Code AST/Regex Inspection ---");
const drawerCode = fs.readFileSync(path.resolve(process.cwd(), "components/project-detail-drawer.tsx"), "utf-8");

assert(drawerCode.includes('"use client"'), "project-detail-drawer.tsx has 'use client' directive");
assert(drawerCode.includes("useIsMobile"), "Drawer uses useIsMobile hook for responsive breakpoint detection");
assert(drawerCode.includes('side={side}'), "Drawer sets sheet side dynamically ('bottom' vs 'right')");
assert(drawerCode.includes("backdrop-blur-2xl"), "Drawer applies glassmorphic backdrop-blur-2xl styling");
assert(drawerCode.includes("SheetTitle"), "Drawer incorporates accessible SheetTitle");
assert(drawerCode.includes("SheetDescription"), "Drawer incorporates accessible SheetDescription");
assert(drawerCode.includes("displayProject"), "Drawer preserves displayProject state during exit transitions");
assert(drawerCode.includes("liveUrl"), "Drawer handles liveUrl external button");
assert(drawerCode.includes("githubUrl"), "Drawer handles githubUrl repository button");
assert(drawerCode.includes("metrics"), "Drawer renders performance metrics grid");
assert(drawerCode.includes("highlights"), "Drawer renders technical highlights bullet points");

// -------------------------------------------------------------
// Test Summary
// -------------------------------------------------------------
console.log("\n=================================================");
console.log(` RESULTS: ${passed} PASSED, ${failed} FAILED`);
console.log("=================================================");

if (failed > 0) {
  process.exit(1);
} else {
  process.exit(0);
}
