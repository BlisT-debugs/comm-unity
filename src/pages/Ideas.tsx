
import React, { useState } from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import AppHeader from '@/components/layout/AppHeader';
import AppSidebar from '@/components/layout/AppSidebar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useLanguage } from '@/contexts/LanguageContext';
import { Lightbulb, ThumbsUp, MessageSquare, Filter, Plus, Zap, Loader2, X } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { useForm } from 'react-hook-form';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import VoiceInput from '@/components/voice/VoiceInput';

interface IdeaFormValues {
  title: string;
  description: string;
  category: string;
}

const Ideas = () => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeVoiceField, setActiveVoiceField] = useState<keyof IdeaFormValues | null>(null);
  
  const form = useForm<IdeaFormValues>({
    defaultValues: {
      title: '',
      description: '',
      category: '',
    }
  });
  
  // Mock idea data
  const [ideas, setIdeas] = useState([
    {
      id: 1,
      title: 'Community resource sharing platform',
      description: 'Create a platform where community members can share and exchange resources like tools, skills, and knowledge.',
      author: 'Sarah Johnson',
      authorAvatar: '',
      votes: 42,
      comments: 12,
      category: 'community',
      status: 'new',
      createdAt: '2023-05-15'
    },
    {
      id: 2,
      title: 'Mobile app for local reporting',
      description: 'Build a mobile app that allows residents to report local issues directly to authorities with photo evidence.',
      author: 'Michael Chen',
      authorAvatar: '',
      votes: 37,
      comments: 8,
      category: 'technology',
      status: 'considering',
      createdAt: '2023-05-10'
    },
    {
      id: 3,
      title: 'Community garden network',
      description: 'Establish a network of community gardens to promote food security and provide education about sustainable agriculture.',
      author: 'Emma Rodriguez',
      authorAvatar: '',
      votes: 29,
      comments: 15,
      category: 'environment',
      status: 'planned',
      createdAt: '2023-05-08'
    },
    {
      id: 4,
      title: 'Youth mentorship program',
      description: 'Connect young people with professionals and retirees for guidance, skill development, and career exploration.',
      author: 'David Thompson',
      authorAvatar: '',
      votes: 24,
      comments: 6,
      category: 'education',
      status: 'new',
      createdAt: '2023-05-03'
    }
  ]);
  
  // Color mapping for status badges
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-500/10 text-blue-500 hover:bg-blue-500/20';
      case 'considering': return 'bg-purple-500/10 text-purple-500 hover:bg-purple-500/20';
      case 'planned': return 'bg-amber-500/10 text-amber-500 hover:bg-amber-500/20';
      case 'in-progress': return 'bg-green-500/10 text-green-500 hover:bg-green-500/20';
      case 'completed': return 'bg-teal-500/10 text-teal-500 hover:bg-teal-500/20';
      case 'archived': return 'bg-gray-500/10 text-gray-500 hover:bg-gray-500/20';
      default: return '';
    }
  };

  // Handle voice input transcripts
  const handleVoiceTranscript = (transcript: string) => {
    if (activeVoiceField && transcript) {
      form.setValue(activeVoiceField, transcript);
      toast.success(`Added voice input to ${activeVoiceField}`);
      setActiveVoiceField(null);
    }
  };

  // Submit a new idea
  const onSubmit = async (data: IdeaFormValues) => {
    try {
      setIsSubmitting(true);
      
      // In a real app, you would send this data to an API
      console.log('Submitting idea:', data);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Add idea to local state (in a real app, this would come from the API response)
      const newIdea = {
        id: ideas.length + 1,
        title: data.title,
        description: data.description,
        author: user?.email || 'Anonymous',
        authorAvatar: user?.user_metadata?.avatar_url || '',
        votes: 0,
        comments: 0,
        category: data.category || 'general',
        status: 'new',
        createdAt: new Date().toISOString().split('T')[0]
      };
      
      setIdeas([newIdea, ...ideas]);
      toast.success('Idea submitted successfully');
      
      // Close dialog and reset form
      setShowCreateDialog(false);
      form.reset();
    } catch (error) {
      console.error('Error submitting idea:', error);
      toast.error('Failed to submit idea', {
        description: 'Please try again later'
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1 flex flex-col min-h-screen">
          <AppHeader />
          
          <main className="flex-1 container py-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
              <div>
                <h1 className="text-3xl font-bold flex items-center gap-2">
                  <Lightbulb className="h-8 w-8 text-amber-500" />
                  {t('Ideas')}
                </h1>
                <p className="text-muted-foreground mt-1">
                  {t('Share and discover community ideas and initiatives')}
                </p>
              </div>
              <div className="flex mt-4 md:mt-0 gap-2">
                <Button variant="outline" size="sm">
                  <Filter className="mr-2 h-4 w-4" />
                  {t('Filter')}
                </Button>
                <Button 
                  variant="default" 
                  size="sm"
                  onClick={() => setShowCreateDialog(true)}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  {t('Submit Idea')}
                </Button>
              </div>
            </div>
            
            <Tabs defaultValue="trending" className="space-y-4">
              <TabsList>
                <TabsTrigger value="trending" className="flex items-center gap-2">
                  <Zap className="h-4 w-4" />
                  {t('Trending')}
                </TabsTrigger>
                <TabsTrigger value="latest">{t('Latest')}</TabsTrigger>
                <TabsTrigger value="top">{t('Top Voted')}</TabsTrigger>
              </TabsList>
              
              <TabsContent value="trending" className="space-y-4">
                {ideas.map(idea => (
                  <Card key={idea.id} className="card-hover">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-xl">{idea.title}</CardTitle>
                          <CardDescription className="flex items-center gap-2 mt-1">
                            <Avatar className="h-6 w-6">
                              <AvatarImage src={idea.authorAvatar} alt={idea.author} />
                              <AvatarFallback>{idea.author.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <span>{idea.author}</span>
                          </CardDescription>
                        </div>
                        <Badge className={getStatusColor(idea.status)} variant="outline">
                          {idea.status.charAt(0).toUpperCase() + idea.status.slice(1)}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p>{idea.description}</p>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      <div className="flex gap-3">
                        <Button variant="ghost" size="sm" className="gap-1">
                          <ThumbsUp className="h-4 w-4" />
                          {idea.votes}
                        </Button>
                        <Button variant="ghost" size="sm" className="gap-1">
                          <MessageSquare className="h-4 w-4" />
                          {idea.comments}
                        </Button>
                      </div>
                      <Badge variant="outline">{idea.category}</Badge>
                    </CardFooter>
                  </Card>
                ))}
              </TabsContent>
              
              <TabsContent value="latest">
                <div className="flex h-40 items-center justify-center rounded-md border border-dashed">
                  <p className="text-sm text-muted-foreground">
                    {t('Latest ideas will appear here')}
                  </p>
                </div>
              </TabsContent>
              
              <TabsContent value="top">
                <div className="flex h-40 items-center justify-center rounded-md border border-dashed">
                  <p className="text-sm text-muted-foreground">
                    {t('Top voted ideas will appear here')}
                  </p>
                </div>
              </TabsContent>
            </Tabs>
          </main>
        </div>
      </div>

      {/* Create Idea Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{t('Submit New Idea')}</DialogTitle>
            <DialogDescription>
              {t('Share your idea with the community. Be clear and concise.')}
            </DialogDescription>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="title"
                rules={{ required: "Title is required" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('Idea Title')}</FormLabel>
                    <div className="flex gap-2">
                      <FormControl>
                        <Input placeholder={t('Enter a descriptive title')} {...field} />
                      </FormControl>
                      <VoiceInput 
                        onTranscriptChange={handleVoiceTranscript}
                        isListening={activeVoiceField === 'title'}
                        onListeningChange={(isListening) => {
                          setActiveVoiceField(isListening ? 'title' : null);
                        }}
                        placeholder="Title"
                        buttonSize="icon"
                      />
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="description"
                rules={{ required: "Description is required" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('Description')}</FormLabel>
                    <div className="flex gap-2 items-start">
                      <FormControl>
                        <Textarea 
                          placeholder={t('Describe your idea in detail...')} 
                          className="min-h-[120px]" 
                          {...field} 
                        />
                      </FormControl>
                      <VoiceInput 
                        onTranscriptChange={handleVoiceTranscript}
                        isListening={activeVoiceField === 'description'}
                        onListeningChange={(isListening) => {
                          setActiveVoiceField(isListening ? 'description' : null);
                        }}
                        placeholder="Description"
                        buttonSize="icon"
                      />
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('Category')}</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={t('Select a category')} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="community">Community</SelectItem>
                        <SelectItem value="technology">Technology</SelectItem>
                        <SelectItem value="environment">Environment</SelectItem>
                        <SelectItem value="education">Education</SelectItem>
                        <SelectItem value="health">Health & Wellness</SelectItem>
                        <SelectItem value="culture">Arts & Culture</SelectItem>
                        <SelectItem value="business">Business & Economy</SelectItem>
                        <SelectItem value="general">General</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="flex justify-end gap-2">
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={() => setShowCreateDialog(false)}
                >
                  <X className="mr-2 h-4 w-4" />
                  {t('Cancel')}
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {t('Submitting...')}
                    </>
                  ) : (
                    <>
                      <Lightbulb className="mr-2 h-4 w-4" />
                      {t('Submit Idea')}
                    </>
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </SidebarProvider>
  );
};

export default Ideas;
