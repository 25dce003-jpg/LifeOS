import React, { useState } from 'react';
import { format } from 'date-fns';
import { Receipt, X, ArrowUpRight, ArrowDownRight, RefreshCw, GitMerge, Clock, Calendar } from 'lucide-react';

export default function StoryChapters({ chapters }) {
  const [selectedChapter, setSelectedChapter] = useState(null);

  if (!chapters || chapters.length === 0) {
    return <div className="text-slate-400">No chapters generated yet.</div>;
  }

  return (
    <div className="pb-24">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold">Story Chapters</h2>
        <span className="text-sm font-medium px-3 py-1 bg-white/5 rounded-full text-slate-400">
          Automatically generated from data clusters
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {chapters.map((chapter, i) => (
          <div 
            key={chapter.id} 
            className="group cursor-pointer bg-[#1a1d24] border border-white/5 rounded-2xl p-6 hover:border-blue-500/30 hover:bg-[#1f222b] transition-all relative overflow-hidden flex flex-col"
            onClick={() => setSelectedChapter(chapter)}
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-indigo-500 opacity-50 group-hover:opacity-100 transition-opacity" />
            
            <div className="text-xs font-bold tracking-widest text-blue-400 uppercase mb-3">
              Chapter {String(chapters.length - i).padStart(2, '0')}
            </div>
            <h3 className="text-xl font-bold text-white mb-2">{chapter.title}</h3>
            <p className="text-slate-400 text-sm mb-6 leading-relaxed flex-1">{chapter.summary}</p>
            
            <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/5">
              <div className="flex items-center gap-4 text-sm text-slate-500">
                <span className="flex items-center gap-1"><Receipt className="w-4 h-4" /> {chapter.receiptCount} moments</span>
              </div>
              <span className="font-medium text-slate-300">{chapter.dateRange}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Chapter Modal */}
      {selectedChapter && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
          <div 
            className="absolute inset-0 bg-black/80 backdrop-blur-sm" 
            onClick={() => setSelectedChapter(null)} 
          />
          <div className="relative bg-[#12141a] border border-white/10 rounded-2xl w-full max-w-5xl max-h-[90vh] flex flex-col shadow-2xl">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-start justify-between p-6 border-b border-white/5 gap-4">
              <div>
                <div className="text-xs font-bold tracking-widest text-blue-400 uppercase mb-2">
                  {selectedChapter.dateRange}
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold text-white">{selectedChapter.title}</h2>
                <p className="text-slate-400 mt-2">{selectedChapter.summary}</p>
              </div>
              <button 
                onClick={() => setSelectedChapter(null)}
                className="p-2 hover:bg-white/5 rounded-full transition-colors text-slate-400 hover:text-white shrink-0"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            {/* Content */}
            <div className="p-6 overflow-y-auto space-y-8">
              
              {/* Summary Stats */}
              <div>
                <h3 className="text-sm font-bold uppercase tracking-widest text-slate-500 mb-4">Financial & Activity Summary</h3>
                <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
                  <StatBox label="Total Moments" value={selectedChapter.receiptCount} />
                  <StatBox label="Expenses" value={`INR ${selectedChapter.totalExpense.toFixed(2)}`} icon={<ArrowUpRight className="w-4 h-4 text-rose-400" />} />
                  <StatBox label="Income" value={`INR ${selectedChapter.totalIncome.toFixed(2)}`} icon={<ArrowDownRight className="w-4 h-4 text-emerald-400" />} />
                  <StatBox label="Transfers" value={`INR ${selectedChapter.totalTransfers.toFixed(2)}`} icon={<RefreshCw className="w-4 h-4 text-blue-400" />} />
                  <StatBox label="Primary Category" value={selectedChapter.topCategory} />
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Activity Breakdown */}
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-widest text-slate-500 mb-4">Activity Breakdown</h3>
                  <div className="bg-[#1a1d24] border border-white/5 rounded-xl p-5">
                    <div className="space-y-3">
                      {Object.entries(selectedChapter.categoryCounts)
                        .sort((a,b) => b[1] - a[1])
                        .slice(0, 6)
                        .map(([cat, count], idx) => (
                          <div key={idx} className="flex items-center justify-between">
                            <span className="text-slate-300 font-medium">{cat}</span>
                            <div className="flex items-center gap-4">
                              <span className="text-slate-500 text-sm">{count} txns</span>
                              <span className="text-rose-400 text-sm w-20 text-right">
                                {selectedChapter.categorySpending[cat] ? `INR ${selectedChapter.categorySpending[cat].toFixed(0)}` : '-'}
                              </span>
                            </div>
                          </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Notable Moments */}
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-widest text-slate-500 mb-4">Notable Moments</h3>
                  <div className="space-y-3">
                    <div className="bg-[#1a1d24] border border-white/5 rounded-xl p-4 flex justify-between items-center">
                      <div>
                        <div className="text-xs text-slate-500 font-bold uppercase mb-1">Highest Expense</div>
                        <div className="text-slate-300 font-medium">{selectedChapter.highestExpenseItem?.note || selectedChapter.highestExpenseItem?.subcategory || 'N/A'}</div>
                      </div>
                      <div className="text-rose-400 font-bold">
                        {selectedChapter.highestExpenseItem ? `INR ${selectedChapter.highestExpenseItem.amount}` : '-'}
                      </div>
                    </div>
                    
                    <div className="bg-[#1a1d24] border border-white/5 rounded-xl p-4 flex justify-between items-center">
                      <div>
                        <div className="text-xs text-slate-500 font-bold uppercase mb-1">Most Frequent Subcategory</div>
                        <div className="text-slate-300 font-medium">{selectedChapter.mostFreqSub || 'N/A'}</div>
                      </div>
                    </div>

                    <div className="bg-[#1a1d24] border border-white/5 rounded-xl p-4 flex justify-between items-center">
                      <div>
                        <div className="text-xs text-slate-500 font-bold uppercase mb-1">Busiest Day</div>
                        <div className="text-slate-300 font-medium">
                          {selectedChapter.busiestDay ? format(new Date(selectedChapter.busiestDay.date), 'MMM do, yyyy') : 'N/A'}
                        </div>
                      </div>
                      <div className="text-blue-400 font-bold bg-blue-500/10 px-2 py-1 rounded">
                        {selectedChapter.busiestDay?.count || 0} txns
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Connected Moments within Chapter */}
              {selectedChapter.connections && selectedChapter.connections.length > 0 && (
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-widest text-slate-500 mb-4 flex items-center gap-2">
                    <GitMerge className="w-4 h-4" /> Connected Moments in this Chapter
                  </h3>
                  <div className="space-y-4">
                    {selectedChapter.connections.slice(0, 5).map(conn => (
                      <div key={conn.id} className="bg-[#1a1d24] border border-white/5 rounded-xl p-5">
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-3">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-xs font-bold uppercase tracking-wider text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded">
                                {conn.type}
                              </span>
                              <span className="text-xs text-slate-500 flex items-center gap-1">
                                <Calendar className="w-3 h-3" /> {format(conn.date, 'MMM do, yyyy')}
                              </span>
                            </div>
                            <h4 className="font-bold text-white">{conn.title}</h4>
                            <p className="text-sm text-slate-400 mt-1">{conn.reason}</p>
                          </div>
                          <div className="shrink-0 text-sm font-medium text-slate-400 bg-white/5 px-3 py-1 rounded-lg">
                            {conn.receipts.length} Receipts
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
                          {conn.receipts.map((r, idx) => (
                            <React.Fragment key={idx}>
                              <div className="shrink-0 max-w-[150px]">
                                <div className="text-xs bg-black/20 rounded px-2 py-1.5 truncate border border-white/5 text-slate-300">
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
                      <div className="text-center text-sm text-slate-500 pt-2">
                        + {selectedChapter.connections.length - 5} more connections occurred during this period.
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

function StatBox({ label, value, icon }) {
  return (
    <div className="bg-white/5 rounded-xl p-4 border border-white/5">
      <div className="flex justify-between items-start mb-2">
        <div className="text-xs font-bold uppercase tracking-wider text-slate-500">{label}</div>
        {icon && <div>{icon}</div>}
      </div>
      <div className="text-lg font-bold text-white truncate" title={String(value)}>{value}</div>
    </div>
  );
}
