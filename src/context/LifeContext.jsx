import React, { createContext, useContext, useState } from 'react';
import { useDataStore } from '../hooks/useDataStore';
import { useExplorer } from '../hooks/useExplorer';

const LifeContext = createContext(null);

export function LifeProvider({ children }) {
  const { data, insights, loading, error } = useDataStore();
  const [activeTab, setActiveTab] = useState('overview');
  
  // Explorer state is managed globally so filters persist when navigating away and back
  const explorerState = useExplorer(data);

  const navigateToExplorer = ({ category, month, searchTerm }) => {
    if (category) explorerState.filters.setCategory(category);
    if (month) explorerState.filters.setMonth(month);
    if (searchTerm !== undefined) explorerState.filters.setSearchTerm(searchTerm);
    setActiveTab('explorer');
  };

  const value = {
    data,
    insights,
    loading,
    error,
    activeTab,
    setActiveTab,
    explorerState,
    navigateToExplorer
  };

  return (
    <LifeContext.Provider value={value}>
      {children}
    </LifeContext.Provider>
  );
}

export function useLifeContext() {
  const context = useContext(LifeContext);
  if (!context) {
    throw new Error('useLifeContext must be used within a LifeProvider');
  }
  return context;
}
