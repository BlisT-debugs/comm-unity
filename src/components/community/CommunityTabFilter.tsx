
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface CommunityTabFilterProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const CommunityTabFilter: React.FC<CommunityTabFilterProps> = ({
  activeTab,
  setActiveTab
}) => {
  return (
    <Tabs 
      value={activeTab} 
      onValueChange={(value) => setActiveTab(value)} 
      className="w-full"
    >
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="all">All Communities</TabsTrigger>
        <TabsTrigger value="joined">Joined</TabsTrigger>
      </TabsList>
    </Tabs>
  );
};

export default CommunityTabFilter;
