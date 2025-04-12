
import React, { useState } from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import AppHeader from '@/components/layout/AppHeader';
import AppSidebar from '@/components/layout/AppSidebar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { Message, Users, Filter, Plus } from 'lucide-react';
import ChatInterface from '@/components/chat/ChatInterface';

const Discussions = () => {
  const { t } = useLanguage();
  const [activeRoom, setActiveRoom] = useState('general');
  
  // Mock discussion rooms
  const discussionRooms = [
    { id: 'general', name: 'General', description: 'General discussions about anything related to the platform', participants: 24 },
    { id: 'help', name: 'Help & Support', description: 'Get help with using the platform', participants: 12 },
    { id: 'feedback', name: 'Feedback', description: 'Share your feedback and suggestions', participants: 8 },
    { id: 'announcements', name: 'Announcements', description: 'Important announcements from the team', participants: 42 }
  ];

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1 flex flex-col min-h-screen">
          <AppHeader />
          
          <main className="flex-1 container py-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
              <div>
                <h1 className="text-3xl font-bold">{t('Discussions')}</h1>
                <p className="text-muted-foreground mt-1">
                  {t('Join conversations and share your thoughts')}
                </p>
              </div>
              <div className="flex mt-4 md:mt-0 gap-2">
                <Button variant="outline" size="sm">
                  <Filter className="mr-2 h-4 w-4" />
                  {t('Filter')}
                </Button>
                <Button variant="default" size="sm">
                  <Plus className="mr-2 h-4 w-4" />
                  {t('New Discussion')}
                </Button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Discussion rooms sidebar */}
              <div className="space-y-4">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Message className="h-5 w-5" />
                      {t('Chat Rooms')}
                    </CardTitle>
                    <CardDescription>
                      {t('Join a room to start chatting')}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {discussionRooms.map(room => (
                      <div 
                        key={room.id}
                        className={`p-3 rounded-md cursor-pointer flex flex-col transition-colors ${activeRoom === room.id ? 'bg-accent/80' : 'hover:bg-accent/50'}`}
                        onClick={() => setActiveRoom(room.id)}
                      >
                        <div className="flex justify-between items-center">
                          <span className="font-medium">{room.name}</span>
                          <div className="flex items-center text-xs text-muted-foreground">
                            <Users className="h-3 w-3 mr-1" />
                            {room.participants}
                          </div>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{room.description}</p>
                      </div>
                    ))}
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">
                      {t('Recent Activity')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <p className="text-sm text-muted-foreground">
                      {t('No recent activity to show')}
                    </p>
                  </CardContent>
                </Card>
              </div>
              
              {/* Chat interface */}
              <div className="md:col-span-2">
                {discussionRooms.find(room => room.id === activeRoom) && (
                  <ChatInterface 
                    roomId={activeRoom}
                    roomName={discussionRooms.find(room => room.id === activeRoom)?.name || ''}
                    roomType="discussion"
                  />
                )}
              </div>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Discussions;
