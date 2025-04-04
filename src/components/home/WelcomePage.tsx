
import React from 'react';
import { Link } from 'react-router-dom';
import { Users, BarChart3, Trophy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import CommunityCard from '@/components/community/CommunityCard';
import FeatureCard from '@/components/home/FeatureCard';
import { useCommunities } from '@/hooks/useCommunities';

const WelcomePage: React.FC = () => {
  const { communities, isLoading } = useCommunities({ limit: 3 });
  
  return (
    <div className="flex flex-col items-center justify-center text-center max-w-3xl mx-auto py-12">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">Welcome to CommUnity</h1>
        <p className="text-xl text-muted-foreground mb-6">
          Connect with your local community to solve problems together
        </p>
        <div className="flex gap-4 justify-center">
          <Button size="lg" asChild>
            <Link to="/auth?tab=signup">Get Started</Link>
          </Button>
          <Button variant="outline" size="lg" asChild>
            <Link to="/about">Learn More</Link>
          </Button>
        </div>
      </div>
      
      <div className="grid gap-8 grid-cols-1 md:grid-cols-3 mt-12">
        <FeatureCard 
          title="Connect" 
          description="Join local communities based on your interests and location" 
          icon={<Users className="h-10 w-10 text-primary" />} 
        />
        <FeatureCard 
          title="Collaborate" 
          description="Work with others to solve real community problems" 
          icon={<BarChart3 className="h-10 w-10 text-primary" />} 
        />
        <FeatureCard 
          title="Earn Rewards" 
          description="Get recognition for your contributions with points and badges" 
          icon={<Trophy className="h-10 w-10 text-primary" />} 
        />
      </div>
      
      <div className="mt-16 w-full">
        <h2 className="text-2xl font-bold mb-4">Featured Communities</h2>
        <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
          {isLoading ? (
            <>
              <div className="h-64 bg-muted animate-pulse rounded-md"></div>
              <div className="h-64 bg-muted animate-pulse rounded-md"></div>
              <div className="h-64 bg-muted animate-pulse rounded-md"></div>
            </>
          ) : (
            communities.map((community) => (
              <CommunityCard 
                key={community.id}
                id={community.id}
                name={community.name}
                description={community.description || ''}
                memberCount={community.member_count}
                categories={['Community']}
                imageUrl={community.image_url || undefined}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default WelcomePage;
