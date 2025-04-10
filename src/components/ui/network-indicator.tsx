
import React from 'react';
import { Wifi, WifiOff, AlertTriangle } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Switch } from '@/components/ui/switch';

const NetworkIndicator: React.FC<{ showSettings?: boolean }> = ({ showSettings = false }) => {
  const { connectionStatus, enableLowDataMode, toggleLowDataMode } = useApp();
  
  // Simple indicator
  if (!showSettings) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Badge 
              variant={connectionStatus === 'offline' ? 'destructive' : 
                      connectionStatus === 'low' ? 'outline' : 'secondary'}
              className="gap-1"
            >
              {connectionStatus === 'offline' ? (
                <><WifiOff className="h-3 w-3" /> Offline</>
              ) : connectionStatus === 'low' ? (
                <><AlertTriangle className="h-3 w-3" /> Low Connectivity</>
              ) : (
                <><Wifi className="h-3 w-3" /> Online</>
              )}
            </Badge>
          </TooltipTrigger>
          <TooltipContent>
            {connectionStatus === 'offline' 
              ? "You're offline. Changes will be saved locally."
              : connectionStatus === 'low'
              ? "Low connectivity detected. Some features may be limited."
              : "You're online. All features available."}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }
  
  // Full settings view
  return (
    <div className="p-4 border rounded-lg bg-card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-medium">Network Status</h3>
        {connectionStatus === 'offline' ? (
          <Badge variant="destructive" className="gap-1">
            <WifiOff className="h-3 w-3" /> Offline
          </Badge>
        ) : connectionStatus === 'low' ? (
          <Badge variant="outline" className="gap-1">
            <AlertTriangle className="h-3 w-3" /> Low Connectivity
          </Badge>
        ) : (
          <Badge variant="secondary" className="gap-1">
            <Wifi className="h-3 w-3" /> Online
          </Badge>
        )}
      </div>
      
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium">Low Data Mode</p>
          <p className="text-xs text-muted-foreground">
            Reduces data usage by limiting images and background syncing
          </p>
        </div>
        <Switch
          checked={enableLowDataMode}
          onCheckedChange={toggleLowDataMode}
        />
      </div>
    </div>
  );
};

export default NetworkIndicator;
