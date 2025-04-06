
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import CommunityCard from '@/components/community/CommunityCard';
import { useCommunities } from '@/hooks/useCommunities';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';

const CommunitiesTab = () => {
  const navigate = useNavigate();
  const { communities, isLoading } = useCommunities({ limit: 6 });

  return (
    <div className="space-y-4">
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-44 bg-muted animate-pulse rounded-md"></div>
          ))}
        </div>
      ) : communities.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {communities.map((community) => (
            <CommunityCard
              key={community.id}
              id={community.id}
              name={community.name}
              description={community.description || ''}
              memberCount={community.member_count}
              categories={['Community']}
              imageUrl={community.image_url || undefined}
              joined={false}
            />
          ))}
        </div>
      ) : (
        <Card className="p-6 flex flex-col items-center justify-center">
          <p className="text-muted-foreground mb-4">No communities found</p>
          <Button onClick={() => navigate('/communities')}>
            <PlusCircle className="h-4 w-4 mr-2" />
            Create a Community
          </Button>
        </Card>
      )}

      <div className="flex justify-center mt-4">
        <Button variant="outline" onClick={() => navigate('/communities')}>
          View All Communities
        </Button>
      </div>
    </div>
  );
};

export default CommunitiesTab;
