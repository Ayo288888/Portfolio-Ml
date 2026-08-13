import { truncateCubicBezier, CubicBezier, TerminalLeafCoord } from "../components/works-canvas-tree";
import { PROJECTS_DATA as projects } from "../data/projects";

// --- Colors & Helpers for Formatting ---
const PASS = "✅ [PASS]";
const FAIL = "❌ [FAIL]";

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;

function assert(condition: boolean, testName: string, detail?: string) {
  totalTests++;
  if (condition) {
    passedTests++;
    console.log(`${PASS} ${testName}`);
  } else {
    failedTests++;
    console.error(`${FAIL} ${testName}`);
    if (detail) console.error(`   Detail: ${detail}`);
  }
}

// Analytical Cubic Bezier formula B(t)
function analyticalBezier(p0: number, p1: number, p2: number, p3: number, t: number): number {
  const mt = 1 - t;
  return mt * mt * mt * p0 + 3 * mt * mt * t * p1 + 3 * mt * t * t * p2 + t * t * t * p3;
}

console.log("=================================================");
console.log(" EMPIRICAL STRESS TEST SUITE: MILESTONE 2 TREE   ");
console.log(" Target: components/works-canvas-tree.tsx       ");
console.log("=================================================\n");

// ---------------------------------------------------------
// 1. De Casteljau Bezier Truncation Math Tests
// ---------------------------------------------------------
console.log("--- 1. DE CASTELJAU BEZIER TRUNCATION MATH ---");

const testCurve: CubicBezier = {
  p0: { x: 500, y: 100 },
  p1: { x: 600, y: 150 },
  p2: { x: 700, y: 250 },
  p3: { x: 800, y: 300 },
};

// t = 0
const t0 = truncateCubicBezier(testCurve, 0);
assert(
  t0.p3.x === testCurve.p0.x && t0.p3.y === testCurve.p0.y,
  "truncateCubicBezier tau=0 returns start point P0 as sub-curve end Q3",
  `Expected (${testCurve.p0.x}, ${testCurve.p0.y}), got (${t0.p3.x}, ${t0.p3.y})`
);

// t = 1
const t1 = truncateCubicBezier(testCurve, 1);
assert(
  Math.abs(t1.p3.x - testCurve.p3.x) < 1e-6 && Math.abs(t1.p3.y - testCurve.p3.y) < 1e-6,
  "truncateCubicBezier tau=1 returns full curve end P3 as sub-curve end Q3",
  `Expected (${testCurve.p3.x}, ${testCurve.p3.y}), got (${t1.p3.x}, ${t1.p3.y})`
);

// t = 0.5
const tHalf = truncateCubicBezier(testCurve, 0.5);
const expectedXHalf = analyticalBezier(testCurve.p0.x, testCurve.p1.x, testCurve.p2.x, testCurve.p3.x, 0.5);
const expectedYHalf = analyticalBezier(testCurve.p0.y, testCurve.p1.y, testCurve.p2.y, testCurve.p3.y, 0.5);
assert(
  Math.abs(tHalf.p3.x - expectedXHalf) < 1e-5 && Math.abs(tHalf.p3.y - expectedYHalf) < 1e-5,
  "truncateCubicBezier tau=0.5 matches analytical Cubic Bezier evaluation B(0.5)",
  `Expected (${expectedXHalf}, ${expectedYHalf}), got (${tHalf.p3.x}, ${tHalf.p3.y})`
);

// Clamping tests tau < 0 and tau > 1
const tNeg = truncateCubicBezier(testCurve, -0.5);
assert(
  tNeg.p3.x === testCurve.p0.x && tNeg.p3.y === testCurve.p0.y,
  "truncateCubicBezier tau=-0.5 clamps to tau=0",
  `Got (${tNeg.p3.x}, ${tNeg.p3.y})`
);

const tOver = truncateCubicBezier(testCurve, 1.5);
assert(
  Math.abs(tOver.p3.x - testCurve.p3.x) < 1e-6 && Math.abs(tOver.p3.y - testCurve.p3.y) < 1e-6,
  "truncateCubicBezier tau=1.5 clamps to tau=1",
  `Got (${tOver.p3.x}, ${tOver.p3.y})`
);


