import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { loadDataset } from '../utils/dataParser';
import { generateInsights } from '../utils/insightGenerator';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [data, setData] = useState(null);
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [activeTab, setActiveTab] = useState('overview');
  
  // Shared filters for cross-component navigation
  const [explorerFilters, setExplorerFilters] = useState({
    search: '',
    category: 'All',
    month: 'All'
  });

  useEffect(() => {
    const initData = async () => {
      try {
        setLoading(true);
        setError(null);
        const parsed = await loadDataset();
        if (!parsed || parsed.length === 0) {
           throw new Error("Dataset is empty or could not be loaded.");
        }
        const generatedInsights = generateInsights(parsed);
        setData(parsed);
        setInsights(generatedInsights);
      } catch (err) {
        console.error("Failed to load data", err);
        setError(err.message || "Failed to parse dataset.");
      } finally {
        setLoading(false);
      }
    };
    initData();
  }, []);

  // Helper for cross-navigation
  const navigateToExplorer = (filters = {}) => {
    setExplorerFilters(prev => ({ ...prev, ...filters }));
    setActiveTab('explorer');
  };

  const navigateToChapters = () => {
    setActiveTab('chapters');
  };

  const value = useMemo(() => ({
    data,
    insights,
    loading,
    error,
    activeTab,
    setActiveTab,
    explorerFilters,
    setExplorerFilters,
    navigateToExplorer,
    navigateToChapters
  }), [data, insights, loading, error, activeTab, explorerFilters]);

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useLifeOS() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useLifeOS must be used within an AppProvider');
  }
  return context;
}
