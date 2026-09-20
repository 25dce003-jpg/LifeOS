import React from 'react';
import { LayoutDashboard, BookOpen, GitMerge, Search } from 'lucide-react';
import { useLifeOS } from '../../context/AppContext';

export default function Header() {
  const { activeTab, setActiveTab } = useLifeOS();

  return (
    <header className="sticky top-0 z-50 glass-panel border-b-white/5 border-t-0 border-l-0 border-r-0">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center font-bold text-white shadow-[0_0_15px_rgba(59,130,246,0.3)]" aria-hidden="true">
            L
          </div>
          <span className="font-bold text-lg tracking-tight text-white">LIFEOS</span>
        </div>
        
        <nav className="hidden md:flex items-center gap-1 p-1 bg-black/40 rounded-xl border border-white/5 backdrop-blur-md" aria-label="Main Navigation">
          <TabButton active={activeTab === 'overview'} onClick={() => setActiveTab('overview')} icon={<LayoutDashboard className="w-4 h-4" />}>Overview</TabButton>
          <TabButton active={activeTab === 'chapters'} onClick={() => setActiveTab('chapters')} icon={<BookOpen className="w-4 h-4" />}>Chapters</TabButton>
          <TabButton active={activeTab === 'connections'} onClick={() => setActiveTab('connections')} icon={<GitMerge className="w-4 h-4" />}>Connections</TabButton>
          <TabButton active={activeTab === 'explorer'} onClick={() => setActiveTab('explorer')} icon={<Search className="w-4 h-4" />}>Explorer</TabButton>
        </nav>
      </div>
    </header>
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
