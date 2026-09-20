import React, { useState, Suspense } from 'react';
import { useLifeContext } from './context/LifeContext';
import { Loader2, LayoutDashboard, BookOpen, GitMerge, Search } from 'lucide-react';

// Lazy loaded components to improve initial render performance
const LifeOverview = React.lazy(() => import('./components/LifeOverview'));
const StoryChapters = React.lazy(() => import('./components/StoryChapters'));
const ConnectionEngine = React.lazy(() => import('./components/ConnectionEngine'));
const ReceiptExplorer = React.lazy(() => import('./components/ReceiptExplorer'));

function App() {
  const { data, insights, loading, activeTab, setActiveTab } = useLifeContext();
  const [isTransitioning, setIsTransitioning] = useState(false);

  const handleTabChange = (tab) => {
    if (tab === activeTab) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setActiveTab(tab);
      setIsTransitioning(false);
    }, 150); // Fast subtle fade
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#09090b] text-white" role="status" aria-label="Loading dataset">
        <Loader2 className="w-10 h-10 animate-spin text-blue-500 mb-6" />
        <h1 className="text-xl font-medium tracking-tight animate-pulse">Parsing Digital Life...</h1>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#09090b] text-white" role="alert">
        <div className="w-16 h-16 rounded-full bg-rose-500/10 flex items-center justify-center mb-4">
          <span className="text-rose-500 font-bold text-2xl">!</span>
        </div>
        <h1 className="text-xl font-medium text-rose-400">No Data Found</h1>
        <p className="text-slate-400 mt-2 text-sm">Could not load the dataset from the public folder.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#09090b] text-slate-100 font-sans selection:bg-blue-500/30 overflow-x-hidden">
      
      {/* Background ambient glow */}
      <div className="fixed top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-900/10 blur-[120px] pointer-events-none" />
      <div className="fixed bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-900/10 blur-[120px] pointer-events-none" />

      {/* Header */}
      <header className="sticky top-0 z-50 glass-panel border-b-white/5 border-t-0 border-l-0 border-r-0">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center font-bold text-white shadow-[0_0_15px_rgba(59,130,246,0.3)]" aria-hidden="true">
              L
            </div>
            <span className="font-bold text-lg tracking-tight text-white">LIFEOS</span>
          </div>
          
          <nav className="hidden md:flex items-center gap-1 p-1 bg-black/40 rounded-xl border border-white/5 backdrop-blur-md" aria-label="Main Navigation">
            <TabButton active={activeTab === 'overview'} onClick={() => handleTabChange('overview')} icon={<LayoutDashboard className="w-4 h-4" />}>Overview</TabButton>
            <TabButton active={activeTab === 'chapters'} onClick={() => handleTabChange('chapters')} icon={<BookOpen className="w-4 h-4" />}>Chapters</TabButton>
            <TabButton active={activeTab === 'connections'} onClick={() => handleTabChange('connections')} icon={<GitMerge className="w-4 h-4" />}>Connections</TabButton>
            <TabButton active={activeTab === 'explorer'} onClick={() => handleTabChange('explorer')} icon={<Search className="w-4 h-4" />}>Explorer</TabButton>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-4 md:py-6" id="main-content">
        <div className="mb-6 md:mb-8 animate-slide-up flex flex-col md:flex-row md:items-center justify-between gap-6">
          <h1 className="text-[32px] md:text-[40px] lg:text-[44px] font-bold tracking-tight text-white leading-tight shrink-0">
            Data-Driven <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">Life Story.</span>
          </h1>
          <div className="glass-panel p-4 rounded-2xl max-w-sm border-l-4 border-l-blue-500/50 bg-white/[0.02]">
            <p className="text-[13px] text-slate-300 leading-relaxed font-serif italic tracking-wide">
              "A comprehensive, objective view of {data.length.toLocaleString()} transactions, organized into meaningful chapters and connections based purely on categorical and temporal relationships."
            </p>
          </div>
        </div>

        <div className={`transition-opacity duration-150 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}>
          <Suspense fallback={
            <div className="flex justify-center p-12">
              <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
            </div>
          }>
            {activeTab === 'overview' && <LifeOverview data={data} insights={insights} />}
            {activeTab === 'chapters' && <StoryChapters chapters={insights.chapters} />}
            {activeTab === 'connections' && <ConnectionEngine connections={insights.connections} />}
            {activeTab === 'explorer' && <ReceiptExplorer data={data} />}
          </Suspense>
        </div>
      </main>
      
      {/* Mobile nav fallback */}
      <nav className="md:hidden fixed bottom-6 left-4 right-4 glass-panel rounded-2xl p-2 flex justify-between z-50 shadow-[0_10px_40px_rgba(0,0,0,0.5)]" aria-label="Mobile Navigation">
        <MobileTabButton active={activeTab === 'overview'} onClick={() => handleTabChange('overview')} label="Overview" icon={<LayoutDashboard className="w-5 h-5" />} />
        <MobileTabButton active={activeTab === 'chapters'} onClick={() => handleTabChange('chapters')} label="Chapters" icon={<BookOpen className="w-5 h-5" />} />
        <MobileTabButton active={activeTab === 'connections'} onClick={() => handleTabChange('connections')} label="Connections" icon={<GitMerge className="w-5 h-5" />} />
        <MobileTabButton active={activeTab === 'explorer'} onClick={() => handleTabChange('explorer')} label="Explorer" icon={<Search className="w-5 h-5" />} />
      </nav>
    </div>
  );
}

function TabButton({ active, onClick, children, icon }) {
  return (
    <button 
      onClick={onClick}
      className={`flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-lg transition-all duration-200 focus-ring ${active ? 'bg-white/10 text-white shadow-sm scale-100' : 'text-slate-400 hover:text-slate-200 hover:bg-white/5 scale-95 hover:scale-100'}`}
      aria-current={active ? 'page' : undefined}
    >
      {icon}
      {children}
    </button>
  );
}

function MobileTabButton({ active, onClick, label, icon }) {
  return (
    <button 
      onClick={onClick}
      className={`flex flex-col items-center justify-center gap-1 text-[10px] font-medium transition-all duration-200 px-2 py-2.5 rounded-xl w-full focus-ring ${active ? 'bg-white/10 text-blue-400' : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'}`}
      aria-current={active ? 'page' : undefined}
    >
      <div className={`transition-transform duration-200 ${active ? 'scale-110 mb-0.5' : 'scale-100'}`}>
        {icon}
      </div>
      {label}
    </button>
  );
}

export default App;
