import { useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { 
  Calendar as CalendarIcon, 
  FileText,
  Upload,
  Camera,
  FilePlus,
  Tag,
  Search,
  CheckCircle,
  XCircle,
  AlertCircle,
  FileText2,
  FileDigit,
  FileBox,
  Truck,
  User,
  Users,
  Clock
} from 'lucide-react';

// Utility function to safely format dates
const safeFormat = (date: any, formatString: string): string => {
  try {
    // Ensure we have a valid Date object
    return format(date instanceof Date ? date : new Date(date), formatString);
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Invalid date';
  }
};

// Define the form schema
const documentUploadSchema = z.object({
  documentType: z.string({
    required_error: "Document type is required",
  }),
  documentCategory: z.string({
    required_error: "Document category is required",
  }),
  relatedEntityType: z.enum(["vehicle", "driver", "client"], {
    required_error: "Related entity type is required",
  }),
  relatedEntityId: z.string({
    required_error: "Related entity is required",
  }),
  title: z.string().min(3, {
    message: "Document title must be at least 3 characters",
  }),
  description: z.string().optional(),
  issueDate: z.date({
    required_error: "Issue date is required",
  }),
  expiryDate: z.date().optional(),
  setExpiryAlert: z.boolean().default(false),
  alertDays: z.number().min(1).optional(),
  documentFile: z.string({
    required_error: "Document file is required",
  }),
  enableOcr: z.boolean().default(false),
  tags: z.array(z.string()).optional(),
  isConfidential: z.boolean().default(false)
});

type DocumentUploadDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  theme: 'light' | 'dark';
};

// Document categories based on entity type
const documentCategories = {
  vehicle: [
    { value: "registrationCertificate", label: "Registration Certificate" },
    { value: "insurancePolicy", label: "Insurance Policy" },
    { value: "permitDocument", label: "Permit Document" },
    { value: "maintenanceRecord", label: "Maintenance Record" },
    { value: "purchaseDocument", label: "Purchase Documentation" }
  ],
  driver: [
    { value: "drivingLicense", label: "Driving License" },
    { value: "idProof", label: "ID Proof" },
    { value: "addressProof", label: "Address Proof" },
    { value: "employmentContract", label: "Employment Contract" },
    { value: "trainingCertificate", label: "Training Certificate" }
  ],
  client: [
    { value: "activeContract", label: "Active Contract" },
    { value: "completedContract", label: "Completed Contract" },
    { value: "templateDocument", label: "Template Document" },
    { value: "addendumDocument", label: "Addendum Document" },
    { value: "clientVerification", label: "Client Verification" }
  ]
};

// Mock entities for selection
const entities = {
  vehicle: [
    { id: "v1", name: "Toyota Innova Crysta (TN01-3456)" },
    { id: "v2", name: "Mahindra Bolero (DL01-8794)" },
    { id: "v3", name: "Tata Ace (MH02-4532)" },
    { id: "v4", name: "Ashok Leyland Dost (KA01-9834)" },
    { id: "v5", name: "Bajaj RE Auto (GJ05-2143)" }
  ],
  driver: [
    { id: "d1", name: "Rajesh Kumar" },
    { id: "d2", name: "Suresh Singh" },
    { id: "d3", name: "Venkatesh Rao" },
    { id: "d4", name: "Mukesh Patel" }
  ],
  client: [
    { id: "c1", name: "ABC Travels" },
    { id: "c2", name: "XYZ Tours" },
    { id: "c3", name: "Fast Logistics" },
    { id: "c4", name: "Local Movers" }
  ]
};

// Common tag suggestions
const tagSuggestions = [
  "Important", 
  "Urgent", 
  "Compliance", 
  "Tax", 
  "Legal", 
  "Financial", 
  "Insurance", 
  "Training", 
  "Verified", 
  "Draft"
];

