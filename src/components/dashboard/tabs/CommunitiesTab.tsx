
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import CommunityCard from '@/components/community/CommunityCard';
import { useCommunities } from '@/hooks/useCommunities';

interface CommunitiesTabProps {
  limit?: number;
  showJoined?: boolean;
}

const CommunitiesTab: React.FC<CommunitiesTabProps> = ({ limit = 3, showJoined = false }) => {
  const { communities, isLoading } = useCommunities({ limit, joined: showJoined });

  return (
    <div className="space-y-4">
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {isLoading ? (
          <>
            <div className="h-64 bg-muted animate-pulse rounded-md"></div>
            <div className="h-64 bg-muted animate-pulse rounded-md"></div>
            <div className="h-64 bg-muted animate-pulse rounded-md"></div>
          </>
        ) : communities.length > 0 ? (
          communities.map((community) => (
            <CommunityCard 
              key={community.id}
              id={community.id}
              name={community.name}
              description={community.description || ''}
              memberCount={community.member_count}
              categories={['Community']}
              imageUrl={community.image_url || undefined}
              joined={showJoined}
            />
          ))
        ) : (
          <div className="col-span-3 text-center py-12">
            <p className="text-muted-foreground mb-4">
              {showJoined ? "You haven't joined any communities yet" : "No communities found"}
            </p>
            <Button asChild>
              <Link to="/communities">{showJoined ? "Explore Communities" : "Create Community"}</Link>
            </Button>
          </div>
        )}
      </div>
      <div className="flex justify-center mt-6">
        <Button variant="outline" asChild>
          <Link to="/communities">View All Communities</Link>
        </Button>
      </div>
    </div>
  );
};

export default CommunitiesTab;
