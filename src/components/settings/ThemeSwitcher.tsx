
import React from 'react';
import { Moon, Sun, Monitor } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface ThemeSwitcherProps {
  variant?: 'card' | 'tabs' | 'minimal';
}

const ThemeSwitcher: React.FC<ThemeSwitcherProps> = ({ variant = 'tabs' }) => {
  const { theme, setTheme } = useApp();
  const { t } = useLanguage();

  if (variant === 'card') {
    return (
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>{t('Appearance')}</CardTitle>
          <CardDescription>
            {t('Customize how the app looks on your device')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-4">
            <div 
              className={`flex flex-col items-center justify-between rounded-md border-2 p-4 hover:bg-accent cursor-pointer ${theme === 'light' ? 'border-primary' : 'border-muted'}`}
              onClick={() => setTheme('light')}
            >
              <Sun className="mb-2 h-6 w-6" />
              <span className="text-sm font-medium">{t('Light')}</span>
            </div>
            <div 
              className={`flex flex-col items-center justify-between rounded-md border-2 p-4 hover:bg-accent cursor-pointer ${theme === 'dark' ? 'border-primary' : 'border-muted'}`}
              onClick={() => setTheme('dark')}
            >
              <Moon className="mb-2 h-6 w-6" />
              <span className="text-sm font-medium">{t('Dark')}</span>
            </div>
            <div 
              className={`flex flex-col items-center justify-between rounded-md border-2 p-4 hover:bg-accent cursor-pointer ${theme === 'system' ? 'border-primary' : 'border-muted'}`}
              onClick={() => setTheme('system')}
            >
              <Monitor className="mb-2 h-6 w-6" />
              <span className="text-sm font-medium">{t('System')}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (variant === 'minimal') {
    return (
      <div className="flex items-center space-x-2">
        <button 
          className={`rounded-md p-2 ${theme === 'light' ? 'bg-accent' : 'hover:bg-muted'}`}
          onClick={() => setTheme('light')}
          title={t('Light')}
        >
          <Sun className="h-4 w-4" />
        </button>
        <button 
          className={`rounded-md p-2 ${theme === 'dark' ? 'bg-accent' : 'hover:bg-muted'}`}
          onClick={() => setTheme('dark')}
          title={t('Dark')}
        >
          <Moon className="h-4 w-4" />
        </button>
        <button 
          className={`rounded-md p-2 ${theme === 'system' ? 'bg-accent' : 'hover:bg-muted'}`}
          onClick={() => setTheme('system')}
          title={t('System')}
        >
          <Monitor className="h-4 w-4" />
        </button>
      </div>
    );
  }

  // Default tabs variant
  return (
    <Tabs defaultValue={theme} onValueChange={(value) => setTheme(value as 'light' | 'dark' | 'system')}>
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="light" className="flex items-center gap-2">
          <Sun className="h-4 w-4" />
          <span className="hidden sm:inline">{t('Light')}</span>
        </TabsTrigger>
        <TabsTrigger value="dark" className="flex items-center gap-2">
          <Moon className="h-4 w-4" />
          <span className="hidden sm:inline">{t('Dark')}</span>
        </TabsTrigger>
        <TabsTrigger value="system" className="flex items-center gap-2">
          <Monitor className="h-4 w-4" />
          <span className="hidden sm:inline">{t('System')}</span>
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
};

export default ThemeSwitcher;
