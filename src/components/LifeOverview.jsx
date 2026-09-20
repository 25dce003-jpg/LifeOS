import React, { useMemo } from 'react';
import { Activity, ShoppingBag, Calendar, HeartPulse, ArrowDownRight, ArrowUpRight, RefreshCw, Layers } from 'lucide-react';
import { format } from 'date-fns';
import { useLifeContext } from '../context/LifeContext';
import { StatCard } from './ui/StatCard';
import { InsightCard } from './ui/InsightCard';

export default function LifeOverview() {
  const { data, insights, navigateToExplorer } = useLifeContext();

  if (!insights || !insights.stats || !data) return null;

  const { 
    totalMoments, 
    totalExpense, 
    totalIncome, 
    totalTransfers, 
    activeMonths, 
    topCategory, 
    mostActiveDay 
  } = insights.stats;

  // Calculate category distribution for visualization
  const categoryDistribution = useMemo(() => {
    const counts = {};
    let maxCount = 0;
    data.forEach(item => {
      if (item.category) {
        counts[item.category] = (counts[item.category] || 0) + 1;
        if (counts[item.category] > maxCount) {
          maxCount = counts[item.category];
        }
      }
    });
    
    // Sort and take top 8
    const sorted = Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8);
      
    return { sorted, maxCount, total: totalMoments };
  }, [data, totalMoments]);

  return (
    <div className="space-y-4 md:space-y-6 pb-12">
      {/* Primary KPI Row - 4 Columns */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
        <div className="animate-slide-up delay-100">
          <StatCard 
            icon={<Activity className="text-blue-400 w-3.5 h-3.5" />}
            label="Total Transactions"
            value={totalMoments}
            subtext="Records processed"
          />
        </div>
        <div className="animate-slide-up delay-200">
          <StatCard 
            icon={<ArrowUpRight className="text-rose-400 w-3.5 h-3.5" />}
            label="Total Expenses"
            value={totalExpense ? `INR ${totalExpense.toLocaleString(undefined, {minimumFractionDigits: 0, maximumFractionDigits: 0})}` : '0'}
            subtext="Money Out"
          />
        </div>
        <div className="animate-slide-up delay-300">
          <StatCard 
            icon={<ArrowDownRight className="text-emerald-400 w-3.5 h-3.5" />}
            label="Total Income"
            value={totalIncome ? `INR ${totalIncome.toLocaleString(undefined, {minimumFractionDigits: 0, maximumFractionDigits: 0})}` : '0'}
            subtext="Money In"
          />
        </div>
        <div className="animate-slide-up delay-400">
          <StatCard 
            icon={<RefreshCw className="text-purple-400 w-3.5 h-3.5" />}
            label="Total Transfers"
            value={totalTransfers ? `INR ${totalTransfers.toLocaleString(undefined, {minimumFractionDigits: 0, maximumFractionDigits: 0})}` : '0'}
            subtext="Transferred Out"
          />
        </div>
      </div>

      {/* Secondary KPI Row - 3 Columns */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 sm:gap-4">
        <div className="animate-slide-up delay-100">
          <StatCard 
            icon={<Calendar className="text-orange-400 w-3.5 h-3.5" />}
            label="Active Months"
            value={activeMonths}
            subtext="Months recorded"
          />
        </div>
        <div className="animate-slide-up delay-200">
          <StatCard 
            icon={<ShoppingBag className="text-indigo-400 w-3.5 h-3.5" />}
            label="Top Category"
            value={topCategory.name}
            subtext={`${topCategory.count} transactions`}
            onClick={() => navigateToExplorer({ category: topCategory.name })}
          />
        </div>
        <div className="animate-slide-up delay-300">
          <StatCard 
            icon={<HeartPulse className="text-pink-400 w-3.5 h-3.5" />}
            label="Busiest Day"
            value={mostActiveDay.date !== 'None' ? format(new Date(mostActiveDay.date), 'MMM do, yyyy') : 'N/A'}
            subtext={`${mostActiveDay.count} transactions`}
            onClick={() => mostActiveDay.date !== 'None' && navigateToExplorer({ searchTerm: format(new Date(mostActiveDay.date), 'MMM dd, yyyy') })}
          />
        </div>
      </div>

      {/* Dynamic Data Visualization */}
      <div className="glass-panel rounded-[20px] p-4 sm:p-5 animate-slide-up delay-400 shadow-[0_4px_20px_rgba(0,0,0,0.3)]">
        <div className="flex items-center gap-2 mb-4">
          <div className="p-1.5 bg-blue-500/10 rounded-lg border border-blue-500/20">
            <Layers className="text-blue-400 w-4 h-4" />
          </div>
          <div>
            <h2 className="text-[15px] font-bold tracking-tight text-white leading-none mb-1">Category Distribution</h2>
            <p className="text-[12px] text-slate-400 leading-none">Most frequent transaction types</p>
          </div>
        </div>
        
        <div className="space-y-2.5">
          {categoryDistribution.sorted.map(([cat, count], idx) => {
            const percentage = Math.round((count / categoryDistribution.maxCount) * 100);
            const totalPercentage = Math.round((count / categoryDistribution.total) * 100);
            return (
              <div 
                key={idx} 
                className="flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-3 group cursor-pointer"
                onClick={() => navigateToExplorer({ category: cat })}
                role="button"
                tabIndex={0}
                aria-label={`Explore category ${cat}`}
              >
                <div className="w-full sm:w-32 md:w-40 text-[12px] font-medium text-slate-300 truncate group-hover:text-blue-400 transition-colors" title={cat}>
                  {cat}
                </div>
                <div className="flex-1 h-6 bg-black/40 rounded-md overflow-hidden flex items-center relative border border-white/5 shadow-inner group-hover:border-white/10 transition-colors">
                  <div 
                    className="h-full bg-gradient-to-r from-blue-500/40 to-indigo-500/60 transition-all duration-1000 ease-out border-r border-blue-400/50 group-hover:from-blue-500/60 group-hover:to-indigo-500/80" 
                    style={{ width: `${percentage}%` }}
                  />
                  <div className="absolute left-3 text-[11px] font-semibold tracking-wide text-white drop-shadow-md">
                    {count}
                  </div>
                </div>
                <div className="w-10 text-right text-[12px] font-semibold text-slate-400 tabular-nums">
                  {totalPercentage}%
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Discovery Highlights - Data Driven Only */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 sm:gap-4 animate-slide-up delay-300">
        <InsightCard 
          title="Top Spending Category"
          description={`Your dataset indicates that "${topCategory.name}" is the most frequent category, appearing ${topCategory.count} times.`}
          actionText={`Explore ${topCategory.name}`}
          onAction={() => navigateToExplorer({ category: topCategory.name })}
        />
        <InsightCard 
          title="Most Active Period"
          description={`Your busiest single day involved ${mostActiveDay.count} distinct transactions on ${mostActiveDay.date !== 'None' ? format(new Date(mostActiveDay.date), 'MMM do, yyyy') : 'N/A'}.`}
          actionText={mostActiveDay.date !== 'None' ? `View Activity on ${format(new Date(mostActiveDay.date), 'MMM do')}` : null}
          onAction={() => mostActiveDay.date !== 'None' && navigateToExplorer({ searchTerm: format(new Date(mostActiveDay.date), 'MMM dd, yyyy') })}
        />
        <InsightCard 
          title="Dataset Scope"
          description={`This dataset covers activity spanning ${activeMonths} different months, comprising a total of ${totalMoments.toLocaleString()} individual records.`}
        />
      </div>
    </div>
  );
}
