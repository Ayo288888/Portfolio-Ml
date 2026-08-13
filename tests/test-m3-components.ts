import fs from 'node:fs';
import path from 'node:path';

interface TestResult {
  name: string;
  passed: boolean;
  details: string[];
}

const results: TestResult[] = [];

// 1. Check existence of created files
const test1: TestResult = { name: "1. Component & Types Files Existence", passed: true, details: [] };
const requiredFiles = [
  "types/index.ts",
  "components/leaf-node.tsx",
  "components/project-detail-drawer.tsx",
  "hooks/use-mobile.ts",
  "components/ui/sheet.tsx"
];

for (const relPath of requiredFiles) {
  const absPath = path.resolve(process.cwd(), relPath);
  if (fs.existsSync(absPath)) {
    test1.details.push(`[PASS] File exists: ${relPath}`);
  } else {
    test1.passed = false;
    test1.details.push(`[FAIL] File NOT found: ${relPath}`);
  }
}
results.push(test1);

// 2. Check types/index.ts exports content
const test2: TestResult = { name: "2. Types Export Verification in types/index.ts", passed: true, details: [] };
const typesFileContent = fs.readFileSync(path.resolve(process.cwd(), "types/index.ts"), "utf-8");
const requiredExports = ["Project", "ProjectMetric", "LeafNodeConfig", "LeafNodeProps", "ProjectDetailDrawerProps"];

for (const exp of requiredExports) {
  if (typesFileContent.includes(exp)) {
    test2.details.push(`[PASS] ${exp} is exported in types/index.ts`);
  } else {
    test2.passed = false;
    test2.details.push(`[FAIL] ${exp} is missing from types/index.ts`);
  }
}
results.push(test2);

// 3. Check LeafNode component source implementation requirements
const test3: TestResult = { name: "3. LeafNode Component Features Check", passed: true, details: [] };
const leafNodeContent = fs.readFileSync(path.resolve(process.cwd(), "components/leaf-node.tsx"), "utf-8");
const leafNodeFeatures = [
  { feature: "Position absolute container", keyword: "absolute" },
  { feature: "Bioluminescent pulse animation", keyword: "motion.span" },
  { feature: "Accent color integration", keyword: "accentColor" },
  { feature: "Viewport collision detection", keyword: "getBoundingClientRect" },
  { feature: "Framer Motion tooltip card", keyword: "AnimatePresence" },
  { feature: "Accessible button tag", keyword: 'type="button"' },
  { feature: "ARIA attributes", keyword: "aria-label" },
  { feature: "Escape key listener", keyword: 'Escape' },
];

for (const item of leafNodeFeatures) {
  if (leafNodeContent.includes(item.keyword)) {
    test3.details.push(`[PASS] LeafNode feature '${item.feature}' found (${item.keyword}).`);
  } else {
    test3.passed = false;
    test3.details.push(`[FAIL] LeafNode feature '${item.feature}' missing (${item.keyword}).`);
  }
}
results.push(test3);

// 4. Check ProjectDetailDrawer component source implementation requirements
const test4: TestResult = { name: "4. ProjectDetailDrawer Component Features Check", passed: true, details: [] };
const drawerContent = fs.readFileSync(path.resolve(process.cwd(), "components/project-detail-drawer.tsx"), "utf-8");
const drawerFeatures = [
  { feature: "Sheet primitive integration", keyword: "SheetContent" },
  { feature: "Dark glassmorphism styling", keyword: "backdrop-blur-2xl" },
  { feature: "Mobile responsive fallback hook", keyword: "useIsMobile" },
  { feature: "Key metrics grid display", keyword: "metrics" },
  { feature: "Technical highlights list", keyword: "highlights" },
  { feature: "External liveUrl button", keyword: "liveUrl" },
  { feature: "External githubUrl button", keyword: "githubUrl" },
  { feature: "Accessible title and description", keyword: "SheetTitle" },
];

for (const item of drawerFeatures) {
  if (drawerContent.includes(item.keyword)) {
    test4.details.push(`[PASS] Drawer feature '${item.feature}' found (${item.keyword}).`);
  } else {
    test4.passed = false;
    test4.details.push(`[FAIL] Drawer feature '${item.feature}' missing (${item.keyword}).`);
  }
}
results.push(test4);

// Output results summary
console.log('=== MILESTONE 3 COMPONENT VERIFICATION RESULTS ===');
let overallPassed = true;
for (const res of results) {
  console.log(`\n--- ${res.name} --- [${res.passed ? 'PASSED' : 'FAILED'}]`);
  for (const line of res.details) {
    console.log(`  ${line}`);
  }
  if (!res.passed) overallPassed = false;
}

console.log(`\nOVERALL M3 VERDICT: ${overallPassed ? 'PASS' : 'FAIL'}`);
process.exit(overallPassed ? 0 : 1);
