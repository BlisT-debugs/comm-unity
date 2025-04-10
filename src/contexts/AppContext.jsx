
import React, { createContext, useContext, useState } from 'react';

// Create the context
const AppContext = createContext();

// Create a provider component
export const AppProvider = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobileView, setIsMobileView] = useState(window.innerWidth < 768);
  const [connectionStatus, setConnectionStatus] = useState('online');
  const [enableLowDataMode, setEnableLowDataMode] = useState(false);
  const [location, setLocation] = useState(null);
  
  // Toggle sidebar function
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  
  // Toggle low data mode
  const toggleLowDataMode = () => {
    setEnableLowDataMode(!enableLowDataMode);
  };
  
  // Add window resize listener to detect mobile view
  React.useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setIsSidebarOpen(false);
      }
    };
    
    window.addEventListener('resize', handleResize);
    
    // Simulate connection status changes for demo purposes
    const checkConnection = () => {
      if (navigator.onLine) {
        setConnectionStatus(Math.random() > 0.9 ? 'low' : 'online');
      } else {
        setConnectionStatus('offline');
      }
    };
    
    const intervalId = setInterval(checkConnection, 30000);
    window.addEventListener('online', () => setConnectionStatus('online'));
    window.addEventListener('offline', () => setConnectionStatus('offline'));
    
    return () => {
      window.removeEventListener('resize', handleResize);
      clearInterval(intervalId);
      window.removeEventListener('online', () => setConnectionStatus('online'));
      window.removeEventListener('offline', () => setConnectionStatus('offline'));
    };
  }, []);
  
  // Context value
  const value = {
    isSidebarOpen,
    setIsSidebarOpen,
    toggleSidebar,
    isMobileView,
    connectionStatus,
    enableLowDataMode,
    toggleLowDataMode,
    location,
    setLocation,
  };
  
  // Provide the context value to children
  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

// Custom hook for using the context
export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
