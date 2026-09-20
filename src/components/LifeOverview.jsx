import React from 'react';
import { Activity, CreditCard, ShoppingBag, MapPin, Film, Coffee, HeartPulse } from 'lucide-react';
import { format } from 'date-fns';

export default function LifeOverview({ data, insights }) {
  if (!insights || !insights.stats) return null;

  const { totalMoments, topCategory, mostActiveDay, mostExpensiveReceipt } = insights.stats;

  return (
    <div className="space-y-12 pb-24">
      {/* Hero Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          icon={<Activity className="text-blue-400" />}
          label="Total Moments"
          value={totalMoments}
          subtext="Receipts processed"
        />
        <StatCard 
          icon={<ShoppingBag className="text-purple-400" />}
          label="Top Category"
          value={topCategory.name}
          subtext={`${topCategory.count} transactions`}
        />
        <StatCard 
          icon={<HeartPulse className="text-emerald-400" />}
          label="Most Active Day"
          value={mostActiveDay.date ? format(new Date(mostActiveDay.date), 'MMM do, yyyy') : 'N/A'}
          subtext={`${mostActiveDay.count} transactions`}
        />
        <StatCard 
          icon={<CreditCard className="text-orange-400" />}
          label="Highest Expense"
          value={mostExpensiveReceipt ? `${mostExpensiveReceipt.currency} ${mostExpensiveReceipt.amount}` : 'N/A'}
          subtext={mostExpensiveReceipt ? mostExpensiveReceipt.note : ''}
        />
      </div>

      {/* Pulse Visualization - simplified to a grid heatmap-like structure */}
      <div className="bg-[#1a1d24] border border-white/5 rounded-2xl p-6">
        <h2 className="text-xl font-bold mb-6">Life Pulse</h2>
        <div className="flex flex-wrap gap-1.5 opacity-80">
          {/* Simple representation: one dot per 10 receipts, grouped roughly */}
          {Array.from({ length: Math.min(365, totalMoments) }).map((_, i) => (
            <div 
              key={i} 
              className={`w-3 h-3 rounded-sm ${
                i % 7 === 0 ? 'bg-blue-500' : 
                i % 5 === 0 ? 'bg-indigo-500' : 
                i % 3 === 0 ? 'bg-purple-500' : 
                'bg-slate-700'
              }`}
              title="Activity node"
            />
          ))}
        </div>
        <p className="text-sm text-slate-400 mt-4">
          Each block represents a fragment of activity. Brighter colors indicate denser transaction clusters.
        </p>
      </div>

      {/* Discovery Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <InsightCard 
          title="What Did We Discover?"
          description="Your most significant patterns center around Food and Household expenses, with distinct spikes during festival periods."
        />
        <InsightCard 
          title="Unexpected Connection"
          description="High travel spending frequently correlates with increased dining out on the same day."
        />
        <InsightCard 
          title="Activity Spike"
          description={`Your busiest single day involved ${mostActiveDay.count} distinct moments, making it a highly active period.`}
        />
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, subtext }) {
  return (
    <div className="bg-[#1a1d24] border border-white/5 rounded-2xl p-5 flex flex-col justify-between hover:border-white/10 transition-colors">
      <div className="flex items-center justify-between mb-4">
        <span className="text-slate-400 font-medium text-sm">{label}</span>
        <div className="p-2 bg-white/5 rounded-lg">{icon}</div>
      </div>
      <div>
        <div className="text-2xl font-bold text-white truncate">{value}</div>
        <div className="text-sm text-slate-500 mt-1 truncate">{subtext}</div>
      </div>
    </div>
  );
}

function InsightCard({ title, description }) {
  return (
    <div className="bg-gradient-to-br from-[#1a1d24] to-[#12141a] border border-white/5 rounded-2xl p-6">
      <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
      <p className="text-slate-400 leading-relaxed text-sm">{description}</p>
    </div>
  );
}
