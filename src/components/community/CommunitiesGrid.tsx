
import React, { Suspense, lazy } from 'react';
import CommunityCardSkeleton from '@/components/community/CommunityCardSkeleton';

// Lazy load the CommunityCard component
const CommunityCard = lazy(() => import('@/components/community/CommunityCard'));

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
    return null;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {communities.map((community) => (
        <Suspense key={community.id} fallback={<CommunityCardSkeleton />}>
          <CommunityCard 
            id={community.id}
            name={community.name}
            description={community.description || ''}
            memberCount={community.member_count}
            categories={['Community']}
            imageUrl={community.image_url || undefined}
            joined={showJoined}
            onJoin={() => onJoinCommunity(community.id)}
          />
        </Suspense>
      ))}
    </div>
  );
};

export default CommunitiesGrid;
