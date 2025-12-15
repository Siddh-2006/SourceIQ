import React, { useState } from 'react';
import { FullReport, ModuleMap, ModuleAnalysis, SecurityModule, MedalType } from '../types';
import { RadarView } from './RadarView';
import { ChatInterface } from './ChatInterface';
import { formatExecutiveSummary, formatRiskText, formatTeamText, formatWithEmojis } from '../utils/textFormatting';
import {
  ShieldAlert, CheckCircle2, AlertTriangle, GitBranch, Star,
  ArrowRight, Layout, Code2, Book, TestTube2, GitCommit,
  Lock, Activity, Briefcase, ChevronRight, ArrowLeft,
  Users, TrendingUp, DollarSign, Server, Medal, BarChart3, Filter,
  Sparkles, Zap, Crosshair, Layers, X, AlertOctagon, ChevronDown
} from 'lucide-react';
import { clsx } from 'clsx';

interface DashboardProps {
  report: FullReport;
  onReset: () => void;
}

type ModuleKey = keyof ModuleMap;

const getMedalFromScore = (score: number): MedalType => {
  if (score >= 90) return 'Platinum';
  if (score >= 75) return 'Gold';
  if (score >= 50) return 'Silver';
  return 'Bronze';
};

const MedalSticker = ({ medal }: { medal: MedalType }) => {
  const styles = {
    Platinum: "bg-cyan-950/40 text-cyan-400 border-cyan-500/50 shadow-[0_0_15px_rgba(34,211,238,0.25)]",
    Gold: "bg-yellow-950/40 text-yellow-400 border-yellow-500/50 shadow-[0_0_15px_rgba(250,204,21,0.25)]",
    Silver: "bg-zinc-800/60 text-zinc-300 border-zinc-500/50 shadow-[0_0_15px_rgba(161,161,170,0.25)]",
    Bronze: "bg-orange-950/40 text-orange-400 border-orange-500/50 shadow-[0_0_15px_rgba(249,115,22,0.25)]"
  };

  return (
    <div className={clsx(
      "flex items-center gap-2 px-3 py-1.5 rounded-full border backdrop-blur-md transition-all hover:scale-105 cursor-help",
      styles[medal]
    )} title={`${medal} Overall Standard`}>
      <Medal size={16} fill="currentColor" />
      <span className="text-xs font-bold uppercase tracking-widest">{medal}</span>
    </div>
  );
};

