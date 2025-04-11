
import React, { createContext, useContext, useState, useEffect } from 'react';
import { performContextualSearch, SearchResult } from '@/utils/searchUtils';
import { communities, issues } from '@/services/mockData';

export type ConnectionStatus = 'online' | 'offline' | 'reconnecting' | 'low';

export interface AppContextType {
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  connectionStatus: ConnectionStatus;
  isMobile: boolean;
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
  reduceMotion: boolean;
  setReduceMotion: (reduce: boolean) => void;
  enableLowDataMode: boolean;
  toggleLowDataMode: () => void;
  // Search related properties
  performSearch: (query: string) => void;
  searchResults: SearchResult[];
  isSearching: boolean;
  // Location
  location: string;
  setLocation: (location: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('online');
  const [isMobile, setIsMobile] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [reduceMotion, setReduceMotion] = useState(false);
  const [enableLowDataMode, setEnableLowDataMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [location, setLocation] = useState('');

  // Check if device is mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Monitor network status
  useEffect(() => {
    const handleOnline = () => setConnectionStatus('online');
    const handleOffline = () => setConnectionStatus('offline');
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Apply theme and motion preferences
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    if (reduceMotion) {
      document.documentElement.classList.add('reduce-motion');
    } else {
      document.documentElement.classList.remove('reduce-motion');
    }
  }, [theme, reduceMotion]);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  
  const toggleLowDataMode = () => setEnableLowDataMode(!enableLowDataMode);

  // Search function
  const performSearch = (query: string) => {
    setSearchQuery(query);
    setIsSearching(true);
    
    // Simulate API delay
    setTimeout(() => {
      const issueResults = performContextualSearch(
        issues,
        query,
        {
          textFields: ['title', 'description'],
          type: 'issue',
          userLocation: location
        }
      );
      
      const communityResults = performContextualSearch(
        communities,
        query,
        {
          textFields: ['name', 'description'],
          type: 'community',
          userLocation: location
        }
      );
      
      setSearchResults([...issueResults, ...communityResults]);
      setIsSearching(false);
    }, 500);
  };
  
  const value = {
    isSidebarOpen,
    toggleSidebar,
    setSidebarOpen: setIsSidebarOpen,
    connectionStatus,
    isMobile,
    theme,
    setTheme,
    reduceMotion,
    setReduceMotion,
    enableLowDataMode,
    toggleLowDataMode,
    performSearch,
    searchResults,
    isSearching,
    location,
    setLocation
  };
  
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = () => {
  const context = useContext(AppContext);
  
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  
  return context;
};
