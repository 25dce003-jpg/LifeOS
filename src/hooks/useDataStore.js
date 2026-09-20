import { useState, useEffect, useMemo } from 'react';
import { loadDataset } from '../utils/dataParser';
import { generateInsights } from '../utils/insightGenerator';

export function useDataStore() {
  const [data, setData] = useState(null);
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    
    const initData = async () => {
      try {
        setLoading(true);
        const parsed = await loadDataset();
        
        if (isMounted) {
          setData(parsed);
          // Generate insights immediately to avoid re-renders
          const generatedInsights = generateInsights(parsed);
          setInsights(generatedInsights);
        }
      } catch (err) {
        if (isMounted) {
          setError(err);
          console.error("Failed to load data", err);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };
    
    initData();
    
    return () => {
      isMounted = false;
    };
  }, []);

  return { data, insights, loading, error };
}
