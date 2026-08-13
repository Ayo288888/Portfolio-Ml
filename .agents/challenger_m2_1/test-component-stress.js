const fs = require('fs');

console.log("=== COMPONENT LOGIC & STRESS TEST HARNESS ===");

const results = [];

function record(testName, pass, details) {
  results.push({ testName, pass, details });
  console.log(`[${pass ? 'PASS' : 'FAIL'}] ${testName} ${details ? '- ' + details : ''}`);
}

// 1. Fallback leafConfig test
function getLeafConfig(project, idx) {
  return project.leafConfig || {
    startScroll: idx * 0.12,
    endScroll: idx * 0.12 + 0.11,
    side: idx % 2 === 0 ? "left" : "right",
    xOffsetPct: 30,
    yOffsetPct: (idx + 1) * 12,
    accentColor: "#3b82f6",
  };
}

const projWithoutConfig = { id: "p1", title: "Test", category: "ML" };
const fallback = getLeafConfig(projWithoutConfig, 0);
record("Fallback leafConfig generation", 
  fallback.startScroll === 0 && Math.abs(fallback.endScroll - 0.11) < 1e-10 && fallback.side === "left" && fallback.accentColor === "#3b82f6",
  `Generated startScroll=${fallback.startScroll}, endScroll=${fallback.endScroll}, side=${fallback.side}`);

const projWithoutConfig2 = { id: "p2", title: "Test 2", category: "Web" };
const fallback2 = getLeafConfig(projWithoutConfig2, 1);
record("Fallback leafConfig for idx 1 (Right side)",
  fallback2.side === "right" && Math.abs(fallback2.startScroll - 0.12) < 1e-10 && Math.abs(fallback2.endScroll - 0.23) < 1e-10,
  `Generated startScroll=${fallback2.startScroll}, endScroll=${fallback2.endScroll}, side=${fallback2.side}`);

// 2. Click Handler Distance Threshold Test (28px)
function handleCanvasClickSim(projects, clickX, clickY, width, height) {
  if (width === 0 || height === 0) return null;
  const isDesktop = width >= 768;
  const X_trunk = isDesktop ? width * 0.5 : 32;

  let closestProject = null;
  let minDistance = 28;

  projects.forEach((project, idx) => {
    const leafConfig = getLeafConfig(project, idx);
    let X3;
    if (isDesktop) {
      if (leafConfig.side === "left") {
        X3 = X_trunk - (leafConfig.xOffsetPct / 100) * (width * 0.42);
      } else {
        X3 = X_trunk + (leafConfig.xOffsetPct / 100) * (width * 0.42);
      }
    } else {
      const rawX3 = X_trunk + (leafConfig.xOffsetPct / 100) * (width - 80);
      X3 = Math.max(64, Math.min(width - 24, rawX3));
    }
    const Y3 = height * (leafConfig.yOffsetPct / 100);

    const dist = Math.hypot(clickX - X3, clickY - Y3);
    if (dist < minDistance) {
      minDistance = dist;
      closestProject = project;
    }
  });

  return closestProject;
}

const sampleProjects = [
  { id: "proj-1", title: "P1", category: "ML", leafConfig: { startScroll: 0, endScroll: 0.1, side: "left", xOffsetPct: 30, yOffsetPct: 20, accentColor: "#3b82f6" } },
  { id: "proj-2", title: "P2", category: "AI", leafConfig: { startScroll: 0.1, endScroll: 0.2, side: "right", xOffsetPct: 40, yOffsetPct: 40, accentColor: "#10b981" } }
];

// Desktop (w=1000, h=1000):
// Trunk = 500
// P1 (left, 30% offset): X3 = 500 - 0.3 * (1000 * 0.42) = 500 - 126 = 374, Y3 = 200
// P2 (right, 40% offset): X3 = 500 + 0.4 * (1000 * 0.42) = 500 + 168 = 668, Y3 = 400

const hitP1 = handleCanvasClickSim(sampleProjects, 375, 202, 1000, 1000);
record("Click Hit Detection within 28px threshold (P1)", hitP1 && hitP1.id === "proj-1",
  `Clicked (375, 202) -> Target P1 (374, 200). Result: ${hitP1 ? hitP1.id : 'none'}`);

const missClick = handleCanvasClickSim(sampleProjects, 300, 200, 1000, 1000);
record("Click Miss outside threshold (>28px)", missClick === null,
  `Clicked (300, 200) dist=74px -> Result: ${missClick ? missClick.id : 'null'}`);

const emptyProjClick = handleCanvasClickSim([], 374, 200, 1000, 1000);
record("Click with empty projects array", emptyProjClick === null);

// 3. Canvas size zero safety test
const zeroDimClick = handleCanvasClickSim(sampleProjects, 374, 200, 0, 0);
record("Click with 0x0 container dimension", zeroDimClick === null);

console.log("\n=== COMPONENT STRESS SUMMARY ===");
const total = results.length;
const passed = results.filter(r => r.pass).length;
console.log(`Total: ${total} | Passed: ${passed} | Failed: ${total - passed}`);

fs.writeFileSync('.agents/challenger_m2_1/component-stress-results.json', JSON.stringify(results, null, 2));
