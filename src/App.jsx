import React, { Suspense, useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { AppProvider, useLifeOS } from './context/AppContext';
import Header from './components/navigation/Header';
import MobileNav from './components/navigation/MobileNav';

// Lazy loaded tabs for performance optimization
const LifeOverview = React.lazy(() => import('./components/LifeOverview'));
const StoryChapters = React.lazy(() => import('./components/StoryChapters'));
const ConnectionEngine = React.lazy(() => import('./components/ConnectionEngine'));
const ReceiptExplorer = React.lazy(() => import('./components/ReceiptExplorer'));

function AppContent() {
  const { data, insights, loading, error, activeTab } = useLifeOS();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [renderedTab, setRenderedTab] = useState(activeTab);

  // Smooth fade transition between tabs
  // eslint-disable-next-line react-compiler/react-compiler, react/set-state-in-effect
  useEffect(() => {
    if (activeTab !== renderedTab) {
      setIsTransitioning(true);
      const timer = setTimeout(() => {
        setRenderedTab(activeTab);
        setIsTransitioning(false);
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [activeTab, renderedTab]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#09090b] text-white" role="status" aria-label="Loading dataset">
        <Loader2 className="w-10 h-10 animate-spin text-blue-500 mb-6" />
        <h1 className="text-xl font-medium tracking-tight animate-pulse">Parsing Digital Life...</h1>
      </div>
    );
  }

  if (error || !data || data.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#09090b] text-white" role="alert">
        <div className="w-16 h-16 rounded-full bg-rose-500/10 flex items-center justify-center mb-4 border border-rose-500/20">
          <span className="text-rose-500 font-bold text-2xl">!</span>
        </div>
        <h1 className="text-xl font-medium text-rose-400">Data Load Error</h1>
        <p className="text-slate-400 mt-2 text-sm">{error || "Could not load the dataset from the public folder."}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#09090b] text-slate-100 font-sans selection:bg-blue-500/30 overflow-x-hidden flex flex-col">
      {/* Background ambient glow */}
      <div className="fixed top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-900/10 blur-[120px] pointer-events-none" />
      <div className="fixed bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-900/10 blur-[120px] pointer-events-none" />

      <Header />

      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-4 md:py-6 w-full flex-1" id="main-content">
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
            <div className="flex justify-center items-center py-20 text-blue-500">
              <Loader2 className="w-8 h-8 animate-spin" />
            </div>
          }>
            {renderedTab === 'overview' && <LifeOverview data={data} insights={insights} />}
            {renderedTab === 'chapters' && <StoryChapters chapters={insights.chapters} />}
            {renderedTab === 'connections' && <ConnectionEngine connections={insights.connections} />}
            {renderedTab === 'explorer' && <ReceiptExplorer data={data} />}
          </Suspense>
        </div>
      </main>
      
      <MobileNav />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
