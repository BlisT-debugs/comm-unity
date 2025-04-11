
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusCircle, MapPin, Loader2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
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
import { useForm } from 'react-hook-form';
import { useApp } from '@/contexts/AppContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/components/ui/use-toast';

// Example issue categories
const issueCategories = [
  { value: 'environment', label: 'Environment' },
  { value: 'infrastructure', label: 'Infrastructure' },
  { value: 'safety', label: 'Safety' },
  { value: 'education', label: 'Education' },
  { value: 'health', label: 'Health' },
];

interface CreateIssueDialogProps {
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  communityId?: string;
}

interface IssueFormValues {
  title: string;
  description: string;
  category: string;
  location: string;
}

const CreateIssueDialog: React.FC<CreateIssueDialogProps> = ({ 
  isOpen, 
  onOpenChange, 
  communityId 
}) => {
  const [open, setOpen] = useState(isOpen || false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { t } = useLanguage();
  const { toast } = useToast();
  const { connectionStatus, location, setLocation } = useApp();
  const navigate = useNavigate();
  
  // Update open state when isOpen prop changes
  React.useEffect(() => {
    if (isOpen !== undefined) {
      setOpen(isOpen);
    }
  }, [isOpen]);

  // Sync open state changes back to parent
  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (onOpenChange) {
      onOpenChange(newOpen);
    }
  };
  
  const form = useForm<IssueFormValues>({
    defaultValues: {
      title: '',
      description: '',
      category: '',
      location: location || '',
    },
  });
  
  // Function to handle form submission
  const onSubmit = async (data: IssueFormValues) => {
    try {
      setIsSubmitting(true);
      
      // Save the location to the app context if provided
      if (data.location && data.location !== location) {
        setLocation(data.location);
      }
      
      // In a real app, we would send this data to an API
      console.log('Creating issue:', { ...data, communityId });
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast({
        title: "Issue created",
        description: "Your issue has been successfully submitted.",
        variant: "default",
      });
      
      // Close the dialog
      handleOpenChange(false);
      form.reset();
      
      // In a real app, we would navigate to the new issue
      // navigate(`/issue/${newIssueId}`);
    } catch (error) {
      console.error('Failed to create issue:', error);
      toast({
        title: "Failed to create issue",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Handle user's current location
  const handleGetLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // In a real app, you'd reverse geocode these coordinates to get a readable address
          const locationString = `${position.coords.latitude.toFixed(4)}, ${position.coords.longitude.toFixed(4)}`;
          form.setValue('location', locationString);
        },
        (error) => {
          console.error('Geolocation error:', error);
          toast({
            title: "Location unavailable",
            description: "Please enter your location manually.",
            variant: "destructive",
          });
        }
      );
    } else {
      toast({
        title: "Geolocation not supported",
        description: "Your browser doesn't support geolocation.",
        variant: "destructive",
      });
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <PlusCircle size={16} />
          {t('Report Issue')}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{t('Report New Issue')}</DialogTitle>
          <DialogDescription>
            {communityId 
              ? t('Report an issue in this community') 
              : t('Report an issue in your area')}
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
                  <FormLabel>{t('Issue Title')}</FormLabel>
                  <FormControl>
                    <Input placeholder={t('Enter a descriptive title')} {...field} />
                  </FormControl>
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
                  <FormControl>
                    <Textarea 
                      placeholder={t('Provide details about the issue')}
                      className="min-h-[100px]" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="category"
              rules={{ required: "Category is required" }}
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
                      {issueCategories.map((category) => (
                        <SelectItem key={category.value} value={category.value}>
                          {t(category.label)}
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
                  <FormLabel>{t('Location')}</FormLabel>
                  <div className="flex gap-2">
                    <FormControl>
                      <Input placeholder={t('Enter location')} {...field} />
                    </FormControl>
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="icon"
                      onClick={handleGetLocation}
                      disabled={connectionStatus === 'offline'}
                    >
                      <MapPin className="h-4 w-4" />
                    </Button>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="flex justify-end">
              <Button type="submit" disabled={isSubmitting || connectionStatus === 'offline'}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {t('Submitting...')}
                  </>
                ) : (
                  t('Submit Issue')
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateIssueDialog;
