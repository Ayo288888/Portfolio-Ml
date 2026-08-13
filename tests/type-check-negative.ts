import type { Project, ProjectMetric, LeafNodeConfig } from '../data/projects.ts';

// Test 1: Invalid side value (should be 'left' | 'right')
// @ts-expect-error
const invalidSide: LeafNodeConfig = {
  startScroll: 0.1,
  endScroll: 0.2,
  side: 'center',
  xOffsetPct: 20,
  yOffsetPct: 30,
  accentColor: '#ffffff',
};

// Test 2: Missing required metric fields
// @ts-expect-error
const invalidMetric: ProjectMetric = {
  label: 'F1',
  // missing value
};

// Test 3: Missing required Project fields
// @ts-expect-error
const invalidProject: Project = {
  id: 'test',
  title: 'Test',
  // missing required fields shortDescription, longDescription, etc.
};
