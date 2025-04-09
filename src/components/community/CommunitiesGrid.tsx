
import React, { Suspense } from 'react';
import CommunityCardSkeleton from '@/components/community/CommunityCardSkeleton';
import CommunityCard from '@/components/community/CommunityCard';

interface Community {
  id: string;
  name: string;
  description: string | null;
  member_count: number;
  image_url: string | null;
}

interface CommunitiesGridProps {
  communities: Community[];
  isLoading: boolean;
  showJoined: boolean;
  onJoinCommunity: (id: string) => void;
}

const CommunitiesGrid: React.FC<CommunitiesGridProps> = ({
  communities,
  isLoading,
  showJoined,
  onJoinCommunity
}) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(6)].map((_, i) => (
          <CommunityCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (communities.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-muted-foreground">No communities found</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {communities.map((community) => (
        <CommunityCard 
          key={community.id}
          id={community.id}
          name={community.name}
          description={community.description || ''}
          memberCount={community.member_count}
          categories={['Community']}
          imageUrl={community.image_url || undefined}
          joined={showJoined}
          onJoin={() => onJoinCommunity(community.id)}
        />
      ))}
    </div>
  );
};

export default CommunitiesGrid;
