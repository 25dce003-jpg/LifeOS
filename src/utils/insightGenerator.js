import { format } from 'date-fns';

export const generateInsights = (dataset) => {
  if (!dataset || dataset.length === 0) return { connections: [], chapters: [], stats: null };

  const stats = calculateStats(dataset);
  const connections = buildConnectionEngine(dataset);
  const chapters = buildStoryChapters(dataset);

  return { stats, connections, chapters };
};

const calculateStats = (dataset) => {
  const totalMoments = dataset.length;
  let totalExpense = 0;
  let totalIncome = 0;
  let totalTransfers = 0;

  const categoryCounts = {};
  const dayCounts = {};

  dataset.forEach(item => {
    if (item.type === 'Expense') {
      totalExpense += item.amount;
    } else if (item.type === 'Income') {
      totalIncome += item.amount;
    } else if (item.type === 'Transfer-Out') {
      totalTransfers += item.amount;
    }

    if (item.category) {
      categoryCounts[item.category] = (categoryCounts[item.category] || 0) + 1;
    }
    
    const dayStr = format(item.date, 'yyyy-MM-dd');
    dayCounts[dayStr] = (dayCounts[dayStr] || 0) + 1;
  });

  let topCategoryName = 'None';
  let topCategoryCount = 0;
  for (const [cat, count] of Object.entries(categoryCounts)) {
    if (count > topCategoryCount) {
      topCategoryName = cat;
      topCategoryCount = count;
    }
  }

  let mostActiveDayStr = 'None';
  let mostActiveDayCount = 0;
  for (const [day, count] of Object.entries(dayCounts)) {
    if (count > mostActiveDayCount) {
      mostActiveDayStr = day;
      mostActiveDayCount = count;
    }
  }

  // Active months
  const months = new Set(dataset.map(item => format(item.date, 'yyyy-MM')));

  return {
    totalMoments,
    totalExpense,
    totalIncome,
    totalTransfers,
    activeMonths: months.size,
    topCategory: { name: topCategoryName, count: topCategoryCount },
    mostActiveDay: { date: mostActiveDayStr, count: mostActiveDayCount },
  };
};

