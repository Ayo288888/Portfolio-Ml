import { truncateCubicBezier, CubicBezier } from "../../components/works-canvas-tree";

// Unit tests for de Casteljau subdivision algorithm (truncateCubicBezier)

function testTruncation() {
  const curve: CubicBezier = {
    p0: { x: 0, y: 0 },
    p1: { x: 10, y: 0 },
    p2: { x: 20, y: 10 },
    p3: { x: 30, y: 10 },
  };

  // Test at t = 0: subcurve start and end should be p0
  const sub0 = truncateCubicBezier(curve, 0);
  console.assert(sub0.p0.x === 0 && sub0.p0.y === 0, "sub0.p0 failed");
  console.assert(sub0.p3.x === 0 && sub0.p3.y === 0, "sub0.p3 failed");

  // Test at t = 1: subcurve should equal full curve
  const sub1 = truncateCubicBezier(curve, 1);
  console.assert(sub1.p0.x === 0 && sub1.p0.y === 0, "sub1.p0 failed");
  console.assert(Math.abs(sub1.p3.x - 30) < 0.0001 && Math.abs(sub1.p3.y - 10) < 0.0001, "sub1.p3 failed");

  // Test at t = 0.5:
  const subHalf = truncateCubicBezier(curve, 0.5);
  // At t=0.5:
  // p01 = (5, 0), p12 = (15, 5), p23 = (25, 10)
  // p012 = (10, 2.5), p123 = (20, 7.5)
  // p0123 = (15, 5)
  console.assert(Math.abs(subHalf.p3.x - 15) < 0.0001, `subHalf.p3.x failed: got ${subHalf.p3.x}`);
  console.assert(Math.abs(subHalf.p3.y - 5) < 0.0001, `subHalf.p3.y failed: got ${subHalf.p3.y}`);

  console.log("ALL TRUNCATION TESTS PASSED SUCCESSFULLY!");
}

testTruncation();