export const Dashboard: React.FC<DashboardProps> = ({ report, onReset }) => {
  const [activeModule, setActiveModule] = useState<ModuleKey | null>(null);
  const [roadmapFilter, setRoadmapFilter] = useState<string>('ALL');
  const [showRiskModal, setShowRiskModal] = useState(false);
  const { home_page, modules, repo_metadata, improvement_roadmap } = report;

  // Map icons to modules
  const getModuleIcon = (key: string) => {
    switch (key) {
      case 'structure': return <Layout size={18} />;
      case 'code_quality': return <Code2 size={18} />;
      case 'documentation': return <Book size={18} />;
      case 'testing': return <TestTube2 size={18} />;
      case 'version_control': return <GitCommit size={18} />;
      case 'security': return <Lock size={18} />;
      case 'operational': return <Activity size={18} />;
      case 'professionalism': return <Briefcase size={18} />;
      case 'business': return <DollarSign size={18} />;
      case 'scalability': return <TrendingUp size={18} />;
      default: return <Layout size={18} />;
    }
  };

  const getMaturityColor = (level: string) => {
    switch (level) {
      case 'Advanced': return 'text-success bg-success/10 border-success/20';
      case 'Intermediate': return 'text-warning bg-warning/10 border-warning/20';
      default: return 'text-danger bg-danger/10 border-danger/20';
    }
  };

  const scores = {
    Structure: modules.structure.score,
    Quality: modules.code_quality.score,
    Docs: modules.documentation.score,
    Testing: modules.testing.score,
    VCS: modules.version_control.score,
    Security: modules.security.score,
    Ops: modules.operational.score,
    Pro: modules.professionalism.score,
    Business: modules.business.score,
    Scale: modules.scalability.score,
  };

  const uniqueDimensions = ['ALL', ...Array.from(new Set(improvement_roadmap.map(i => i.dimension)))];
  const filteredRoadmap = roadmapFilter === 'ALL'
    ? improvement_roadmap.slice(0, 4)
    : improvement_roadmap.filter(i => i.dimension === roadmapFilter);

  const overallMedal = getMedalFromScore(home_page.overall_score);

  return (
    <div className="flex h-screen bg-background text-zinc-200 overflow-hidden font-sans selection:bg-primary/30">

      {/* Modern Sidebar */}
      <aside className="w-16 lg:w-64 border-r border-white/5 bg-[#09090b] flex flex-col flex-shrink-0 z-20 transition-all duration-300">
        <div className="p-4 lg:p-6 border-b border-white/5 flex items-center justify-center lg:justify-start gap-3">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center font-bold text-white shadow-lg shadow-primary/20">
            <Sparkles size={16} fill="white" />
          </div>
          <span className="hidden lg:block font-bold text-white tracking-tight text-lg">SourceIQ</span>
        </div>

        <nav className="flex-1 overflow-y-auto py-6 space-y-1 px-3">
          <button
            onClick={() => setActiveModule(null)}
            className={clsx(
              "w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all text-sm font-medium group",
              activeModule === null
                ? "bg-gradient-to-r from-primary/10 to-transparent text-primary border-l-2 border-primary"
                : "text-zinc-500 hover:bg-white/5 hover:text-zinc-200"
            )}
          >
            <Layout size={20} className={clsx(activeModule === null && "drop-shadow-[0_0_8px_rgba(99,102,241,0.5)]")} />
            <span className="hidden lg:block">Mission Control</span>
          </button>

          <div className="hidden lg:block px-3 mt-8 mb-4 text-[10px] font-bold text-zinc-600 uppercase tracking-widest">
            Audit Modules
          </div>

          {(Object.keys(modules) as ModuleKey[]).map((key) => (
            <button
              key={key}
              onClick={() => setActiveModule(key)}
              className={clsx(
                "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-sm font-medium group relative overflow-hidden",
                activeModule === key
                  ? "bg-gradient-to-r from-primary/10 to-transparent text-primary border-l-2 border-primary"
                  : "text-zinc-500 hover:bg-white/5 hover:text-zinc-200"
              )}
            >
              <span className="relative z-10 flex items-center gap-3">
                {getModuleIcon(key)}
                <span className="hidden lg:block capitalize truncate">{key.replace(/_/g, ' ')}</span>
              </span>
              {modules[key].score < 50 && (
                <span className="hidden lg:block ml-auto w-1.5 h-1.5 rounded-full bg-danger shadow-[0_0_8px_rgba(239,68,68,0.6)]" />
              )}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-white/5 bg-zinc-900/30">
          <button
            onClick={onReset}
            className="w-full flex items-center justify-center lg:justify-start gap-3 px-3 py-3 text-sm font-medium text-zinc-400 hover:text-white hover:bg-white/5 rounded-xl transition-colors"
          >
            <ArrowLeft size={18} />
            <span className="hidden lg:block">New Audit</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto bg-background relative scroll-smooth">
        {/* Background Ambience */}
        <div className="fixed inset-0 pointer-events-none z-0">
          <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px]" />
          <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-secondary/5 rounded-full blur-[100px]" />
        </div>

        {/* Header */}
        <header className="sticky top-0 bg-[#030304]/80 backdrop-blur-xl border-b border-white/5 z-30 px-8 py-5 flex justify-between items-center">
          <div>
            <div className="flex items-center gap-4 mb-1">
              <h1 className="text-xl font-bold text-white tracking-tight">{repo_metadata.name}</h1>
              <MedalSticker medal={overallMedal} />
            </div>
            <div className="flex items-center gap-4 text-xs text-zinc-500 font-mono">
              <span className="flex items-center gap-1.5"><GitBranch size={12} /> {repo_metadata.forks}</span>
              <span className="flex items-center gap-1.5"><Star size={12} /> {repo_metadata.stars}</span>
              <span className={clsx("px-2 py-0.5 rounded-full border text-[10px] uppercase font-bold", getMaturityColor(home_page.maturity_level))}>
                {home_page.maturity_level}
              </span>
            </div>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold mb-1">Overall Health</span>
            <div className="flex items-baseline gap-1">
              <span className={clsx("text-3xl font-mono font-bold tracking-tighter",
                home_page.overall_score > 75 ? "text-success drop-shadow-[0_0_10px_rgba(16,185,129,0.3)]" :
                  home_page.overall_score > 40 ? "text-warning" : "text-danger")}>
                {home_page.overall_score}
              </span>
              <span className="text-sm text-zinc-600">/100</span>
            </div>
          </div>
        </header>

        <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-8 pb-32 relative z-10">
          {activeModule === null ? (
            // MISSION CONTROL - ENHANCED LAYOUT WITH REPOSITORY HERO
            <div className="animate-fade-in space-y-8">

              {/* Repository Hero Section */}
              <div className="bg-gradient-to-br from-surface/50 via-primary/5 to-secondary/5 backdrop-blur-md border border-white/10 rounded-3xl p-8 lg:p-12 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-40 bg-gradient-to-br from-primary/10 to-transparent rounded-full blur-[80px] pointer-events-none" />
                <div className="absolute bottom-0 left-0 p-32 bg-gradient-to-tr from-secondary/10 to-transparent rounded-full blur-[60px] pointer-events-none" />

                <div className="relative z-10">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="p-4 rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 border border-white/10">
                      <Sparkles className="text-primary" size={32} />
                    </div>
                    <div>
                      <h1 className="text-3xl lg:text-4xl font-bold text-white tracking-tight mb-2">
                        {repo_metadata.name}
                      </h1>
                      <div className="flex items-center gap-4 text-zinc-400">
                        <span className="flex items-center gap-2">
                          <GitBranch size={16} />
                          <span className="font-mono">{repo_metadata.forks} forks</span>
                        </span>
                        <span className="flex items-center gap-2">
                          <Star size={16} />
                          <span className="font-mono">{repo_metadata.stars} stars</span>
                        </span>
                        <span className="flex items-center gap-2">
                          <BarChart3 size={16} />
                          <span className="font-mono">{repo_metadata.age_months} months old</span>
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Repository Description & Summary */}
                  <div className="mb-8">
                    <div className="prose prose-lg prose-invert max-w-none">
                      <div className="mb-6">
                        {formatExecutiveSummary(home_page.executive_summary)}
                      </div>
                    </div>

                    {/* Tech Stack Pills */}
                    <div className="flex flex-wrap gap-3 mb-6">
                      {report.repo_metadata.language_stack.map((lang, i) => (
                        <span key={i} className="px-4 py-2 rounded-full bg-white/10 border border-white/20 text-sm text-white font-medium hover:bg-white/20 transition-colors">
                          {lang}
                        </span>
                      ))}
                    </div>

                    {/* Key Metrics Row */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                      <div className="text-center p-4 bg-white/5 rounded-2xl border border-white/10">
                        <div className="text-3xl font-bold text-white mb-1">{home_page.overall_score}</div>
                        <div className="text-sm text-zinc-400">Overall Score</div>
                      </div>
                      <div className="text-center p-4 bg-white/5 rounded-2xl border border-white/10">
                        <div className="text-3xl font-bold text-success mb-1">{home_page.maturity_level}</div>
                        <div className="text-sm text-zinc-400">Maturity Level</div>
                      </div>
                      <div className="text-center p-4 bg-white/5 rounded-2xl border border-white/10">
                        <div className="text-3xl font-bold text-primary mb-1">{home_page.risk_snapshot.length}</div>
                        <div className="text-sm text-zinc-400">Risk Areas</div>
                      </div>
                      <div className="text-center p-4 bg-white/5 rounded-2xl border border-white/10">
                        <div className="text-3xl font-bold text-secondary mb-1">{home_page.team_recommendation.length}</div>
                        <div className="text-sm text-zinc-400">Team Needs</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Main Analysis Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                {/* Left Column - Radar Chart */}
                <div className="lg:col-span-5">
                  <div className="bg-surface/50 backdrop-blur-md border border-white/10 rounded-3xl p-6 h-full hover:border-white/20 transition-all duration-500 group">
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <h3 className="text-xl font-bold text-white mb-2">Macro Analysis</h3>
                        <p className="text-sm text-zinc-400">Comprehensive quality assessment across all dimensions</p>
                      </div>
                      <div className="p-3 rounded-xl bg-primary/10 border border-primary/20">
                        <Crosshair size={20} className="text-primary" />
                      </div>
                    </div>
                    <div className="w-full h-[400px] relative">
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 rounded-2xl" />
                      <RadarView scores={scores} />
                    </div>
                  </div>
                </div>

                {/* Right Column - Risk Assessment */}
                <div className="lg:col-span-7">
                  <div className="bg-gradient-to-br from-surface/50 to-danger/5 backdrop-blur-md border border-white/10 rounded-3xl p-6 h-full">
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-3">
                          <div className="w-3 h-3 bg-danger rounded-full animate-pulse"></div>
                          Critical Risk Assessment
                        </h3>
                        <p className="text-sm text-zinc-400">Priority-ranked security and operational concerns</p>
                      </div>
                      <button
                        onClick={() => setShowRiskModal(true)}
                        className="px-4 py-2 bg-danger/10 border border-danger/20 rounded-xl text-danger text-sm font-medium hover:bg-danger/20 transition-colors"
                      >
                        View All Risks
                      </button>
                    </div>

                    <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                      {home_page.risk_snapshot.map((risk, index) => {
                        const riskLevel = index === 0 ? 'CRITICAL' : index === 1 ? 'HIGH' : index === 2 ? 'MEDIUM' : 'LOW';
                        const riskColors = {
                          'CRITICAL': { bg: 'bg-red-500/10', border: 'border-red-500/30', text: 'text-red-400', badge: 'bg-red-500/20' },
                          'HIGH': { bg: 'bg-orange-500/10', border: 'border-orange-500/30', text: 'text-orange-400', badge: 'bg-orange-500/20' },
                          'MEDIUM': { bg: 'bg-yellow-500/10', border: 'border-yellow-500/30', text: 'text-yellow-400', badge: 'bg-yellow-500/20' },
                          'LOW': { bg: 'bg-blue-500/10', border: 'border-blue-500/30', text: 'text-blue-400', badge: 'bg-blue-500/20' }
                        };
                        const colors = riskColors[riskLevel as keyof typeof riskColors];

                        return (
                          <div key={index} className={`p-5 ${colors.bg} border ${colors.border} rounded-2xl hover:scale-[1.02] transition-all duration-300 group`}>
                            <div className="flex items-start gap-4">
                              <div className={`p-3 rounded-xl ${colors.badge} flex-shrink-0`}>
                                <AlertTriangle className={colors.text} size={20} />
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center justify-between mb-3">
                                  <span className={`text-xs font-bold px-3 py-1 rounded-full ${colors.badge} ${colors.text} uppercase tracking-wider`}>
                                    {riskLevel} PRIORITY
                                  </span>
                                  <span className="text-xs text-zinc-500 font-mono">#{index + 1}</span>
                                </div>
                                <div className="group-hover:text-white transition-colors">
                                  {formatRiskText(risk)}
                                </div>
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </div>
              </div>

              {/* Team Topology Section */}
              <div className="bg-gradient-to-br from-surface/50 to-secondary/5 backdrop-blur-md border border-white/10 rounded-3xl p-8">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-2 flex items-center gap-3">
                      <div className="p-3 rounded-xl bg-secondary/10 border border-secondary/20">
                        <Users className="text-secondary" size={24} />
                      </div>
                      Team Topology Strategy
                    </h3>
                    <p className="text-zinc-400">Strategic hiring recommendations based on technical analysis</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {home_page.team_recommendation.map((rec, index) => {
                    const priorityLevel = index === 0 ? 'IMMEDIATE' : index === 1 ? 'SHORT-TERM' : 'LONG-TERM';
                    const priorityColors = {
                      'IMMEDIATE': { bg: 'bg-red-500/10', border: 'border-red-500/30', text: 'text-red-400', badge: 'bg-red-500/20', icon: 'text-red-400' },
                      'SHORT-TERM': { bg: 'bg-yellow-500/10', border: 'border-yellow-500/30', text: 'text-yellow-400', badge: 'bg-yellow-500/20', icon: 'text-yellow-400' },
                      'LONG-TERM': { bg: 'bg-green-500/10', border: 'border-green-500/30', text: 'text-green-400', badge: 'bg-green-500/20', icon: 'text-green-400' }
                    };
                    const colors = priorityColors[priorityLevel as keyof typeof priorityColors];

                    return (
                      <div key={index} className={`p-6 ${colors.bg} border ${colors.border} rounded-2xl hover:scale-[1.02] transition-all duration-300 group relative overflow-hidden`}>
                        <div className="absolute top-0 right-0 p-20 bg-gradient-to-br from-white/5 to-transparent rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                        <div className="relative z-10">
                          <div className="flex items-center justify-between mb-4">
                            <div className={`p-3 rounded-xl ${colors.badge}`}>
                              <Users className={colors.icon} size={20} />
                            </div>
                            <div className={`text-3xl font-bold ${colors.text} bg-white/5 px-4 py-2 rounded-xl border border-white/10`}>
                              {rec.count}x
                            </div>
                          </div>

                          <div className="mb-4">
                            <h4 className="text-xl font-bold text-white mb-2">{rec.role}</h4>
                            <span className={`text-xs font-bold px-3 py-1 rounded-full ${colors.badge} ${colors.text} uppercase tracking-wider`}>
                              {priorityLevel}
                            </span>
                          </div>

                          <div className="border-l-2 border-white/20 pl-4 mb-4">
                            <div>
                              {formatTeamText(rec.justification)}
                            </div>
                          </div>

                          <div className="flex items-center justify-between text-xs text-zinc-500">
                            <span>Hiring Priority: #{index + 1}</span>
                            <div className="flex items-center gap-1">
                              <div className={`w-2 h-2 rounded-full ${colors.text.replace('text-', 'bg-')}`}></div>
                              <span className="uppercase tracking-wider font-mono">{priorityLevel}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Roadmap - Wide Bottom Card */}
              <div className="col-span-12 bg-surface/30 backdrop-blur-md border border-white/10 rounded-3xl p-6 lg:p-8">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-8">
                  <div className="flex items-center gap-2">
                    <Zap className="text-yellow-400" size={18} fill="currentColor" />
                    <h3 className="text-lg font-bold text-white tracking-tight">Remediation Roadmap</h3>
                  </div>

                  <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 scrollbar-hide">
                    <Filter size={14} className="text-zinc-500 flex-shrink-0" />
                    <div className="flex gap-2">
                      {uniqueDimensions.map(dim => (
                        <button
                          key={dim}
                          onClick={() => setRoadmapFilter(dim)}
                          className={clsx(
                            "px-4 py-1.5 rounded-full text-xs font-medium border transition-all whitespace-nowrap",
                            roadmapFilter === dim
                              ? "bg-primary/20 text-primary border-primary/50 shadow-[0_0_10px_rgba(99,102,241,0.2)]"
                              : "bg-white/5 text-zinc-400 border-white/5 hover:bg-white/10 hover:text-white"
                          )}
                        >
                          {dim === 'ALL' ? 'High Priority' : dim}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredRoadmap.length > 0 ? (
                    filteredRoadmap.map((item, idx) => (
                      <div key={idx} className="group p-5 bg-[#09090b] border border-white/5 rounded-2xl hover:border-primary/30 transition-all duration-300 relative overflow-hidden">
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-primary to-transparent opacity-50 group-hover:opacity-100 transition-opacity" />
                        <div className="text-[10px] text-primary font-mono mb-2 uppercase tracking-widest">{item.dimension}</div>
                        <div className="font-bold text-white mb-2 group-hover:text-primary transition-colors">{item.action}</div>
                        <div className="text-sm text-zinc-400 leading-relaxed">{item.reason}</div>
                      </div>
                    ))
                  ) : (
                    <div className="col-span-full py-12 text-center text-zinc-600 text-sm italic border-2 border-dashed border-white/5 rounded-2xl">
                      All clear for this filter category.
                    </div>
                  )}
                </div>
              </div>

            </div>
          ) : (
            // MODULE DETAIL VIEW
            <div className="animate-slide-up space-y-8">
              <ModuleDetailView
                moduleKey={activeModule}
                data={modules[activeModule] as any}
              />
            </div>
          )}
        </div>

        {/* Floating Chat Integration */}
        <ChatInterface report={report} />

        {/* Risk Intelligence Modal */}
        {showRiskModal && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
            <div className="bg-[#09090b] border border-white/10 rounded-3xl w-full max-w-2xl max-h-[80vh] overflow-y-auto relative shadow-2xl animate-slide-up">
              <button
                onClick={() => setShowRiskModal(false)}
                className="absolute top-6 right-6 p-2 rounded-full bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>

              <div className="p-8">
                <div className="flex items-center gap-4 mb-8">
                  <div className="p-4 rounded-2xl bg-warning/10 text-warning border border-warning/20">
                    <AlertTriangle size={32} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white tracking-tight">Risk Intelligence Report</h2>
                    <p className="text-zinc-400 mt-1">Comprehensive list of detected threats</p>
                  </div>
                </div>

                <div className="space-y-3">
                  {home_page.risk_snapshot.map((risk, i) => (
                    <div key={i} className="flex gap-4 p-5 bg-white/5 rounded-2xl border border-white/5 hover:border-warning/30 transition-colors group">
                      <span className="font-mono text-warning/50 text-sm pt-0.5">{(i + 1).toString().padStart(2, '0')}</span>
                      <p className="text-zinc-200 leading-relaxed group-hover:text-white transition-colors">{risk}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
};

const ModuleDetailView = ({ moduleKey, data }: { moduleKey: string, data: ModuleAnalysis & Partial<SecurityModule> }) => {
  const isSecurity = moduleKey === 'security';
  const [expandedVuln, setExpandedVuln] = useState<number | null>(null);

  const getSeverityStyles = (score: number) => {
    if (score >= 9) return {
      color: 'text-rose-500',
      border: 'border-rose-500',
      bg: 'bg-rose-500/10',
      indicator: 'bg-rose-500'
    };
    if (score >= 7) return {
      color: 'text-orange-500',
      border: 'border-orange-500',
      bg: 'bg-orange-500/10',
      indicator: 'bg-orange-500'
    };
    if (score >= 4) return {
      color: 'text-amber-400',
      border: 'border-amber-400',
      bg: 'bg-amber-400/10',
      indicator: 'bg-amber-400'
    };
    return {
      color: 'text-cyan-400',
      border: 'border-cyan-400',
      bg: 'bg-cyan-400/10',
      indicator: 'bg-cyan-400'
    };
  };

  return (
    <div className="space-y-8">
      {/* Module Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-white/10 pb-8 gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] text-zinc-400 uppercase tracking-widest mb-4 font-bold">
            <Layers size={10} /> Macro Dimension
          </div>
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <h2 className="text-4xl md:text-5xl font-bold text-white capitalize tracking-tighter">{moduleKey.replace(/_/g, ' ')}</h2>

            {/* Large Medal */}
            <div className="flex-shrink-0 p-3 rounded-full bg-white/5 border border-white/5 backdrop-blur-xl">
              {data.medal === 'Platinum' && <Medal size={40} className="text-cyan-400 drop-shadow-[0_0_20px_rgba(34,211,238,0.5)]" />}
              {data.medal === 'Gold' && <Medal size={40} className="text-yellow-400 drop-shadow-[0_0_20px_rgba(250,204,21,0.5)]" />}
              {data.medal === 'Silver' && <Medal size={40} className="text-zinc-300 drop-shadow-[0_0_20px_rgba(161,161,170,0.5)]" />}
              {data.medal === 'Bronze' && <Medal size={40} className="text-orange-500 drop-shadow-[0_0_20px_rgba(249,115,22,0.5)]" />}
            </div>
          </div>
        </div>
        <div className="flex items-end gap-8">
          <div className="hidden md:block text-right">
            <div className="text-xs text-zinc-500 mb-2 flex items-center justify-end gap-1 font-mono uppercase">
              Benchmark
            </div>
            {/* Micro Chart Simulation */}
            <div className="flex gap-1.5 items-end h-12">
              {[40, 60, 50, 70, 60, 80].map((h, i) => (
                <div key={i} style={{ height: `${h}%` }} className="w-2 bg-white/5 rounded-t-sm" />
              ))}
              <div style={{ height: `${data.score}%` }} className="w-2 bg-primary rounded-t-sm shadow-[0_0_10px_rgba(99,102,241,0.5)]" />
            </div>
          </div>
          <div className="text-right">
            <div className="text-xs text-zinc-500 mb-1 uppercase tracking-widest font-bold">Score</div>
            <div className={clsx("text-6xl font-mono font-bold tracking-tighter", data.score > 70 ? "text-white" : "text-warning")}>
              {data.score}
            </div>
          </div>
        </div>
      </div>

      {/* Security Specific Section with Heatmap & Interactive List */}
      {isSecurity && data.vulnerabilities && (
        <div className="bg-[#09090b] border border-white/10 rounded-3xl p-6 lg:p-8 relative overflow-hidden">
          {/* Background effects */}
          <div className="absolute top-0 right-0 p-40 bg-red-500/5 rounded-full blur-[100px] pointer-events-none" />

          <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3 relative z-10">
            <ShieldAlert className="text-rose-500" size={24} />
            Vulnerability Assessment
          </h3>

          {/* Heatmap Bar */}
          <div className="flex gap-1 mb-8 relative z-10 h-2 rounded-full overflow-hidden bg-white/5">
            {data.vulnerabilities.map((v, i) => {
              const styles = getSeverityStyles(v.severity);
              return (
                <div
                  key={i}
                  className={`flex-1 ${styles.indicator} opacity-80 transition-opacity hover:opacity-100`}
                  title={`Severity: ${v.severity}`}
                />
              )
            })}
          </div>

          <div className="grid gap-3 relative z-10">
            {data.vulnerabilities.map((vuln, i) => {
              const isOpen = expandedVuln === i;
              const styles = getSeverityStyles(vuln.severity);

              return (
                <div
                  key={i}
                  onClick={() => setExpandedVuln(isOpen ? null : i)}
                  className={`
                        rounded-xl border transition-all duration-300 cursor-pointer overflow-hidden
                        ${isOpen ? `bg-white/5 border-white/20` : 'bg-[#09090b] border-white/5 hover:border-white/20'}
                      `}
                >
                  {/* Header Row */}
                  <div className="p-4 flex items-center gap-4">
                    {/* Severity Score Box */}
                    <div className={`
                            w-12 h-12 rounded-lg flex flex-col items-center justify-center border
                            ${styles.border} ${styles.bg}
                            shadow-[0_0_15px_rgba(0,0,0,0.3)] ${isOpen ? 'scale-110' : ''} transition-transform
                         `}>
                      <span className={`text-lg font-bold ${styles.color}`}>{vuln.severity}</span>
                    </div>

                    <div className="flex-1 min-w-0">
                      <h4 className={`font-bold text-base truncate ${styles.color}`}>{vuln.issue}</h4>
                      {!isOpen && <p className="text-xs text-zinc-500 truncate mt-1">{vuln.explanation}</p>}
                    </div>

                    <ChevronRight className={`text-zinc-600 transition-transform duration-300 ${isOpen ? 'rotate-90' : ''}`} />
                  </div>

                  {/* Expanded Content */}
                  <div className={`
                         overflow-hidden transition-all duration-300 ease-in-out
                         ${isOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}
                      `}>
                    <div className="p-4 pt-0 text-sm border-t border-white/5 mx-4 mt-2">
                      <div className="grid md:grid-cols-2 gap-6 py-4">
                        <div>
                          <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold block mb-2">Analysis</span>
                          <div className="leading-relaxed">{formatWithEmojis(vuln.explanation)}</div>
                        </div>
                        <div className="bg-white/5 rounded-lg p-3 border border-white/5">
                          <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold block mb-2 flex items-center gap-2">
                            <CheckCircle2 size={12} className="text-success" /> Remediation
                          </span>
                          <div className="text-xs font-mono block leading-relaxed break-words">{formatWithEmojis(vuln.mitigation)}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 3-Column Analysis */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-4">
          <h3 className="text-xs font-bold text-success uppercase tracking-widest flex items-center gap-2 mb-2">
            <CheckCircle2 size={14} /> Key Strengths
          </h3>
          <ul className="space-y-3">
            {data.strengths.map((item, i) => (
              <li key={i} className="text-sm bg-surface/50 p-4 rounded-xl border border-white/5 hover:border-success/30 transition-colors">
                {formatWithEmojis(item)}
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-4">
          <h3 className="text-xs font-bold text-warning uppercase tracking-widest flex items-center gap-2 mb-2">
            <AlertTriangle size={14} /> Weaknesses
          </h3>
          <ul className="space-y-3">
            {data.weaknesses.map((item, i) => (
              <li key={i} className="text-sm bg-surface/50 p-4 rounded-xl border border-white/5 hover:border-warning/30 transition-colors">
                {formatWithEmojis(item)}
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-4">
          <h3 className="text-xs font-bold text-primary uppercase tracking-widest flex items-center gap-2 mb-2">
            <Activity size={14} /> Implicit Risks
          </h3>
          <ul className="space-y-3">
            {data.hidden_risks.map((item, i) => (
              <li key={i} className="text-sm bg-surface/50 p-4 rounded-xl border border-white/5 border-l-2 border-l-primary/50">
                {formatWithEmojis(item)}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Impact & Failure Scenarios */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        <div className="bg-surface/50 backdrop-blur-md border border-white/10 rounded-3xl p-8">
          <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-4">Real World Impact</h3>
          <div className="text-lg leading-relaxed font-light">
            {formatWithEmojis(data.real_world_impact)}
          </div>
        </div>
        <div className="bg-[#09090b] border border-white/10 rounded-3xl p-8 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-32 bg-danger/5 rounded-full blur-[80px] pointer-events-none group-hover:bg-danger/10 transition-colors duration-700" />
          <h3 className="text-xs font-bold text-danger uppercase tracking-widest mb-4 flex items-center gap-2">
            <AlertTriangle size={12} /> Projected Failure (6-24mo)
          </h3>
          <div className="text-lg leading-relaxed font-light relative z-10">
            {formatWithEmojis(data.failure_scenario)}
          </div>
        </div>
      </div>

      {/* Remediation */}
      <div className="bg-gradient-to-br from-surface/50 to-primary/5 border border-white/10 rounded-3xl p-8">
        <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-6">Action Plan</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {data.remediation_steps.map((step, i) => (
            <div key={i} className="flex items-start gap-4">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-white/5 border border-white/10 text-sm font-mono text-primary mt-0.5 shadow-sm">{i + 1}</span>
              <div className="text-sm leading-relaxed py-1">{formatWithEmojis(step)}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
