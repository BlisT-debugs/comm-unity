
import React from 'react';
import { Link } from 'react-router-dom';
import { BarChart3, PlusCircle, TrendingUp, Trophy, Users } from 'lucide-react';
import { SidebarProvider } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AppHeader from '@/components/layout/AppHeader';
import AppSidebar from '@/components/layout/AppSidebar';
import CommunityCard from '@/components/community/CommunityCard';
import IssueCard from '@/components/issues/IssueCard';
import LeaderboardItem from '@/components/gamification/LeaderboardItem';
import AchievementBadge from '@/components/gamification/AchievementBadge';
import { communities, issues, leaderboard, achievements } from '@/services/mockData';

const Index = () => {
  // Mock user state for demo
  const isLoggedIn = true;
  
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1 flex flex-col min-h-screen">
          <AppHeader isLoggedIn={isLoggedIn} />
          
          <main className="flex-1 container py-6">
            {isLoggedIn ? (
              <LoggedInDashboard />
            ) : (
              <WelcomePage />
            )}
          </main>
          
          <footer className="border-t py-6 bg-muted/40">
            <div className="container flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="text-center md:text-left">
                <div className="flex items-center justify-center md:justify-start gap-2 font-bold text-xl mb-2">
                  <div className="rounded-lg bg-primary p-1">
                    <span className="text-white">Comm</span>
                  </div>
                  <span className="text-socio-darkgreen">Unity</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Connecting communities for collaborative problem solving
                </p>
              </div>
              
              <div className="flex gap-6">
                <Link to="/about" className="text-sm text-muted-foreground hover:text-foreground">
                  About
                </Link>
                <Link to="/privacy" className="text-sm text-muted-foreground hover:text-foreground">
                  Privacy
                </Link>
                <Link to="/terms" className="text-sm text-muted-foreground hover:text-foreground">
                  Terms
                </Link>
                <Link to="/contact" className="text-sm text-muted-foreground hover:text-foreground">
                  Contact
                </Link>
              </div>
            </div>
          </footer>
        </div>
      </div>
    </SidebarProvider>
  );
};

const LoggedInDashboard = () => {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Create Issue
        </Button>
      </div>
      
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
        <DashboardCard 
          title="Active Issues" 
          value="12" 
          description="3 awaiting your input"
          icon={<BarChart3 className="h-4 w-4 text-muted-foreground" />}
        />
        <DashboardCard 
          title="My Communities" 
          value="5" 
          description="2 with new activity"
          icon={<Users className="h-4 w-4 text-muted-foreground" />}
        />
        <DashboardCard 
          title="Impact Score" 
          value="550" 
          description="Up 15% from last month"
          icon={<TrendingUp className="h-4 w-4 text-muted-foreground" />}
        />
        <DashboardCard 
          title="Achievements" 
          value="7" 
          description="2 new this week"
          icon={<Trophy className="h-4 w-4 text-muted-foreground" />}
        />
      </div>
      
      <Tabs defaultValue="issues" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="issues">Recent Issues</TabsTrigger>
          <TabsTrigger value="communities">My Communities</TabsTrigger>
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
          <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
        </TabsList>
        
        <TabsContent value="issues" className="space-y-4">
          <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
            {issues.slice(0, 4).map((issue) => (
              <IssueCard key={issue.id} {...issue} />
            ))}
          </div>
          <div className="flex justify-center mt-6">
            <Button variant="outline" asChild>
              <Link to="/issues">View All Issues</Link>
            </Button>
          </div>
        </TabsContent>
        
        <TabsContent value="communities" className="space-y-4">
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {communities.slice(0, 3).map((community) => (
              <CommunityCard 
                key={community.id} 
                {...community} 
                joined={community.id === 'greenville' || community.id === 'techpark'} 
              />
            ))}
          </div>
          <div className="flex justify-center mt-6">
            <Button variant="outline" asChild>
              <Link to="/communities">View All Communities</Link>
            </Button>
          </div>
        </TabsContent>
        
        <TabsContent value="achievements" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Your Achievements</CardTitle>
              <CardDescription>Track your community impact and unlock new achievements</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                {achievements.map((achievement) => (
                  <div key={achievement.id} className="flex flex-col items-center text-center">
                    <AchievementBadge 
                      name={achievement.name} 
                      description={achievement.description}
                      type={achievement.type as any}
                      unlocked={achievement.unlocked}
                      progress={achievement.progress}
                      className="mb-2"
                    />
                    <span className="text-sm font-medium">{achievement.name}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="leaderboard" className="space-y-4">
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
                    isCurrentUser={user.name === 'Current User'}
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

const DashboardCard = ({ title, value, description, icon }: { 
  title: string; 
  value: string; 
  description: string; 
  icon: React.ReactNode;
}) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
};

const WelcomePage = () => {
  return (
    <div className="flex flex-col items-center justify-center text-center max-w-3xl mx-auto py-12">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">Welcome to CommUnity</h1>
        <p className="text-xl text-muted-foreground mb-6">
          Connect with your local community to solve problems together
        </p>
        <div className="flex gap-4 justify-center">
          <Button size="lg" asChild>
            <Link to="/signup">Get Started</Link>
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
      
      <div className="mt-16">
        <h2 className="text-2xl font-bold mb-4">Featured Communities</h2>
        <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
          {communities.slice(0, 3).map((community) => (
            <CommunityCard key={community.id} {...community} />
          ))}
        </div>
      </div>
    </div>
  );
};

const FeatureCard = ({ title, description, icon }: { 
  title: string; 
  description: string; 
  icon: React.ReactNode;
}) => {
  return (
    <div className="flex flex-col items-center p-6 bg-muted/40 rounded-lg text-center">
      <div className="rounded-full bg-primary/10 p-4 mb-4">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
};

export default Index;
