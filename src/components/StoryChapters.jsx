import React, { useState } from 'react';
import { format } from 'date-fns';
import { Receipt, X, ArrowUpRight, ArrowDownRight, RefreshCw, GitMerge, Calendar } from 'lucide-react';
import { useLifeOS } from '../context/AppContext';

export default function StoryChapters({ chapters }) {
  const [selectedChapter, setSelectedChapter] = useState(null);
  const { navigateToExplorer } = useLifeOS();

  if (!chapters || chapters.length === 0) {
    return <div className="text-slate-400">No chapters generated yet.</div>;
  }

  return (
    <div className="pb-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 gap-3">
        <div>
          <h2 className="text-2xl font-bold tracking-tight mb-1">Monthly Summary</h2>
          <p className="text-sm text-slate-400 font-light">Calculated aggregations from the dataset.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5">
        {chapters.map((chapter, i) => {
          const delayClass = `delay-${((i % 4) + 1) * 100}`;
          return (
            <button 
              key={chapter.id} 
              className={`animate-slide-up ${delayClass} group cursor-pointer glass-panel rounded-[20px] p-4 sm:p-5 hover:border-white/20 hover:bg-white/[0.04] hover:shadow-[0_4px_20px_rgba(0,0,0,0.5)] transition-all duration-300 relative overflow-hidden flex flex-col text-left focus-ring w-full`}
              onClick={() => setSelectedChapter(chapter)}
              aria-label={`View details for ${chapter.title}`}
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-indigo-500 opacity-40 group-hover:opacity-100 transition-opacity duration-500" />
              
              <div className="text-[10px] font-bold tracking-[0.2em] text-blue-400/80 uppercase mb-2.5">
                Chapter {String(chapters.length - i).padStart(2, '0')}
              </div>
              <h3 className="text-xl font-bold text-white mb-2 tracking-tight">{chapter.title}</h3>
              <p className="text-slate-400 text-[13px] mb-5 leading-relaxed font-light flex-1">{chapter.summary}</p>
              
              <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/5 w-full">
                <div className="flex items-center gap-1.5 text-[12px] text-slate-400 font-medium bg-black/40 px-2.5 py-1 rounded-md border border-white/5">
                  <Receipt className="w-3.5 h-3.5" /> {chapter.receiptCount} receipts
                </div>
                <span className="font-semibold text-slate-300 tracking-wide text-[12px]">{chapter.dateRange}</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Chapter Modal */}
      {selectedChapter && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
        >
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-md animate-fade-in" 
            onClick={() => setSelectedChapter(null)} 
          />
          <div className="relative glass-panel bg-[#12141a]/90 rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl animate-scale-in border border-white/10 overflow-hidden">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-start justify-between p-5 sm:p-6 border-b border-white/5 gap-3 relative">
              <div className="absolute inset-0 bg-gradient-to-b from-blue-500/5 to-transparent pointer-events-none" />
              <div className="relative z-10">
                <div className="text-[10px] font-bold tracking-[0.2em] text-blue-400 uppercase mb-2">
                  {selectedChapter.dateRange}
                </div>
                <h2 id="modal-title" className="text-2xl sm:text-3xl font-bold text-white tracking-tight leading-tight">{selectedChapter.title}</h2>
                <p className="text-slate-400 mt-2 font-light max-w-xl text-[13px]">{selectedChapter.summary}</p>
              </div>
              <button 
                onClick={() => setSelectedChapter(null)}
                className="p-2 bg-black/40 hover:bg-white/10 rounded-full transition-all duration-200 text-slate-400 hover:text-white shrink-0 focus-ring border border-white/5 relative z-10 hover:scale-110"
                aria-label="Close modal"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            
            {/* Content */}
            <div className="p-5 sm:p-6 overflow-y-auto space-y-6" tabIndex="-1">
              
              {/* Summary Stats */}
              <div>
                <h3 className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-500 mb-3">Financial & Activity Summary</h3>
                <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
                  <StatBox label="Total Receipts" value={selectedChapter.receiptCount} />
                  <StatBox label="Expenses" value={`INR ${selectedChapter.totalExpense.toLocaleString(undefined, {minimumFractionDigits: 0, maximumFractionDigits: 0})}`} icon={<ArrowUpRight className="w-3.5 h-3.5 text-rose-400" />} />
                  <StatBox label="Income" value={`INR ${selectedChapter.totalIncome.toLocaleString(undefined, {minimumFractionDigits: 0, maximumFractionDigits: 0})}`} icon={<ArrowDownRight className="w-3.5 h-3.5 text-emerald-400" />} />
                  <StatBox label="Transfers" value={`INR ${selectedChapter.totalTransfers.toLocaleString(undefined, {minimumFractionDigits: 0, maximumFractionDigits: 0})}`} icon={<RefreshCw className="w-3.5 h-3.5 text-purple-400" />} />
                  <div onClick={() => { setSelectedChapter(null); navigateToExplorer({ category: selectedChapter.topCategory, month: selectedChapter.dateRange }); }} className="cursor-pointer group">
                    <StatBox label="Primary Category" value={selectedChapter.topCategory} interactive />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Activity Breakdown */}
                <div>
                  <h3 className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-500 mb-3">Expense Breakdown</h3>
                  <div className="bg-black/20 border border-white/5 rounded-xl p-4">
                    <div className="space-y-3">
                      {Object.entries(selectedChapter.categoryCounts)
                        .sort((a,b) => b[1] - a[1])
                        .slice(0, 6)
                        .map(([cat, count], idx) => (
                          <div key={idx} className="flex items-center justify-between group">
                            <span className="text-slate-300 font-medium text-[13px] group-hover:text-white transition-colors">{cat}</span>
                            <div className="flex items-center gap-3">
                              <span className="text-slate-500 text-[11px] font-medium bg-white/5 px-2 py-0.5 rounded">{count} txns</span>
                              <span className="text-rose-400/90 text-[13px] font-semibold w-20 text-right">
                                {selectedChapter.categorySpending[cat] ? `INR ${selectedChapter.categorySpending[cat].toLocaleString(undefined, {minimumFractionDigits: 0, maximumFractionDigits: 0})}` : '-'}
                              </span>
                            </div>
                          </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Notable Facts */}
                <div>
                  <h3 className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-500 mb-3">Notable Facts</h3>
                  <div className="space-y-3">
                    <div className="bg-black/20 border border-white/5 rounded-xl p-3.5 flex justify-between items-center transition-colors hover:bg-white/[0.02]">
                      <div>
                        <div className="text-[9px] text-slate-500 font-bold tracking-wider uppercase mb-1">Highest Expense</div>
                        <div className="text-slate-300 font-medium text-[13px] truncate max-w-[180px]" title={selectedChapter.highestExpenseItem?.note || selectedChapter.highestExpenseItem?.subcategory || 'N/A'}>
                          {selectedChapter.highestExpenseItem?.note || selectedChapter.highestExpenseItem?.subcategory || 'N/A'}
                        </div>
                      </div>
                      <div className="text-rose-400 font-bold text-[13px] shrink-0">
                        {selectedChapter.highestExpenseItem ? `INR ${selectedChapter.highestExpenseItem.amount}` : '-'}
                      </div>
                    </div>
                    
                    <div className="bg-black/20 border border-white/5 rounded-xl p-3.5 flex justify-between items-center transition-colors hover:bg-white/[0.02]">
                      <div>
                        <div className="text-[9px] text-slate-500 font-bold tracking-wider uppercase mb-1">Most Frequent Subcategory</div>
                        <div className="text-slate-300 font-medium text-[13px]">{selectedChapter.mostFreqSub || 'N/A'}</div>
                      </div>
                    </div>

                    <div className="bg-black/20 border border-white/5 rounded-xl p-3.5 flex justify-between items-center transition-colors hover:bg-white/[0.02]">
                      <div>
                        <div className="text-[9px] text-slate-500 font-bold tracking-wider uppercase mb-1">Busiest Day</div>
                        <div className="text-slate-300 font-medium text-[13px]">
                          {selectedChapter.busiestDay ? format(new Date(selectedChapter.busiestDay.date), 'MMM do, yyyy') : 'N/A'}
                        </div>
                      </div>
                      <div className="text-blue-400 font-bold bg-blue-500/10 px-2 py-0.5 rounded-md border border-blue-500/20 text-[12px]">
                        {selectedChapter.busiestDay?.count || 0} txns
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Connected Moments within Chapter */}
              {selectedChapter.connections && selectedChapter.connections.length > 0 && (
                <div>
                  <h3 className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-500 mb-3 flex items-center gap-1.5">
                    <GitMerge className="w-3.5 h-3.5" /> Discovered Patterns
                  </h3>
                  <div className="space-y-3">
                    {selectedChapter.connections.slice(0, 5).map(conn => (
                      <div key={conn.id} className="bg-black/20 border border-white/5 rounded-xl p-4 transition-all duration-300 hover:border-white/10 hover:bg-white/[0.03]">
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-3">
                          <div>
                            <div className="flex items-center gap-2 mb-1.5">
                              <span className="text-[9px] font-bold uppercase tracking-widest text-blue-400 bg-blue-500/10 border border-blue-500/20 px-1.5 py-0.5 rounded">
                                {conn.type}
                              </span>
                              <span className="text-[11px] text-slate-500 flex items-center gap-1 font-medium">
                                <Calendar className="w-3 h-3" /> {format(conn.date, 'MMM do, yyyy')}
                              </span>
                            </div>
                            <h4 className="font-bold text-white text-[15px] tracking-tight">{conn.title}</h4>
                            <p className="text-[12px] text-slate-400 mt-1 font-light">{conn.reason}</p>
                          </div>
                          <div className="shrink-0 text-[10px] font-semibold tracking-wide text-slate-400 bg-black/40 border border-white/5 px-2 py-1 rounded">
                            {conn.receipts.length} Receipts
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5 scrollbar-hide pt-1">
                          {conn.receipts.map((r, idx) => (
                            <React.Fragment key={idx}>
                              <div className="shrink-0 max-w-[140px]">
                                <div className="text-[11px] bg-white/5 rounded-md px-2 py-1 truncate border border-white/10 text-slate-300 font-medium" title={r.note || r.subcategory || r.category}>
                                  {r.note || r.subcategory || r.category}
                                </div>
                              </div>
                              {idx < conn.receipts.length - 1 && (
                                <div className="w-4 h-[1px] bg-white/10 shrink-0" />
                              )}
                            </React.Fragment>
                          ))}
                        </div>
                      </div>
                    ))}
                    {selectedChapter.connections.length > 5 && (
                      <div className="text-center text-[12px] text-slate-500 pt-2 font-light">
                        + {selectedChapter.connections.length - 5} more patterns identified in this month.
                      </div>
                    )}
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function StatBox({ label, value, icon, interactive }) {
  return (
    <div className={`bg-black/20 rounded-xl p-3 sm:p-3.5 border border-white/5 transition-colors hover:bg-white/[0.02] group relative ${interactive ? 'cursor-pointer hover:border-white/20' : ''}`}>
      <div className="flex justify-between items-start mb-2">
        <div className="text-[9px] font-bold uppercase tracking-wider text-slate-500">{label}</div>
        {icon && <div>{icon}</div>}
      </div>
      <div className="text-lg sm:text-xl font-bold text-white tracking-tight truncate flex items-center justify-between" title={String(value)}>
        <span>{value}</span>
        {interactive && <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 text-blue-400 transition-opacity" />}
      </div>
    </div>
  );
}
