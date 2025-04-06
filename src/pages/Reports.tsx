
import React from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import AppHeader from '@/components/layout/AppHeader';
import AppSidebar from '@/components/layout/AppSidebar';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Mock data for reports
const monthlyActivityData = [
  { name: 'Jan', issues: 4, communities: 2 },
  { name: 'Feb', issues: 6, communities: 3 },
  { name: 'Mar', issues: 8, communities: 5 },
  { name: 'Apr', issues: 12, communities: 7 },
  { name: 'May', issues: 9, communities: 6 },
  { name: 'Jun', issues: 15, communities: 8 },
];

const topIssuesData = [
  { category: 'Environment', count: 35 },
  { category: 'Infrastructure', count: 28 },
  { category: 'Safety', count: 23 },
  { category: 'Education', count: 18 },
  { category: 'Waste Management', count: 15 },
];

const Reports = () => {
  const { user, isLoading } = useAuth();

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1 flex flex-col min-h-screen">
          <AppHeader />
          
          <main className="flex-1 container py-6">
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold tracking-tight">Reports & Analytics</h1>
                <p className="text-muted-foreground">
                  Track community engagement and issue resolution metrics
                </p>
              </div>
              
              {isLoading ? (
                <div className="flex items-center justify-center h-[60vh]">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                </div>
              ) : !user ? (
                <Card className="p-8 text-center">
                  <CardHeader>
                    <CardTitle>Authentication Required</CardTitle>
                    <CardDescription>
                      Please sign in to view reports and analytics
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button onClick={() => window.location.href = '/auth'}>
                      Sign In
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <Tabs defaultValue="overview" className="space-y-4">
                  <TabsList>
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="issues">Issues</TabsTrigger>
                    <TabsTrigger value="communities">Communities</TabsTrigger>
                    <TabsTrigger value="impact">Impact</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="overview">
                    <div className="grid gap-4 md:grid-cols-2">
                      <Card>
                        <CardHeader>
                          <CardTitle>Monthly Activity</CardTitle>
                          <CardDescription>
                            Issues created and communities joined over time
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                              <BarChart
                                data={monthlyActivityData}
                                margin={{
                                  top: 5,
                                  right: 30,
                                  left: 20,
                                  bottom: 5,
                                }}
                              >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="issues" fill="#8884d8" name="Issues" />
                                <Bar dataKey="communities" fill="#82ca9d" name="Communities" />
                              </BarChart>
                            </ResponsiveContainer>
                          </div>
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardHeader>
                          <CardTitle>Top Issue Categories</CardTitle>
                          <CardDescription>
                            Most common types of community issues
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                              <BarChart
                                data={topIssuesData}
                                layout="vertical"
                                margin={{
                                  top: 5,
                                  right: 30,
                                  left: 20,
                                  bottom: 5,
                                }}
                              >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis type="number" />
                                <YAxis type="category" dataKey="category" />
                                <Tooltip />
                                <Bar dataKey="count" fill="#8884d8" name="Count" />
                              </BarChart>
                            </ResponsiveContainer>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="issues">
                    <Card>
                      <CardHeader>
                        <CardTitle>Issue Analytics</CardTitle>
                        <CardDescription>
                          Detailed breakdown of issues by status, resolution time, and engagement
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground text-center py-12">
                          More detailed issue analytics will be available soon
                        </p>
                      </CardContent>
                    </Card>
                  </TabsContent>
                  
                  <TabsContent value="communities">
                    <Card>
                      <CardHeader>
                        <CardTitle>Community Analytics</CardTitle>
                        <CardDescription>
                          Community growth, engagement metrics, and activity trends
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground text-center py-12">
                          More detailed community analytics will be available soon
                        </p>
                      </CardContent>
                    </Card>
                  </TabsContent>
                  
                  <TabsContent value="impact">
                    <Card>
                      <CardHeader>
                        <CardTitle>Impact Tracking</CardTitle>
                        <CardDescription>
                          Measure the real-world impact of resolved issues
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground text-center py-12">
                          Impact tracking metrics will be available soon
                        </p>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              )}
            </div>
          </main>
          
          <footer className="border-t py-6 bg-muted/40">
            <div className="container flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="text-center md:text-left">
                <div className="flex items-center justify-center md:justify-start gap-2 font-bold text-xl mb-2">
                  <div className="rounded-lg bg-primary p-1">
                    <span className="text-white">Comm</span>
                  </div>
                  <span>Unity</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Connecting communities for collaborative problem solving
                </p>
              </div>
              
              <div className="flex gap-6">
                <a href="/about" className="text-sm text-muted-foreground hover:text-foreground">
                  About
                </a>
                <a href="/privacy" className="text-sm text-muted-foreground hover:text-foreground">
                  Privacy
                </a>
                <a href="/terms" className="text-sm text-muted-foreground hover:text-foreground">
                  Terms
                </a>
                <a href="/contact" className="text-sm text-muted-foreground hover:text-foreground">
                  Contact
                </a>
              </div>
            </div>
          </footer>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Reports;
