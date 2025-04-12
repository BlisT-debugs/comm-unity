
import React from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import AppHeader from '@/components/layout/AppHeader';
import AppSidebar from '@/components/layout/AppSidebar';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useApp } from '@/contexts/AppContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import ThemeSwitcher from '@/components/settings/ThemeSwitcher';
import LanguageSelector from '@/components/settings/LanguageSelector';
import { Bell, Wifi, Eye, Shield } from 'lucide-react';

const Settings = () => {
  const { reduceMotion, setReduceMotion, enableLowDataMode, toggleLowDataMode } = useApp();
  const { t } = useLanguage();
  
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1 flex flex-col min-h-screen">
          <AppHeader />
          
          <main className="flex-1 container py-6 max-w-4xl">
            <h1 className="text-3xl font-bold mb-6">{t('Settings')}</h1>
            
            <div className="space-y-6">
              <ThemeSwitcher variant="card" />
              
              <Card>
                <CardHeader>
                  <CardTitle>{t('Accessibility')}</CardTitle>
                  <CardDescription>{t('Customize your experience')}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="reduce-motion">{t('Reduce Animations')}</Label>
                      <p className="text-sm text-muted-foreground">
                        {t('Minimize motion effects throughout the interface')}
                      </p>
                    </div>
                    <Switch 
                      id="reduce-motion" 
                      checked={reduceMotion}
                      onCheckedChange={setReduceMotion}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="low-data-mode" className="flex items-center gap-2">
                        <Wifi className="h-4 w-4" />
                        {t('Low Data Mode')}
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        {t('Reduce bandwidth usage by loading fewer images and animations')}
                      </p>
                    </div>
                    <Switch 
                      id="low-data-mode" 
                      checked={enableLowDataMode}
                      onCheckedChange={toggleLowDataMode}
                    />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="h-5 w-5" />
                    {t('Notifications')}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="email-notifications">{t('Email Notifications')}</Label>
                      <p className="text-sm text-muted-foreground">
                        {t('Receive important updates and summaries via email')}
                      </p>
                    </div>
                    <Switch id="email-notifications" defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="push-notifications">{t('Push Notifications')}</Label>
                      <p className="text-sm text-muted-foreground">
                        {t('Receive real-time alerts directly in your browser')}
                      </p>
                    </div>
                    <Switch id="push-notifications" defaultChecked />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Eye className="h-5 w-5" />
                    {t('Privacy')}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="profile-visibility">{t('Public Profile')}</Label>
                      <p className="text-sm text-muted-foreground">
                        {t('Allow others to view your profile and activities')}
                      </p>
                    </div>
                    <Switch id="profile-visibility" defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="activity-visibility">{t('Show My Activities')}</Label>
                      <p className="text-sm text-muted-foreground">
                        {t('Display your recent activities and contributions to others')}
                      </p>
                    </div>
                    <Switch id="activity-visibility" defaultChecked />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    {t('Language & Region')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>{t('Preferred Language')}</Label>
                      <p className="text-sm text-muted-foreground">
                        {t('Select your preferred language for the interface')}
                      </p>
                    </div>
                    <LanguageSelector variant="outline" />
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
