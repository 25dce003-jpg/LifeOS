import React, { useState, useMemo } from 'react';
import { format } from 'date-fns';
import { Search, Filter, ArrowDownUp, Receipt, X } from 'lucide-react';

export default function ReceiptExplorer({ data }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [sortOrder, setSortOrder] = useState('desc'); // 'desc' or 'asc'
  const [selectedReceipt, setSelectedReceipt] = useState(null);

  // Extract unique categories
  const categories = useMemo(() => {
    const cats = new Set(data.map(d => d.category));
    return ['All', ...Array.from(cats)].filter(Boolean);
  }, [data]);

  // Filter and sort logic
  const filteredData = useMemo(() => {
    let filtered = data;

    if (categoryFilter !== 'All') {
      filtered = filtered.filter(d => d.category === categoryFilter);
    }

    if (searchTerm) {
      const lower = searchTerm.toLowerCase();
      filtered = filtered.filter(d => 
        (d.note && d.note.toLowerCase().includes(lower)) ||
        (d.subcategory && d.subcategory.toLowerCase().includes(lower)) ||
        (d.category && d.category.toLowerCase().includes(lower)) ||
        (d.contextualTag && d.contextualTag.toLowerCase().includes(lower))
      );
    }

    return filtered.sort((a, b) => {
      const timeA = a.date.getTime();
      const timeB = b.date.getTime();
      return sortOrder === 'desc' ? timeB - timeA : timeA - timeB;
    });
  }, [data, searchTerm, categoryFilter, sortOrder]);

  return (
    <div className="pb-24">
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-2">Explorer</h2>
        <p className="text-slate-400">Search and filter through {data.length} original transactions.</p>
      </div>

      {/* Controls */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
          <input 
            type="text"
            placeholder="Search moments..."
            className="w-full bg-[#1a1d24] border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex gap-4">
          <div className="relative flex-1 md:flex-none md:w-48">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <select 
              className="w-full bg-[#1a1d24] border border-white/10 rounded-xl py-3 pl-9 pr-4 text-white focus:outline-none focus:border-blue-500 appearance-none cursor-pointer"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          
          <button 
            onClick={() => setSortOrder(prev => prev === 'desc' ? 'asc' : 'desc')}
            className="bg-[#1a1d24] border border-white/10 rounded-xl px-4 py-3 text-slate-300 hover:text-white hover:bg-white/5 transition-colors flex items-center justify-center"
            title="Toggle Sort Order"
          >
            <ArrowDownUp className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Results Meta */}
      <div className="text-sm text-slate-500 mb-4 flex justify-between">
        <span>Showing {filteredData.length} results</span>
        {searchTerm && (
          <button onClick={() => setSearchTerm('')} className="text-blue-400 hover:text-blue-300">
            Clear Search
          </button>
        )}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredData.slice(0, 100).map((receipt) => (
          <div 
            key={receipt.id}
            onClick={() => setSelectedReceipt(receipt)}
            className="bg-[#1a1d24] border border-white/5 rounded-xl p-4 cursor-pointer hover:border-blue-500/50 hover:bg-[#1f222b] transition-all group"
          >
            <div className="flex justify-between items-start mb-3">
              <div className="bg-white/5 p-2 rounded-lg text-slate-400 group-hover:text-blue-400 group-hover:bg-blue-500/10 transition-colors">
                <Receipt className="w-5 h-5" />
              </div>
              <div className="text-right">
                <div className={`font-bold ${receipt.type === 'Expense' ? 'text-slate-200' : 'text-emerald-400'}`}>
                  {receipt.currency} {receipt.amount}
                </div>
                <div className="text-xs text-slate-500">{format(receipt.date, 'MMM dd, yyyy')}</div>
              </div>
            </div>
            
            <div className="font-medium text-white line-clamp-1 mb-1" title={receipt.note}>
              {receipt.note || receipt.subcategory || 'Transaction'}
            </div>
            
            <div className="flex gap-2 text-xs mt-3">
              <span className="bg-white/5 text-slate-400 px-2 py-1 rounded truncate max-w-[50%] border border-white/5" title="Original Category">
                {receipt.category}
              </span>
              <span className="bg-blue-500/10 text-blue-400/80 px-2 py-1 rounded truncate border border-blue-500/10" title="Derived Context">
                {receipt.contextualTag}
              </span>
            </div>
          </div>
        ))}
      </div>

      {filteredData.length > 100 && (
        <div className="text-center p-8 text-slate-500">
          Showing top 100 results. Use search or filters to narrow down.
        </div>
      )}
      
      {filteredData.length === 0 && (
        <div className="text-center p-12 border border-dashed border-white/10 rounded-2xl bg-white/5">
          <Receipt className="w-12 h-12 text-slate-600 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-white mb-1">No receipts found</h3>
          <p className="text-slate-500">Try adjusting your search or filters.</p>
        </div>
      )}

      {/* Detail Modal */}
      {selectedReceipt && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
          <div 
            className="absolute inset-0 bg-black/80 backdrop-blur-sm" 
            onClick={() => setSelectedReceipt(null)} 
          />
          <div className="relative bg-[#12141a] border border-white/10 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden">
            <div className="p-6 border-b border-white/5 flex justify-between items-start">
              <div>
                <h3 className="text-xl font-bold text-white mb-1">Receipt Details</h3>
                <p className="text-slate-400 text-sm">{format(selectedReceipt.date, 'MMMM do, yyyy')}</p>
              </div>
              <button 
                onClick={() => setSelectedReceipt(null)}
                className="p-2 hover:bg-white/5 rounded-full transition-colors text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="text-center bg-[#1a1d24] p-6 rounded-xl border border-white/5">
                <div className="text-sm text-slate-500 uppercase tracking-widest font-bold mb-2">Amount</div>
                <div className={`text-4xl font-bold ${selectedReceipt.type === 'Expense' ? 'text-white' : 'text-emerald-400'}`}>
                  {selectedReceipt.currency} {selectedReceipt.amount}
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-xs text-slate-500 uppercase font-bold mb-1">Original Category</div>
                  <div className="font-medium">{selectedReceipt.category || '-'}</div>
                </div>
                <div>
                  <div className="text-xs text-slate-500 uppercase font-bold mb-1">Derived Context</div>
                  <div className="font-medium text-blue-400">{selectedReceipt.contextualTag || '-'}</div>
                </div>
                <div>
                  <div className="text-xs text-slate-500 uppercase font-bold mb-1">Subcategory</div>
                  <div className="font-medium">{selectedReceipt.subcategory || '-'}</div>
                </div>
                <div>
                  <div className="text-xs text-slate-500 uppercase font-bold mb-1">Mode</div>
                  <div className="font-medium">{selectedReceipt.mode || '-'}</div>
                </div>
              </div>
              
              {selectedReceipt.note && (
                <div>
                  <div className="text-xs text-slate-500 uppercase font-bold mb-1">Note / Description</div>
                  <div className="bg-[#1a1d24] p-3 rounded-lg border border-white/5 text-sm">
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
