import { PROJECTS_DATA, getProjectById } from '../data/projects.ts';
import type { Project } from '../data/projects.ts';
import * as fs from 'fs';
import * as path from 'path';

interface TestResult {
  category: string;
  name: string;
  passed: boolean;
  error?: string;
  details?: any;
}

const results: TestResult[] = [];

function assert(condition: boolean, category: string, name: string, failureMessage?: string, details?: any) {
  if (condition) {
    results.push({ category, name, passed: true, details });
  } else {
    results.push({ category, name, passed: false, error: failureMessage || 'Assertion failed', details });
  }
}

async function runEmpiricalTests() {
  console.log('=== EMPIRICAL TEST SUITE: data/projects.ts ===\n');

  // 1. DATASET COUNT & UNIQ
  assert(Array.isArray(PROJECTS_DATA), 'Dataset', 'PROJECTS_DATA is Array', 'PROJECTS_DATA is not an array');
  assert(PROJECTS_DATA.length === 7, 'Dataset', 'PROJECTS_DATA length is 7', `Expected 7 items, got ${PROJECTS_DATA.length}`);

  const ids = new Set<string>();
  const idKebabRegex = /^[a-z0-9-]+$/;

  for (const project of PROJECTS_DATA) {
    const isUnique = !ids.has(project.id);
    ids.add(project.id);
    assert(isUnique, 'Dataset', `Project ID unique: ${project.id}`, `Duplicate project ID found: ${project.id}`);
    assert(
      idKebabRegex.test(project.id),
      'Dataset',
      `Project ID format kebab-case: ${project.id}`,
      `ID ${project.id} is not valid kebab-case`
    );
    assert(project.title.trim().length > 0, 'Dataset', `Project title non-empty: ${project.id}`);
    assert(project.category.trim().length > 0, 'Dataset', `Project category non-empty: ${project.id}`);
    assert(project.year.trim().length > 0, 'Dataset', `Project year non-empty: ${project.id}`);
    assert(project.shortDescription.trim().length > 0, 'Dataset', `Project shortDescription non-empty: ${project.id}`);
    assert(project.longDescription.trim().length > 0, 'Dataset', `Project longDescription non-empty: ${project.id}`);
  }

  // 2. METRICS ARRAYS
  for (const project of PROJECTS_DATA) {
    assert(
      Array.isArray(project.metrics) && project.metrics.length > 0,
      'Metrics',
      `Metrics non-empty array: ${project.id}`,
      `Project ${project.id} has no metrics array or empty metrics`
    );

    const metricLabels = new Set<string>();
    for (let i = 0; i < project.metrics.length; i++) {
      const metric = project.metrics[i];
      assert(
        typeof metric.label === 'string' && metric.label.trim().length > 0,
        'Metrics',
        `Metric label non-empty [${project.id}][${i}]`,
        `Project ${project.id} metric ${i} has empty or non-string label: "${metric.label}"`
      );
      assert(
        typeof metric.value === 'string' && metric.value.trim().length > 0,
        'Metrics',
        `Metric value non-empty [${project.id}][${i}]`,
        `Project ${project.id} metric ${i} has empty or non-string value: "${metric.value}"`
      );
      if (metric.description !== undefined) {
        assert(
          typeof metric.description === 'string' && metric.description.trim().length > 0,
          'Metrics',
          `Metric description non-empty [${project.id}][${i}]`,
          `Project ${project.id} metric ${i} has empty description`
        );
      }

      const isLabelUnique = !metricLabels.has(metric.label);
      metricLabels.add(metric.label);
      assert(
        isLabelUnique,
        'Metrics',
        `Metric label unique within project [${project.id}]: "${metric.label}"`,
        `Duplicate metric label "${metric.label}" in project ${project.id}`
      );
    }
  }

  // 3. HIGHLIGHTS ARRAYS
  for (const project of PROJECTS_DATA) {
    assert(
      Array.isArray(project.highlights) && project.highlights.length > 0,
      'Highlights',
      `Highlights non-empty array: ${project.id}`,
      `Project ${project.id} has no highlights array or empty highlights`
    );

    const highlightSet = new Set<string>();
    for (let i = 0; i < project.highlights.length; i++) {
      const highlight = project.highlights[i];
      assert(
        typeof highlight === 'string' && highlight.trim().length > 0,
        'Highlights',
        `Highlight non-empty string [${project.id}][${i}]`,
        `Project ${project.id} highlight ${i} is empty`
      );
      assert(
        highlight.trim().length >= 10,
        'Highlights',
        `Highlight descriptive length (>=10 chars) [${project.id}][${i}]`,
        `Highlight too short (<10 chars): "${highlight}"`
      );

      const isHighlightUnique = !highlightSet.has(highlight);
      highlightSet.add(highlight);
      assert(
        isHighlightUnique,
        'Highlights',
        `Highlight unique within project [${project.id}][${i}]`,
        `Duplicate highlight found in project ${project.id}`
      );
    }
  }

  // 4. TAG LISTS
  for (const project of PROJECTS_DATA) {
    assert(
      Array.isArray(project.tags) && project.tags.length > 0,
      'Tags',
      `Tags non-empty array: ${project.id}`,
      `Project ${project.id} has no tags array or empty tags`
    );

    const tagSet = new Set<string>();
    for (let i = 0; i < project.tags.length; i++) {
      const tag = project.tags[i];
      assert(
        typeof tag === 'string' && tag.trim().length > 0,
        'Tags',
        `Tag non-empty string [${project.id}][${i}]`,
        `Project ${project.id} tag ${i} is empty`
      );
      assert(
        tag === tag.trim(),
        'Tags',
        `Tag no leading/trailing whitespace [${project.id}][${i}]: "${tag}"`,
        `Tag "${tag}" has extra whitespace`
      );

      const isTagUnique = !tagSet.has(tag);
      tagSet.add(tag);
      assert(
        isTagUnique,
        'Tags',
        `Tag unique within project [${project.id}]: "${tag}"`,
        `Duplicate tag "${tag}" in project ${project.id}`
      );
    }
  }

  // 5. URL FORMATS
  for (const project of PROJECTS_DATA) {
    if (project.liveUrl !== undefined) {
      let valid = false;
      try {
        const parsed = new URL(project.liveUrl);
        valid = parsed.protocol === 'http:' || parsed.protocol === 'https:';
      } catch (e) {
        valid = false;
      }
      assert(
        valid,
        'URLs',
        `liveUrl valid URL format: ${project.id}`,
        `Project ${project.id} liveUrl "${project.liveUrl}" is not a valid http/https URL`
      );
    }

    if (project.githubUrl !== undefined) {
      let valid = false;
      try {
        const parsed = new URL(project.githubUrl);
        valid = (parsed.protocol === 'http:' || parsed.protocol === 'https:') && parsed.hostname === 'github.com';
      } catch (e) {
        valid = false;
      }
      assert(
        valid,
        'URLs',
        `githubUrl valid GitHub URL format: ${project.id}`,
        `Project ${project.id} githubUrl "${project.githubUrl}" is not a valid github.com URL`
      );
    }
  }

  // 5b. URL REACHABILITY (NETWORK FETCH TEST WITH 5s TIMEOUT)
  console.log('\n--- Testing URL Reachability (Network HTTP HEAD/GET) ---');
  for (const project of PROJECTS_DATA) {
    if (project.liveUrl) {
      try {
        const res = await fetch(project.liveUrl, { method: 'HEAD', headers: { 'User-Agent': 'Mozilla/5.0' }, signal: AbortSignal.timeout(15000) });
        const ok = res.status < 400;
        assert(
          ok,
          'URL Reachability',
          `liveUrl reachable HTTP 2xx/3xx [${project.id}]: ${project.liveUrl}`,
          `liveUrl returned HTTP ${res.status}: ${project.liveUrl}`
        );
      } catch (err: any) {
        // Retry with GET if HEAD fails
        try {
          const res = await fetch(project.liveUrl, { method: 'GET', headers: { 'User-Agent': 'Mozilla/5.0' }, signal: AbortSignal.timeout(15000) });
          const ok = res.status < 400;
          assert(
            ok,
            'URL Reachability',
            `liveUrl reachable HTTP 2xx/3xx [${project.id}]: ${project.liveUrl}`,
            `liveUrl returned HTTP ${res.status}: ${project.liveUrl}`
          );
        } catch (e2: any) {
          assert(
            false,
            'URL Reachability',
            `liveUrl reachable [${project.id}]: ${project.liveUrl}`,
            `Network error reaching liveUrl: ${e2.message}`
          );
        }
      }
    }

    if (project.githubUrl) {
      try {
        const res = await fetch(project.githubUrl, { method: 'HEAD', headers: { 'User-Agent': 'Mozilla/5.0' }, signal: AbortSignal.timeout(15000) });
        const ok = res.status < 400;
        assert(
          ok,
          'URL Reachability',
          `githubUrl reachable HTTP 2xx/3xx [${project.id}]: ${project.githubUrl}`,
          `githubUrl returned HTTP ${res.status}: ${project.githubUrl}`
        );
      } catch (err: any) {
        try {
          const res = await fetch(project.githubUrl, { method: 'GET', headers: { 'User-Agent': 'Mozilla/5.0' }, signal: AbortSignal.timeout(15000) });
          const ok = res.status < 400;
          assert(
            ok,
            'URL Reachability',
            `githubUrl reachable HTTP 2xx/3xx [${project.id}]: ${project.githubUrl}`,
            `githubUrl returned HTTP ${res.status}: ${project.githubUrl}`
          );
        } catch (e2: any) {
          assert(
            false,
            'URL Reachability',
            `githubUrl reachable [${project.id}]: ${project.githubUrl}`,
            `Network error reaching githubUrl: ${e2.message}`
          );
        }
      }
    }
  }

  // 6. LEAF CONFIGURATION
  const hexColorRegex = /^#[0-9a-fA-F]{6}$/;
  let prevEndScroll = 0;

  for (const project of PROJECTS_DATA) {
    const lc = project.leafConfig;
    assert(!!lc, 'LeafConfig', `leafConfig exists: ${project.id}`, `Project ${project.id} missing leafConfig`);
    if (lc) {
      assert(
        typeof lc.startScroll === 'number' && lc.startScroll >= 0 && lc.startScroll <= 1,
        'LeafConfig',
        `startScroll in range [0, 1]: ${project.id} (${lc.startScroll})`,
        `startScroll out of bounds: ${lc.startScroll}`
      );
      assert(
        typeof lc.endScroll === 'number' && lc.endScroll >= 0 && lc.endScroll <= 1,
        'LeafConfig',
        `endScroll in range [0, 1]: ${project.id} (${lc.endScroll})`,
        `endScroll out of bounds: ${lc.endScroll}`
      );
      assert(
        lc.startScroll < lc.endScroll,
        'LeafConfig',
        `startScroll < endScroll: ${project.id} (${lc.startScroll} < ${lc.endScroll})`,
        `startScroll (${lc.startScroll}) is not less than endScroll (${lc.endScroll})`
      );
      assert(
        lc.side === 'left' || lc.side === 'right',
        'LeafConfig',
        `side is 'left' or 'right': ${project.id} (${lc.side})`,
        `Invalid side value: ${lc.side}`
      );
      assert(
        typeof lc.xOffsetPct === 'number' && lc.xOffsetPct >= 0 && lc.xOffsetPct <= 100,
        'LeafConfig',
        `xOffsetPct in range [0, 100]: ${project.id} (${lc.xOffsetPct})`,
        `xOffsetPct out of bounds: ${lc.xOffsetPct}`
      );
      assert(
        typeof lc.yOffsetPct === 'number' && lc.yOffsetPct >= 0 && lc.yOffsetPct <= 100,
        'LeafConfig',
        `yOffsetPct in range [0, 100]: ${project.id} (${lc.yOffsetPct})`,
        `yOffsetPct out of bounds: ${lc.yOffsetPct}`
      );
      assert(
        hexColorRegex.test(lc.accentColor),
        'LeafConfig',
        `accentColor valid 6-char hex: ${project.id} (${lc.accentColor})`,
        `accentColor is not valid hex: ${lc.accentColor}`
      );

      // Check sequential ordering
      assert(
        lc.startScroll >= prevEndScroll - 0.05,
        'LeafConfig',
        `Monotonic scroll progression: ${project.id} (start ${lc.startScroll} vs prev end ${prevEndScroll})`,
        `Project ${project.id} startScroll (${lc.startScroll}) overlaps heavily with previous endScroll (${prevEndScroll})`
      );
      prevEndScroll = lc.endScroll;
    }
  }

  // 7. IMAGE ASSET FILE EXISTENCE
  console.log('\n--- Testing Image Asset Existence on Disk ---');
  const publicDir = path.join(process.cwd(), 'public');
  for (const project of PROJECTS_DATA) {
    assert(
      project.image.startsWith('/'),
      'Image Assets',
      `Image path starts with /: ${project.id} (${project.image})`,
      `Image path does not start with /: ${project.image}`
    );

    const relativeFilePath = project.image.startsWith('/') ? project.image.slice(1) : project.image;
    const fullPath = path.join(publicDir, relativeFilePath);
    const exists = fs.existsSync(fullPath);

    assert(
      exists,
      'Image Assets',
      `Image file exists on disk: ${project.id} -> ${relativeFilePath}`,
      `Image file NOT found on disk: ${fullPath}`
    );
  }

  // 8. HELPER FUNCTIONS
  console.log('\n--- Testing getProjectById Helper ---');
  for (const project of PROJECTS_DATA) {
    const found = getProjectById(project.id);
    assert(
      found === project,
      'Helpers',
      `getProjectById('${project.id}') returns project object`,
      `getProjectById failed for ${project.id}`
    );
  }
  const nonExistent = getProjectById('non-existent-id-12345');
  assert(
    nonExistent === undefined,
    'Helpers',
    `getProjectById('non-existent') returns undefined`,
    `Expected undefined, got ${JSON.stringify(nonExistent)}`
  );

  // SUMMARY & REPORT
  console.log('\n========================================');
  const total = results.length;
  const passed = results.filter((r) => r.passed).length;
  const failed = results.filter((r) => !r.passed).length;

  console.log(`TOTAL TESTS: ${total} | PASSED: ${passed} | FAILED: ${failed}`);

  if (failed > 0) {
    console.log('\nFAILURES:');
    for (const failure of results.filter((r) => !r.passed)) {
      console.log(`❌ [${failure.category}] ${failure.name}: ${failure.error}`);
    }
  } else {
    console.log('\nALL EMPIRICAL TESTS PASSED SUCCESSFULLY! 🎉');
  }

  return { total, passed, failed, results };
}

(async () => {
  try {
    const { total, passed, failed } = await runEmpiricalTests();
    if (failed > 0) {
      console.log(`\nCompleted with ${failed} failure(s).`);
    } else {
      console.log('\nAll empirical tests passed!');
    }
  } catch (err) {
    console.error('Fatal error running tests:', err);
    process.exit(1);
  }
})();
