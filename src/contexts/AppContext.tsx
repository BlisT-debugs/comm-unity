
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { toast } from "@/hooks/use-toast";
import { SearchResult, performContextualSearch } from '@/utils/searchUtils';
import { useIssues } from '@/hooks/useIssues';
import { useCommunities } from '@/hooks/useCommunities';

type ConnectionStatus = 'online' | 'offline' | 'low';

interface AppContextType {
  isOnline: boolean;
  connectionStatus: ConnectionStatus;
  enableLowDataMode: boolean;
  toggleLowDataMode: () => void;
  performSearch: (query: string) => Promise<SearchResult[]>;
  searchResults: SearchResult[];
  location: string | null;
  setLocation: (location: string | null) => void;
  isSearching: boolean;
}

const AppContext = createContext<AppContextType>({
  isOnline: true,
  connectionStatus: 'online',
  enableLowDataMode: false,
  toggleLowDataMode: () => {},
  performSearch: async () => [],
  searchResults: [],
  location: null,
  setLocation: () => {},
  isSearching: false,
});

export const useApp = () => useContext(AppContext);

export const AppProvider: React.FC<{children: ReactNode}> = ({ children }) => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>(navigator.onLine ? 'online' : 'offline');
  const [enableLowDataMode, setEnableLowDataMode] = useState(
    localStorage.getItem('low-data-mode') === 'true'
  );
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [location, setLocation] = useState<string | null>(
    localStorage.getItem('user-location')
  );
  
  const { issues } = useIssues({ limit: 100 });
  const { communities } = useCommunities({ limit: 100 });

  // Monitor online/offline status
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setConnectionStatus('online');
      toast({
        title: "You're back online",
        description: "Your changes will now sync.",
      });
    };

    const handleOffline = () => {
      setIsOnline(false);
      setConnectionStatus('offline');
      toast({
        title: "You're offline",
        description: "Changes will be saved locally until connection is restored.",
        variant: "destructive",
      });
    };

    // Use Performance API to detect slow connections
    const checkConnectionSpeed = () => {
      if ("connection" in navigator && navigator.onLine) {
        const connection = (navigator as any).connection;
        
        if (connection) {
          if (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g') {
            setConnectionStatus('low');
            if (!enableLowDataMode) {
              toast({
                title: "Low connectivity detected",
                description: "Consider enabling low data mode in settings.",
              });
            }
          } else {
            setConnectionStatus('online');
          }
        }
      }
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    // Check connection speed periodically
    const intervalId = setInterval(checkConnectionSpeed, 30000);
    
    // Initial check
    checkConnectionSpeed();

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      clearInterval(intervalId);
    };
  }, [enableLowDataMode]);

  // Save low data mode preference
  useEffect(() => {
    localStorage.setItem('low-data-mode', enableLowDataMode.toString());
  }, [enableLowDataMode]);
  
  // Save location preference
  useEffect(() => {
    if (location) {
      localStorage.setItem('user-location', location);
    } else {
      localStorage.removeItem('user-location');
    }
  }, [location]);
  
  const toggleLowDataMode = () => {
    setEnableLowDataMode(prev => !prev);
  };

  // Unified search across issues and communities with context awareness
  const performSearch = async (query: string): Promise<SearchResult[]> => {
    if (!query.trim()) {
      setSearchResults([]);
      return [];
    }
    
    setIsSearching(true);
    
    try {
      // Search in issues
      const issueResults = performContextualSearch(
        issues,
        query,
        {
          textFields: ['title', 'description', 'category'],
          locationField: 'location',
          userLocation: location || undefined,
          dateField: 'created_at',
          popularityField: 'upvote_count',
          type: 'issue'
        }
      );
      
      // Search in communities
      const communityResults = performContextualSearch(
        communities,
        query,
        {
          textFields: ['name', 'description'],
          locationField: 'location',
          userLocation: location || undefined,
          dateField: 'created_at',
          popularityField: 'member_count',
          type: 'community'
        }
      );
      
      // Combine and sort by relevance
      const combinedResults = [...issueResults, ...communityResults]
        .sort((a, b) => b.score - a.score);
      
      setSearchResults(combinedResults);
      return combinedResults;
    } catch (error) {
      console.error("Search error:", error);
      return [];
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <AppContext.Provider 
      value={{ 
        isOnline, 
        connectionStatus,
        enableLowDataMode, 
        toggleLowDataMode,
        performSearch,
        searchResults,
        location,
        setLocation,
        isSearching
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
