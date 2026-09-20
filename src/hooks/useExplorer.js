import { useState, useMemo } from 'react';
import { format } from 'date-fns';

export function useExplorer(data) {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [typeFilter, setTypeFilter] = useState('All');
  const [monthFilter, setMonthFilter] = useState('All');
  const [sortBy, setSortBy] = useState('date'); // 'date' or 'amount'
  const [sortOrder, setSortOrder] = useState('desc'); // 'desc' or 'asc'

  // Extract unique filter options
  const { categories, types, months } = useMemo(() => {
    if (!data || data.length === 0) return { categories: ['All'], types: ['All'], months: ['All'] };

    const cats = new Set();
    const ts = new Set();
    const ms = new Set();
    
    data.forEach(d => {
      if (d.category) cats.add(d.category);
      if (d.type) ts.add(d.type);
      if (d.date) ms.add(format(d.date, 'yyyy-MM'));
    });
    
    return {
      categories: ['All', ...Array.from(cats)].sort(),
      types: ['All', ...Array.from(ts)].sort(),
      months: ['All', ...Array.from(ms)].sort((a,b) => b.localeCompare(a))
    };
  }, [data]);

  // Filter and sort logic
  const filteredData = useMemo(() => {
    if (!data) return [];
    
    let filtered = data;

    if (categoryFilter !== 'All') {
      filtered = filtered.filter(d => d.category === categoryFilter);
    }
    
    if (typeFilter !== 'All') {
      filtered = filtered.filter(d => d.type === typeFilter);
    }
    
    if (monthFilter !== 'All') {
      filtered = filtered.filter(d => format(d.date, 'yyyy-MM') === monthFilter);
    }

    if (searchTerm) {
      const lower = searchTerm.toLowerCase();
      filtered = filtered.filter(d => {
        const dateStr = d.date ? format(d.date, 'MMM dd, yyyy').toLowerCase() : '';
        return (
          (d.note && d.note.toLowerCase().includes(lower)) ||
          (d.subcategory && d.subcategory.toLowerCase().includes(lower)) ||
          (d.category && d.category.toLowerCase().includes(lower)) ||
          (d.mode && d.mode.toLowerCase().includes(lower)) ||
          dateStr.includes(lower)
        );
      });
    }

    return filtered.sort((a, b) => {
      let comparison = 0;
      if (sortBy === 'date') {
        comparison = a.date.getTime() - b.date.getTime();
      } else if (sortBy === 'amount') {
        comparison = a.amount - b.amount;
      }
      return sortOrder === 'desc' ? -comparison : comparison;
    });
  }, [data, searchTerm, categoryFilter, typeFilter, monthFilter, sortBy, sortOrder]);

  const setCategory = (cat) => {
    setCategoryFilter(categories.includes(cat) ? cat : 'All');
  };

  const setMonth = (month) => {
    setMonthFilter(months.includes(month) ? month : 'All');
  };

  return {
    filters: {
      searchTerm, setSearchTerm,
      categoryFilter, setCategoryFilter, setCategory,
      typeFilter, setTypeFilter,
      monthFilter, setMonthFilter, setMonth,
      sortBy, setSortBy,
      sortOrder, setSortOrder
    },
    options: { categories, types, months },
    filteredData
  };
}
