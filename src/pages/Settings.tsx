
import React from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import AppHeader from '@/components/layout/AppHeader';
import AppSidebar from '@/components/layout/AppSidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useApp } from '@/contexts/AppContext';
import { useLanguage } from '@/contexts/LanguageContext';

const Settings = () => {
  const { theme, setTheme, reduceMotion, setReduceMotion } = useApp();
  const { t } = useLanguage();
  
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1 flex flex-col min-h-screen">
          <AppHeader />
          
          <main className="flex-1 container py-6">
            <h1 className="text-3xl font-bold mb-6">{t('Settings')}</h1>
            
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>{t('Appearance')}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="dark-mode">{t('Dark Mode')}</Label>
                    <Switch 
                      id="dark-mode" 
                      checked={theme === 'dark'}
                      onCheckedChange={(checked) => setTheme(checked ? 'dark' : 'light')}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="reduce-motion">{t('Reduce Animations')}</Label>
                    <Switch 
                      id="reduce-motion" 
                      checked={reduceMotion}
                      onCheckedChange={setReduceMotion}
                    />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>{t('Notifications')}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="email-notifications">{t('Email Notifications')}</Label>
                    <Switch id="email-notifications" defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="push-notifications">{t('Push Notifications')}</Label>
                    <Switch id="push-notifications" defaultChecked />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>{t('Privacy')}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="profile-visibility">{t('Public Profile')}</Label>
                    <Switch id="profile-visibility" defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="activity-visibility">{t('Show My Activities')}</Label>
                    <Switch id="activity-visibility" defaultChecked />
                  </div>
                </CardContent>
              </Card>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Settings;
