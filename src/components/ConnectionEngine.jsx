import React, { useState } from 'react';
import { format } from 'date-fns';
import { GitMerge, ArrowRight, X, Calendar, Repeat, Layers, TrendingUp, AlertTriangle } from 'lucide-react';

export default function ConnectionEngine({ connections }) {
  const [selectedConn, setSelectedConn] = useState(null);

  if (!connections || connections.length === 0) {
    return <div className="text-slate-400">No connections discovered.</div>;
  }

  const getTypeIcon = (type) => {
    switch(type) {
      case 'Same-Day Cluster': return <Calendar className="w-4 h-4 text-blue-400" />;
      case 'Repeated Category': return <Repeat className="w-4 h-4 text-emerald-400" />;
      case 'Category Combination': return <Layers className="w-4 h-4 text-purple-400" />;
      case 'High Amount': return <TrendingUp className="w-4 h-4 text-rose-400" />;
      case 'High-Activity Day': return <AlertTriangle className="w-4 h-4 text-orange-400" />;
      default: return <GitMerge className="w-4 h-4 text-blue-400" />;
    }
  };

  return (
    <div className="pb-12">
      <div className="mb-6">
        <h2 className="text-2xl font-bold tracking-tight mb-1">Connection Engine</h2>
        <p className="text-sm text-slate-400 font-light">Discovering objective patterns and clusters within the dataset.</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        {connections.slice(0, 30).map((conn, i) => {
          const delayClass = `delay-${((i % 4) + 1) * 100}`;
          return (
            <div key={conn.id} className={`animate-slide-up ${delayClass} glass-panel rounded-[20px] p-4 sm:p-5 relative overflow-hidden flex flex-col group transition-all duration-300 hover:border-white/10 hover:shadow-[0_4px_20px_rgba(0,0,0,0.5)] hover:bg-white/[0.02]`}>
              
              <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-4 gap-3">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-white/5 rounded-xl border border-white/5 shadow-inner transition-transform duration-300 group-hover:scale-110 group-hover:bg-white/10">
                    {getTypeIcon(conn.type)}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5 mb-1.5">
                      <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 bg-black/40 px-1.5 py-0.5 rounded border border-white/5">
                        {conn.type}
                      </span>
                    </div>
                    <h3 className="font-bold text-white text-[17px] tracking-tight leading-tight">{conn.title}</h3>
                    <div className="text-[12px] text-slate-400 mt-1 font-medium">{format(conn.date, 'MMMM do, yyyy')}</div>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedConn(conn)}
                  className="shrink-0 text-[12px] font-semibold text-blue-400 hover:text-white transition-all flex items-center justify-center gap-1.5 bg-blue-500/10 hover:bg-blue-500/20 px-3 py-1.5 rounded-lg focus-ring w-full sm:w-auto"
                  aria-label={`View details for ${conn.title}`}
                >
                  View <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
              
              <div className="p-3.5 bg-black/30 rounded-xl border border-white/5 mb-3.5 flex-1 shadow-inner">
                <div className="flex justify-between items-start gap-3 mb-2">
                  <p className="text-[10px] tracking-widest uppercase font-bold text-slate-500">Data Rationale</p>
                  <div className="text-[9px] font-bold tracking-wider text-blue-400 bg-blue-500/10 px-1.5 py-0.5 rounded border border-blue-500/20">
                    {conn.stats}
                  </div>
                </div>
                <p className="text-[12px] text-slate-300 leading-relaxed font-light">{conn.reason}</p>
              </div>

              {/* Mini preview graph */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1.5 scrollbar-hide shrink-0 pt-1">
                <div className="text-[9px] font-bold uppercase tracking-wider text-slate-500 bg-white/5 px-2 py-1 rounded-md border border-white/5">
                  {conn.receipts.length} Items
                </div>
                {conn.receipts.slice(0, 4).map((r, idx) => (
                  <React.Fragment key={idx}>
                    <div className="shrink-0 max-w-[120px]">
                      <div className="text-[11px] bg-black/40 rounded-md px-2 py-1 truncate border border-white/5 text-slate-300 font-medium transition-colors group-hover:border-white/10 group-hover:bg-white/5" title={r.note || r.subcategory || r.category}>
                        {r.note || r.subcategory || r.category}
                      </div>
                    </div>
                    {idx < Math.min(conn.receipts.length, 4) - 1 && (
                      <div className="w-4 h-[1px] bg-white/10 shrink-0" />
                    )}
                  </React.Fragment>
                ))}
                {conn.receipts.length > 4 && (
                  <div className="text-[10px] text-slate-500 shrink-0 ml-1 font-medium">+{conn.receipts.length - 4}</div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Detailed Connection Map Modal */}
      {selectedConn && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="conn-modal-title"
        >
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-md animate-fade-in" 
            onClick={() => setSelectedConn(null)} 
          />
          <div className="relative glass-panel bg-[#12141a]/90 rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl animate-scale-in border border-white/10 overflow-hidden">
            
            {/* Header */}
            <div className="flex items-start justify-between p-5 sm:p-6 border-b border-white/5 relative">
              <div className="absolute inset-0 bg-gradient-to-b from-blue-500/5 to-transparent pointer-events-none" />
              <div className="flex items-start gap-4 relative z-10">
                <div className="p-3 bg-white/5 rounded-xl border border-white/10 hidden sm:block shadow-inner">
                  {getTypeIcon(selectedConn.type)}
                </div>
                <div>
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 bg-white/5 px-2 py-0.5 rounded border border-white/5">
                      {selectedConn.type}
                    </span>
                    <span className="text-[9px] font-bold uppercase tracking-wider text-blue-400 bg-blue-500/10 border border-blue-500/20 px-2 py-0.5 rounded">
                      {selectedConn.stats}
                    </span>
                  </div>
                  <h2 id="conn-modal-title" className="text-xl sm:text-2xl font-bold text-white tracking-tight leading-tight">
                    {selectedConn.title}
                  </h2>
                  <div className="text-slate-400 mt-1.5 flex gap-2 items-center text-[12px] font-medium">
                    <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" />{format(selectedConn.date, 'MMMM do, yyyy')}</span>
                    <span className="text-white/20">•</span>
                    <span>{selectedConn.receipts.length} Transactions</span>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setSelectedConn(null)}
                className="p-1.5 bg-black/40 hover:bg-white/10 rounded-full transition-all duration-200 text-slate-400 hover:text-white focus-ring relative z-10 border border-white/5 hover:scale-110"
                aria-label="Close modal"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            
            {/* Rationale Banner */}
            <div className="px-5 sm:px-6 py-4 bg-blue-500/5 border-b border-blue-500/10 flex items-start gap-3">
              <GitMerge className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-[10px] text-blue-300 font-bold uppercase tracking-[0.15em] mb-1">Objective Rationale</p>
                <p className="text-[12px] text-slate-300 leading-relaxed font-light">{selectedConn.reason}</p>
              </div>
            </div>

            {/* Journey Map */}
            <div className="p-5 sm:p-6 overflow-y-auto flex-1" tabIndex="-1">
              <div className="relative pb-4">
                {/* Vertical line connecting nodes */}
                <div className="absolute left-[13px] top-5 bottom-5 w-[2px] bg-gradient-to-b from-blue-500/50 via-white/10 to-white/10 rounded-full" />
                
                <div className="space-y-6">
                  {selectedConn.receipts.map((r, idx) => (
                    <div key={idx} className="relative pl-10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 group">
                      {/* Node dot with glow */}
                      <div className="absolute left-[9px] top-1/2 -translate-y-1/2 w-[10px] h-[10px] rounded-full bg-blue-400 shadow-[0_0_12px_rgba(96,165,250,0.6)] border-2 border-[#12141a] z-10 transition-transform duration-300 group-hover:scale-150 group-hover:bg-blue-300" />
                      
                      <div className="bg-black/20 border border-white/5 rounded-xl p-4 flex-1 transition-all duration-300 hover:border-white/10 hover:bg-white/[0.03] hover:shadow-[0_4px_15px_rgba(0,0,0,0.3)]">
                        <div className="flex justify-between items-start mb-2">
                          <div className="text-[9px] font-bold text-blue-400 uppercase tracking-widest flex items-center gap-1.5">
                            <span className="w-5 h-5 rounded-md bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-[9px] shadow-inner">
                              {String(idx + 1).padStart(2, '0')}
                            </span>
                            Item
                          </div>
                          <div className="text-[9px] font-bold uppercase tracking-wider text-slate-400 bg-white/5 px-2 py-0.5 rounded border border-white/5">
                            {r.mode}
                          </div>
                        </div>
                        
                        <div className="font-bold text-white mb-2 text-[15px] tracking-tight">
                          {r.note || r.subcategory || 'Transaction Record'}
                        </div>
                        
                        <div className="flex flex-wrap gap-1.5 text-[9px] font-medium tracking-wide uppercase">
                          {r.category && (
                            <span className="bg-white/5 px-2 py-1 rounded border border-white/5 text-slate-300">
                              CAT: {r.category}
                            </span>
                          )}
                          {r.subcategory && (
                            <span className="bg-white/5 px-2 py-1 rounded border border-white/5 text-slate-400">
                              SUB: {r.subcategory}
                            </span>
                          )}
                        </div>
                      </div>
                      
                      <div className="sm:w-32 sm:text-right shrink-0 bg-black/20 sm:bg-transparent p-3 sm:p-0 rounded-xl sm:rounded-none border border-white/5 sm:border-none flex flex-row sm:flex-col justify-between sm:justify-center items-center sm:items-end">
                        <div className="text-[9px] text-slate-500 sm:hidden mb-0 font-bold uppercase tracking-widest">Amount</div>
                        <div className="text-right">
                          <div className={`font-bold text-[17px] tracking-tight ${r.type === 'Expense' ? 'text-white' : 'text-emerald-400'}`}>
                            {r.currency} {r.amount}
                          </div>
                          <div className="text-[9px] text-slate-500 sm:mt-0.5 font-bold uppercase tracking-[0.2em]">{r.type}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
