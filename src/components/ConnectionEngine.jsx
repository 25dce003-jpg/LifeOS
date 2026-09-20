import React, { useState } from 'react';
import { format } from 'date-fns';
import { GitMerge, ArrowRight, X, Calendar, Clock, Repeat, Hash, AlertTriangle, Layers } from 'lucide-react';

export default function ConnectionEngine({ connections }) {
  const [selectedConn, setSelectedConn] = useState(null);

  if (!connections || connections.length === 0) {
    return <div className="text-slate-400">No connections discovered.</div>;
  }

  const getTypeIcon = (type) => {
    switch(type) {
      case 'Same-Day Cluster': return <Calendar className="w-5 h-5 text-blue-400" />;
      case 'Time-Window Cluster': return <Clock className="w-5 h-5 text-indigo-400" />;
      case 'Repeated Activity': return <Repeat className="w-5 h-5 text-emerald-400" />;
      case 'Category Combination': return <Layers className="w-5 h-5 text-purple-400" />;
      case 'Recurring Pattern': return <Hash className="w-5 h-5 text-pink-400" />;
      case 'Unusual Activity': return <AlertTriangle className="w-5 h-5 text-orange-400" />;
      default: return <GitMerge className="w-5 h-5 text-blue-400" />;
    }
  };

  return (
    <div className="pb-24">
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-2">Connection Engine</h2>
        <p className="text-slate-400">Discovering objective relationships between fragments of data.</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {connections.slice(0, 30).map((conn) => (
          <div key={conn.id} className="bg-[#1a1d24] border border-white/5 rounded-2xl p-6 relative overflow-hidden flex flex-col">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/5 rounded-lg border border-white/5">
                  {getTypeIcon(conn.type)}
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500 bg-black/20 px-2 py-0.5 rounded border border-white/5">
                      {conn.type}
                    </span>
                  </div>
                  <h3 className="font-bold text-white text-lg leading-tight">{conn.title}</h3>
                  <div className="text-sm text-slate-400 mt-0.5">{format(conn.date, 'MMMM do, yyyy')}</div>
                </div>
              </div>
              <button 
                onClick={() => setSelectedConn(conn)}
                className="shrink-0 text-sm font-medium text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-1 bg-blue-500/10 px-3 py-1.5 rounded-lg"
              >
                View Map <ArrowRight className="w-4 h-4" />
              </button>
            </div>
            
            <div className="p-4 bg-[#12141a] rounded-xl border border-white/5 mb-4 flex-1">
              <div className="flex justify-between items-start gap-4 mb-2">
                <p className="text-sm text-slate-300 font-medium">Why connected?</p>
                <div className="text-xs font-medium text-blue-400 bg-blue-500/10 px-2 py-1 rounded">
                  {conn.stats}
                </div>
              </div>
              <p className="text-sm text-slate-500 leading-relaxed">{conn.reason}</p>
            </div>

            {/* Mini preview graph */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide shrink-0">
              <div className="text-xs font-medium text-slate-500 bg-white/5 px-2 py-1 rounded">
                {conn.receipts.length} Receipts:
              </div>
              {conn.receipts.slice(0, 4).map((r, idx) => (
                <React.Fragment key={idx}>
                  <div className="shrink-0 max-w-[120px]">
                    <div className="text-xs bg-white/5 rounded px-2 py-1.5 truncate border border-white/5 text-slate-300" title={r.note || r.category}>
                      {r.note || r.category}
                    </div>
                  </div>
                  {idx < Math.min(conn.receipts.length, 4) - 1 && (
                    <div className="w-4 h-[1px] bg-white/20 shrink-0" />
                  )}
                </React.Fragment>
              ))}
              {conn.receipts.length > 4 && (
                <div className="text-xs text-slate-500 shrink-0 ml-2">+{conn.receipts.length - 4} more</div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Detailed Connection Map Modal */}
      {selectedConn && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
          <div 
            className="absolute inset-0 bg-black/80 backdrop-blur-sm" 
            onClick={() => setSelectedConn(null)} 
          />
          <div className="relative bg-[#12141a] border border-white/10 rounded-2xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl">
            
            {/* Header */}
            <div className="flex items-start justify-between p-6 border-b border-white/5">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-white/5 rounded-xl border border-white/5 hidden sm:block">
                  {getTypeIcon(selectedConn.type)}
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400 bg-white/5 px-2 py-0.5 rounded border border-white/5">
                      {selectedConn.type}
                    </span>
                    <span className="text-xs font-bold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded">
                      {selectedConn.stats}
                    </span>
                  </div>
                  <h2 className="text-2xl font-bold text-white leading-tight">
                    {selectedConn.title}
                  </h2>
                  <div className="text-slate-400 mt-1 flex gap-2 items-center text-sm">
                    <Calendar className="w-4 h-4" />
                    {format(selectedConn.date, 'MMMM do, yyyy')}
                    <span>•</span>
                    <span>{selectedConn.receipts.length} Transactions involved</span>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setSelectedConn(null)}
                className="p-2 hover:bg-white/5 rounded-full transition-colors text-slate-400 hover:text-white"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            {/* Rationale Banner */}
            <div className="px-6 py-4 bg-blue-500/5 border-b border-blue-500/10 flex items-start gap-3">
              <GitMerge className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-blue-300/80 font-bold uppercase tracking-wider mb-1">Objective Rationale</p>
                <p className="text-sm text-slate-300 leading-relaxed">{selectedConn.reason}</p>
              </div>
            </div>

            {/* Journey Map */}
            <div className="p-6 overflow-y-auto flex-1">
              <div className="relative pb-4">
                {/* Vertical line connecting nodes */}
                <div className="absolute left-[15px] top-4 bottom-4 w-[2px] bg-white/10" />
                
                <div className="space-y-6">
                  {selectedConn.receipts.map((r, idx) => (
                    <div key={idx} className="relative pl-10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 group">
                      {/* Node dot */}
                      <div className="absolute left-[11px] top-1/2 -translate-y-1/2 w-[10px] h-[10px] rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)] border-2 border-[#12141a] z-10" />
                      
                      <div className="bg-[#1a1d24] border border-white/5 rounded-xl p-4 flex-1 transition-colors hover:border-white/10 hover:bg-[#1f222b]">
                        <div className="flex justify-between items-start mb-2">
                          <div className="text-xs font-bold text-blue-400 flex items-center gap-1">
                            <span className="w-5 h-5 rounded-full bg-blue-500/20 flex items-center justify-center text-[10px]">
                              {String(idx + 1).padStart(2, '0')}
                            </span>
                            Sequence
                          </div>
                          <div className="text-xs text-slate-500 bg-white/5 px-2 py-0.5 rounded border border-white/5">
                            {r.mode}
                          </div>
                        </div>
                        
                        <div className="font-bold text-white mb-1.5 text-lg">
                          {r.note || r.subcategory || 'Transaction Record'}
                        </div>
                        
                        <div className="flex flex-wrap gap-2 text-xs text-slate-500">
                          <span className="bg-white/5 px-2 py-1 rounded border border-white/5 text-slate-300">
                            Category: {r.category}
                          </span>
                          {r.subcategory && (
                            <span className="bg-white/5 px-2 py-1 rounded border border-white/5 text-slate-400">
                              Sub: {r.subcategory}
                            </span>
                          )}
                        </div>
                      </div>
                      
                      <div className="sm:w-32 sm:text-right shrink-0 bg-[#1a1d24] sm:bg-transparent p-3 sm:p-0 rounded-xl sm:rounded-none border border-white/5 sm:border-none">
                        <div className="text-xs text-slate-500 sm:hidden mb-1 font-medium">Amount</div>
                        <div className={`font-bold text-lg ${r.type === 'Expense' ? 'text-slate-200' : 'text-emerald-400'}`}>
                          {r.currency} {r.amount}
                        </div>
                        <div className="text-xs text-slate-500 sm:mt-1 font-medium uppercase tracking-wider">{r.type}</div>
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
