import Papa from 'papaparse';
import { isValid, parseISO } from 'date-fns';

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
    // Attempt to parse date (assuming DD/MM/YYYY or DD/MM/YYYY HH:mm format in CSV, but stripping time)
    let parsedDate = null;
    if (row.Date) {
      const dateParts = row.Date.trim().split(' ');
      const dateOnly = dateParts[0];
      
      const [day, month, year] = dateOnly.split('/');
      if (day && month && year) {
         // Create an ISO string for midnight UTC to avoid timezone issues or fabricated times
         const isoString = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}T00:00:00`;
         parsedDate = parseISO(isoString);
      }
    }

    return {
      id: `receipt-${index}`,
      originalDate: row.Date,
      date: isValid(parsedDate) ? parsedDate : null,
      mode: row.Mode,
      category: row.Category,
      subcategory: row.Subcategory,
      note: row.Note,
      amount: parseFloat(row.Amount) || 0,
      type: row['Income/Expense'],
      currency: row.Currency,
      raw: row
    };
  }).filter(item => item.date !== null) // Filter out items with invalid dates for timeline
    .sort((a, b) => a.date.getTime() - b.date.getTime()); // Sort chronologically
};
