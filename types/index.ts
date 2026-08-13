import type { Project, ProjectMetric, LeafNodeConfig } from "@/data/projects";

export type { Project, ProjectMetric, LeafNodeConfig };

export interface LeafNodeProps {
  project: Project;
  /** Absolute X coordinate (px or percentage string) relative to tree container */
  x: number | string;
  /** Absolute Y coordinate (px or percentage string) relative to tree container */
  y: number | string;
  /** Controls visibility based on scroll progress resolving terminal branch */
  isVisible?: boolean;
  /** Whether project detail drawer is currently open for this node */
  isSelected?: boolean;
  /** Callback to trigger project selection & detail drawer */
  onSelect: (project: Project) => void;
  /** Optional container class overrides */
  className?: string;
}

export interface ProjectDetailDrawerProps {
  project: Project | null;
  isOpen: boolean;
  onClose: () => void;
}
