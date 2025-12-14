export interface RepoMetadata {
  name: string;
  language_stack: string[];
  age_months: number;
  stars: number;
  forks: number;
}

export type MedalType = 'Platinum' | 'Gold' | 'Silver' | 'Bronze';

export interface MacroScores {
  structure: number;
  code_quality: number;
  documentation: number;
  testing: number;
  version_control: number;
  security: number;
  operational: number;
  professionalism: number;
  business: number;
  scalability: number;
}

export interface CriticalFlags {
  has_tests: boolean;
  has_readme: boolean;
  has_license: boolean;
  secrets_detected: boolean;
  unused_dependencies: number;
}

export interface ImprovementItem {
  dimension: string;
  action: string;
  reason: string;
}

export interface ModuleAnalysis {
  score: number;
  medal: MedalType;
  strengths: string[];
  weaknesses: string[];
  hidden_risks: string[];
  real_world_impact: string;
  failure_scenario: string;
  remediation_steps: string[];
}

export interface SecurityIssue {
  issue: string;
  severity: number; // 1-10
  explanation: string;
  mitigation: string;
}

export interface SecurityModule extends ModuleAnalysis {
  vulnerabilities: SecurityIssue[];
}

export interface TeamRole {
  role: string;
  count: number;
  justification: string;
}

export interface HomePageData {
  overview: string;
  executive_summary: string;
  overall_score: number;
  maturity_level: 'Beginner' | 'Intermediate' | 'Advanced';
  risk_snapshot: string[];
  team_recommendation: TeamRole[];
}

export interface ModuleMap {
  structure: ModuleAnalysis;
  code_quality: ModuleAnalysis;
  documentation: ModuleAnalysis;
  testing: ModuleAnalysis;
  version_control: ModuleAnalysis;
  security: SecurityModule;
  operational: ModuleAnalysis;
  professionalism: ModuleAnalysis;
  business: ModuleAnalysis;
  scalability: ModuleAnalysis;
}

export interface FullReport {
  repo_metadata: RepoMetadata;
  critical_flags: CriticalFlags;
  home_page: HomePageData;
  modules: ModuleMap;
  improvement_roadmap: ImprovementItem[];
  repo_url?: string; // Optional field for enhanced chat context
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

export type AnalysisState = 'IDLE' | 'ANALYZING' | 'COMPLETE' | 'ERROR';
