
import React, { createContext, useContext, useState, useEffect } from 'react';
import { performContextualSearch, SearchResult } from '@/utils/searchUtils';
import { communities, issues } from '@/services/mockData';

export type ConnectionStatus = 'online' | 'offline' | 'reconnecting' | 'low';
export type ThemeType = 'light' | 'dark' | 'system';

export interface AppContextType {
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  connectionStatus: ConnectionStatus;
  isMobile: boolean;
  theme: ThemeType;
  setTheme: (theme: ThemeType) => void;
  resolvedTheme: 'light' | 'dark';
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
  const [theme, setTheme] = useState<ThemeType>(() => {
    // Get from localStorage or default to 'system'
    const savedTheme = localStorage.getItem('theme');
    return (savedTheme as ThemeType) || 'system';
  });
  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>(
    document.documentElement.classList.contains('dark') ? 'dark' : 'light'
  );
  const [reduceMotion, setReduceMotion] = useState(() => {
    const savedMotion = localStorage.getItem('reduceMotion');
    return savedMotion ? JSON.parse(savedMotion) : false;
  });
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

  // Handle system theme preference changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = () => {
      if (theme === 'system') {
        const newTheme = mediaQuery.matches ? 'dark' : 'light';
        setResolvedTheme(newTheme);
        updateThemeClass(newTheme);
      }
    };
    
    // Initial check
    handleChange();
    
    // Listen for changes
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme]);

  // Apply theme and motion preferences when they change
  useEffect(() => {
    const newResolvedTheme = theme === 'system'
      ? window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
      : theme;
    
    setResolvedTheme(newResolvedTheme);
    updateThemeClass(newResolvedTheme);
    localStorage.setItem('theme', theme);
    
    localStorage.setItem('reduceMotion', JSON.stringify(reduceMotion));
    
    if (reduceMotion) {
      document.documentElement.classList.add('reduce-motion');
    } else {
      document.documentElement.classList.remove('reduce-motion');
    }
  }, [theme, reduceMotion]);

  const updateThemeClass = (newTheme: 'light' | 'dark') => {
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

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
    resolvedTheme,
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
