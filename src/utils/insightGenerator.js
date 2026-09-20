import { format, differenceInHours } from 'date-fns';

export const generateInsights = (dataset) => {
  if (!dataset || dataset.length === 0) return { connections: [], chapters: [], stats: null };

  const stats = calculateStats(dataset);
  const connections = buildConnectionEngine(dataset);
  const chapters = buildStoryChapters(dataset);

  return { stats, connections, chapters };
};

const calculateStats = (dataset) => {
  const totalMoments = dataset.length;
  let highestExpense = 0;
  let mostExpensiveReceipt = null;

  const categoryCounts = {};
  const dayCounts = {};

  dataset.forEach(item => {
    if (item.type === 'Expense' && item.amount > highestExpense) {
      highestExpense = item.amount;
      mostExpensiveReceipt = item;
    }

    categoryCounts[item.category] = (categoryCounts[item.category] || 0) + 1;
    
    const dayStr = format(item.date, 'yyyy-MM-dd');
    dayCounts[dayStr] = (dayCounts[dayStr] || 0) + 1;
  });

  const topCategory = Object.keys(categoryCounts).reduce((a, b) => categoryCounts[a] > categoryCounts[b] ? a : b, '');
  const mostActiveDay = Object.keys(dayCounts).reduce((a, b) => dayCounts[a] > dayCounts[b] ? a : b, '');

  return {
    totalMoments,
    topCategory: { name: topCategory, count: categoryCounts[topCategory] },
    mostActiveDay: { date: mostActiveDay, count: dayCounts[mostActiveDay] },
    mostExpensiveReceipt
  };
};

export const buildConnectionEngine = (dataset) => {
  const connections = [];
  const processedIds = new Set();

  // Sort chronologically
  const sorted = [...dataset].sort((a, b) => a.date.getTime() - b.date.getTime());

  const dayCounts = {};
  sorted.forEach(item => {
    const day = format(item.date, 'yyyy-MM-dd');
    dayCounts[day] = (dayCounts[day] || 0) + 1;
  });
  
  const avgDailyActivity = Object.keys(dayCounts).length > 0 
    ? Object.values(dayCounts).reduce((a,b) => a + b, 0) / Object.keys(dayCounts).length 
    : 0;

  // 1. UNUSUAL ACTIVITY
  Object.entries(dayCounts).forEach(([day, count]) => {
     if (count > avgDailyActivity * 2 && count >= 5) {
       const items = sorted.filter(i => format(i.date, 'yyyy-MM-dd') === day && !processedIds.has(i.id));
       if (items.length >= 5) {
         connections.push({
           id: `conn-unusual-${day}-${Math.random().toString(36).substr(2, 5)}`,
           type: 'Unusual Activity',
           title: 'Activity Spike',
           reason: `This day had ${count} transactions, above the dataset's typical daily activity of ${Math.round(avgDailyActivity)}.`,
           receipts: items,
           date: new Date(day),
           stats: `+${Math.round((count/avgDailyActivity - 1)*100)}% above average`
         });
         items.forEach(i => processedIds.add(i.id));
       }
     }
  });



  // Pre-group by day
  const byDay = {};
  sorted.forEach(item => {
    if (!processedIds.has(item.id)) {
      const day = format(item.date, 'yyyy-MM-dd');
      if (!byDay[day]) byDay[day] = [];
      byDay[day].push(item);
    }
  });

  // 3. REPEATED ACTIVITY
  for (const [day, items] of Object.entries(byDay)) {
    const catMap = {};
    items.forEach(i => {
      if (!catMap[i.category]) catMap[i.category] = [];
      catMap[i.category].push(i);
    });

    for (const [cat, catItems] of Object.entries(catMap)) {
      if (catItems.length >= 3) {
        connections.push({
          id: `conn-repeat-${day}-${cat}-${Math.random().toString(36).substr(2, 5)}`,
          type: 'Repeated Activity',
          title: `Repeated ${cat} Transactions`,
          reason: `${catItems.length} ${cat} transactions occurred on the same day.`,
          receipts: catItems,
          date: catItems[0].date,
          stats: `Category: ${cat}`
        });
        catItems.forEach(i => processedIds.add(i.id));
      }
    }
  }

  // 4. CATEGORY COMBINATION
  for (const [day, items] of Object.entries(byDay)) {
    const remaining = items.filter(i => !processedIds.has(i.id));
    const uniqueCats = [...new Set(remaining.map(r => r.category))];
    if (uniqueCats.length >= 2 && remaining.length >= 3) {
       connections.push({
          id: `conn-combo-${day}-${Math.random().toString(36).substr(2, 5)}`,
          type: 'Category Combination',
          title: 'Mixed Activity Pattern',
          reason: `Data pattern: ${uniqueCats.slice(0,2).join(' and ')} transactions occurred together on the same calendar day.`,
          receipts: remaining.slice(0, 6),
          date: remaining[0].date,
          stats: `${uniqueCats.length} Categories Combined`
       });
       remaining.slice(0, 6).forEach(i => processedIds.add(i.id));
    }
  }

  // 5. SAME-DAY CLUSTER
  for (const [day, items] of Object.entries(byDay)) {
    const remaining = items.filter(i => !processedIds.has(i.id));
    if (remaining.length >= 3) {
      connections.push({
          id: `conn-sameday-${day}-${Math.random().toString(36).substr(2, 5)}`,
          type: 'Same-Day Cluster',
          title: 'Daily Activity Group',
          reason: `${remaining.length} receipts connected because they occurred on the same date.`,
          receipts: remaining,
          date: remaining[0].date,
          stats: `1 Date`
      });
      remaining.forEach(i => processedIds.add(i.id));
    }
  }

  // 6. RECURRING PATTERN
  const monthlyCategoryDays = {};
  sorted.forEach(item => {
     if (processedIds.has(item.id)) return;
     const month = format(item.date, 'yyyy-MM');
     const day = format(item.date, 'yyyy-MM-dd');
     const key = `${month}-${item.category}`;
     if (!monthlyCategoryDays[key]) monthlyCategoryDays[key] = { items: [], days: new Set() };
     monthlyCategoryDays[key].days.add(day);
     monthlyCategoryDays[key].items.push(item);
  });

  for (const [key, data] of Object.entries(monthlyCategoryDays)) {
    if (data.days.size >= 5) {
      const [month, category] = key.split('-');
      connections.push({
          id: `conn-recurring-${key}-${Math.random().toString(36).substr(2, 5)}`,
          type: 'Recurring Pattern',
          title: `Consistent ${category}`,
          reason: `${category} activity appeared on ${data.days.size} different days this month.`,
          receipts: data.items.slice(0, 10),
          date: new Date(`${month}-01T00:00:00`),
          stats: `${data.days.size} distinct days`
      });
      data.items.slice(0, 10).forEach(i => processedIds.add(i.id));
    }
  }

  return connections.sort((a, b) => b.date.getTime() - a.date.getTime());
};

