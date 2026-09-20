import React from 'react';

export function InsightCard({ title, description, actionText, onAction }) {
  return (
    <div className="glass-panel rounded-[20px] p-4 transition-all duration-300 hover:border-white/10 hover:bg-white/[0.03] flex flex-col">
      <h3 className="text-[14px] font-bold text-white mb-1.5 tracking-tight leading-tight">{title}</h3>
      <p className="text-slate-400 leading-relaxed text-[13px] font-light flex-1">{description}</p>
      
      {actionText && onAction && (
        <button 
          onClick={onAction}
          className="mt-3 text-left text-[11px] font-bold uppercase tracking-wider text-blue-400 hover:text-blue-300 transition-colors w-fit focus-ring rounded"
        >
          {actionText} &rarr;
        </button>
      )}
    </div>
  );
}