// ---------------------------------------------------------
// 2. Responsive Breakpoint & Coordinate Boundary Tests
// ---------------------------------------------------------
console.log("\n--- 2. RESPONSIVE BREAKPOINT & BOUNDARY TESTS ---");

function calculateLeafCoords(width: number, height: number, currentS: number) {
  const isDesktop = width >= 768;
  const X_trunk = isDesktop ? width * 0.5 : 32;

  return projects.map((project, idx) => {
    const leafConfig = project.leafConfig || {
      startScroll: idx * 0.12,
      endScroll: idx * 0.12 + 0.11,
      side: idx % 2 === 0 ? "left" : ("right" as const),
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
      accentColor,
      side,
    };
  });
}

// Test Desktop Mode (width = 1000, height = 800)
const desktopCoords = calculateLeafCoords(1000, 800, 0.5);
assert(
  desktopCoords.length === projects.length,
  "Desktop produces coordinates for all project leaf nodes",
  `Count: ${desktopCoords.length}`
);

desktopCoords.forEach((coord, i) => {
  const proj = projects[i];
  const side = proj.leafConfig.side;
  if (side === "left") {
    assert(
      coord.x < 500,
      `Desktop Left branch [${proj.id}] X coordinate is left of trunk (X=${coord.x} < 500)`,
      `x=${coord.x}`
    );
  } else {
    assert(
      coord.x > 500,
      `Desktop Right branch [${proj.id}] X coordinate is right of trunk (X=${coord.x} > 500)`,
      `x=${coord.x}`
    );
  }
  assert(
    coord.x >= 0 && coord.x <= 1000,
    `Desktop branch [${proj.id}] X coordinate stays within container bounds [0, 1000]`,
    `x=${coord.x}`
  );
});

// Test Mobile Mode (width = 375, height = 800)
const mobileCoords = calculateLeafCoords(375, 800, 0.5);
mobileCoords.forEach((coord, i) => {
  const proj = projects[i];
  assert(
    coord.x >= 64 && coord.x <= 375 - 24,
    `Mobile branch [${proj.id}] X coordinate strictly clamped in [64, ${375 - 24}]`,
    `x=${coord.x}`
  );
});

// Test Mobile Small Screen (width = 320, height = 600)
const smallMobileCoords = calculateLeafCoords(320, 600, 0.5);
smallMobileCoords.forEach((coord, i) => {
  const proj = projects[i];
  assert(
    coord.x >= 64 && coord.x <= 320 - 24,
    `Small Mobile (320px) branch [${proj.id}] X coordinate strictly clamped in [64, 296]`,
    `x=${coord.x}`
  );
});


// ---------------------------------------------------------
// 3. Callback Throttling Simulation Test
// ---------------------------------------------------------
console.log("\n--- 3. CALLBACK THROTTLING SIMULATION ---");

function simulateThrottledEmit(
  prev: TerminalLeafCoord[] | null,
  coords: TerminalLeafCoord[]
): { shouldEmit: boolean; nextState: TerminalLeafCoord[] | null } {
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

  return {
    shouldEmit,
    nextState: shouldEmit ? coords : prev,
  };
}

// Initial emit
let lastEmitted: TerminalLeafCoord[] | null = null;
const initial = calculateLeafCoords(1000, 800, 0.1);
let res = simulateThrottledEmit(lastEmitted, initial);
assert(res.shouldEmit === true, "Initial leaf coordinates calculation triggers emit");
lastEmitted = res.nextState;

// Sub-threshold shift (delta X = 0.3px, delta Y = 0.2px, delta progress = 0.005)
const subThresholdCoords = initial.map((c) => ({
  ...c,
  x: c.x + 0.3,
  y: c.y + 0.2,
  progress: c.progress + 0.005,
}));
res = simulateThrottledEmit(lastEmitted, subThresholdCoords);
assert(res.shouldEmit === false, "Sub-threshold movement (< 0.5px, < 0.01 progress) DOES NOT trigger emit");

// Further sub-threshold shift accumulative (total delta X from lastEmitted = 0.7px)
const accumCoords = initial.map((c) => ({
  ...c,
  x: c.x + 0.7,
  y: c.y + 0.2,
  progress: c.progress + 0.005,
}));
res = simulateThrottledEmit(lastEmitted, accumCoords);
assert(res.shouldEmit === true, "Accumulated movement (> 0.5px from last emitted) DOES trigger emit");
lastEmitted = res.nextState;

