
import React from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface CommunitySearchBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const CommunitySearchBar: React.FC<CommunitySearchBarProps> = ({
  searchQuery,
  setSearchQuery
}) => {
  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <Input 
        placeholder="Search communities..." 
        className="pl-9"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
    </div>
  );
};

export default CommunitySearchBar;
