import React from 'react';

export function StatCard({ icon, label, value, subtext, onClick }) {
  return (
    <div 
      onClick={onClick}
      role={onClick ? 'button' : 'article'}
      tabIndex={onClick ? 0 : undefined}
      className={`glass-panel h-full rounded-[20px] p-3.5 sm:p-4 flex flex-col justify-between transition-all duration-300 relative overflow-hidden group ${onClick ? 'cursor-pointer hover:bg-white/[0.04] hover:border-white/20 hover:shadow-[0_4px_20px_rgba(0,0,0,0.5)] focus-ring' : 'hover:bg-white/[0.03] hover:border-white/10 hover:shadow-[0_4px_20px_rgba(0,0,0,0.5)]'}`}
    >
      {/* Subtle radial glow on hover */}
      <div className="absolute inset-0 bg-radial-gradient from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
      
      <div className="flex items-start justify-between mb-3 relative z-10">
        <span className="text-slate-400 font-semibold text-[11px] tracking-widest uppercase truncate pr-2">{label}</span>
        <div className="p-1.5 bg-black/40 border border-white/5 rounded-lg shrink-0 transition-transform duration-300 group-hover:scale-110">{icon}</div>
      </div>
      <div className="relative z-10">
        <div className="text-[26px] md:text-[28px] font-bold tracking-tight text-white truncate leading-none" title={String(value)}>{value}</div>
        <div className="text-[12px] font-medium text-slate-500 mt-1.5 truncate" title={subtext}>{subtext}</div>
      </div>
    </div>
  );
}
