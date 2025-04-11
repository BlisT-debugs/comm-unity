
import { useState, useEffect } from 'react';
import { useApp } from '@/contexts/AppContext';

// Simulated function to handle reconnection logic
const attemptReconnection = async (): Promise<boolean> => {
  // Simulate network reconnection attempt with a delay
  return new Promise((resolve) => {
    setTimeout(() => {
      // 70% chance of successful reconnection for demo
      const success = Math.random() > 0.3;
      resolve(success);
    }, 1500);
  });
};

export function useRealTimeUpdates<T>(
  fetchFunction: () => Promise<T>,
  options: {
    initialData?: T;
    pollingInterval?: number;
    dependencies?: any[];
    onDataUpdated?: (data: T) => void;
    enableOfflineCache?: boolean;
  } = {}
) {
  const { 
    initialData, 
    pollingInterval = 30000, 
    dependencies = [], 
    onDataUpdated,
    enableOfflineCache = true
  } = options;
  
  const [data, setData] = useState<T | undefined>(initialData);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const { connectionStatus, enableLowDataMode } = useApp();
  
  // Fetch data function with error handling and offline support
  const fetchData = async () => {
    if (connectionStatus === 'offline') {
      console.log('Skipping fetch while offline');
      setLoading(false);
      return;
    }
    
    try {
      setLoading(true);
      const result = await fetchFunction();
      
      setData(result);
      setLastUpdated(new Date());
      setError(null);
      
      // Optional callback when data is updated
      if (onDataUpdated) {
        onDataUpdated(result);
      }
      
      // Store in local cache for offline use if enabled
      if (enableOfflineCache) {
        try {
          localStorage.setItem('cached_data', JSON.stringify(result));
          localStorage.setItem('cache_timestamp', new Date().toISOString());
        } catch (e) {
          console.warn('Failed to store data in local cache', e);
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error occurred'));
      
      // If network error and we have cached data, use it
      if (enableOfflineCache && connectionStatus !== 'online' && connectionStatus !== 'low') {
        try {
          const cachedData = localStorage.getItem('cached_data');
          if (cachedData) {
            setData(JSON.parse(cachedData) as T);
            setLastUpdated(new Date(localStorage.getItem('cache_timestamp') || ''));
            console.log('Using cached data due to connection issue');
          }
        } catch (e) {
          console.error('Failed to retrieve cached data', e);
        }
      }
    } finally {
      setLoading(false);
    }
  };
  
  // Initial fetch and dependency-based refetch
  useEffect(() => {
    fetchData();
  }, [...dependencies]);
  
  // Set up polling
  useEffect(() => {
    // Skip polling if offline or in low data mode
    if (connectionStatus === 'offline' || (connectionStatus === 'low' && enableLowDataMode)) {
      return;
    }
    
    // For low connectivity, use a longer interval
    const interval = connectionStatus === 'low' ? pollingInterval * 2 : pollingInterval;
    
    const timer = setInterval(fetchData, interval);
    return () => clearInterval(timer);
  }, [connectionStatus, enableLowDataMode, pollingInterval, ...dependencies]);
  
  // Handle reconnection attempts
  useEffect(() => {
    let reconnectionTimer: number | undefined;
    
    if (connectionStatus === 'reconnecting') {
      reconnectionTimer = window.setTimeout(async () => {
        const success = await attemptReconnection();
        if (success) {
          // If reconnection successful, fetch latest data
          fetchData();
        }
      }, 3000);
    }
    
    return () => {
      if (reconnectionTimer) clearTimeout(reconnectionTimer);
    };
  }, [connectionStatus]);
  
  return {
    data,
    loading,
    error,
    lastUpdated,
    refresh: fetchData
  };
}
