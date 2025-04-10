
import React from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import AppHeader from '@/components/layout/AppHeader';
import AppSidebar from '@/components/layout/AppSidebar';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import LanguageSelector from '@/components/settings/LanguageSelector';
import NetworkIndicator from '@/components/ui/network-indicator';
import { useLanguage } from '@/contexts/LanguageContext';
import { useApp } from '@/contexts/AppContext';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const Settings = () => {
  const { user, isLoading } = useAuth();
  const { t } = useLanguage();
  const { enableLowDataMode, toggleLowDataMode } = useApp();

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1 flex flex-col min-h-screen">
          <AppHeader />
          
          <main className="flex-1 container py-6">
            <h1 className="text-3xl font-bold mb-6">{t('Settings')}</h1>
            
            {isLoading ? (
              <div className="flex items-center justify-center h-[60vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              </div>
            ) : !user ? (
              <Card>
                <CardHeader>
                  <CardTitle>{t('Authentication Required')}</CardTitle>
                  <CardDescription>{t('Please log in to access settings')}</CardDescription>
                </CardHeader>
              </Card>
            ) : (
              <Tabs defaultValue="general">
                <TabsList className="mb-6">
                  <TabsTrigger value="general">{t('General')}</TabsTrigger>
                  <TabsTrigger value="language">{t('Language')}</TabsTrigger>
                  <TabsTrigger value="network">{t('Network')}</TabsTrigger>
                  <TabsTrigger value="notifications">{t('Notifications')}</TabsTrigger>
                </TabsList>
                
                <TabsContent value="general" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>{t('Interface Settings')}</CardTitle>
                      <CardDescription>
                        {t('Customize your experience')}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="dark-mode">{t('Dark Mode')}</Label>
                          <p className="text-sm text-muted-foreground">
                            {t('Enable dark mode for the interface')}
                          </p>
                        </div>
                        <Switch id="dark-mode" />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="reduced-motion">{t('Reduce Animations')}</Label>
                          <p className="text-sm text-muted-foreground">
                            {t('Minimize motion for better accessibility')}
                          </p>
                        </div>
                        <Switch id="reduced-motion" />
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="language">
                  <Card>
                    <CardHeader>
                      <CardTitle>{t('Language Settings')}</CardTitle>
                      <CardDescription>
                        {t('Choose your preferred language')}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label>{t('Interface Language')}</Label>
                        <LanguageSelector variant="outline" />
                        <p className="text-sm text-muted-foreground mt-2">
                          {t('This will change the language of buttons, menus, and system messages')}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="network">
                  <Card>
                    <CardHeader>
                      <CardTitle>{t('Network Settings')}</CardTitle>
                      <CardDescription>
                        {t('Manage how the app behaves with different network conditions')}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <NetworkIndicator showSettings />
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="notifications">
                  <Card>
                    <CardHeader>
                      <CardTitle>{t('Notification Preferences')}</CardTitle>
                      <CardDescription>
                        {t('Customize what notifications you receive')}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>{t('Issue Updates')}</Label>
                          <p className="text-sm text-muted-foreground">
                            {t('Get notified about issues you created or follow')}
                          </p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>{t('Community Activity')}</Label>
                          <p className="text-sm text-muted-foreground">
                            {t('Get updates about communities you belong to')}
                          </p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>{t('Achievement Alerts')}</Label>
                          <p className="text-sm text-muted-foreground">
                            {t('Get notified when you earn new achievements')}
                          </p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            )}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Settings;
