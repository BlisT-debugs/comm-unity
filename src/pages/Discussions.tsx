
import React, { useState } from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import AppHeader from '@/components/layout/AppHeader';
import AppSidebar from '@/components/layout/AppSidebar';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ChatInterface from '@/components/chat/ChatInterface';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { MessageSquare, Users, Lightbulb } from 'lucide-react';

const discussionRooms = [
  { id: 'general', name: 'General', description: 'General community discussions' },
  { id: 'ideas', name: 'Ideas', description: 'Share and discuss community ideas' },
  { id: 'help', name: 'Help & Support', description: 'Get help from other community members' },
];

const Discussions = () => {
  const { user } = useAuth();
  const [activeRoom, setActiveRoom] = useState(discussionRooms[0]);

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1 flex flex-col min-h-screen">
          <AppHeader />
          
          <main className="flex-1 container py-6">
            <h1 className="text-3xl font-bold mb-6">Discussions</h1>
            
            {user ? (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card className="md:col-span-1">
                  <CardHeader>
                    <CardTitle className="text-lg">Discussion Rooms</CardTitle>
                    <CardDescription>Join a discussion room to chat</CardDescription>
                  </CardHeader>
                  <CardContent className="px-2">
                    <div className="space-y-2">
                      {discussionRooms.map((room) => (
                        <Button
                          key={room.id}
                          variant={activeRoom.id === room.id ? "default" : "outline"}
                          className="w-full justify-start"
                          onClick={() => setActiveRoom(room)}
                        >
                          <MessageSquare className="h-4 w-4 mr-2" />
                          {room.name}
                        </Button>
                      ))}
                    </div>
                  </CardContent>
                </Card>
                
                <div className="md:col-span-3">
                  <ChatInterface 
                    roomId={activeRoom.id} 
                    roomName={activeRoom.name}
                    roomType="discussion" 
                  />
                </div>
              </div>
            ) : (
              <Card className="p-6 text-center">
                <div className="mb-4">
                  <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground" />
                </div>
                <CardTitle className="text-xl mb-2">Join the Conversation</CardTitle>
                <CardDescription className="mb-4">
                  Sign in to participate in real-time discussions with community members
                </CardDescription>
                <Button variant="default" onClick={() => window.location.href = "/auth"}>
                  Sign In to Chat
                </Button>
              </Card>
            )}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Discussions;
