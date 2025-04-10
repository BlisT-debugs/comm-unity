
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search as SearchIcon, X, Loader2 } from 'lucide-react';
import { 
  CommandDialog, 
  CommandEmpty, 
  CommandGroup, 
  CommandInput, 
  CommandItem, 
  CommandList 
} from '@/components/ui/command';
import { Button } from '@/components/ui/button';
import { useApp } from '@/contexts/AppContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';

const GlobalSearch: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const { performSearch, searchResults, isSearching, connectionStatus } = useApp();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);

  // Handle keyboard shortcut to open search
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  // Handle search when query changes
  useEffect(() => {
    const timer = setTimeout(() => {
      if (query) {
        performSearch(query);
      }
    }, 300); // Debounce search

    return () => clearTimeout(timer);
  }, [query, performSearch]);

  const handleSelect = (item: { id: string; url: string }) => {
    setOpen(false);
    navigate(item.url);
  };

  return (
    <>
      <Button
        variant="outline"
        className="relative h-9 w-9 p-0 xl:h-10 xl:w-60 xl:justify-start xl:px-3 xl:py-2"
        onClick={() => setOpen(true)}
      >
        <SearchIcon className="h-4 w-4 xl:mr-2" aria-hidden="true" />
        <span className="hidden xl:inline-flex">{t('Search')}</span>
        <span className="sr-only">Search</span>
        <kbd className="pointer-events-none absolute right-1.5 top-2 hidden h-6 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-xs font-medium opacity-100 xl:flex">
          <span className="text-xs">⌘</span>K
        </kbd>
      </Button>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput
          ref={inputRef}
          placeholder={connectionStatus === 'offline' ? 
            `${t('Search')} (offline mode)` : 
            `${t('Search')} ${t('communities')}, ${t('issues')}`
          }
          value={query}
          onValueChange={setQuery}
        />
        <CommandList>
          {isSearching ? (
            <div className="p-4 text-center">
              <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">Searching...</p>
            </div>
          ) : query.length > 0 && searchResults.length === 0 ? (
            <CommandEmpty>No results found</CommandEmpty>
          ) : (
            <>
              {searchResults.length > 0 && (
                <>
                  <CommandGroup heading={t('Communities')}>
                    {searchResults
                      .filter(item => item.type === 'community')
                      .map(item => (
                        <CommandItem 
                          key={item.id}
                          value={item.title}
                          onSelect={() => handleSelect(item)}
                        >
                          <div className="mr-2 flex h-6 w-6 items-center justify-center rounded-full bg-primary/20">
                            <span className="text-xs text-primary">
                              {item.title.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <span>{item.title}</span>
                        </CommandItem>
                      ))
                    }
                  </CommandGroup>
                  
                  <CommandGroup heading={t('Issues')}>
                    {searchResults
                      .filter(item => item.type === 'issue')
                      .map(item => (
                        <CommandItem 
                          key={item.id}
                          value={item.title}
                          onSelect={() => handleSelect(item)}
                        >
                          <div 
                            className={cn(
                              "mr-2 w-2 h-2 rounded-full",
                              item.category === 'environment' && "bg-green-500",
                              item.category === 'infrastructure' && "bg-orange-500",
                              item.category === 'safety' && "bg-red-500",
                              item.category === 'education' && "bg-blue-500",
                              item.category === 'health' && "bg-purple-500"
                            )}
                          />
                          <span>{item.title}</span>
                        </CommandItem>
                      ))
                    }
                  </CommandGroup>
                </>
              )}
            </>
          )}
        </CommandList>
      </CommandDialog>
    </>
  );
};

export default GlobalSearch;
