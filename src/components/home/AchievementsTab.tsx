
import React from 'react';
import { Trophy } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import AchievementBadge from '@/components/gamification/AchievementBadge';
import { useAuth } from '@/hooks/useAuth';
import { useUserAchievements } from '@/hooks/useUserAchievements';

const AchievementsTab: React.FC = () => {
  const { user } = useAuth();
  const { achievements, isLoading: isAchievementsLoading } = useUserAchievements();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Achievements</CardTitle>
        <CardDescription>Track your community impact and unlock new achievements</CardDescription>
      </CardHeader>
      <CardContent>
        {isAchievementsLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-muted animate-pulse mb-2"></div>
                <div className="w-20 h-4 bg-muted animate-pulse"></div>
              </div>
            ))}
          </div>
        ) : achievements && achievements.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {achievements.map((achievement) => (
              <div key={achievement.id} className="flex flex-col items-center text-center">
                <AchievementBadge 
                  name={achievement.name} 
                  description={achievement.description}
                  type={achievement.achievement_type as any}
                  unlocked={true}
                  progress={100}
                  className="mb-2"
                />
                <span className="text-sm font-medium">{achievement.name}</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <Trophy className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground mb-4">
              {user ? "You haven't unlocked any achievements yet" : "Sign in to track achievements"}
            </p>
            <p className="text-sm">Get started by participating in community activities</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AchievementsTab;
