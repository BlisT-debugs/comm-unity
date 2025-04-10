
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { useApp } from '@/contexts/AppContext';

type RealtimeResourceType = 'issues' | 'communities' | 'comments';

interface UseRealTimeUpdatesOptions {
  resource: RealtimeResourceType;
  onInsert?: (payload: any) => void;
  onUpdate?: (payload: any) => void;
  onDelete?: (payload: any) => void;
  enabled?: boolean;
  resourceId?: string;
}

export const useRealTimeUpdates = ({
  resource,
  onInsert,
  onUpdate,
  onDelete,
  enabled = true,
  resourceId
}: UseRealTimeUpdatesOptions) => {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const { connectionStatus } = useApp();
  
  useEffect(() => {
    // Don't subscribe if disabled or offline
    if (!enabled || connectionStatus === 'offline') {
      return setIsSubscribed(false);
    }
    
    // Configure the filter based on resource type and ID
    let filter: any = {
      event: '*',
      schema: 'public',
      table: resource
    };
    
    // Add specific filter for resourceId if provided
    if (resourceId) {
      filter.filter = `id=eq.${resourceId}`;
    }

    // Create channel and subscribe to changes
    const channel = supabase
      .channel('public-changes')
      .on('postgres_changes', filter, (payload) => {
        const { eventType } = payload;
        
        // Handle different event types
        switch (eventType) {
          case 'INSERT':
            if (onInsert) onInsert(payload.new);
            else {
              let title = '';
              if (resource === 'issues') title = `New issue created: ${payload.new.title}`;
              else if (resource === 'communities') title = `New community created: ${payload.new.name}`;
              else if (resource === 'comments') title = 'New comment added';
              
              if (title) {
                toast({
                  title,
                  description: 'Refresh to see the latest updates',
                });
              }
            }
            break;
          
          case 'UPDATE':
            if (onUpdate) onUpdate(payload.new);
            break;
            
          case 'DELETE':
            if (onDelete) onDelete(payload.old);
            break;
            
          default:
            break;
        }
      })
      .subscribe((status) => {
        setIsSubscribed(status === 'SUBSCRIBED');
        
        if (status === 'SUBSCRIBED' && connectionStatus !== 'low') {
          console.log(`Subscribed to real-time updates for ${resource}`);
        } else if (status === 'CHANNEL_ERROR') {
          console.error(`Error subscribing to ${resource} updates`);
        }
      });

    // Cleanup on unmount
    return () => {
      supabase.removeChannel(channel);
      setIsSubscribed(false);
    };
  }, [resource, resourceId, enabled, connectionStatus, onInsert, onUpdate, onDelete]);

  return { isSubscribed };
};