// Active state flip (scroll progresses to activate node)
const activeFlipCoords = lastEmitted!.map((c, i) => ({
  ...c,
  active: i === 0 ? true : c.active, // flip first node to active
}));
res = simulateThrottledEmit(lastEmitted, activeFlipCoords);
assert(res.shouldEmit === true, "Active state boolean flip IMMEDIATELY triggers emit regardless of spatial delta");
lastEmitted = res.nextState;


// ---------------------------------------------------------
// 4. DPR Scaling & Dimension Calculation Test
// ---------------------------------------------------------
console.log("\n--- 4. DPR SCALING & DIMENSION CALCULATIONS ---");

function calculateDprCanvasDims(width: number, height: number, devicePixelRatio: number) {
  const dpr = Math.min(devicePixelRatio || 1, 2);
  return {
    targetCanvasWidth: Math.floor(width * dpr),
    targetCanvasHeight: Math.floor(height * dpr),
    styleWidth: `${width}px`,
    styleHeight: `${height}px`,
    effectiveDpr: dpr,
  };
}

const dpr1 = calculateDprCanvasDims(800, 600, 1.0);
assert(
  dpr1.targetCanvasWidth === 800 && dpr1.targetCanvasHeight === 600 && dpr1.effectiveDpr === 1.0,
  "DPR = 1.0 generates 1x buffer resolution"
);

const dpr2 = calculateDprCanvasDims(800, 600, 2.0);
assert(
  dpr2.targetCanvasWidth === 1600 && dpr2.targetCanvasHeight === 1200 && dpr2.effectiveDpr === 2.0,
  "DPR = 2.0 generates 2x buffer resolution"
);

const dpr3 = calculateDprCanvasDims(800, 600, 3.0);
assert(
  dpr3.targetCanvasWidth === 1600 && dpr3.targetCanvasHeight === 1200 && dpr3.effectiveDpr === 2.0,
  "DPR = 3.0 is capped at 2.0x buffer resolution for performance"
);


// ---------------------------------------------------------
// 5. Direct Canvas Click Target Detection Math Test
// ---------------------------------------------------------
console.log("\n--- 5. CLICK TARGET COLLISION DETECTION MATH ---");

function findClickedProject(clickX: number, clickY: number, width: number, height: number): string | null {
  const isDesktop = width >= 768;
  const X_trunk = isDesktop ? width * 0.5 : 32;

  let closestProjectId: string | null = null;
  let minDistance = 28;

  projects.forEach((project, idx) => {
    const leafConfig = project.leafConfig || {
      startScroll: idx * 0.12,
      endScroll: idx * 0.12 + 0.11,
      side: idx % 2 === 0 ? "left" : ("right" as const),
      xOffsetPct: 30,
      yOffsetPct: (idx + 1) * 12,
      accentColor: "#3b82f6",
    };

    let X3: number;
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
      closestProjectId = project.id;
    }
  });

  return closestProjectId;
}

// Test clicking near project 0 on Desktop
const firstLeaf = desktopCoords[0];
const clickedExact = findClickedProject(firstLeaf.x, firstLeaf.y, 1000, 800);
assert(clickedExact === firstLeaf.id, `Click on exact leaf coordinate (${firstLeaf.x}, ${firstLeaf.y}) returns project ID ${firstLeaf.id}`);

const clickedNear = findClickedProject(firstLeaf.x + 15, firstLeaf.y + 15, 1000, 800);
assert(clickedNear === firstLeaf.id, `Click within 28px threshold (15, 15 => dist 21.2px) returns project ID ${firstLeaf.id}`);

const clickedFar = findClickedProject(firstLeaf.x + 40, firstLeaf.y + 40, 1000, 800);
assert(clickedFar === null, "Click outside 28px threshold (40, 40 => dist 56.5px) returns null");

console.log("\n=================================================");
console.log(` SUMMARY: ${passedTests} / ${totalTests} tests passed.`);
console.log("=================================================");

if (failedTests > 0) {
  process.exit(1);
}
