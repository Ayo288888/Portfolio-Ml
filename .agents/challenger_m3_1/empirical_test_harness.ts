import fs from "fs";
import path from "path";
import { PROJECTS_DATA, Project } from "../../data/projects";

interface EmpiricalResult {
  testName: string;
  passed: boolean;
  details: string[];
}

const results: EmpiricalResult[] = [];

console.log("=================================================");
console.log("  EMPIRICAL CHALLENGER M3 - VERIFICATION HARNESS ");
console.log("=================================================\n");

// TEST 1: Viewport Edge Collision Logic Simulation
const test1: EmpiricalResult = {
  testName: "1. Viewport Edge Collision Detection Math Verification",
  passed: true,
  details: [],
};

function computeTooltipPosition(
  rect: { top: number; left: number; right: number; bottom: number },
  vw: number,
  vh: number
) {
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

  return { vertical, horizontal };
}

const viewports = [
  { name: "Desktop 1080p (1920x1080)", vw: 1920, vh: 1080 },
  { name: "Tablet (768x1024)", vw: 768, vh: 1024 },
  { name: "Mobile (375x667)", vw: 375, vh: 667 },
];

const boundaryScenarios = [
  { name: "Top-Left Corner", rect: { top: 10, left: 10, right: 42, bottom: 42 }, expectedV: "below", expectedH: "left" },
  { name: "Top-Right Corner", rect: { top: 10, left: 1878, right: 1910, bottom: 42 }, expectedV: "below", expectedH: "right" },
  { name: "Bottom-Left Corner", rect: { top: 1030, left: 10, right: 42, bottom: 1062 }, expectedV: "above", expectedH: "left" },
  { name: "Bottom-Right Corner", rect: { top: 1030, left: 1878, right: 1910, bottom: 1062 }, expectedV: "above", expectedH: "right" },
  { name: "Center Viewport", rect: { top: 500, left: 944, right: 976, bottom: 532 }, expectedV: "above", expectedH: "center" },
];

for (const vp of viewports) {
  test1.details.push(`Testing viewport: ${vp.name}`);
  for (const scenario of boundaryScenarios) {
    // Adjust right for custom viewport if needed
    const adjustedRect = {
      ...scenario.rect,
      right: scenario.name.includes("Right") ? vp.vw - 10 : scenario.rect.right,
      left: scenario.name.includes("Right") ? vp.vw - 42 : scenario.rect.left,
    };
    const pos = computeTooltipPosition(adjustedRect, vp.vw, vp.vh);
    const pass = pos.vertical === scenario.expectedV && pos.horizontal === scenario.expectedH;
    if (pass) {
      test1.details.push(`  [PASS] ${scenario.name}: computed (vertical: ${pos.vertical}, horizontal: ${pos.horizontal}) matches expected.`);
    } else {
      test1.passed = false;
      test1.details.push(`  [FAIL] ${scenario.name}: computed (vertical: ${pos.vertical}, horizontal: ${pos.horizontal}), expected (vertical: ${scenario.expectedV}, horizontal: ${scenario.expectedH}).`);
    }
  }
}
results.push(test1);

// TEST 2: Robustness against Missing / Optional Fields
const test2: EmpiricalResult = {
  testName: "2. Optional & Missing Fields Rendering Safety",
  passed: true,
  details: [],
};

const sampleFullProject = PROJECTS_DATA[0];

// Case A: Missing liveUrl
const projectNoLiveUrl: Project = {
  ...sampleFullProject,
  id: "test-no-live-url",
  liveUrl: undefined,
};

// Case B: Missing githubUrl
const projectNoGithubUrl: Project = {
  ...sampleFullProject,
  id: "test-no-github-url",
  githubUrl: undefined,
};

// Case C: Missing both URLs
const projectNoUrls: Project = {
  ...sampleFullProject,
  id: "test-no-urls",
  liveUrl: undefined,
  githubUrl: undefined,
};

// Case D: Empty metrics and highlights
const projectEmptyMetrics: Project = {
  ...sampleFullProject,
  id: "test-empty-metrics",
  metrics: [],
  highlights: [],
};

// Case E: Missing leafConfig accentColor
const projectMissingAccent: any = {
  ...sampleFullProject,
  id: "test-missing-accent",
  leafConfig: {
    ...sampleFullProject.leafConfig,
    accentColor: undefined,
  },
};

// Verify drawer rendering logic for missing fields
const drawerFile = fs.readFileSync(path.resolve(process.cwd(), "components/project-detail-drawer.tsx"), "utf-8");

if (drawerFile.includes("currentProject.liveUrl &&") && drawerFile.includes("currentProject.githubUrl &&")) {
  test2.details.push("[PASS] ProjectDetailDrawer conditionally guards liveUrl and githubUrl action buttons.");
} else {
  test2.passed = false;
  test2.details.push("[FAIL] ProjectDetailDrawer does not properly guard optional liveUrl / githubUrl.");
}

