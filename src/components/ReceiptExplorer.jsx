import React, { useState } from 'react';
import { format } from 'date-fns';
import { Search, ArrowDownUp, Receipt, X, ChevronDown } from 'lucide-react';
import { useLifeContext } from '../context/LifeContext';

export default function ReceiptExplorer() {
  const { data, explorerState } = useLifeContext();
  const { filters, options, filteredData } = explorerState;
  
  const [selectedReceipt, setSelectedReceipt] = useState(null);

  return (
    <div className="pb-24">
      <div className="mb-10">
        <h2 className="text-3xl font-bold tracking-tight mb-2">Explorer</h2>
        <p className="text-slate-400 font-light">Search and filter through {data.length.toLocaleString()} original transactions.</p>
      </div>

      {/* Controls */}
      <div className="flex flex-col xl:flex-row gap-4 mb-8">
        <div className="relative flex-1 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
          <input 
            type="text"
            placeholder="Search notes, categories, subcategories..."
            className="w-full glass-panel border border-white/10 rounded-2xl py-3.5 pl-12 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all shadow-inner placeholder:text-slate-500"
            value={filters.searchTerm}
            onChange={(e) => filters.setSearchTerm(e.target.value)}
            aria-label="Search transactions"
          />
        </div>
        
        <div className="flex flex-wrap gap-4">
          <div className="relative flex-1 sm:flex-none sm:w-44 min-w-[130px]">
            <select 
              className="w-full glass-panel border border-white/10 rounded-2xl py-3.5 pl-4 pr-10 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 appearance-none cursor-pointer hover:border-white/20 transition-colors"
              value={filters.typeFilter}
              onChange={(e) => filters.setTypeFilter(e.target.value)}
              aria-label="Filter by type"
            >
              <option value="All">All Types</option>
              {options.types.filter(t => t !== 'All').map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
          </div>

          <div className="relative flex-1 sm:flex-none sm:w-44 min-w-[130px]">
            <select 
              className="w-full glass-panel border border-white/10 rounded-2xl py-3.5 pl-4 pr-10 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 appearance-none cursor-pointer hover:border-white/20 transition-colors"
              value={filters.categoryFilter}
              onChange={(e) => filters.setCategoryFilter(e.target.value)}
              aria-label="Filter by category"
            >
              <option value="All">All Categories</option>
              {options.categories.filter(c => c !== 'All').map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
          </div>
          
          <div className="relative flex-1 sm:flex-none sm:w-44 min-w-[130px]">
            <select 
              className="w-full glass-panel border border-white/10 rounded-2xl py-3.5 pl-4 pr-10 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 appearance-none cursor-pointer hover:border-white/20 transition-colors"
              value={filters.monthFilter}
              onChange={(e) => filters.setMonthFilter(e.target.value)}
              aria-label="Filter by month"
            >
              <option value="All">All Months</option>
              {options.months.filter(m => m !== 'All').map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
          </div>

          <div className="flex gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-36">
              <select 
                className="w-full glass-panel border border-white/10 rounded-2xl py-3.5 pl-4 pr-10 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 appearance-none cursor-pointer hover:border-white/20 transition-colors"
                value={filters.sortBy}
                onChange={(e) => filters.setSortBy(e.target.value)}
                aria-label="Sort by attribute"
              >
                <option value="date">Sort: Date</option>
                <option value="amount">Sort: Amount</option>
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
            </div>
            
            <button 
              onClick={() => filters.setSortOrder(prev => prev === 'desc' ? 'asc' : 'desc')}
              className="glass-panel border border-white/10 rounded-2xl px-5 py-3.5 text-slate-300 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all flex items-center justify-center shrink-0 focus-ring hover:scale-105 active:scale-95"
              title={`Toggle Sort Order (currently ${filters.sortOrder})`}
              aria-label={`Toggle Sort Order, currently ${filters.sortOrder}`}
            >
              <ArrowDownUp className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Results Meta */}
      <div className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-6 flex justify-between">
        <span aria-live="polite">Showing {filteredData.length.toLocaleString()} results</span>
        {filters.searchTerm && (
          <button onClick={() => filters.setSearchTerm('')} className="text-blue-400 hover:text-blue-300 focus-ring px-2 rounded">
            CLEAR SEARCH
          </button>
        )}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 sm:gap-6">
        {filteredData.slice(0, 100).map((receipt, i) => {
          const delayClass = `delay-${((i % 4) + 1) * 100}`;
          return (
            <button 
              key={receipt.id}
              onClick={() => setSelectedReceipt(receipt)}
              className={`animate-slide-up ${delayClass} glass-panel rounded-3xl p-5 sm:p-6 text-left cursor-pointer hover:border-white/20 hover:shadow-[0_8px_30px_rgba(0,0,0,0.5)] hover:bg-white/[0.04] transition-all duration-300 group focus-ring w-full relative overflow-hidden`}
              aria-label={`View receipt for ${receipt.amount} ${receipt.currency} on ${format(receipt.date, 'MMM dd, yyyy')}`}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 via-transparent to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
              
              <div className="flex justify-between items-start mb-4 relative z-10">
                <div className="bg-black/40 p-2.5 rounded-xl text-slate-400 border border-white/5 shadow-inner transition-transform duration-300 group-hover:scale-110 group-hover:bg-blue-500/10 group-hover:text-blue-400">
                  <Receipt className="w-5 h-5" />
                </div>
                <div className="text-right">
                  <div className={`font-bold text-xl tracking-tight ${receipt.type === 'Expense' ? 'text-white' : 'text-emerald-400'}`}>
                    {receipt.currency} {receipt.amount}
                  </div>
                  <div className="text-[10px] uppercase tracking-widest font-bold text-slate-500 mt-0.5">{format(receipt.date, 'MMM dd, yyyy')}</div>
                </div>
              </div>
              
              <div className="font-bold text-white mb-4 tracking-tight leading-snug line-clamp-2 relative z-10" title={receipt.note}>
                {receipt.note || receipt.subcategory || 'Transaction'}
              </div>
              
              <div className="flex gap-2 text-[10px] font-bold tracking-wider uppercase flex-wrap relative z-10">
                {receipt.type && (
                  <span className="bg-black/40 text-slate-400 px-2.5 py-1 rounded-md border border-white/5">
                    {receipt.type}
                  </span>
                )}
                {receipt.category && (
                  <span className="bg-white/5 text-slate-300 px-2.5 py-1 rounded-md border border-white/5">
                    {receipt.category}
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {filteredData.length > 100 && (
        <div className="text-center p-12 text-slate-500 font-light mt-8">
          Showing top 100 results. Use search or filters to narrow down.
        </div>
      )}
      
      {filteredData.length === 0 && (
        <div className="text-center p-16 glass-panel border border-dashed border-white/10 rounded-3xl mt-8">
          <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-6">
            <Receipt className="w-8 h-8 text-slate-600" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2 tracking-tight">No receipts found</h3>
          <p className="text-slate-400 font-light">Try adjusting your search or filters.</p>
        </div>
      )}

      {/* Detail Modal */}
      {selectedReceipt && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6"
          role="dialog"
          aria-modal="true"
          aria-labelledby="receipt-modal-title"
        >
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-md animate-fade-in" 
            onClick={() => setSelectedReceipt(null)} 
          />
          <div className="relative glass-panel bg-[#12141a]/90 rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden animate-scale-in border border-white/10">
            
            <div className="p-6 sm:p-8 border-b border-white/5 flex justify-between items-start relative">
              <div className="absolute inset-0 bg-gradient-to-b from-blue-500/5 to-transparent pointer-events-none" />
              <div className="relative z-10">
                <h3 id="receipt-modal-title" className="text-2xl font-bold text-white mb-1 tracking-tight">Receipt Details</h3>
                <p className="text-slate-400 text-sm font-medium">{format(selectedReceipt.date, 'MMMM do, yyyy')}</p>
              </div>
              <button 
                onClick={() => setSelectedReceipt(null)}
                className="p-2 bg-black/40 hover:bg-white/10 rounded-full transition-all duration-200 text-slate-400 hover:text-white focus-ring relative z-10 border border-white/5 hover:scale-110"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 sm:p-8 space-y-6" tabIndex="-1">
              <div className="text-center bg-black/20 p-8 rounded-2xl border border-white/5 shadow-inner transition-colors hover:bg-white/[0.02]">
                <div className="text-[10px] text-slate-500 uppercase tracking-[0.2em] font-bold mb-3">{selectedReceipt.type || 'Amount'}</div>
                <div className={`text-5xl font-bold tracking-tight ${selectedReceipt.type === 'Expense' ? 'text-white' : 'text-emerald-400'}`}>
                  {selectedReceipt.currency} {selectedReceipt.amount}
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-black/20 p-4 rounded-xl border border-white/5">
                  <div className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-1.5">Category</div>
                  <div className="font-semibold text-white">{selectedReceipt.category || '-'}</div>
                </div>
                <div className="bg-black/20 p-4 rounded-xl border border-white/5">
                  <div className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-1.5">Subcategory</div>
                  <div className="font-semibold text-white">{selectedReceipt.subcategory || '-'}</div>
                </div>
                <div className="bg-black/20 p-4 rounded-xl border border-white/5">
                  <div className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-1.5">Mode</div>
                  <div className="font-semibold text-white">{selectedReceipt.mode || '-'}</div>
                </div>
                <div className="bg-black/20 p-4 rounded-xl border border-white/5">
                  <div className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-1.5">Type</div>
                  <div className="font-semibold text-white">{selectedReceipt.type || '-'}</div>
                </div>
              </div>
              
              {selectedReceipt.note && (
                <div>
                  <div className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-2">Note / Description</div>
                  <div className="bg-black/20 p-5 rounded-2xl border border-white/5 text-sm font-medium text-slate-300 break-words leading-relaxed">
                    {selectedReceipt.note}
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
