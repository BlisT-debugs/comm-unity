
import React from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import AppHeader from '@/components/layout/AppHeader';
import AppSidebar from '@/components/layout/AppSidebar';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Bell, CheckCircle, Clock, AlertTriangle } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';

// Mock notification data
const mockNotifications = [
  {
    id: '1',
    title: 'New issue in Green Valley Community',
    description: 'A new issue about waste management has been created',
    date: '2 hours ago',
    read: false,
    type: 'issue'
  },
  {
    id: '2',
    title: 'Your issue has been resolved',
    description: 'The infrastructure issue you reported has been marked as resolved',
    date: 'Yesterday',
    read: true,
    type: 'update'
  },
  {
    id: '3',
    title: 'You earned a new achievement!',
    description: 'Community Builder: Join or create 3 communities',
    date: '3 days ago',
    read: true,
    type: 'achievement'
  },
  {
    id: '4',
    title: 'New community joined',
    description: 'You are now a member of Downtown Improvement Group',
    date: '1 week ago',
    read: true,
    type: 'community'
  },
];

const NotificationItem: React.FC<{
  notification: typeof mockNotifications[0];
}> = ({ notification }) => {
  const { t } = useLanguage();
  
  return (
    <div className={`p-4 border-b last:border-b-0 ${!notification.read ? 'bg-primary/5' : ''}`}>
      <div className="flex gap-4">
        <div className="mt-1">
          {notification.type === 'issue' && (
            <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
              <AlertTriangle className="h-5 w-5 text-orange-600" />
            </div>
          )}
          {notification.type === 'update' && (
            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
              <CheckCircle className="h-5 w-5 text-green-600" />
            </div>
          )}
          {notification.type === 'achievement' && (
            <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
              <Bell className="h-5 w-5 text-purple-600" />
            </div>
          )}
          {notification.type === 'community' && (
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
              <Bell className="h-5 w-5 text-blue-600" />
            </div>
          )}
        </div>
        <div className="flex-1">
          <div className="flex items-start justify-between">
            <h4 className={`font-medium ${!notification.read ? 'text-primary' : ''}`}>
              {t(notification.title)}
            </h4>
            <span className="text-xs text-muted-foreground flex items-center">
              <Clock className="h-3 w-3 mr-1" />
              {notification.date}
            </span>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            {t(notification.description)}
          </p>
        </div>
      </div>
    </div>
  );
};

const Notifications = () => {
  const { user, isLoading } = useAuth();
  const { t } = useLanguage();
  
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1 flex flex-col min-h-screen">
          <AppHeader />
          
          <main className="flex-1 container py-6">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-3xl font-bold">{t('Notifications')}</h1>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <Switch id="mark-read" />
                  <label htmlFor="mark-read" className="text-sm">
                    {t('Auto-mark as read')}
                  </label>
                </div>
                <Button variant="outline" size="sm">
                  {t('Mark all as read')}
                </Button>
              </div>
            </div>
            
            {isLoading ? (
              <div className="flex items-center justify-center h-[60vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              </div>
            ) : !user ? (
              <Card>
                <CardHeader>
                  <CardTitle>{t('Authentication Required')}</CardTitle>
                  <CardDescription>{t('Please log in to view your notifications')}</CardDescription>
                </CardHeader>
              </Card>
            ) : (
              <Card>
                <Tabs defaultValue="all">
                  <CardHeader className="pb-0">
                    <TabsList>
                      <TabsTrigger value="all">{t('All')}</TabsTrigger>
                      <TabsTrigger value="unread">{t('Unread')}</TabsTrigger>
                      <TabsTrigger value="issues">{t('Issues')}</TabsTrigger>
                      <TabsTrigger value="communities">{t('Communities')}</TabsTrigger>
                    </TabsList>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <TabsContent value="all" className="m-0">
                      <div className="divide-y">
                        {mockNotifications.map(notification => (
                          <NotificationItem key={notification.id} notification={notification} />
                        ))}
                      </div>
                    </TabsContent>
                    <TabsContent value="unread" className="m-0">
                      <div className="divide-y">
                        {mockNotifications
                          .filter(n => !n.read)
                          .map(notification => (
                            <NotificationItem key={notification.id} notification={notification} />
                          ))}
                      </div>
                    </TabsContent>
                    <TabsContent value="issues" className="m-0">
                      <div className="divide-y">
                        {mockNotifications
                          .filter(n => n.type === 'issue' || n.type === 'update')
                          .map(notification => (
                            <NotificationItem key={notification.id} notification={notification} />
                          ))}
                      </div>
                    </TabsContent>
                    <TabsContent value="communities" className="m-0">
                      <div className="divide-y">
                        {mockNotifications
                          .filter(n => n.type === 'community')
                          .map(notification => (
                            <NotificationItem key={notification.id} notification={notification} />
                          ))}
                      </div>
                    </TabsContent>
                  </CardContent>
                </Tabs>
              </Card>
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
                  {t('Connecting communities for collaborative problem solving')}
                </p>
              </div>
              
              <div className="flex gap-6">
                <a href="/about" className="text-sm text-muted-foreground hover:text-foreground">
                  {t('About')}
                </a>
                <a href="/privacy" className="text-sm text-muted-foreground hover:text-foreground">
                  {t('Privacy')}
                </a>
                <a href="/terms" className="text-sm text-muted-foreground hover:text-foreground">
                  {t('Terms')}
                </a>
                <a href="/contact" className="text-sm text-muted-foreground hover:text-foreground">
                  {t('Contact')}
                </a>
              </div>
            </div>
          </footer>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Notifications;
