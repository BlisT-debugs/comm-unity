
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Search as SearchIcon, Filter, MapPin, Globe, Database, Signal, SlidersHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { SupportedLanguage, searchContent, SearchResult } from '@/services/searchService';
import { Skeleton } from '@/components/ui/skeleton';

const CATEGORIES = [
  'Environment',
  'Safety',
  'Infrastructure',
  'Education',
  'Health',
  'Waste Management',
  'Transportation',
  'Community Events',
  'Other'
];

const LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Spanish (Español)' },
  { code: 'fr', name: 'French (Français)' },
  { code: 'hi', name: 'Hindi (हिन्दी)' },
  { code: 'zh', name: 'Chinese (中文)' },
  { code: 'ar', name: 'Arabic (العربية)' },
  { code: 'sw', name: 'Swahili (Kiswahili)' }
];

const Search = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  
  // Search state
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [language, setLanguage] = useState<SupportedLanguage>('en');
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [trustScore, setTrustScore] = useState<number>(0);
  const [includeIssues, setIncludeIssues] = useState(true);
  const [includeCommunities, setIncludeCommunities] = useState(true);
  const [connectivity, setConnectivity] = useState<'high' | 'medium' | 'low'>('high');
  const [sortBy, setSortBy] = useState<'relevance' | 'recent' | 'trust'>('relevance');
  
  // Results state
  const [results, setResults] = useState<SearchResult[]>([]);
  const [totalResults, setTotalResults] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [hasSearched, setHasSearched] = useState<boolean>(false);
  
  // Effect to search with params from URL
  useEffect(() => {
    if (searchParams.get('q')) {
      performSearch();
    }
  }, []); // Only run once on mount
  
  const addCategory = () => {
    if (selectedCategory && !categories.includes(selectedCategory)) {
      setCategories([...categories, selectedCategory]);
      setSelectedCategory('');
    }
  };
  
  const removeCategory = (category: string) => {
    setCategories(categories.filter(c => c !== category));
  };
  
  const performSearch = async () => {
    if (!query.trim()) return;
    
    setIsLoading(true);
    setHasSearched(true);
    
    try {
      // Update URL for shareable search
      const params = new URLSearchParams();
      params.set('q', query);
      if (language !== 'en') params.set('lang', language);
      if (categories.length) params.set('cat', categories.join(','));
      if (sortBy !== 'relevance') params.set('sort', sortBy);
      
      navigate({
        pathname: '/search',
        search: params.toString()
      }, { replace: true });
      
      const { results: searchResults, totalCount, pageCount } = await searchContent({
        query,
        language,
        categories: categories.length > 0 ? categories : undefined,
        minTrustScore: trustScore,
        page: currentPage,
        includeIssues,
        includeCommunities,
        connectivity,
        sortBy
      });
      
      setResults(searchResults);
      setTotalResults(totalCount);
      setTotalPages(pageCount);
      
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1); // Reset to first page
    performSearch();
  };
  
  const renderResultCard = (result: SearchResult) => {
    const isIssue = result.type === 'issue';
    
    return (
      <Card key={result.id} className="overflow-hidden">
        <CardHeader className="p-4 pb-2">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-lg">{result.title}</CardTitle>
              <div className="flex items-center text-sm text-muted-foreground mt-1">
                <Badge 
                  variant={isIssue ? "default" : "outline"} 
                  className={`mr-2 ${isIssue ? 'bg-blue-500' : ''}`}
                >
                  {isIssue ? 'Issue' : 'Community'}
                </Badge>
                {result.category && <span className="mr-2">{result.category}</span>}
                {result.language !== 'en' && (
                  <Badge variant="secondary" className="mr-2">
                    <Globe className="w-3 h-3 mr-1" />
                    {LANGUAGES.find(l => l.code === result.language)?.name || result.language}
                  </Badge>
                )}
              </div>
            </div>
            {result.trustScore && (
              <div className="flex flex-col items-center">
                <div className={`
                  rounded-full w-10 h-10 flex items-center justify-center text-white font-medium
                  ${result.trustScore >= 70 ? 'bg-green-500' : 
                    result.trustScore >= 40 ? 'bg-yellow-500' : 'bg-red-500'}
                `}>
                  {Math.round(result.trustScore)}
                </div>
                <span className="text-xs text-muted-foreground mt-1">Trust</span>
              </div>
            )}
          </div>
        </CardHeader>
        
        <CardContent className="p-4 pt-0">
          <p className="text-sm line-clamp-2">{result.description}</p>
        </CardContent>
        
        <CardFooter className="p-4 pt-0 flex items-center justify-between">
          <div className="flex items-center text-sm text-muted-foreground">
            {result.location && (
              <span className="flex items-center mr-3">
                <MapPin className="w-3 h-3 mr-1" />
                {result.location}
              </span>
            )}
            <span>
              {new Date(result.lastUpdated).toLocaleDateString()}
            </span>
          </div>
          <Button 
            variant="secondary" 
            size="sm"
            onClick={() => navigate(`/${result.type === 'issue' ? 'issues' : 'communities'}/${result.id}`)}
          >
            View
          </Button>
        </CardFooter>
      </Card>
    );
  };
  
  return (
    <div className="container py-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Advanced Search</h1>
      </div>
      
      <form onSubmit={handleSearch} className="space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-grow">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search issues and communities..." 
              className="pl-9"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          
          <Select value={language} onValueChange={(value) => setLanguage(value as SupportedLanguage)}>
            <SelectTrigger className="w-full md:w-[200px]">
              <SelectValue placeholder="Language" />
            </SelectTrigger>
            <SelectContent>
              {LANGUAGES.map((lang) => (
                <SelectItem key={lang.code} value={lang.code}>
                  {lang.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Button type="submit">
            <SearchIcon className="mr-2 h-4 w-4" />
            Search
          </Button>
          
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Filter className="mr-2 h-4 w-4" />
                Filters
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Search Filters</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label>Categories</Label>
                  <div className="flex gap-2">
                    <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                      <SelectTrigger className="flex-grow">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {CATEGORIES.map((cat) => (
                          <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button type="button" onClick={addCategory} size="sm">
                      Add
                    </Button>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mt-2">
                    {categories.map((cat) => (
                      <Badge key={cat} variant="secondary">
                        {cat}
                        <button 
                          className="ml-1 hover:text-destructive" 
                          onClick={() => removeCategory(cat)}
                          type="button"
                        >
                          ×
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <Separator />
                
                <div className="grid gap-2">
                  <Label>Minimum Trust Score: {trustScore}</Label>
                  <Slider 
                    value={[trustScore]} 
                    onValueChange={(values) => setTrustScore(values[0])} 
                    max={100} 
                    step={5}
                  />
                </div>
                
                <Separator />
                
                <div className="grid gap-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="include-issues">Include Issues</Label>
                    <Switch 
                      id="include-issues"
                      checked={includeIssues}
                      onCheckedChange={setIncludeIssues}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="include-communities">Include Communities</Label>
                    <Switch 
                      id="include-communities" 
                      checked={includeCommunities}
                      onCheckedChange={setIncludeCommunities}
                    />
                  </div>
                </div>
                
                <Separator />
                
                <div className="grid gap-2">
                  <Label>Connection Quality</Label>
                  <Select value={connectivity} onValueChange={(value: any) => setConnectivity(value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="high">High (Full Results)</SelectItem>
                      <SelectItem value="medium">Medium (Reduced Results)</SelectItem>
                      <SelectItem value="low">Low (Minimal Results)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid gap-2">
                  <Label>Sort By</Label>
                  <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="relevance">Relevance</SelectItem>
                      <SelectItem value="recent">Most Recent</SelectItem>
                      <SelectItem value="trust">Trust Score</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button onClick={performSearch} type="button">
                  Apply Filters
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </form>
      
      <div className="space-y-4">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[...Array(4)].map((_, i) => (
              <Card key={i} className="overflow-hidden">
                <CardHeader className="p-4">
                  <Skeleton className="h-6 w-3/4" />
                  <div className="flex items-center mt-2">
                    <Skeleton className="h-4 w-16 mr-2" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-4/5" />
                </CardContent>
                <CardFooter className="p-4 pt-0 flex justify-between">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-8 w-16" />
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : hasSearched && results.length > 0 ? (
          <>
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Found {totalResults} results
              </p>
              <div className="flex items-center space-x-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  disabled={currentPage === 1}
                  onClick={() => {
                    setCurrentPage(prev => Math.max(1, prev - 1));
                    performSearch();
                  }}
                >
                  Previous
                </Button>
                <span className="text-sm">
                  Page {currentPage} of {totalPages}
                </span>
                <Button 
                  variant="outline" 
                  size="sm" 
                  disabled={currentPage === totalPages}
                  onClick={() => {
                    setCurrentPage(prev => Math.min(totalPages, prev + 1));
                    performSearch();
                  }}
                >
                  Next
                </Button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {results.map(renderResultCard)}
            </div>
          </>
        ) : hasSearched ? (
          <Card className="p-12 flex flex-col items-center justify-center">
            <Database className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-xl font-medium mb-1">No results found</h3>
            <p className="text-muted-foreground text-center">
              Try adjusting your search terms or filters
            </p>
          </Card>
        ) : (
          <Card className="p-12 flex flex-col items-center justify-center">
            <SearchIcon className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-xl font-medium mb-1">Search for issues and communities</h3>
            <p className="text-muted-foreground text-center max-w-md">
              Use the search bar above to find content. You can filter by language, 
              category, and more using the filters button.
            </p>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Search;
