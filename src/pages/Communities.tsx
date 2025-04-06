
import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useCommunities } from '@/hooks/useCommunities';
import { useJoinCommunity } from '@/hooks/useJoinCommunity';
import CommunitiesGrid from '@/components/community/CommunitiesGrid';
import CommunitySearchBar from '@/components/community/CommunitySearchBar';
import CommunityTabFilter from '@/components/community/CommunityTabFilter';
import CommunityEmptyState from '@/components/community/CommunityEmptyState';
import CreateCommunityDialog from '@/components/community/CreateCommunityDialog';

const Communities = () => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<string>('all');
  const [isCreateDialogOpen, setCreateDialogOpen] = useState(false);
  
  // Get communities based on active tab
  const { communities, isLoading, refetch } = useCommunities({
    search: searchQuery,
    joined: activeTab === 'joined'
  });
  
  const { joinCommunity } = useJoinCommunity(refetch);
  
  return (
    <div className="container py-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Communities</h1>
        
        <CreateCommunityDialog
          isOpen={isCreateDialogOpen}
          setIsOpen={setCreateDialogOpen}
          onSuccess={refetch}
        />
      </div>
      
      <div className="flex flex-col md:flex-row gap-4">
        <div className="md:w-3/4">
          <CommunitySearchBar 
            searchQuery={searchQuery} 
            setSearchQuery={setSearchQuery} 
          />
        </div>
        
        <div className="md:w-1/4">
          {user && (
            <CommunityTabFilter 
              activeTab={activeTab} 
              setActiveTab={setActiveTab} 
            />
          )}
        </div>
      </div>
      
      {isLoading ? (
        <CommunitiesGrid 
          communities={[]} 
          isLoading={true} 
          showJoined={activeTab === 'joined'}
          onJoinCommunity={joinCommunity}
        />
      ) : communities.length > 0 ? (
        <CommunitiesGrid 
          communities={communities} 
          isLoading={false} 
          showJoined={activeTab === 'joined'}
          onJoinCommunity={joinCommunity}
        />
      ) : (
        <CommunityEmptyState 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
          onCreateCommunity={() => setCreateDialogOpen(true)}
        />
      )}
    </div>
  );
};

export default Communities;
