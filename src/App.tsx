import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { AnalysisState, FullReport } from './types';
import { analyzeRepo } from './services/geminiService';
import { Dashboard } from './components/Dashboard';
import { Loader2, Search, Cpu, Sparkles, CheckCircle2, AlertOctagon, Terminal, ArrowRight, ShieldCheck, Users, TrendingUp, Layers } from 'lucide-react';
import { clsx } from 'clsx';

// Cinematic Loader Component
const CinematicLoader = () => {
  const [step, setStep] = useState(0);
  const steps = [
    "Initializing neural audit engine...",
    "Cloning repository metadata...",
    "Parsing abstract syntax trees...",
    "Identifying architectural patterns...",
    "Scanning for CVE vulnerabilities...",
    "Evaluating team topology requirements...",
    "Calculating technical debt ratio...",
    "Synthesizing executive report..."
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setStep((prev) => (prev < steps.length - 1 ? prev + 1 : prev));
    }, 1200);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full max-w-md mx-auto space-y-6 animate-fade-in">
      <div className="relative h-2 bg-surfaceHighlight rounded-full overflow-hidden">
        <div 
          className="absolute top-0 left-0 h-full bg-gradient-to-r from-primary via-secondary to-accent transition-all duration-700 ease-out"
          style={{ width: `${((step + 1) / steps.length) * 100}%` }}
        />
      </div>
      <div className="space-y-3">
        {steps.map((s, i) => (
          <div 
            key={i} 
            className={clsx(
              "flex items-center gap-3 text-sm font-mono transition-all duration-500",
              i === step ? "text-white scale-105 pl-2 border-l-2 border-primary" : 
              i < step ? "text-success opacity-50" : "text-zinc-700 opacity-20"
            )}
          >
            {i < step ? <CheckCircle2 size={14} /> : i === step ? <Loader2 className="animate-spin" size={14} /> : <div className="w-3.5" />}
            {s}
          </div>
        ))}
      </div>
    </div>
  );
};

const FeatureCard = ({ icon: Icon, title, desc, delay }: { icon: any, title: string, desc: string, delay: string }) => (
  <div className="p-6 bg-white/5 border border-white/5 rounded-2xl hover:bg-white/10 hover:border-white/20 transition-all duration-500 group animate-slide-up hover:-translate-y-1" style={{ animationDelay: delay }}>
    <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform border border-white/5">
      <Icon className="text-white group-hover:text-primary transition-colors" size={24} />
    </div>
    <h3 className="text-white font-bold text-lg mb-2 tracking-tight">{title}</h3>
    <p className="text-zinc-400 text-sm leading-relaxed">{desc}</p>
  </div>
);

