import React from 'react';
import { LayoutDashboard, BookOpen, GitMerge, Search } from 'lucide-react';
import { useLifeOS } from '../../context/AppContext';

export default function MobileNav() {
  const { activeTab, setActiveTab } = useLifeOS();

  return (
    <nav className="md:hidden fixed bottom-6 left-4 right-4 glass-panel rounded-2xl p-2 flex justify-between z-50 shadow-[0_10px_40px_rgba(0,0,0,0.5)]" aria-label="Mobile Navigation">
      <MobileTabButton active={activeTab === 'overview'} onClick={() => setActiveTab('overview')} label="Overview" icon={<LayoutDashboard className="w-5 h-5" />} />
      <MobileTabButton active={activeTab === 'chapters'} onClick={() => setActiveTab('chapters')} label="Chapters" icon={<BookOpen className="w-5 h-5" />} />
      <MobileTabButton active={activeTab === 'connections'} onClick={() => setActiveTab('connections')} label="Connections" icon={<GitMerge className="w-5 h-5" />} />
      <MobileTabButton active={activeTab === 'explorer'} onClick={() => setActiveTab('explorer')} label="Explorer" icon={<Search className="w-5 h-5" />} />
    </nav>
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
