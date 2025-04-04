
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import LeaderboardItem from '@/components/gamification/LeaderboardItem';

interface LeaderboardTabProps {
  profile?: any;
}

const LeaderboardTab: React.FC<LeaderboardTabProps> = ({ profile }) => {
  // Mock data for leaderboard until backend is connected
  const leaderboard = [
    { id: '1', name: 'Community Champion', points: 850 },
    { id: '2', name: 'Eco Warrior', points: 720 },
    { id: '3', name: 'Park Protector', points: 640 },
    { id: '4', name: 'Green Thumb', points: 580 },
    { id: '5', name: profile?.username || profile?.full_name || 'Current User', points: profile?.impact_score || 550, isCurrentUser: true },
    { id: '6', name: 'Wildlife Guardian', points: 510 },
    { id: '7', name: 'River Cleaner', points: 490 },
    { id: '8', name: 'Neighborhood Helper', points: 460 },
    { id: '9', name: 'Recycling Expert', points: 430 },
    { id: '10', name: 'Urban Gardener', points: 410 },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Community Leaderboard</CardTitle>
        <CardDescription>Top contributors making an impact</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {leaderboard.map((user, index) => (
            <LeaderboardItem 
              key={user.id}
              rank={index + 1}
              name={user.name}
              points={user.points}
              isCurrentUser={user.isCurrentUser}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default LeaderboardTab;
