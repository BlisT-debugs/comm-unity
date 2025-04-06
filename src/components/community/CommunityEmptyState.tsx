
import React from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CommunityEmptyStateProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onCreateCommunity: () => void;
}

const CommunityEmptyState: React.FC<CommunityEmptyStateProps> = ({
  activeTab,
  setActiveTab,
  onCreateCommunity
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-16">
      <p className="text-muted-foreground mb-4">
        {activeTab === 'joined' 
          ? "You haven't joined any communities yet" 
          : "No communities found matching your search"}
      </p>
      {activeTab === 'joined' ? (
        <Button onClick={() => setActiveTab('all')}>Explore Communities</Button>
      ) : (
        <Button onClick={onCreateCommunity}>
          <Plus className="mr-2 h-4 w-4" />
          Create a Community
        </Button>
      )}
    </div>
  );
};

export default CommunityEmptyState;
