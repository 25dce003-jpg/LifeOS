import { useState, useEffect } from 'react';
import { loadDataset } from './utils/dataParser';
import { generateInsights } from './utils/insightGenerator';
import LifeOverview from './components/LifeOverview';
import StoryChapters from './components/StoryChapters';
import ConnectionEngine from './components/ConnectionEngine';
import ReceiptExplorer from './components/ReceiptExplorer';
import { Loader2 } from 'lucide-react';

function App() {
  const [data, setData] = useState(null);
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    const initData = async () => {
      try {
        const parsed = await loadDataset();
        const generatedInsights = generateInsights(parsed);
        setData(parsed);
        setInsights(generatedInsights);
      } catch (error) {
        console.error("Failed to load data", error);
      } finally {
        setLoading(false);
      }
    };
    initData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#0f1115] text-white">
        <Loader2 className="w-12 h-12 animate-spin text-blue-500 mb-4" />
        <h1 className="text-2xl font-semibold">Parsing Digital Life...</h1>
        <p className="text-slate-400 mt-2">Loading transactions and discovering connections.</p>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#0f1115] text-white">
        <h1 className="text-2xl font-semibold text-red-400">No Data Found</h1>
        <p className="text-slate-400 mt-2">Could not load the dataset from public folder.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f1115] text-slate-100 font-sans selection:bg-blue-500/30">
      
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#0f1115]/80 backdrop-blur-md border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center font-bold text-white shadow-lg shadow-blue-500/20">
              L
            </div>
            <span className="font-bold text-xl tracking-tight">LIFEOS</span>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <TabButton active={activeTab === 'overview'} onClick={() => setActiveTab('overview')}>Overview</TabButton>
            <TabButton active={activeTab === 'chapters'} onClick={() => setActiveTab('chapters')}>Chapters</TabButton>
            <TabButton active={activeTab === 'connections'} onClick={() => setActiveTab('connections')}>Connections</TabButton>
            <TabButton active={activeTab === 'explorer'} onClick={() => setActiveTab('explorer')}>Explorer</TabButton>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-4">
            Your life, in receipts.
          </h1>
          <p className="text-lg text-slate-400 max-w-2xl">
            Discover the story hidden inside your digital life. We've analyzed {data.length} transactions to find patterns, connections, and meaning.
          </p>
        </div>

        {activeTab === 'overview' && <LifeOverview data={data} insights={insights} />}
        {activeTab === 'chapters' && <StoryChapters chapters={insights.chapters} />}
        {activeTab === 'connections' && <ConnectionEngine connections={insights.connections} />}
        {activeTab === 'explorer' && <ReceiptExplorer data={data} />}

      </main>
      
      {/* Mobile nav fallback */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-[#1a1d24] border-t border-white/5 p-4 flex justify-between z-50">
        <MobileTabButton active={activeTab === 'overview'} onClick={() => setActiveTab('overview')} label="Overview" />
        <MobileTabButton active={activeTab === 'chapters'} onClick={() => setActiveTab('chapters')} label="Chapters" />
        <MobileTabButton active={activeTab === 'connections'} onClick={() => setActiveTab('connections')} label="Connections" />
        <MobileTabButton active={activeTab === 'explorer'} onClick={() => setActiveTab('explorer')} label="Explorer" />
      </div>
    </div>
  );
}

function TabButton({ active, onClick, children }) {
  return (
    <button 
      onClick={onClick}
      className={`text-sm font-medium transition-colors ${active ? 'text-white' : 'text-slate-400 hover:text-slate-200'}`}
    >
      {children}
    </button>
  );
}

function MobileTabButton({ active, onClick, label }) {
  return (
    <button 
      onClick={onClick}
      className={`text-xs font-medium transition-colors px-3 py-2 rounded-lg ${active ? 'bg-white/10 text-white' : 'text-slate-400'}`}
    >
      {label}
    </button>
  );
}

export default App;
