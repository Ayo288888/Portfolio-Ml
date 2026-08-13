import fs from 'node:fs';
import path from 'node:path';
import { PROJECTS_DATA, getProjectById } from '../data/projects.ts';

interface TestResult {
  name: string;
  passed: boolean;
  details: string[];
}

const results: TestResult[] = [];

// 1. Array length and Unique IDs check
const test1: TestResult = { name: "1. Dataset Count and Unique IDs", passed: true, details: [] };
if (PROJECTS_DATA.length !== 7) {
  test1.passed = false;
  test1.details.push(`Expected 7 projects, found ${PROJECTS_DATA.length}`);
} else {
  test1.details.push(`PROJECTS_DATA count is exactly 7.`);
}

const seenIds = new Set<string>();
const duplicateIds: string[] = [];
for (const p of PROJECTS_DATA) {
  if (!p.id || typeof p.id !== 'string' || p.id.trim() === '') {
    test1.passed = false;
    test1.details.push(`Project has invalid/empty id: ${JSON.stringify(p.id)}`);
  } else if (seenIds.has(p.id)) {
    duplicateIds.push(p.id);
  } else {
    seenIds.add(p.id);
  }
}
if (duplicateIds.length > 0) {
  test1.passed = false;
  test1.details.push(`Found duplicate IDs: ${duplicateIds.join(', ')}`);
} else {
  test1.details.push(`All ${seenIds.size} project IDs are unique: [${Array.from(seenIds).join(', ')}]`);
}
results.push(test1);

// 2. Image assets presence in public/ directory
const test2: TestResult = { name: "2. Image Asset Presence in public/", passed: true, details: [] };
const publicDir = path.resolve(process.cwd(), 'public');
for (const p of PROJECTS_DATA) {
  if (!p.image || typeof p.image !== 'string') {
    test2.passed = false;
    test2.details.push(`Project ${p.id} missing image property.`);
    continue;
  }
  
  // Strip leading slash if present
  const relativePath = p.image.startsWith('/') ? p.image.slice(1) : p.image;
  const fullPath = path.join(publicDir, relativePath);
  
  if (fs.existsSync(fullPath)) {
    const stats = fs.statSync(fullPath);
    test2.details.push(`[PASS] ${p.id}: image '${p.image}' exists (${stats.size} bytes)`);
  } else {
    test2.passed = false;
    test2.details.push(`[FAIL] ${p.id}: image '${p.image}' NOT FOUND at expected filesystem path '${fullPath}'`);
  }
}
results.push(test2);

// 3. Helper function getProjectById lookup
const test3: TestResult = { name: "3. getProjectById Lookup Accuracy", passed: true, details: [] };
for (const p of PROJECTS_DATA) {
  const found = getProjectById(p.id);
  if (found !== p) {
    test3.passed = false;
    test3.details.push(`[FAIL] getProjectById('${p.id}') returned ${found ? found.id : 'undefined'}, expected project with id '${p.id}'`);
  } else {
    test3.details.push(`[PASS] getProjectById('${p.id}') correctly resolved.`);
  }
}

// Test invalid / nonexistent ID lookups
const invalidIds = ["non-existent-id", "", "invalid_123", "MARGINAL-AI-READER"];
for (const invalidId of invalidIds) {
  const found = getProjectById(invalidId);
  if (found !== undefined) {
    test3.passed = false;
    test3.details.push(`[FAIL] getProjectById('${invalidId}') returned object, expected undefined.`);
  } else {
    test3.details.push(`[PASS] getProjectById('${invalidId}') returned undefined as expected.`);
  }
}
results.push(test3);

