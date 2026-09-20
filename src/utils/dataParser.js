import Papa from 'papaparse';
import { parse, isValid, parseISO } from 'date-fns';

export const loadDataset = async () => {
  try {
    const response = await fetch('/Daily Household Transactions.csv');
    if (!response.ok) throw new Error('Failed to fetch dataset');
    const csvText = await response.text();
    
    return new Promise((resolve, reject) => {
      Papa.parse(csvText, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          resolve(processRawData(results.data));
        },
        error: (error) => reject(error)
      });
    });
  } catch (error) {
    console.error('Error loading dataset:', error);
    return [];
  }
};

const processRawData = (rawData) => {
  return rawData.map((row, index) => {
    // Attempt to parse date
    let parsedDate = null;
    let hasTime = false;
    if (row.Date) {
      const dateParts = row.Date.trim().split(' ');
      const dateOnly = dateParts[0];
      const timeOnly = dateParts[1];
      
      hasTime = !!timeOnly;
      const timeStr = timeOnly || '00:00:00';
      
      const [day, month, year] = dateOnly.split('/');
      if (day && month && year) {
         const isoString = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}T${timeStr}`;
         parsedDate = parseISO(isoString);
      }
    }

    // Derive Contextual Tag based on rules
    let contextualTag = row.Category || 'Other';
    if (row.Category?.toLowerCase() === 'subscription' && row.Subcategory?.toLowerCase() === 'netflix') {
      contextualTag = 'Entertainment';
    } else if (row.Category?.toLowerCase() === 'transportation') {
      contextualTag = 'Travel';
    } else if (row.Category?.toLowerCase() === 'culture' && row.Subcategory?.toLowerCase() === 'movie') {
      contextualTag = 'Entertainment';
    } else if (row.Category?.toLowerCase() === 'food' && row.Subcategory?.toLowerCase() === 'dinner') {
      contextualTag = 'Dining';
    }

    return {
      id: `receipt-${index}`,
      originalDate: row.Date,
      date: isValid(parsedDate) ? parsedDate : null,
      hasTime,
      mode: row.Mode,
      category: row.Category,
      subcategory: row.Subcategory,
      note: row.Note,
      amount: parseFloat(row.Amount) || 0,
      type: row['Income/Expense'],
      currency: row.Currency,
      contextualTag,
      raw: row
    };
  }).filter(item => item.date !== null) // Filter out items with invalid dates for timeline
    .sort((a, b) => a.date.getTime() - b.date.getTime()); // Sort chronologically
};
