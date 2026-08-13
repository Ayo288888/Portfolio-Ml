const fs = require('fs');

// Exact copy of truncateCubicBezier from components/works-canvas-tree.tsx
function truncateCubicBezier(curve, tau) {
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

// Cubic Bezier explicit formula: B(t) = (1-t)^3 * P0 + 3(1-t)^2 * t * P1 + 3(1-t) * t^2 * P2 + t^3 * P3
function evalCubicBezier(curve, t) {
  const u = 1 - t;
  const tt = t * t;
  const uu = u * u;
  const uuu = uu * u;
  const ttt = tt * t;

  return {
    x: uuu * curve.p0.x + 3 * uu * t * curve.p1.x + 3 * u * tt * curve.p2.x + ttt * curve.p3.x,
    y: uuu * curve.p0.y + 3 * uu * t * curve.p1.y + 3 * u * tt * curve.p2.y + ttt * curve.p3.y,
  };
}

const results = [];

function record(suite, testName, pass, details) {
  results.push({ suite, testName, pass, details });
  console.log(`[${pass ? 'PASS' : 'FAIL'}] ${suite} :: ${testName} ${details ? '- ' + details : ''}`);
}

console.log("=== STARTING EMPIRICAL TEST SUITE FOR WORKS-CANVAS-TREE ===");

// -------------------------------------------------------------
// SUITE 1: De Casteljau Math & Bezier Properties Verification
// -------------------------------------------------------------

// Test 1.1: At t = 0, returns start point P0
const curve1 = {
  p0: { x: 100, y: 100 },
  p1: { x: 200, y: 150 },
  p2: { x: 300, y: 50 },
  p3: { x: 400, y: 200 }
};

const resT0 = truncateCubicBezier(curve1, 0);
const passT0_P0 = (resT0.p0.x === curve1.p0.x && resT0.p0.y === curve1.p0.y);
const passT0_P3 = (resT0.p3.x === curve1.p0.x && resT0.p3.y === curve1.p0.y);
record("Math Properties", "t=0 start point P0", passT0_P0 && passT0_P3, 
  `res.p0=(${resT0.p0.x},${resT0.p0.y}), res.p3=(${resT0.p3.x},${resT0.p3.y}) vs P0=(${curve1.p0.x},${curve1.p0.y})`);

// Test 1.2: At t = 1, returns end point P3
const resT1 = truncateCubicBezier(curve1, 1);
const passT1_P0 = (resT1.p0.x === curve1.p0.x && resT1.p0.y === curve1.p0.y);
const passT1_P3 = (resT1.p3.x === curve1.p3.x && resT1.p3.y === curve1.p3.y);
const passT1_P1 = (resT1.p1.x === curve1.p1.x && resT1.p1.y === curve1.p1.y);
const passT1_P2 = (resT1.p2.x === curve1.p2.x && resT1.p2.y === curve1.p2.y);
record("Math Properties", "t=1 end point P3", passT1_P0 && passT1_P3 && passT1_P1 && passT1_P2, 
  `res.p3=(${resT1.p3.x},${resT1.p3.y}) vs P3=(${curve1.p3.x},${curve1.p3.y})`);

// Test 1.3: For t in (0, 1), Q3 equals exact formula B(t) across 1,000 random curves & t steps
let maxError = 0;
let randomTestsPassed = true;

for (let i = 0; i < 1000; i++) {
  const randCurve = {
    p0: { x: Math.random() * 1000, y: Math.random() * 1000 },
    p1: { x: Math.random() * 1000, y: Math.random() * 1000 },
    p2: { x: Math.random() * 1000, y: Math.random() * 1000 },
    p3: { x: Math.random() * 1000, y: Math.random() * 1000 },
  };

  for (let t = 0.01; t < 1.0; t += 0.05) {
    const sub = truncateCubicBezier(randCurve, t);
    const expected = evalCubicBezier(randCurve, t);

    const errX = Math.abs(sub.p3.x - expected.x);
    const errY = Math.abs(sub.p3.y - expected.y);
    const dist = Math.hypot(errX, errY);

    if (dist > maxError) maxError = dist;
    if (dist > 1e-10) {
      randomTestsPassed = false;
    }
  }
}

record("Math Properties", "Q3 lies on original cubic Bezier curve for t in (0,1)", randomTestsPassed, 
  `Max error across 20,000 evaluations: ${maxError.toExponential(4)}`);

// Test 1.4: Out-of-bounds t clamping in truncateCubicBezier
const subNeg = truncateCubicBezier(curve1, -0.5);
const subHuge = truncateCubicBezier(curve1, 5.0);
const passClampNeg = (subNeg.p3.x === curve1.p0.x && subNeg.p3.y === curve1.p0.y);
const passClampHuge = (subHuge.p3.x === curve1.p3.x && subHuge.p3.y === curve1.p3.y);
record("Math Properties", "t out-of-bounds clamping (-0.5 -> 0, 5.0 -> 1)", passClampNeg && passClampHuge,
  `subNeg.p3=(${subNeg.p3.x},${subNeg.p3.y}), subHuge.p3=(${subHuge.p3.x},${subHuge.p3.y})`);

// -------------------------------------------------------------
// SUITE 2: Scroll Progress Edge Cases (S calculation & branch logic)
// -------------------------------------------------------------

function computeBranchProgress(currentS, startScroll, endScroll) {
  return Math.max(0, Math.min(1, (currentS - startScroll) / (endScroll - startScroll)));
}

function computeTrunkY(currentS, height) {
  return Math.min(height, Math.max(40, height * (currentS * 1.05 + 0.02)));
}

const leaf = { startScroll: 0.1, endScroll: 0.3 };

// Test 2.1: S < 0 (S = -0.5)
const sNeg = -0.5;
const bProgressNeg = computeBranchProgress(sNeg, leaf.startScroll, leaf.endScroll);
const trunkYNeg = computeTrunkY(sNeg, 1000);
record("Scroll Edge Cases", "S < 0 (S = -0.5)", bProgressNeg === 0 && trunkYNeg === 40,
  `bProgress=${bProgressNeg}, trunkY=${trunkYNeg} (expected 0 and 40)`);

// Test 2.2: S = 0
const sZero = 0;
const bProgressZero = computeBranchProgress(sZero, leaf.startScroll, leaf.endScroll);
const trunkYZero = computeTrunkY(sZero, 1000);
record("Scroll Edge Cases", "S = 0", bProgressZero === 0 && trunkYZero === 40,
  `bProgress=${bProgressZero}, trunkY=${trunkYZero} (expected 0 and 40)`);

// Test 2.3: S = 0.2 (mid-branch, sBranch should be (0.2-0.1)/0.2 = 0.5)
const sMid = 0.2;
const bProgressMid = computeBranchProgress(sMid, leaf.startScroll, leaf.endScroll);
record("Scroll Edge Cases", "S = 0.2 (Mid-branch)", Math.abs(bProgressMid - 0.5) < 1e-10,
  `bProgress=${bProgressMid} (expected 0.5)`);

// Test 2.4: S = 0.3 (at endScroll, sBranch = 1)
const sEnd = 0.3;
const bProgressEnd = computeBranchProgress(sEnd, leaf.startScroll, leaf.endScroll);
record("Scroll Edge Cases", "S = 0.3 (endScroll)", bProgressEnd === 1,
  `bProgress=${bProgressEnd} (expected 1.0)`);

// Test 2.5: S > 1 (S = 1.5)
const sHuge = 1.5;
const bProgressHuge = computeBranchProgress(sHuge, leaf.startScroll, leaf.endScroll);
const trunkYHuge = computeTrunkY(sHuge, 1000);
record("Scroll Edge Cases", "S > 1 (S = 1.5)", bProgressHuge === 1 && trunkYHuge === 1000,
  `bProgress=${bProgressHuge}, trunkY=${trunkYHuge} (expected 1.0 and 1000)`);

// Test 2.6: S = Infinity & -Infinity
const sInf = Infinity;
const sNegInf = -Infinity;
const bProgressInf = computeBranchProgress(sInf, leaf.startScroll, leaf.endScroll);
const bProgressNegInf = computeBranchProgress(sNegInf, leaf.startScroll, leaf.endScroll);
record("Scroll Edge Cases", "S = Infinity & -Infinity", bProgressInf === 1 && bProgressNegInf === 0,
  `bProgressInf=${bProgressInf}, bProgressNegInf=${bProgressNegInf}`);

// Test 2.7: S = NaN
const sNaN = NaN;
const bProgressNaN = computeBranchProgress(sNaN, leaf.startScroll, leaf.endScroll);
const trunkYNaN = computeTrunkY(sNaN, 1000);
const isNaNSafetyIssue = Number.isNaN(bProgressNaN);
record("Scroll Edge Cases", "S = NaN safety check", !isNaNSafetyIssue,
  `bProgressNaN=${bProgressNaN}, trunkYNaN=${trunkYNaN}. NOTE: NaN produces NaN in Math.max(0, Math.min(1, NaN))`);

// Test 2.8: startScroll === endScroll (Zero range branch)
const bProgressZeroRange = computeBranchProgress(0.5, 0.2, 0.2);
record("Scroll Edge Cases", "startScroll === endScroll (Zero range)", bProgressZeroRange === 1,
  `bProgressZeroRange=${bProgressZeroRange}`);

// -------------------------------------------------------------
// SUITE 3: Responsive Breakpoints & Layout Coordinates
// -------------------------------------------------------------

function computeBranchCoordinates(width, height, side, xOffsetPct, yOffsetPct) {
  const isDesktop = width >= 768;
  const X_trunk = isDesktop ? width * 0.5 : 32;

  let X3;
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
  return { X_trunk, X3, Y3, isDesktop };
}

// Test 3.1: Desktop mode (w=1024, h=800, left side, 30% xOffset)
const desktopLeft = computeBranchCoordinates(1024, 800, "left", 30, 20);
const expectedXTrunkDesk = 512;
const expectedX3DeskLeft = 512 - 0.3 * (1024 * 0.42); // 512 - 129.024 = 382.976
record("Responsive Layout", "Desktop Left Branch (w=1024)",
  desktopLeft.X_trunk === expectedXTrunkDesk && Math.abs(desktopLeft.X3 - expectedX3DeskLeft) < 1e-5,
  `X_trunk=${desktopLeft.X_trunk}, X3=${desktopLeft.X3} (expected ${expectedX3DeskLeft})`);

// Test 3.2: Desktop mode (w=1024, h=800, right side, 30% xOffset)
const desktopRight = computeBranchCoordinates(1024, 800, "right", 30, 20);
const expectedX3DeskRight = 512 + 0.3 * (1024 * 0.42); // 512 + 129.024 = 641.024
record("Responsive Layout", "Desktop Right Branch (w=1024)",
  Math.abs(desktopRight.X3 - expectedX3DeskRight) < 1e-5,
  `X3=${desktopRight.X3} (expected ${expectedX3DeskRight})`);

// Test 3.3: Mobile mode (w=375, h=800, left side specified, should forced rightward)
const mobileLeft = computeBranchCoordinates(375, 800, "left", 30, 20);
// Trunk X = 32. rawX3 = 32 + 0.3 * (375 - 80) = 32 + 0.3 * 295 = 32 + 88.5 = 120.5
// Clamped in [64, 351] -> 120.5
record("Responsive Layout", "Mobile Left-to-Right Branch (w=375)",
  mobileLeft.X_trunk === 32 && Math.abs(mobileLeft.X3 - 120.5) < 1e-5,
  `X_trunk=${mobileLeft.X_trunk}, X3=${mobileLeft.X3} (expected 120.5)`);

// Test 3.4: Mobile mode narrow clamping (w=100)
const mobileNarrow = computeBranchCoordinates(100, 800, "right", 100, 20);
// Trunk X = 32. rawX3 = 32 + 1.0 * (100 - 80) = 52. Clamped [64, 76] -> 64.
record("Responsive Layout", "Mobile Narrow Screen Clamping (w=100)",
  mobileNarrow.X3 === 64,
  `X3=${mobileNarrow.X3} (expected 64 clamped minimum)`);

// -------------------------------------------------------------
// SUITE 4: Callback Throttling & Emitting Logic
// -------------------------------------------------------------

function checkShouldEmit(prev, coords) {
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
  return shouldEmit;
}

const initialCoords = [
  { id: "1", x: 100, y: 200, active: false, progress: 0, accentColor: "#fff", side: "left" }
];

// Test 4.1: Initial call emits
record("Throttling", "Initial null prev emits", checkShouldEmit(null, initialCoords) === true);

// Test 4.2: Micro-movements (<0.5px, <0.01 progress) do NOT emit
const microCoords = [
  { id: "1", x: 100.2, y: 200.3, active: false, progress: 0.005, accentColor: "#fff", side: "left" }
];
record("Throttling", "Micro movement suppresses emit", checkShouldEmit(initialCoords, microCoords) === false);

// Test 4.3: Significant movement (>0.5px X) DOES emit
const moveXCoords = [
  { id: "1", x: 100.8, y: 200, active: false, progress: 0, accentColor: "#fff", side: "left" }
];
record("Throttling", "X shift > 0.5px triggers emit", checkShouldEmit(initialCoords, moveXCoords) === true);

// Test 4.4: Active boolean flip DOES emit
const activeFlipCoords = [
  { id: "1", x: 100, y: 200, active: true, progress: 0, accentColor: "#fff", side: "left" }
];
record("Throttling", "Active boolean flip triggers emit", checkShouldEmit(initialCoords, activeFlipCoords) === true);

console.log("\n=== TEST SUMMARY ===");
const totalTests = results.length;
const passedTests = results.filter(r => r.pass).length;
const failedTests = results.filter(r => !r.pass).length;

console.log(`Total: ${totalTests} | Passed: ${passedTests} | Failed: ${failedTests}`);

fs.writeFileSync('.agents/challenger_m2_1/test-results.json', JSON.stringify(results, null, 2));
