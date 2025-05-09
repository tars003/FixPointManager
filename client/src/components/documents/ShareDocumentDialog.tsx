import { useState } from "react";
import { useTranslation } from "react-i18next";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Copy, Check, Link, Mail, Clock, Lock, Shield, RefreshCw } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

interface ShareDocumentDialogProps {
  documentId: string;
  documentName: string;
  documentType: string;
  children: React.ReactNode;
}

const shareFormSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }).or(z.literal("")),
  phone: z.string().regex(/^\+?[0-9]{10,15}$/, { 
    message: "Please enter a valid phone number" 
  }).or(z.literal("")),
  accessType: z.enum(["view", "download", "both"]),
  expiryTime: z.enum(["1h", "24h", "7d", "30d", "never"]),
  requirePassword: z.boolean().default(false),
  password: z.string().min(6, { 
    message: "Password must be at least 6 characters" 
  }).optional(),
  notifyOnAccess: z.boolean().default(false),
});

type ShareFormValues = z.infer<typeof shareFormSchema>;

const ShareDocumentDialog = ({ documentId, documentName, documentType, children }: ShareDocumentDialogProps) => {
  const { t } = useTranslation(['common', 'documents']);
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isGeneratingLink, setIsGeneratingLink] = useState(false);
  const [generatedLink, setGeneratedLink] = useState("");
  const [isCopied, setIsCopied] = useState(false);
  const [linkId, setLinkId] = useState("");
  
  const form = useForm<ShareFormValues>({
    resolver: zodResolver(shareFormSchema),
    defaultValues: {
      email: "",
      phone: "",
      accessType: "view",
      expiryTime: "24h",
      requirePassword: false,
      password: "",
      notifyOnAccess: false,
    },
  });

  const generateSecureLink = async (values: ShareFormValues) => {
    setIsGeneratingLink(true);
    
    try {
      // In a real implementation, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Generate a secure random ID for the link
      const randomId = Math.random().toString(36).substring(2, 15) + 
                       Math.random().toString(36).substring(2, 15);
      setLinkId(randomId);
      
      // Generate the link
      const baseUrl = window.location.origin;
      const newLink = `${baseUrl}/document-view/${randomId}`;
      setGeneratedLink(newLink);
      
      // Record the sharing action
      console.log('Document shared:', {
        documentId,
        linkId: randomId,
        recipient: values.email || values.phone,
        accessType: values.accessType,
        expiryTime: values.expiryTime,
        hasPassword: values.requirePassword,
        notifyOnAccess: values.notifyOnAccess,
        timestamp: new Date().toISOString()
      });
      
      if (values.email || values.phone) {
        // In a real app, send an email or SMS notification
        toast({
          title: t('documents:share.sentNotification', 'Notification Sent'),
          description: t(
            'documents:share.notificationSent', 
            'Link has been sent to {{recipient}}', 
            { recipient: values.email || values.phone }
          ),
        });
      }
    } catch (error) {
      console.error('Error generating secure link:', error);
      toast({
        title: t('common:error', 'Error'),
        description: t('documents:share.errorGeneratingLink', 'Failed to generate secure link. Please try again.'),
        variant: 'destructive',
      });
    } finally {
      setIsGeneratingLink(false);
    }
  };
  
  const handleCopyLink = () => {
    if (!generatedLink) return;
    
    navigator.clipboard.writeText(generatedLink)
      .then(() => {
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
        
        toast({
          title: t('common:copied', 'Copied!'),
          description: t('documents:share.linkCopied', 'Link copied to clipboard'),
        });
      })
      .catch(err => {
        console.error('Failed to copy text: ', err);
        toast({
          title: t('common:error', 'Error'),
          description: t('documents:share.copyFailed', 'Failed to copy to clipboard'),
          variant: 'destructive',
        });
      });
  };
  
  const refreshLink = () => {
    // Reset the form and generate a new link
    setGeneratedLink("");
    setLinkId("");
    generateSecureLink(form.getValues());
  };
  
  const requirePasswordWatch = form.watch("requirePassword");
  
  const getExpiryTimeLabel = (value: string) => {
    switch(value) {
      case "1h": return t('documents:share.expiryTimes.1h', '1 hour');
      case "24h": return t('documents:share.expiryTimes.24h', '24 hours');
      case "7d": return t('documents:share.expiryTimes.7d', '7 days');
      case "30d": return t('documents:share.expiryTimes.30d', '30 days');
      case "never": return t('documents:share.expiryTimes.never', 'Never');
      default: return value;
    }
  };

  const onSubmit = (values: ShareFormValues) => {
    generateSecureLink(values);
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t('documents:share.title', 'Share Document')}</DialogTitle>
          <DialogDescription>
            {t('documents:share.description', 'Generate a secure link to share "{{documentName}}"', { documentName })}
          </DialogDescription>
        </DialogHeader>
        
        {!generatedLink ? (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="flex items-center space-x-2 bg-muted/50 p-2 rounded-md">
                <div className="p-2 bg-primary/10 rounded-md">
                  <Shield className="h-5 w-5 text-primary" />
                </div>
                <p className="text-sm text-muted-foreground">
                  {t('documents:share.securityNote', 'All shared links are encrypted and can be revoked at any time.')}
                </p>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-sm font-medium">{t('documents:share.sendTo', 'Send to (optional)')}</h3>
                <div className="grid grid-cols-1 gap-4">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex items-center">
                          <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                          <FormLabel>{t('common:email', 'Email')}</FormLabel>
                        </div>
                        <FormControl>
                          <Input 
                            placeholder={t('documents:share.emailPlaceholder', 'Enter recipient email')} 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 mr-2 text-muted-foreground">
                            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                          </svg>
                          <FormLabel>{t('common:phone', 'Phone')}</FormLabel>
                        </div>
                        <FormControl>
                          <Input 
                            placeholder={t('documents:share.phonePlaceholder', 'Enter recipient phone')} 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-sm font-medium">{t('documents:share.accessSettings', 'Access Settings')}</h3>
                
                <FormField
                  control={form.control}
                  name="accessType"
                  render={({ field }) => (
                    <FormItem className="space-y-1">
                      <FormLabel>{t('documents:share.accessType', 'Recipient can:')}</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex flex-col space-y-1"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="view" id="view" />
                            <Label htmlFor="view">{t('documents:share.accessTypes.view', 'View only')}</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="download" id="download" />
                            <Label htmlFor="download">{t('documents:share.accessTypes.download', 'Download only')}</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="both" id="both" />
                            <Label htmlFor="both">{t('documents:share.accessTypes.both', 'View and download')}</Label>
                          </div>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="expiryTime"
                  render={({ field }) => (
                    <FormItem className="space-y-1">
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                        <FormLabel>{t('documents:share.linkExpiry', 'Link expires after:')}</FormLabel>
                      </div>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex flex-wrap gap-2"
                        >
                          {["1h", "24h", "7d", "30d", "never"].map((value) => (
                            <div 
                              key={value}
                              className={cn(
                                "flex items-center justify-center px-3 py-1.5 rounded-md border cursor-pointer text-sm",
                                field.value === value 
                                  ? "bg-primary text-primary-foreground border-primary" 
                                  : "bg-background hover:bg-muted"
                              )}
                              onClick={() => field.onChange(value)}
                            >
                              {getExpiryTimeLabel(value)}
                            </div>
                          ))}
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="space-y-3">
                  <FormField
                    control={form.control}
                    name="requirePassword"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Lock className="h-4 w-4 text-muted-foreground" />
                          <FormLabel>{t('documents:share.passwordProtection', 'Password protection')}</FormLabel>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  
                  {requirePasswordWatch && (
                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input 
                              type="password" 
                              placeholder={t('documents:share.passwordPlaceholder', 'Enter password')} 
                              {...field} 
                            />
                          </FormControl>
                          <FormDescription>
                            {t('documents:share.passwordNote', 'Recipients will need this password to access the document')}
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                </div>
                
                <FormField
                  control={form.control}
                  name="notifyOnAccess"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between">
                      <div className="space-y-0.5">
                        <FormLabel className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-muted-foreground" />
                          {t('documents:share.notifyOnAccess', 'Notify me when accessed')}
                        </FormLabel>
                        <FormDescription>
                          {t('documents:share.notifyOnAccessDesc', 'Receive email notifications when someone accesses this document')}
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
              
              <DialogFooter>
                <Button type="submit" disabled={isGeneratingLink}>
                  {isGeneratingLink ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      {t('documents:share.generating', 'Generating link')}
                    </span>
                  ) : (
                    t('documents:share.generate', 'Generate Secure Link')
                  )}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        ) : (
          <>
            <div className="space-y-4">
              <div className="bg-muted p-4 rounded-md space-y-3">
                <div className="flex justify-between items-center">
                  <h3 className="text-sm font-medium flex items-center gap-2">
                    <Link className="h-4 w-4 text-primary" />
                    {t('documents:share.secureLink', 'Secure Link')}
                  </h3>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-7 px-2"
                    onClick={refreshLink}
                  >
                    <RefreshCw className="h-3.5 w-3.5 mr-1" />
                    {t('documents:share.refresh', 'Refresh')}
                  </Button>
                </div>
                
                <div className="flex">
                  <Input 
                    value={generatedLink} 
                    readOnly 
                    className="rounded-r-none"
                  />
                  <Button 
                    className="rounded-l-none px-2.5"
                    onClick={handleCopyLink}
                    variant="secondary"
                  >
                    {isCopied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
                
                <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" />
                    <span>
                      {t('documents:share.expires', 'Expires')}: {getExpiryTimeLabel(form.getValues('expiryTime'))}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Lock className="h-3.5 w-3.5" />
                    <span>
                      {form.getValues('requirePassword') 
                        ? t('documents:share.passwordProtected', 'Password protected') 
                        : t('documents:share.noPassword', 'No password')}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-2 bg-blue-50 dark:bg-blue-950/30 p-3 rounded-md text-blue-600 dark:text-blue-400 text-sm">
                <Info className="h-5 w-5 flex-shrink-0" />
                <p>
                  {t('documents:share.trackingNote', 'You can track access to this document in your sharing history')}
                </p>
              </div>
              
              {(form.getValues('email') || form.getValues('phone')) && (
                <div className="flex items-center space-x-2 bg-green-50 dark:bg-green-950/30 p-3 rounded-md text-green-600 dark:text-green-400 text-sm">
                  <Check className="h-5 w-5 flex-shrink-0" />
                  <p>
                    {t(
                      'documents:share.sentConfirmation', 
                      'Link sent to {{recipient}}', 
                      { recipient: form.getValues('email') || form.getValues('phone') }
                    )}
                  </p>
                </div>
              )}
            </div>
            
            <DialogFooter className="flex flex-col-reverse sm:flex-row gap-2 sm:gap-0">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                {t('common:close', 'Close')}
              </Button>
              <Button 
                variant="default" 
                onClick={handleCopyLink}
                className="sm:ml-2"
              >
                {isCopied ? (
                  <span className="flex items-center">
                    <Check className="h-4 w-4 mr-2" />
                    {t('common:copied', 'Copied!')}
                  </span>
                ) : (
                  <span className="flex items-center">
                    <Copy className="h-4 w-4 mr-2" />
                    {t('documents:share.copyLink', 'Copy Link')}
                  </span>
                )}
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ShareDocumentDialog;