export const buildConnectionEngine = (dataset) => {
  const connections = [];
  const processedIds = new Set();

  // Sort chronologically
  const sorted = [...dataset].sort((a, b) => a.date.getTime() - b.date.getTime());

  const dayCounts = {};
  const totalAmount = sorted.reduce((sum, item) => sum + item.amount, 0);
  const avgAmount = sorted.length > 0 ? totalAmount / sorted.length : 0;

  sorted.forEach(item => {
    const day = format(item.date, 'yyyy-MM-dd');
    dayCounts[day] = (dayCounts[day] || 0) + 1;
  });
  
  const avgDailyActivity = Object.keys(dayCounts).length > 0 
    ? Object.values(dayCounts).reduce((a,b) => a + b, 0) / Object.keys(dayCounts).length 
    : 0;

  // 1. High-Activity Days (instead of Unusual Activity)
  Object.entries(dayCounts).forEach(([day, count]) => {
     if (count > avgDailyActivity * 2 && count >= 5) {
       const items = sorted.filter(i => format(i.date, 'yyyy-MM-dd') === day && !processedIds.has(i.id));
       if (items.length >= 5) {
         connections.push({
           id: `conn-activity-${day}-${Math.random().toString(36).substring(2, 7)}`,
           type: 'High-Activity Day',
           title: 'Activity Spike',
           reason: `${count} transactions occurred on ${day}, which is significantly above the dataset average of ${Math.round(avgDailyActivity)} per day.`,
           receipts: items,
           date: new Date(day),
           stats: `${count} Transactions`
         });
         items.forEach(i => processedIds.add(i.id));
       }
     }
  });

  // 1.5 Recurring Transactions (Subscriptions/Bills)
  const bySubcategory = {};
  sorted.forEach(item => {
    if (!processedIds.has(item.id) && item.subcategory) {
      if (!bySubcategory[item.subcategory]) bySubcategory[item.subcategory] = [];
      bySubcategory[item.subcategory].push(item);
    }
  });

  for (const [subcat, items] of Object.entries(bySubcategory)) {
    if (items.length >= 3) {
      const months = new Set(items.map(i => format(i.date, 'yyyy-MM')));
      if (months.size >= 3) {
        const avgAmt = items.reduce((s, i) => s + i.amount, 0) / items.length;
        // Check if amounts are within 15% variance
        const allSimilar = items.every(i => Math.abs(i.amount - avgAmt) / (avgAmt || 1) < 0.15);
        
        if (allSimilar) {
          connections.push({
             id: `conn-recurring-${Math.random().toString(36).substring(2, 7)}`,
             type: 'Recurring Transaction',
             title: `Recurring: ${subcat}`,
             reason: `Consistently similar amounts spent on "${subcat}" across ${months.size} different months.`,
             receipts: items,
             date: items[items.length - 1].date,
             stats: `${months.size} Months`
          });
          items.forEach(i => processedIds.add(i.id));
        }
      }
    }
  }

  // Pre-group by day for remaining connection types
  const byDay = {};
  sorted.forEach(item => {
    if (!processedIds.has(item.id)) {
      const day = format(item.date, 'yyyy-MM-dd');
      if (!byDay[day]) byDay[day] = [];
      byDay[day].push(item);
    }
  });

  // 2. Unusually High Transaction Amounts
  sorted.forEach(item => {
    if (!processedIds.has(item.id) && item.amount > avgAmount * 3 && item.amount > 0) {
      connections.push({
         id: `conn-highamt-${item.id}-${Math.random().toString(36).substring(2, 7)}`,
         type: 'High Amount',
         title: `Significant ${item.category || 'Transaction'}`,
         reason: `This transaction of ${item.currency} ${item.amount} is significantly above the average transaction amount of ${Math.round(avgAmount)}.`,
         receipts: [item],
         date: item.date,
         stats: `>3x Average Amount`
      });
      processedIds.add(item.id);
    }
  });

  // 3. Repeated Activity (Category/Subcategory)
  for (const [day, items] of Object.entries(byDay)) {
    const catMap = {};
    items.forEach(i => {
      if (!processedIds.has(i.id) && i.category) {
        if (!catMap[i.category]) catMap[i.category] = [];
        catMap[i.category].push(i);
      }
    });

    for (const [cat, catItems] of Object.entries(catMap)) {
      if (catItems.length >= 3) {
        connections.push({
          id: `conn-repeat-${day}-${cat}-${Math.random().toString(36).substring(2, 7)}`,
          type: 'Repeated Category',
          title: `Repeated ${cat}`,
          reason: `${catItems.length} transactions in the "${cat}" category occurred on ${day}.`,
          receipts: catItems,
          date: catItems[0].date,
          stats: `Category: ${cat}`
        });
        catItems.forEach(i => processedIds.add(i.id));
      }
    }
  }

  // 4. Category Combination
  for (const [day, items] of Object.entries(byDay)) {
    const remaining = items.filter(i => !processedIds.has(i.id) && i.category);
    const uniqueCats = [...new Set(remaining.map(r => r.category))];
    if (uniqueCats.length >= 2 && remaining.length >= 3) {
       connections.push({
          id: `conn-combo-${day}-${Math.random().toString(36).substring(2, 7)}`,
          type: 'Category Combination',
          title: 'Mixed Activity Pattern',
          reason: `Transactions spanning ${uniqueCats.length} different categories (${uniqueCats.slice(0, 2).join(' and ')}) occurred on ${day}.`,
          receipts: remaining.slice(0, 6),
          date: remaining[0].date,
          stats: `${uniqueCats.length} Categories`
       });
       remaining.slice(0, 6).forEach(i => processedIds.add(i.id));
    }
  }

  // 5. Same-Day Cluster (Catch-all for remaining dense days)
  for (const [day, items] of Object.entries(byDay)) {
    const remaining = items.filter(i => !processedIds.has(i.id));
    if (remaining.length >= 3) {
      connections.push({
          id: `conn-sameday-${day}-${Math.random().toString(36).substring(2, 7)}`,
          type: 'Same-Day Cluster',
          title: 'Daily Activity Group',
          reason: `${remaining.length} transactions connected because they occurred on ${day}.`,
          receipts: remaining,
          date: remaining[0].date,
          stats: `1 Date`
      });
      remaining.forEach(i => processedIds.add(i.id));
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
      // Financials (Strict Separation)
      if (i.type === 'Expense') {
        totalExpense += i.amount;
        if (!highestExpenseItem || i.amount > highestExpenseItem.amount) {
          highestExpenseItem = i;
        }
        if (i.category) {
          categorySpending[i.category] = (categorySpending[i.category] || 0) + i.amount;
        }
      } else if (i.type === 'Income') {
        totalIncome += i.amount;
      } else if (i.type === 'Transfer-Out') {
        totalTransfers += i.amount;
      }

      // Breakdown
      if (i.category) {
        categoryCounts[i.category] = (categoryCounts[i.category] || 0) + 1;
      }
      if (i.subcategory) {
        subcategoryCounts[i.subcategory] = (subcategoryCounts[i.subcategory] || 0) + 1;
      }

      const day = format(i.date, 'yyyy-MM-dd');
      dayCounts[day] = (dayCounts[day] || 0) + 1;
    });

    let topCategory = 'Other';
    if (Object.keys(categoryCounts).length > 0) {
      topCategory = Object.keys(categoryCounts).reduce((a, b) => categoryCounts[a] > categoryCounts[b] ? a : b);
    }
    
    let mostFreqSub = null;
    if (Object.keys(subcategoryCounts).length > 0) {
       mostFreqSub = Object.keys(subcategoryCounts).reduce((a, b) => subcategoryCounts[a] > subcategoryCounts[b] ? a : b);
    }

    let busiestDay = null;
    if (Object.keys(dayCounts).length > 0) {
       const busiestDayStr = Object.keys(dayCounts).reduce((a, b) => dayCounts[a] > dayCounts[b] ? a : b);
       busiestDay = { date: busiestDayStr, count: dayCounts[busiestDayStr] };
    }

    const title = `${monthName} Summary`;
    const summary = `During ${monthName}, there were ${items.length} total transactions. The most active category was ${topCategory}.`;
    
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