// 4. leafConfig structure and bounds
const test4: TestResult = { name: "4. leafConfig Bounds & Types", passed: true, details: [] };
for (const p of PROJECTS_DATA) {
  const lc = p.leafConfig;
  if (!lc) {
    test4.passed = false;
    test4.details.push(`[FAIL] Project ${p.id} is missing leafConfig.`);
    continue;
  }

  // startScroll (0.0 to 1.0)
  if (typeof lc.startScroll !== 'number' || lc.startScroll < 0.0 || lc.startScroll > 1.0) {
    test4.passed = false;
    test4.details.push(`[FAIL] ${p.id}: startScroll ${lc.startScroll} out of bounds [0.0, 1.0]`);
  }

  // endScroll (0.0 to 1.0)
  if (typeof lc.endScroll !== 'number' || lc.endScroll < 0.0 || lc.endScroll > 1.0) {
    test4.passed = false;
    test4.details.push(`[FAIL] ${p.id}: endScroll ${lc.endScroll} out of bounds [0.0, 1.0]`);
  }

  // startScroll < endScroll
  if (typeof lc.startScroll === 'number' && typeof lc.endScroll === 'number' && lc.startScroll >= lc.endScroll) {
    test4.passed = false;
    test4.details.push(`[FAIL] ${p.id}: startScroll (${lc.startScroll}) >= endScroll (${lc.endScroll})`);
  }

  // side ("left" | "right")
  if (lc.side !== "left" && lc.side !== "right") {
    test4.passed = false;
    test4.details.push(`[FAIL] ${p.id}: side '${lc.side}' is not 'left' or 'right'`);
  }

  // xOffsetPct (0 to 100)
  if (typeof lc.xOffsetPct !== 'number' || lc.xOffsetPct < 0 || lc.xOffsetPct > 100) {
    test4.passed = false;
    test4.details.push(`[FAIL] ${p.id}: xOffsetPct ${lc.xOffsetPct} out of bounds [0, 100]`);
  }

  // yOffsetPct (0 to 100)
  if (typeof lc.yOffsetPct !== 'number' || lc.yOffsetPct < 0 || lc.yOffsetPct > 100) {
    test4.passed = false;
    test4.details.push(`[FAIL] ${p.id}: yOffsetPct ${lc.yOffsetPct} out of bounds [0, 100]`);
  }

  // accentColor hex string pattern
  if (typeof lc.accentColor !== 'string' || !/^#[0-9a-fA-F]{6}$/.test(lc.accentColor)) {
    test4.passed = false;
    test4.details.push(`[FAIL] ${p.id}: accentColor '${lc.accentColor}' is not a valid 6-char hex color.`);
  }
}
if (test4.passed) {
  test4.details.push(`All 7 leafConfigs satisfy bounds, numeric types, side enum, and hex accent colors.`);
}
results.push(test4);

// 5. String fields & Non-empty array checks
const test5: TestResult = { name: "5. Non-Empty String Fields & Collections", passed: true, details: [] };
const requiredStringFields: (keyof typeof PROJECTS_DATA[0])[] = [
  'id', 'title', 'shortDescription', 'longDescription', 'year', 'category', 'image'
];

for (const p of PROJECTS_DATA) {
  for (const field of requiredStringFields) {
    const val = p[field];
    if (typeof val !== 'string' || val.trim() === '') {
      test5.passed = false;
      test5.details.push(`[FAIL] ${p.id}: Field '${field}' is empty or not string.`);
    }
  }

  // Tags array
  if (!Array.isArray(p.tags) || p.tags.length === 0 || p.tags.some(t => typeof t !== 'string' || t.trim() === '')) {
    test5.passed = false;
    test5.details.push(`[FAIL] ${p.id}: 'tags' must be a non-empty array of non-empty strings.`);
  }

  // Metrics array
  if (!Array.isArray(p.metrics) || p.metrics.length === 0) {
    test5.passed = false;
    test5.details.push(`[FAIL] ${p.id}: 'metrics' must be a non-empty array.`);
  } else {
    for (const m of p.metrics) {
      if (!m.label || !m.value || m.label.trim() === '' || m.value.trim() === '') {
        test5.passed = false;
        test5.details.push(`[FAIL] ${p.id}: metric item invalid: ${JSON.stringify(m)}`);
      }
    }
  }

  // Highlights array
  if (!Array.isArray(p.highlights) || p.highlights.length === 0 || p.highlights.some(h => typeof h !== 'string' || h.trim() === '')) {
    test5.passed = false;
    test5.details.push(`[FAIL] ${p.id}: 'highlights' must be a non-empty array of non-empty strings.`);
  }
}
if (test5.passed) {
  test5.details.push(`All 7 projects contain non-empty required string fields, tags, metrics, and highlights.`);
}
results.push(test5);

// Output results summary
console.log('=== EMPIRICAL TEST SUITE RESULTS ===');
let overallPassed = true;
for (const res of results) {
  console.log(`\n--- ${res.name} --- [${res.passed ? 'PASSED' : 'FAILED'}]`);
  for (const line of res.details) {
    console.log(`  ${line}`);
  }
  if (!res.passed) overallPassed = false;
}

console.log(`\nOVERALL VERDICT: ${overallPassed ? 'APPROVE' : 'REQUEST_CHANGES'}`);
process.exit(overallPassed ? 0 : 1);