const buildStoryChapters = (dataset) => {
  const chapters = [];
  const byMonth = {};
  dataset.forEach(item => {
    const monthKey = format(item.date, 'yyyy-MM');
    if (!byMonth[monthKey]) byMonth[monthKey] = [];
    byMonth[monthKey].push(item);
  });

  for (const [monthKey, items] of Object.entries(byMonth)) {
    const dateObj = new Date(`${monthKey}-01T00:00:00`);
    const monthName = format(dateObj, 'MMMM yyyy');

    let totalExpense = 0;
    let totalIncome = 0;
    let totalTransfers = 0;
    const categoryCounts = {};
    const categorySpending = {};
    const subcategoryCounts = {};
    const dayCounts = {};
    let highestExpenseItem = null;

    items.forEach(i => {
      // Financials
      if (i.type === 'Expense') {
        totalExpense += i.amount;
        if (!highestExpenseItem || i.amount > highestExpenseItem.amount) {
          highestExpenseItem = i;
        }
      } else if (i.type === 'Income') {
        totalIncome += i.amount;
      } else if (i.type === 'Transfer-Out') {
        totalTransfers += i.amount;
      }

      // Breakdown
      categoryCounts[i.category] = (categoryCounts[i.category] || 0) + 1;
      if (i.type === 'Expense') {
        categorySpending[i.category] = (categorySpending[i.category] || 0) + i.amount;
      }

      if (i.subcategory) {
        subcategoryCounts[i.subcategory] = (subcategoryCounts[i.subcategory] || 0) + 1;
      }

      const day = format(i.date, 'yyyy-MM-dd');
      dayCounts[day] = (dayCounts[day] || 0) + 1;
    });

    const topCategory = Object.keys(categoryCounts).length > 0 
      ? Object.keys(categoryCounts).reduce((a, b) => categoryCounts[a] > categoryCounts[b] ? a : b) 
      : 'Other';
    
    let mostFreqSub = null;
    if (Object.keys(subcategoryCounts).length > 0) {
       mostFreqSub = Object.keys(subcategoryCounts).reduce((a, b) => subcategoryCounts[a] > subcategoryCounts[b] ? a : b);
    }

    let busiestDay = null;
    if (Object.keys(dayCounts).length > 0) {
       const busiestDayStr = Object.keys(dayCounts).reduce((a, b) => dayCounts[a] > dayCounts[b] ? a : b);
       busiestDay = { date: busiestDayStr, count: dayCounts[busiestDayStr] };
    }

    const topCatPercent = Math.round((categoryCounts[topCategory] / items.length) * 100);
    const topCatDays = new Set(items.filter(i => i.category === topCategory).map(i => format(i.date, 'yyyy-MM-dd'))).size;
    
    const summary = `${topCategory} was the primary category, representing ${topCatPercent}% of recorded activity and appearing on ${topCatDays} different days.`;

    const title = `${topCategory} Activity — ${monthName}`;
    
    // Find connections inside this specific chapter
    const chapterConnections = buildConnectionEngine(items);

    chapters.push({
      id: `chapter-${monthKey}`,
      title,
      summary,
      dateRange: monthName,
      receiptCount: items.length,
      topCategory,
      totalExpense,
      totalIncome,
      totalTransfers,
      categoryCounts,
      categorySpending,
      mostFreqSub,
      busiestDay,
      highestExpenseItem,
      receipts: items,
      date: dateObj,
      connections: chapterConnections
    });
  }

  return chapters.sort((a, b) => b.date.getTime() - a.date.getTime());
};
