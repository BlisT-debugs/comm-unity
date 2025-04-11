
import React, { useState } from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import AppHeader from '@/components/layout/AppHeader';
import AppSidebar from '@/components/layout/AppSidebar';
import AchievementBadge from '@/components/gamification/AchievementBadge';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Award, Star, Trophy, Target, Users, Leaf, BookOpen } from 'lucide-react';
import { achievements } from '@/services/mockData';
import { useUserAchievements, Achievement } from '@/hooks/useUserAchievements';

const Achievements = () => {
  const [tab, setTab] = useState('all');
  const { achievements: userAchievements, isLoading } = useUserAchievements();
  
  // Using the mock data if no user achievements are available yet
  const displayAchievements = userAchievements.length > 0 
    ? userAchievements 
    : achievements.map(a => ({
        ...a,
        id: a.id,
        name: a.name,
        description: a.description,
        badge_image: '',
        required_points: 0,
        achievement_type: a.type,
        type: a.type as 'bronze' | 'silver' | 'gold' | 'platinum',
        unlocked: a.unlocked,
        progress: a.progress
      }));
  
  const filteredAchievements = tab === 'all' 
    ? displayAchievements
    : displayAchievements.filter(achievement => 
        achievement.type === tab || 
        (tab === 'unlocked' && achievement.unlocked) || 
        (tab === 'locked' && !achievement.unlocked)
      );
  
  const achievementCategories = {
    participation: filteredAchievements.filter(a => a.name?.toLowerCase().includes('contribution') || a.name?.toLowerCase().includes('first')),
    environment: filteredAchievements.filter(a => a.name?.toLowerCase().includes('eco') || a.name?.toLowerCase().includes('environment')),
    community: filteredAchievements.filter(a => a.name?.toLowerCase().includes('community')),
    leadership: filteredAchievements.filter(a => a.name?.toLowerCase().includes('leader')),
    collaboration: filteredAchievements.filter(a => a.name?.toLowerCase().includes('collaborat')),
    other: filteredAchievements.filter(a => 
      !a.name?.toLowerCase().includes('contribution') && 
      !a.name?.toLowerCase().includes('first') &&
      !a.name?.toLowerCase().includes('eco') &&
      !a.name?.toLowerCase().includes('environment') &&
      !a.name?.toLowerCase().includes('community') &&
      !a.name?.toLowerCase().includes('leader') &&
      !a.name?.toLowerCase().includes('collaborat')
    )
  };
  
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1 flex flex-col min-h-screen">
          <AppHeader />
          
          <main className="flex-1 container py-6">
            <div className="mb-8">
              <h1 className="text-3xl font-bold mb-2">Your Achievements</h1>
              <p className="text-muted-foreground">Track your progress and unlock badges as you contribute to your community</p>
            </div>
            
            {isLoading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 animate-pulse">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="bg-muted rounded-lg p-6 flex flex-col items-center space-y-4">
                    <div className="w-16 h-16 rounded-full bg-muted-foreground/20"></div>
                    <div className="h-4 w-24 bg-muted-foreground/20 rounded"></div>
                    <div className="h-3 w-32 bg-muted-foreground/20 rounded"></div>
                  </div>
                ))}
              </div>
            ) : (
              <>
                <Tabs defaultValue="all" className="mb-8" onValueChange={setTab}>
                  <div className="border-b">
                    <TabsList className="mb-0">
                      <TabsTrigger value="all">All</TabsTrigger>
                      <TabsTrigger value="bronze">Bronze</TabsTrigger>
                      <TabsTrigger value="silver">Silver</TabsTrigger>
                      <TabsTrigger value="gold">Gold</TabsTrigger>
                      <TabsTrigger value="platinum">Platinum</TabsTrigger>
                      <TabsTrigger value="unlocked">Unlocked</TabsTrigger>
                      <TabsTrigger value="locked">Locked</TabsTrigger>
                    </TabsList>
                  </div>
                </Tabs>

                <div className="space-y-10">
                  {achievementCategories.participation.length > 0 && (
                    <div>
                      <div className="flex items-center gap-2 mb-4">
                        <Award className="h-5 w-5 text-primary" />
                        <h2 className="text-xl font-semibold">Participation</h2>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {achievementCategories.participation.map((achievement) => (
                          <div key={achievement.id} className="bg-card rounded-lg p-6 flex flex-col items-center text-center space-y-4 border">
                            <AchievementBadge
                              name={achievement.name}
                              description={achievement.description}
                              type={achievement.type}
                              unlocked={!!achievement.unlocked}
                              progress={achievement.progress}
                              icon={<Star className="h-6 w-6" />}
                              className="w-16 h-16"
                            />
                            <h3 className="font-semibold">{achievement.name}</h3>
                            <p className="text-sm text-muted-foreground">{achievement.description}</p>
                            <Badge variant={achievement.unlocked ? "default" : "outline"}>
                              {achievement.unlocked ? "Unlocked" : achievement.progress ? `${achievement.progress}% Complete` : "Locked"}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {achievementCategories.community.length > 0 && (
                    <div>
                      <div className="flex items-center gap-2 mb-4">
                        <Users className="h-5 w-5 text-primary" />
                        <h2 className="text-xl font-semibold">Community</h2>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {achievementCategories.community.map((achievement) => (
                          <div key={achievement.id} className="bg-card rounded-lg p-6 flex flex-col items-center text-center space-y-4 border">
                            <AchievementBadge
                              name={achievement.name}
                              description={achievement.description}
                              type={achievement.type}
                              unlocked={achievement.unlocked}
                              progress={achievement.progress}
                              icon={<Users className="h-6 w-6" />}
                              className="w-16 h-16"
                            />
                            <h3 className="font-semibold">{achievement.name}</h3>
                            <p className="text-sm text-muted-foreground">{achievement.description}</p>
                            <Badge variant={achievement.unlocked ? "default" : "outline"}>
                              {achievement.unlocked ? "Unlocked" : achievement.progress ? `${achievement.progress}% Complete` : "Locked"}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {achievementCategories.environment.length > 0 && (
                    <div>
                      <div className="flex items-center gap-2 mb-4">
                        <Leaf className="h-5 w-5 text-primary" />
                        <h2 className="text-xl font-semibold">Environmental</h2>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {achievementCategories.environment.map((achievement) => (
                          <div key={achievement.id} className="bg-card rounded-lg p-6 flex flex-col items-center text-center space-y-4 border">
                            <AchievementBadge
                              name={achievement.name}
                              description={achievement.description}
                              type={achievement.type}
                              unlocked={!!achievement.unlocked}
                              progress={achievement.progress}
                              icon={<Leaf className="h-6 w-6" />}
                              className="w-16 h-16"
                            />
                            <h3 className="font-semibold">{achievement.name}</h3>
                            <p className="text-sm text-muted-foreground">{achievement.description}</p>
                            <Badge variant={achievement.unlocked ? "default" : "outline"}>
                              {achievement.unlocked ? "Unlocked" : achievement.progress ? `${achievement.progress}% Complete` : "Locked"}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {achievementCategories.leadership.length > 0 && (
                    <div>
                      <div className="flex items-center gap-2 mb-4">
                        <Trophy className="h-5 w-5 text-primary" />
                        <h2 className="text-xl font-semibold">Leadership</h2>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {achievementCategories.leadership.map((achievement) => (
                          <div key={achievement.id} className="bg-card rounded-lg p-6 flex flex-col items-center text-center space-y-4 border">
                            <AchievementBadge
                              name={achievement.name}
                              description={achievement.description}
                              type={achievement.type}
                              unlocked={!!achievement.unlocked}
                              progress={achievement.progress}
                              icon={<Trophy className="h-6 w-6" />}
                              className="w-16 h-16"
                            />
                            <h3 className="font-semibold">{achievement.name}</h3>
                            <p className="text-sm text-muted-foreground">{achievement.description}</p>
                            <Badge variant={achievement.unlocked ? "default" : "outline"}>
                              {achievement.unlocked ? "Unlocked" : achievement.progress ? `${achievement.progress}% Complete` : "Locked"}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {achievementCategories.collaboration.length > 0 && (
                    <div>
                      <div className="flex items-center gap-2 mb-4">
                        <Target className="h-5 w-5 text-primary" />
                        <h2 className="text-xl font-semibold">Collaboration</h2>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {achievementCategories.collaboration.map((achievement) => (
                          <div key={achievement.id} className="bg-card rounded-lg p-6 flex flex-col items-center text-center space-y-4 border">
                            <AchievementBadge
                              name={achievement.name}
                              description={achievement.description}
                              type={achievement.type}
                              unlocked={!!achievement.unlocked}
                              progress={achievement.progress}
                              icon={<Target className="h-6 w-6" />}
                              className="w-16 h-16"
                            />
                            <h3 className="font-semibold">{achievement.name}</h3>
                            <p className="text-sm text-muted-foreground">{achievement.description}</p>
                            <Badge variant={achievement.unlocked ? "default" : "outline"}>
                              {achievement.unlocked ? "Unlocked" : achievement.progress ? `${achievement.progress}% Complete` : "Locked"}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {achievementCategories.other.length > 0 && (
                    <div>
                      <div className="flex items-center gap-2 mb-4">
                        <BookOpen className="h-5 w-5 text-primary" />
                        <h2 className="text-xl font-semibold">Other Achievements</h2>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {achievementCategories.other.map((achievement) => (
                          <div key={achievement.id} className="bg-card rounded-lg p-6 flex flex-col items-center text-center space-y-4 border">
                            <AchievementBadge
                              name={achievement.name}
                              description={achievement.description}
                              type={achievement.type}
                              unlocked={!!achievement.unlocked}
                              progress={achievement.progress}
                              icon={<BookOpen className="h-6 w-6" />}
                              className="w-16 h-16"
                            />
                            <h3 className="font-semibold">{achievement.name}</h3>
                            <p className="text-sm text-muted-foreground">{achievement.description}</p>
                            <Badge variant={achievement.unlocked ? "default" : "outline"}>
                              {achievement.unlocked ? "Unlocked" : achievement.progress ? `${achievement.progress}% Complete` : "Locked"}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {filteredAchievements.length === 0 && (
                    <div className="text-center py-12">
                      <Award className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                      <h3 className="text-lg font-medium">No achievements found</h3>
                      <p className="text-muted-foreground">No achievements match your current filter</p>
                    </div>
                  )}
                </div>
              </>
            )}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Achievements;
