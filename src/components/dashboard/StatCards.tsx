
import React from 'react';
import { BarChart3, TrendingUp, Trophy, Users } from 'lucide-react';
import DashboardCard from '@/components/dashboard/DashboardCard';

interface StatCardsProps {
  issuesCount: number;
  communitiesCount: number;
  impactScore: number;
  achievementsCount: number;
  isAuthenticated: boolean;
}

const StatCards: React.FC<StatCardsProps> = ({
  issuesCount,
  communitiesCount,
  impactScore,
  achievementsCount,
  isAuthenticated
}) => {
  return (
    <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
      <DashboardCard 
        title="Active Issues" 
        value={issuesCount.toString()}
        description="Explore community issues"
        icon={<BarChart3 className="h-4 w-4 text-muted-foreground" />}
      />
      <DashboardCard 
        title="My Communities" 
        value={communitiesCount.toString()}
        description={isAuthenticated ? "Communities you've joined" : "Sign in to join communities"}
        icon={<Users className="h-4 w-4 text-muted-foreground" />}
      />
      <DashboardCard 
        title="Impact Score" 
        value={impactScore.toString()}
        description="Keep contributing to increase your score"
        icon={<TrendingUp className="h-4 w-4 text-muted-foreground" />}
      />
      <DashboardCard 
        title="Achievements" 
        value={achievementsCount.toString()}
        description="Unlock more by participating"
        icon={<Trophy className="h-4 w-4 text-muted-foreground" />}
      />
    </div>
  );
};

export default StatCards;