export function UploadDocumentDialog({ open, onOpenChange, theme }: DocumentUploadDialogProps) {
  // Current file upload preview
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [fileSize, setFileSize] = useState<number | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadComplete, setUploadComplete] = useState(false);
  const [processingStatus, setProcessingStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');
  
  // Selected tags state
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  
  // Form state
  const form = useForm<z.infer<typeof documentUploadSchema>>({
    resolver: zodResolver(documentUploadSchema),
    defaultValues: {
      documentType: '',
      documentCategory: '',
      relatedEntityType: 'vehicle',
      relatedEntityId: '',
      title: '',
      description: '',
      issueDate: new Date(),
      setExpiryAlert: false,
      enableOcr: false,
      tags: [],
      isConfidential: false
    }
  });
  
  // Watch for related entity type changes to update document categories
  const relatedEntityType = form.watch('relatedEntityType');
  
  // Watch for OCR option
  const enableOcr = form.watch('enableOcr');
  
  // Watch for expiry alert option
  const setExpiryAlert = form.watch('setExpiryAlert');
  
  // Handle file upload
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setFileSize(file.size);
    
    // Simulate file upload
    setIsUploading(true);
    setUploadProgress(0);
    
    // Read file for preview (only for images - in a real app we'd check file type)
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        // If it's an image, we can preview it
        if (file.type.startsWith('image/')) {
          setFilePreview(e.target.result.toString());
        } else {
          // For non-images, just set a generic preview or icon representation
          setFilePreview(null);
        }
      }
    };
    reader.readAsDataURL(file);
    
    // Simulate progress
    let progress = 0;
    const interval = setInterval(() => {
      progress += 5;
      setUploadProgress(progress);
      
      if (progress >= 100) {
        clearInterval(interval);
        setIsUploading(false);
        setUploadComplete(true);
        
        // Set the file path in the form
        form.setValue('documentFile', file.name);
        
        // Auto-suggest a title based on filename
        if (!form.getValues('title')) {
          // Remove extension and convert to title case
          const suggestedTitle = file.name
            .split('.').slice(0, -1).join('.')
            .split(/[_-]/).join(' ')
            .replace(/\b\w/g, l => l.toUpperCase());
            
          form.setValue('title', suggestedTitle);
        }
        
        // If OCR is enabled, simulate processing
        if (enableOcr) {
          setProcessingStatus('processing');
          setTimeout(() => {
            setProcessingStatus('success');
          }, 2000);
        }
      }
    }, 100);
  };
  
  // Handle tag selection
  const handleTagSelect = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
    
    // Update the form value
    form.setValue('tags', selectedTags.includes(tag) 
      ? selectedTags.filter(t => t !== tag) 
      : [...selectedTags, tag]
    );
  };
  
  // Handle drag and drop
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };
  
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      
      // Create a fake event to reuse handleFileUpload logic
      const event = {
        target: {
          files: [file]
        }
      } as unknown as React.ChangeEvent<HTMLInputElement>;
      
      handleFileUpload(event);
    }
  };
  
  // Handle form submission
  const onSubmit = (data: z.infer<typeof documentUploadSchema>) => {
    console.log("Document Upload Form Data:", data);
    
    // In a real app, we would send this data to the API
    // For now, we'll simulate success and close the dialog
    setTimeout(() => {
      onOpenChange(false);
      
      // Reset form state
      setFilePreview(null);
      setFileName(null);
      setFileSize(null);
      setUploadProgress(null);
      setIsUploading(false);
      setUploadComplete(false);
      setProcessingStatus('idle');
      setSelectedTags([]);
      form.reset();
    }, 1000);
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={`max-w-2xl ${theme === 'dark' ? 'bg-gray-800 text-white border-gray-700' : ''}`}>
        <DialogHeader>
          <DialogTitle className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : ''}`}>
            <div className="flex items-center">
              <FilePlus className="h-5 w-5 mr-2 text-primary" />
              Upload Document
            </div>
          </DialogTitle>
          <DialogDescription className={theme === 'dark' ? 'text-gray-400' : ''}>
            Upload and categorize documents for vehicles, drivers or clients
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 mt-4">
            {/* Document Type and Category */}
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="relatedEntityType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className={theme === 'dark' ? 'text-gray-300' : ''}>
                      Related To
                    </FormLabel>
                    <Select 
                      value={field.value} 
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger className={theme === 'dark' ? 'bg-gray-700 border-gray-600' : ''}>
                        <SelectValue placeholder="Select entity type" />
                      </SelectTrigger>
                      <SelectContent className={theme === 'dark' ? 'bg-gray-800 border-gray-700' : ''}>
                        <SelectItem value="vehicle">
                          <div className="flex items-center">
                            <Truck className="h-4 w-4 mr-2" />
                            Vehicle
                          </div>
                        </SelectItem>
                        <SelectItem value="driver">
                          <div className="flex items-center">
                            <User className="h-4 w-4 mr-2" />
                            Driver
                          </div>
                        </SelectItem>
                        <SelectItem value="client">
                          <div className="flex items-center">
                            <Users className="h-4 w-4 mr-2" />
                            Client
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="relatedEntityId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className={theme === 'dark' ? 'text-gray-300' : ''}>
                      Select {relatedEntityType === 'vehicle' ? 'Vehicle' : relatedEntityType === 'driver' ? 'Driver' : 'Client'}
                    </FormLabel>
                    <Select 
                      value={field.value} 
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger className={theme === 'dark' ? 'bg-gray-700 border-gray-600' : ''}>
                        <SelectValue placeholder={`Select ${relatedEntityType}`} />
                      </SelectTrigger>
                      <SelectContent className={theme === 'dark' ? 'bg-gray-800 border-gray-700' : ''}>
                        {entities[relatedEntityType].map(entity => (
                          <SelectItem key={entity.id} value={entity.id}>
                            {entity.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="documentCategory"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className={theme === 'dark' ? 'text-gray-300' : ''}>
                      Document Category
                    </FormLabel>
                    <Select 
                      value={field.value} 
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger className={theme === 'dark' ? 'bg-gray-700 border-gray-600' : ''}>
                        <SelectValue placeholder="Select document category" />
                      </SelectTrigger>
                      <SelectContent className={theme === 'dark' ? 'bg-gray-800 border-gray-700' : ''}>
                        {documentCategories[relatedEntityType].map(category => (
                          <SelectItem key={category.value} value={category.value}>
                            {category.label}
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
                name="documentType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className={theme === 'dark' ? 'text-gray-300' : ''}>
                      Document Type
                    </FormLabel>
                    <Select 
                      value={field.value} 
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger className={theme === 'dark' ? 'bg-gray-700 border-gray-600' : ''}>
                        <SelectValue placeholder="Select document type" />
                      </SelectTrigger>
                      <SelectContent className={theme === 'dark' ? 'bg-gray-800 border-gray-700' : ''}>
                        <SelectItem value="original">Original</SelectItem>
                        <SelectItem value="copy">Copy</SelectItem>
                        <SelectItem value="scan">Scan</SelectItem>
                        <SelectItem value="form">Form</SelectItem>
                        <SelectItem value="receipt">Receipt</SelectItem>
                        <SelectItem value="invoice">Invoice</SelectItem>
                        <SelectItem value="certificate">Certificate</SelectItem>
                        <SelectItem value="report">Report</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            {/* Document Title and Description */}
            <div className="grid grid-cols-1 gap-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className={theme === 'dark' ? 'text-gray-300' : ''}>
                      Document Title
                    </FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Enter document title" 
                        {...field} 
                        className={theme === 'dark' ? 'bg-gray-700 border-gray-600' : ''}
                      />
                    </FormControl>
                    <FormDescription className={theme === 'dark' ? 'text-gray-400' : ''}>
                      A descriptive title for easy identification
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className={theme === 'dark' ? 'text-gray-300' : ''}>
                      Description (Optional)
                    </FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Add any additional details about this document" 
                        {...field} 
                        className={theme === 'dark' ? 'bg-gray-700 border-gray-600' : ''}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            {/* Issue and Expiry Dates */}
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="issueDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel className={theme === 'dark' ? 'text-gray-300' : ''}>
                      Issue Date
                    </FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={`w-full pl-3 text-left font-normal ${
                              !field.value ? "text-muted-foreground" : ""
                            } ${
                              theme === 'dark' ? 'bg-gray-700 border-gray-600' : ''
                            }`}
                          >
                            {field.value ? (
                              safeFormat(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className={`w-auto p-0 ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : ''}`}>
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="expiryDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel className={theme === 'dark' ? 'text-gray-300' : ''}>
                      Expiry Date (Optional)
                    </FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={`w-full pl-3 text-left font-normal ${
                              !field.value ? "text-muted-foreground" : ""
                            } ${
                              theme === 'dark' ? 'bg-gray-700 border-gray-600' : ''
                            }`}
                          >
                            {field.value ? (
                              safeFormat(field.value, "PPP")
                            ) : (
                              <span>Set expiry date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className={`w-auto p-0 ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : ''}`}>
                        <Calendar
                          mode="single"
                          selected={field.value || undefined}
                          onSelect={field.onChange}
                          disabled={(date) => date < new Date()}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Expiry Alert */}
            <div className="space-y-2">
              <FormField
                control={form.control}
                name="setExpiryAlert"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-3 shadow-sm">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel className={theme === 'dark' ? 'text-gray-300' : ''}>
                        Set expiry alert
                      </FormLabel>
                      <FormDescription className={theme === 'dark' ? 'text-gray-400' : ''}>
                        Receive notifications before document expires
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />

              {setExpiryAlert && (
                <FormField
                  control={form.control}
                  name="alertDays"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center gap-2">
                        <Label className={theme === 'dark' ? 'text-gray-300' : ''}>
                          Alert me
                        </Label>
                        <Select
                          value={field.value?.toString() || '30'}
                          onValueChange={(value) => field.onChange(parseInt(value))}
                        >
                          <SelectTrigger className={`w-24 ${theme === 'dark' ? 'bg-gray-700 border-gray-600' : ''}`}>
                            <SelectValue placeholder="30 days" />
                          </SelectTrigger>
                          <SelectContent className={theme === 'dark' ? 'bg-gray-800 border-gray-700' : ''}>
                            <SelectItem value="7">7 days</SelectItem>
                            <SelectItem value="14">14 days</SelectItem>
                            <SelectItem value="30">30 days</SelectItem>
                            <SelectItem value="60">60 days</SelectItem>
                            <SelectItem value="90">90 days</SelectItem>
                          </SelectContent>
                        </Select>
                        <Label className={theme === 'dark' ? 'text-gray-300' : ''}>
                          before expiry
                        </Label>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>
            
            {/* Document Upload area */}
            <FormField
              control={form.control}
              name="documentFile"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className={theme === 'dark' ? 'text-gray-300' : ''}>
                    Upload Document
                  </FormLabel>
                  
                  <div 
                    className={`border-2 border-dashed rounded-lg p-6 text-center ${
                      theme === 'dark' ? 'border-gray-600 bg-gray-700/30' : 'border-gray-300 bg-gray-50'
                    } ${
                      uploadComplete ? 'border-green-500' : ''
                    }`}
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                  >
                    {!uploadComplete ? (
                      <>
                        <div className="flex flex-col items-center justify-center space-y-2">
                          <Upload className={`h-8 w-8 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`} />
                          <div className={theme === 'dark' ? 'text-gray-300' : ''}>
                            <p className="font-medium">Drag and drop your file here or</p>
                            <div className="mt-2 flex justify-center">
                              <label className="cursor-pointer rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
                                <span>Browse files</span>
                                <input 
                                  id="file-upload" 
                                  type="file" 
                                  className="sr-only"
                                  onChange={handleFileUpload}
                                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.tif,.tiff,.xls,.xlsx"
                                />
                              </label>
                              <span className="mx-2">or</span>
                              <Button 
                                size="sm" 
                                variant="outline"
                                className={theme === 'dark' ? 'border-gray-600' : ''}
                                type="button"
                              >
                                <Camera className="h-4 w-4 mr-1" />
                                Take Photo
                              </Button>
                            </div>
                          </div>
                          <div className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                            Supported formats: PDF, Word, Excel, JPG, PNG, TIFF (Max 10MB)
                          </div>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="flex items-center justify-center space-x-4">
                          {filePreview ? (
                            <img 
                              src={filePreview} 
                              alt="Document preview" 
                              className="h-16 w-16 object-cover rounded" 
                            />
                          ) : (
                            <FileText className={`h-16 w-16 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`} />
                          )}
                          <div className="flex flex-col text-left">
                            <span className={`font-medium ${theme === 'dark' ? 'text-white' : ''}`}>{fileName}</span>
                            <span className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                              {fileSize && `${(fileSize / 1024).toFixed(2)} KB`}
                            </span>
                            <div className="flex items-center mt-1">
                              <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                              <span className={`text-xs ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                                Upload complete
                              </span>
                            </div>
                          </div>
                        </div>
                      </>
                    )}
                    
                    {isUploading && (
                      <div className="mt-4">
                        <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-primary" 
                            style={{ width: `${uploadProgress}%` }}
                          ></div>
                        </div>
                        <div className="text-xs text-center mt-1">
                          Uploading... {uploadProgress}%
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {/* OCR Processing */}
            <div className="space-y-4">
              {uploadComplete && (
                <FormField
                  control={form.control}
                  name="enableOcr"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-3 shadow-sm">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel className={theme === 'dark' ? 'text-gray-300' : ''}>
                          Extract text with OCR
                        </FormLabel>
                        <FormDescription className={theme === 'dark' ? 'text-gray-400' : ''}>
                          Automatically extract text from document for better searchability
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />
              )}
              
              {processingStatus === 'processing' && (
                <div className={`p-3 rounded ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'}`}>
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-primary border-b-2"></div>
                    <span className={theme === 'dark' ? 'text-gray-300' : ''}>Processing document with OCR...</span>
                  </div>
                </div>
              )}
              
              {processingStatus === 'success' && (
                <div className={`p-3 rounded ${theme === 'dark' ? 'bg-green-900/30' : 'bg-green-50'} ${theme === 'dark' ? 'text-green-300' : 'text-green-700'}`}>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4" />
                    <span>Text extraction complete. Document is now searchable.</span>
                  </div>
                </div>
              )}
              
              {processingStatus === 'error' && (
                <div className={`p-3 rounded ${theme === 'dark' ? 'bg-red-900/30' : 'bg-red-50'} ${theme === 'dark' ? 'text-red-300' : 'text-red-700'}`}>
                  <div className="flex items-center space-x-2">
                    <XCircle className="h-4 w-4" />
                    <span>Could not extract text. Please try again or upload a clearer document.</span>
                  </div>
                </div>
              )}
            </div>
            
            {/* Document Tags */}
            <div className="space-y-4">
              <div>
                <Label className={theme === 'dark' ? 'text-gray-300' : ''}>
                  Tags (Optional)
                </Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {tagSuggestions.map(tag => (
                    <div 
                      key={tag}
                      onClick={() => handleTagSelect(tag)}
                      className={`px-3 py-1 rounded-full text-xs font-medium cursor-pointer ${
                        selectedTags.includes(tag)
                          ? theme === 'dark' 
                            ? 'bg-primary text-primary-foreground' 
                            : 'bg-primary text-primary-foreground'
                          : theme === 'dark'
                            ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {tag}
                    </div>
                  ))}
                </div>
                <div className={`text-xs mt-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                  Click on tags to add them to this document
                </div>
              </div>
              
              <FormField
                control={form.control}
                name="isConfidential"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-3 shadow-sm">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel className={theme === 'dark' ? 'text-gray-300' : ''}>
                        Mark as confidential
                      </FormLabel>
                      <FormDescription className={theme === 'dark' ? 'text-gray-400' : ''}>
                        Restrict access to authorized personnel only
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />
            </div>
            
            <DialogFooter>
              <Button
                type="button" 
                variant="outline" 
                onClick={() => onOpenChange(false)}
                className={theme === 'dark' ? 'border-gray-600 hover:bg-gray-700' : ''}
              >
                Cancel
              </Button>
              <Button 
                type="submit"
                className={uploadComplete ? 'bg-primary hover:bg-primary/90' : 'bg-gray-400 cursor-not-allowed'}
                disabled={!uploadComplete}
              >
                Upload Document
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}