const App = () => {
  const [repoUrl, setRepoUrl] = useState('');
  const [state, setState] = useState<AnalysisState>('IDLE');
  const [report, setReport] = useState<FullReport | null>(null);
  const [error, setError] = useState<string>('');

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!repoUrl.trim()) return;

    setState('ANALYZING');
    setError('');

    try {
      const data = await analyzeRepo(repoUrl);
      setReport(data);
      setState('COMPLETE');
    } catch (err: any) {
      console.error(err);
      setState('ERROR');
      setError(err.message || "An unexpected error occurred during analysis.");
    }
  };

  const reset = () => {
    setState('IDLE');
    setReport(null);
    setRepoUrl('');
  };

  if (state === 'COMPLETE' && report) {
    return <Dashboard report={report} onReset={reset} />;
  }

  return (
    <div className="min-h-screen bg-background text-zinc-200 selection:bg-primary/30 flex flex-col relative overflow-hidden">
      
      {/* Background Ambience */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
         <div className="absolute inset-0 bg-grid opacity-30" />
         <div className="absolute top-0 inset-x-0 h-[500px] bg-gradient-to-b from-[#0f0f11] to-transparent opacity-80" />
         <div className="absolute inset-0 aurora-gradient" />
      </div>

      <main className="flex-1 flex flex-col items-center justify-center p-6 relative z-10 w-full max-w-6xl mx-auto pt-20 pb-20">
        
        {state === 'IDLE' || state === 'ERROR' ? (
          <div className="w-full space-y-16 animate-slide-up">
            
            {/* Hero Section */}
            <div className="text-center space-y-6 max-w-4xl mx-auto">
              <h1 className="text-6xl md:text-8xl font-bold tracking-tighter text-white drop-shadow-2xl mb-2">
                Source<span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-accent">IQ</span>
              </h1>
              
              <div className="space-y-4">
                <h2 className="text-2xl md:text-3xl text-white font-medium tracking-tight">
                   Code with Clarity. Ship with Confidence.
                </h2>
                <p className="text-lg md:text-xl text-zinc-400 font-light max-w-2xl mx-auto leading-relaxed">
                  Transform your repository into actionable intelligence. We analyze structure, security, and scalability to give you a CTO-level blueprint in seconds.
                </p>
              </div>
            </div>

            {/* Main Action Card */}
            <div className="max-w-2xl mx-auto bg-black/40 backdrop-blur-2xl border border-white/10 p-3 rounded-2xl shadow-[0_0_50px_rgba(99,102,241,0.1)] transform transition-all hover:scale-[1.01] hover:border-white/20 duration-500 hover:shadow-[0_0_80px_rgba(99,102,241,0.2)]">
              <form onSubmit={handleAnalyze} className="relative flex items-center">
                 <div className="absolute left-5 text-zinc-500">
                   <Search size={22} />
                 </div>
                 <input 
                    type="text" 
                    value={repoUrl}
                    onChange={(e) => setRepoUrl(e.target.value)}
                    placeholder="github.com/owner/repository"
                    className="w-full bg-transparent text-lg text-white placeholder:text-zinc-600 px-14 py-5 rounded-xl focus:outline-none font-medium"
                 />
                 <button 
                   type="submit"
                   disabled={!repoUrl.trim()}
                   className="absolute right-2 bg-white text-black hover:bg-zinc-200 disabled:opacity-50 disabled:cursor-not-allowed px-8 py-3.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 hover:shadow-lg hover:shadow-white/20"
                 >
                   Analyze <ArrowRight size={16} />
                 </button>
              </form>
            </div>



            {state === 'ERROR' && (
              <div className="max-w-2xl mx-auto bg-danger/10 border border-danger/30 text-danger px-4 py-3 rounded-lg text-sm flex items-center justify-center gap-2 animate-fade-in">
                <AlertOctagon size={16} />
                {error}
              </div>
            )}

            {/* Feature Showcase Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-8">
               <FeatureCard 
                  icon={Layers}
                  title="Deep Audit"
                  desc="Instantly grade your code structure, documentation, and quality against industry standards."
                  delay="100ms"
               />
               <FeatureCard 
                  icon={ShieldCheck}
                  title="Security Foresight"
                  desc="Detect hidden vulnerabilities and secrets before they become critical incidents."
                  delay="200ms"
               />
               <FeatureCard 
                  icon={Users}
                  title="Team Topology"
                  desc="Get an AI-recommended hiring plan tailored to your codebase's complexity."
                  delay="300ms"
               />
               <FeatureCard 
                  icon={TrendingUp}
                  title="Scalability Roadmap"
                  desc="A step-by-step technical debt reduction plan to prepare for your next million users."
                  delay="400ms"
               />
            </div>

          </div>
        ) : (
          <div className="w-full max-w-xl text-center space-y-8 animate-fade-in py-20">
             <div className="mb-8">
               <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-mono mb-6 border border-primary/20">
                 <Terminal size={12} />
                 REMOTE CONNECTION ESTABLISHED
               </div>
               <h2 className="text-4xl font-bold text-white mb-2 tracking-tight">Auditing Repository</h2>
               <p className="text-zinc-500 font-mono text-sm">{repoUrl}</p>
             </div>
             <CinematicLoader />
          </div>
        )}

      </main>

      {/* Personalized Footer */}
      <footer className="relative z-10 py-8 text-center border-t border-white/5 bg-black/20 backdrop-blur-sm">
        <div className="flex items-center justify-center gap-2 text-zinc-500 text-sm font-medium tracking-wide">
           <span>Made with</span>
           <span className="text-rose-500 animate-pulse drop-shadow-[0_0_8px_rgba(244,63,94,0.6)]">❤️</span>
           <span>and code by <span className="text-white font-bold hover:text-primary transition-colors cursor-default">Siddh</span></span>
        </div>
      </footer>
    </div>
  );
};

export default App;