
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { MapPin, RefreshCw } from 'lucide-react';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useCommunities } from '@/hooks/useCommunities';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { useQueryClient } from '@tanstack/react-query';
import { useLanguage } from '@/contexts/LanguageContext';
import { useApp } from '@/contexts/AppContext';

interface CreateIssueDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const formSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters'),
  description: z.string().min(20, 'Description must be at least 20 characters'),
  category: z.string().min(1, 'Please select a category'),
  communityId: z.string().uuid('Please select a community'),
  location: z.string().optional(),
});

const categories = [
  { id: 'waste', name: 'Waste Management' },
  { id: 'education', name: 'Education' },
  { id: 'safety', name: 'Safety' },
  { id: 'infrastructure', name: 'Infrastructure' },
  { id: 'environment', name: 'Environment' },
  { id: 'health', name: 'Health' },
];

const CreateIssueDialog: React.FC<CreateIssueDialogProps> = ({ open, onOpenChange }) => {
  const { user } = useAuth();
  const { communities } = useCommunities({ userId: user?.id });
  const queryClient = useQueryClient();
  const { t } = useLanguage();
  const { connectionStatus, location: userLocation, setLocation } = useApp();
  const [detectingLocation, setDetectingLocation] = useState(false);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      description: '',
      category: '',
      communityId: '',
      location: userLocation || '',
    }
  });

  const isSubmitting = form.formState.isSubmitting;
  const isOffline = connectionStatus === 'offline';

  const localizedCategories = categories.map(category => ({
    ...category,
    displayName: t(category.name)
  }));

  const detectUserLocation = () => {
    if (navigator.geolocation) {
      setDetectingLocation(true);
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const { latitude, longitude } = position.coords;
            // For demonstration purposes, we'll use a simple reverse geocoding approach
            // In a real app, you might use a proper geocoding service
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10`
            );
            const data = await response.json();
            
            // Extract meaningful location data
            const locationName = data.address?.city || 
                               data.address?.town || 
                               data.address?.village || 
                               data.address?.county ||
                               '';
                               
            if (locationName) {
              form.setValue('location', locationName);
              setLocation(locationName);
            }
          } catch (error) {
            console.error('Error fetching location:', error);
            toast({
              title: "Location detection failed",
              description: "Please enter your location manually",
              variant: "destructive",
            });
          } finally {
            setDetectingLocation(false);
          }
        },
        (error) => {
          console.error('Geolocation error:', error);
          setDetectingLocation(false);
          toast({
            title: "Location access denied",
            description: "Please enable location access or enter manually",
            variant: "destructive",
          });
        }
      );
    } else {
      toast({
        title: "Geolocation not supported",
        description: "Your browser doesn't support location detection",
        variant: "destructive",
      });
    }
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!user) {
      toast({
        title: t("Authentication required"),
        description: t("You need to be logged in to create an issue"),
        variant: "destructive"
      });
      return;
    }

    // Handle offline mode
    if (isOffline) {
      // Store data locally until connection is restored
      const offlineIssues = JSON.parse(localStorage.getItem('offline-issues') || '[]');
      offlineIssues.push({
        ...values,
        created_at: new Date().toISOString(),
        creator_id: user.id,
        status: 'open',
        pending: true
      });
      localStorage.setItem('offline-issues', JSON.stringify(offlineIssues));
      
      toast({
        title: t("Issue saved offline"),
        description: t("It will be uploaded when you're back online"),
      });
      
      onOpenChange(false);
      form.reset();
      return;
    }

    try {
      const { error } = await supabase
        .from('issues')
        .insert({
          title: values.title,
          description: values.description,
          category: values.category,
          community_id: values.communityId,
          creator_id: user.id,
          location: values.location,
          status: 'open'
        });

      if (error) throw error;

      toast({
        title: t("Success!"),
        description: t("Your issue has been created successfully")
      });

      // Refresh issues data
      queryClient.invalidateQueries({ queryKey: ['issues'] });
      
      // Close dialog and reset form
      onOpenChange(false);
      form.reset();
    } catch (error) {
      console.error("Error creating issue:", error);
      toast({
        title: t("Error"),
        description: t("There was an error creating your issue. Please try again."),
        variant: "destructive"
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{t("Create New Issue")}</DialogTitle>
          <DialogDescription>
            {t("Share a community issue that needs attention. Be specific about the problem and location.")}
          </DialogDescription>
        </DialogHeader>

        {isOffline && (
          <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 rounded-md p-3 text-sm mb-4">
            {t("You're currently offline. Your issue will be saved locally and uploaded when you reconnect.")}
          </div>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="communityId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("Community")}</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                    disabled={isSubmitting}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={t("Select a community")} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {communities.map((community) => (
                        <SelectItem 
                          key={community.id} 
                          value={community.id}
                        >
                          {community.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("Title")}</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder={t("Enter a clear title for the issue")} 
                      {...field} 
                      disabled={isSubmitting}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("Description")}</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder={t("Describe the issue in detail")} 
                      className="min-h-[100px]" 
                      {...field} 
                      disabled={isSubmitting}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("Category")}</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                    disabled={isSubmitting}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={t("Select a category")} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {localizedCategories.map((category) => (
                        <SelectItem 
                          key={category.id} 
                          value={category.id}
                        >
                          {category.displayName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("Location")}</FormLabel>
                  <div className="flex gap-2">
                    <FormControl>
                      <Input 
                        placeholder={t("Where is this issue located?")} 
                        {...field} 
                        disabled={isSubmitting || detectingLocation}
                      />
                    </FormControl>
                    <Button 
                      type="button" 
                      size="icon"
                      variant="outline"
                      onClick={detectUserLocation}
                      disabled={isSubmitting || detectingLocation || isOffline}
                    >
                      {detectingLocation ? (
                        <RefreshCw className="h-4 w-4 animate-spin" />
                      ) : (
                        <MapPin className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => onOpenChange(false)}
                disabled={isSubmitting}
              >
                {t("Cancel")}
              </Button>
              <Button 
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? t('Creating...') : isOffline ? t('Save Offline') : t('Create Issue')}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateIssueDialog;