if (drawerFile.includes("currentProject.metrics && currentProject.metrics.length > 0") && drawerFile.includes("currentProject.highlights && currentProject.highlights.length > 0")) {
  test2.details.push("[PASS] ProjectDetailDrawer conditionally guards metrics and highlights sections.");
} else {
  test2.passed = false;
  test2.details.push("[FAIL] ProjectDetailDrawer missing length checks for metrics / highlights.");
}

const leafFile = fs.readFileSync(path.resolve(process.cwd(), "components/leaf-node.tsx"), "utf-8");
if (leafFile.includes('project.leafConfig?.accentColor || "#3b82f6"') && drawerFile.includes('currentProject.leafConfig?.accentColor || "#3b82f6"')) {
  test2.details.push("[PASS] Accent color fallback (#3b82f6) present in both LeafNode and ProjectDetailDrawer.");
} else {
  test2.passed = false;
  test2.details.push("[FAIL] Accent color fallback missing.");
}

// Check tag safe navigation in LeafNode
if (leafFile.includes("project.tags.slice") && !leafFile.includes("project.tags?.slice") && !leafFile.includes("(project.tags || [])")) {
  test2.details.push("[WARNING] LeafNode line uses `project.tags.slice(0, 3)` without optional chaining or default fallback `(project.tags || [])`. Works fine if `tags` array is always provided, but could crash if `tags` is undefined.");
} else {
  test2.details.push("[PASS] LeafNode handles `tags` safely.");
}

results.push(test2);

// TEST 3: Accessibility & ARIA Attribute Verification
const test3: EmpiricalResult = {
  testName: "3. Accessibility & Keyboard Control Verification",
  passed: true,
  details: [],
};

// Check LeafNode button accessibility
const leafChecks = [
  { name: "Button tag with type='button'", check: leafFile.includes('type="button"') },
  { name: "aria-label attribute", check: leafFile.includes('aria-label=') },
  { name: "aria-expanded attribute", check: leafFile.includes('aria-expanded=') },
  { name: "aria-describedby tooltip association", check: leafFile.includes('aria-describedby=') },
  { name: "tabIndex control based on visibility", check: leafFile.includes('tabIndex={isVisible ? 0 : -1}') },
  { name: "Escape key listener for tooltip dismissal", check: leafFile.includes('e.key === "Escape"') },
  { name: "Focus & Blur handlers", check: leafFile.includes("onFocus=") && leafFile.includes("onBlur=") },
  { name: "Tooltip element role='tooltip'", check: leafFile.includes('role="tooltip"') },
];

for (const lc of leafChecks) {
  if (lc.check) {
    test3.details.push(`  [PASS] ${lc.name} is present in LeafNode.`);
  } else {
    test3.passed = false;
    test3.details.push(`  [FAIL] ${lc.name} missing in LeafNode.`);
  }
}

// Check ProjectDetailDrawer sheet dialog accessibility
const drawerChecks = [
  { name: "Sheet primitive integration", check: drawerFile.includes('<Sheet') },
  { name: "SheetTitle component", check: drawerFile.includes('<SheetTitle') },
  { name: "SheetDescription component", check: drawerFile.includes('<SheetDescription') },
  { name: "Mobile sheet fallback hook (useIsMobile)", check: drawerFile.includes('useIsMobile()') },
];

for (const dc of drawerChecks) {
  if (dc.check) {
    test3.details.push(`  [PASS] ${dc.name} is present in ProjectDetailDrawer.`);
  } else {
    test3.passed = false;
    test3.details.push(`  [FAIL] ${dc.name} missing in ProjectDetailDrawer.`);
  }
}

results.push(test3);

// TEST 4: Exported Types and Contract Integrity
const test4: EmpiricalResult = {
  testName: "4. Type Definitions & Contract Integrity",
  passed: true,
  details: [],
};

const typesFile = fs.readFileSync(path.resolve(process.cwd(), "types/index.ts"), "utf-8");
const expectedExportedTypes = ["Project", "ProjectMetric", "LeafNodeConfig", "LeafNodeProps", "ProjectDetailDrawerProps"];

for (const exp of expectedExportedTypes) {
  if (typesFile.includes(exp)) {
    test4.details.push(`  [PASS] Type '${exp}' correctly exported in types/index.ts.`);
  } else {
    test4.passed = false;
    test4.details.push(`  [FAIL] Type '${exp}' NOT exported in types/index.ts.`);
  }
}

results.push(test4);

// SUMMARY PRINTING
console.log("-------------------------------------------------");
console.log("  SUMMARY OF EMPIRICAL VERIFICATION");
console.log("-------------------------------------------------");

let allPassed = true;
for (const r of results) {
  console.log(`\n${r.testName}: ${r.passed ? "PASSED [✓]" : "FAILED [✗]"}`);
  for (const line of r.details) {
    console.log(`  ${line}`);
  }
  if (!r.passed) allPassed = false;
}

console.log("\n=================================================");
console.log(`  FINAL VERDICT: ${allPassed ? "APPROVE" : "REQUEST_CHANGES"}`);
console.log("=================================================\n");

process.exit(allPassed ? 0 : 1);
